import { ref, reactive, readonly } from 'vue'
import { authApi, userApi, dockApi, droneApi, missionApi, alertApi, systemApi, deviceApi, roleApi, hmsApi, livestreamApi, waylineApi, controlApi } from '../api/services'
import { apiClient } from '../api/config'
import type { User, Dock, Drone, Mission, Alert, Device, Role, HmsAlert } from '../types'
import { useDeviceStore } from '../stores/device'

// 视频缓存管理
const VIDEO_CACHE_KEY = 'video_devices_cache'
const VIDEO_CACHE_VERSION_KEY = 'video_cache_version'

// 视频设备信息结构
interface VideoDeviceInfo {
  deviceSn: string
  deviceType: 'dock' | 'drone_visible' | 'drone_infrared'
  cameraIndex: string
  videoIndex: string
  videoId: string
  switchableVideoTypes: string[]
  lastUpdate: number
}

interface VideoCacheData {
  version: string
  devices: VideoDeviceInfo[]
  lastUpdate: number
}

// 缓存视频设备信息
const cacheVideoDevices = (capacityData: any, dockSns: string[], droneSns: string[]) => {
  const videoDevices: VideoDeviceInfo[] = []
  const now = Date.now()
  
  console.log('开始缓存视频设备信息...')
  
  if (capacityData.available_devices) {
    for (const device of capacityData.available_devices) {
      if (device.camera_list && device.camera_list.length > 0) {
        for (const camera of device.camera_list) {
          if (camera.video_list && camera.video_list.length > 0) {
            for (const video of camera.video_list) {
              const videoId = `${device.sn}/${camera.camera_index}/${video.video_index}`
              const switchableTypes = video.switchable_video_types || []
              
              // 判断设备类型
              let deviceType: 'dock' | 'drone_visible' | 'drone_infrared'
              if (dockSns.includes(device.sn)) {
                deviceType = 'dock'
              } else if (droneSns.includes(device.sn)) {
                // 根据switchable_video_types数量判断是可见光还是红外
                deviceType = switchableTypes.length > 2 ? 'drone_visible' : 'drone_infrared'
              } else {
                continue // 跳过未知设备类型
              }
              
              videoDevices.push({
                deviceSn: device.sn,
                deviceType,
                cameraIndex: camera.camera_index,
                videoIndex: video.video_index,
                videoId,
                switchableVideoTypes: switchableTypes,
                lastUpdate: now
              })
              
              console.log(`缓存视频设备: ${deviceType} - ${device.sn} - ${videoId} - types: ${switchableTypes.length}`)
            }
          }
        }
      }
    }
  }
  
  const cacheData: VideoCacheData = {
    version: '1.0',
    devices: videoDevices,
    lastUpdate: now
  }
  
  localStorage.setItem(VIDEO_CACHE_KEY, JSON.stringify(cacheData))
  console.log(`视频设备缓存完成，共缓存 ${videoDevices.length} 个视频设备`)
  
  return videoDevices
}

// 获取缓存的视频设备信息
const getCachedVideoDevices = (): VideoDeviceInfo[] => {
  const cacheStr = localStorage.getItem(VIDEO_CACHE_KEY)
  if (!cacheStr) {
    return []
  }
  
  try {
    const cacheData: VideoCacheData = JSON.parse(cacheStr)
    return cacheData.devices || []
  } catch (error) {
    console.error('解析视频设备缓存失败:', error)
    return []
  }
}

// 检查缓存是否需要更新
const shouldUpdateVideoCache = (capacityData: any): boolean => {
  const cacheStr = localStorage.getItem(VIDEO_CACHE_KEY)
  if (!cacheStr) {
    console.log('没有视频缓存，需要创建')
    return true
  }
  
  try {
    const cacheData: VideoCacheData = JSON.parse(cacheStr)
    const cacheDeviceCount = cacheData.devices.length
    
    // 计算当前capacity数据中的视频设备数量
    let currentDeviceCount = 0
    if (capacityData.available_devices) {
      for (const device of capacityData.available_devices) {
        if (device.camera_list) {
          for (const camera of device.camera_list) {
            if (camera.video_list) {
              currentDeviceCount += camera.video_list.length
            }
          }
        }
      }
    }
    
    if (cacheDeviceCount !== currentDeviceCount) {
      console.log(`视频设备数量不一致，缓存: ${cacheDeviceCount}, 当前: ${currentDeviceCount}，需要更新`)
      return true
    }
    
    // 检查时间是否超过30分钟
    const thirtyMinutes = 30 * 60 * 1000
    if (Date.now() - cacheData.lastUpdate > thirtyMinutes) {
      console.log('视频缓存超过30分钟，需要更新')
      return true
    }
    
    console.log('视频缓存有效，无需更新')
    return false
  } catch (error) {
    console.error('检查视频缓存失败:', error)
    return true
  }
}

// 根据类型获取最佳视频设备
const getBestVideoDevice = (deviceType: 'dock' | 'drone_visible' | 'drone_infrared'): VideoDeviceInfo | null => {
  const cachedDevices = getCachedVideoDevices()
  const devices = cachedDevices.filter(device => device.deviceType === deviceType)
  
  if (devices.length === 0) {
    console.warn(`没有找到类型为 ${deviceType} 的视频设备`)
    return null
  }
  
  // 优先选择switchable_video_types最多的设备
  devices.sort((a, b) => b.switchableVideoTypes.length - a.switchableVideoTypes.length)
  
  console.log(`选择最佳 ${deviceType} 视频设备:`, devices[0])
  return devices[0]
}
export function useAuth() {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 初始化时从localStorage恢复用户信息
  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
      apiClient.setAuthToken(savedToken)
    }
  }

  // 登录
  const login = async (loginData: { username: string; password: string }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authApi.login(loginData.username, loginData.password)
      const { access_token, token_type } = response
      
      console.log('登录响应:', response)
      console.log('获取到的token:', access_token)
      console.log('token类型:', token_type)
      
      // 设置认证token
      apiClient.setAuthToken(access_token)
      
      // 获取用户信息
      const userResponse = await authApi.getCurrentUser()
      console.log('用户信息响应:', userResponse)
      console.log('响应类型:', typeof userResponse)
      console.log('响应键:', Object.keys(userResponse))
      
      // 尝试不同的响应结构
      let userData: any
      if (userResponse.data) {
        userData = userResponse.data
        console.log('使用response.data结构')
      } else {
        userData = userResponse
        console.log('使用直接响应结构')
      }
      
      console.log('用户数据:', userData)
      console.log('workspace_id:', userData?.workspace_id)
      
      user.value = userData
      token.value = access_token
      
      // 保存到localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', access_token)
      
      // 缓存workspace_id
      if (userData?.workspace_id) {
        localStorage.setItem('workspace_id', userData.workspace_id)
        console.log('登录时workspace_id已缓存:', userData.workspace_id)
      } else {
        console.warn('用户数据中没有找到workspace_id:', userData)
      }
      
      console.log('localStorage中的token:', localStorage.getItem('token'))
      
      // 获取设备列表并缓存
      try {
        console.log('登录后开始获取设备列表...')
        const deviceResponse = await deviceApi.getDevices({ skip: 0, limit: 100 })
        console.log('设备列表获取成功:', deviceResponse)
        
        // 使用新的缓存函数，同时缓存设备SN和完整设备信息
        const { cacheDeviceSns } = useDevices()
        cacheDeviceSns(deviceResponse)
        
        // 分离机场和无人机SN用于后续处理
        const dockSns = deviceResponse.filter(device => {
          return device.device_type_info?.device_type === 3
        }).map(device => device.device_sn)
        
        const droneSns = deviceResponse.filter(device => {
          return device.device_type_info?.device_type === 100
        }).map(device => device.device_sn)
        
        // 初始化无人机的 zoom_factor
        const { updateDroneZoomFactor } = useDevices()
        const currentZoomFactor = localStorage.getItem('camera_zoom_factor')
        const zoomFactor = currentZoomFactor ? parseInt(currentZoomFactor, 10) : 1
        
        // 为所有无人机设置初始 zoom_factor
        droneSns.forEach((droneSn: string) => {
          updateDroneZoomFactor(droneSn, zoomFactor)
        })
        
        console.log('登录时设备信息已缓存到本地:', { 
          dockSns, 
          droneSns, 
          totalDevices: deviceResponse.length,
          initialZoomFactor: zoomFactor
        })
        
        // 如果有机场，设置第一个为默认选中
        const deviceStore = useDeviceStore()
        deviceStore.setDevices(deviceResponse)
        
        if (deviceStore.docks.length > 0) {
          deviceStore.setSelectedDock(deviceStore.docks[0].device_sn)
        }
        
        // 调用视频流接口
        try {
          console.log('登录后开始获取视频容量信息...')
          const capacityResponse = await livestreamApi.getCapacity()
          console.log('视频容量信息获取成功:', capacityResponse)
          
          // 缓存capacity数据到localStorage
          localStorage.setItem('livestream_capacity', JSON.stringify(capacityResponse))
          console.log('capacity数据已缓存到localStorage')
          
          // 检查是否需要更新视频设备缓存
          if (shouldUpdateVideoCache(capacityResponse)) {
            console.log('更新视频设备缓存...')
            cacheVideoDevices(capacityResponse, dockSns, droneSns)
          }
          
          // 优先选择机场视频流
          const dockVideoDevice = getBestVideoDevice('dock')
          let dockWebrtcUrl = ''
          let dockLivestreamResponse = null
          if (dockVideoDevice) {
            console.log('选择机场视频设备:', dockVideoDevice)
            // 获取机场SN用于API调用
            if (dockSns.length === 0) {
              console.error('没有找到机场设备，无法启动视频流')
              return
            }
            const dockSn = dockSns[0] // 使用第一个机场SN
            console.log('登录 - 使用机场SN调用视频流接口:', dockSn)
            // 启动视频流，使用机场SN作为device_sn，传递video_id参数
            console.log('开始启动机场视频流...')
            dockLivestreamResponse = await livestreamApi.startLivestream(dockSn, {
              video_id: dockVideoDevice.videoId
            })
            console.log('机场视频流启动成功:', dockLivestreamResponse)
            // 处理push_url地址，替换为webrtc地址
            const pushUrl = dockLivestreamResponse.push_url
            dockWebrtcUrl = pushUrl.replace(/^rtmp:\/\/[^\/]+/, 'webrtc://10.10.1.3:8000')
            console.log('原始push_url:', pushUrl)
            console.log('转换后的webrtc地址:', dockWebrtcUrl)
            // 保存视频流地址到localStorage
            localStorage.setItem('video_stream_url', dockWebrtcUrl)
            localStorage.setItem('video_bid', dockLivestreamResponse.bid)
            localStorage.setItem('current_video_type', 'dock')
            console.log('机场视频流地址已保存到localStorage')
          }

          // 无人机可见光视频流
          let droneVisibleWebrtcUrl = ''
          let droneVisibleLivestreamResponse = null
          const droneVisibleDevice = getBestVideoDevice('drone_visible')
          if (droneVisibleDevice && dockSns.length > 0) {
            const dockSn = dockSns[0]
            try {
              droneVisibleLivestreamResponse = await livestreamApi.startLivestream(dockSn, {
                video_id: droneVisibleDevice.videoId
              })
              const pushUrl = droneVisibleLivestreamResponse.push_url
              droneVisibleWebrtcUrl = pushUrl.replace(/^rtmp:\/\/[^\/]+/, 'webrtc://10.10.1.3:8000')
            } catch (e) {
              // 无人机未起飞时这里会报错，忽略即可
            }
          }

          // 无人机红外视频流（如有）
          let droneInfraredWebrtcUrl = ''
          let droneInfraredLivestreamResponse = null
          const droneInfraredDevice = getBestVideoDevice('drone_infrared')
          if (droneInfraredDevice && dockSns.length > 0) {
            const dockSn = dockSns[0]
            try {
              droneInfraredLivestreamResponse = await livestreamApi.startLivestream(dockSn, {
                video_id: droneInfraredDevice.videoId
              })
              const pushUrl = droneInfraredLivestreamResponse.push_url
              droneInfraredWebrtcUrl = pushUrl.replace(/^rtmp:\/\/[^\/]+/, 'webrtc://10.10.1.3:8000')
            } catch (e) {
              // 无人机未起飞时这里会报错，忽略即可
            }
          }

          // 组装 video_streams 数组并写入缓存
          const videoStreams = []
          
          // 从capacity数据中获取真实的switchable_video_types
          const getSwitchableTypesFromCapacity = (deviceSn: string, videoId: string) => {
            if (!capacityResponse.available_devices) return []
            
            for (const device of capacityResponse.available_devices) {
              if (device.sn === deviceSn && device.camera_list) {
                for (const camera of device.camera_list) {
                  if (camera.video_list) {
                    for (const video of camera.video_list) {
                      const currentVideoId = `${device.sn}/${camera.camera_index}/${video.video_index}`
                      if (currentVideoId === videoId) {
                        return video.switchable_video_types || []
                      }
                    }
                  }
                }
              }
            }
            return []
          }
          
          if (dockWebrtcUrl && dockVideoDevice) {
            const switchableTypes = getSwitchableTypesFromCapacity(dockVideoDevice.deviceSn, dockVideoDevice.videoId)
            videoStreams.push({ 
              type: 'dock', 
              url: dockWebrtcUrl,
              switchable_video_types: switchableTypes,
              device_sn: dockVideoDevice.deviceSn,
              camera_index: dockVideoDevice.cameraIndex,
              video_index: dockVideoDevice.videoIndex
            })
          }
          
          if (droneVisibleWebrtcUrl && droneVisibleDevice) {
            const switchableTypes = getSwitchableTypesFromCapacity(droneVisibleDevice.deviceSn, droneVisibleDevice.videoId)
            videoStreams.push({ 
              type: 'drone_visible', 
              url: droneVisibleWebrtcUrl,
              switchable_video_types: switchableTypes,
              device_sn: droneVisibleDevice.deviceSn,
              camera_index: droneVisibleDevice.cameraIndex,
              video_index: droneVisibleDevice.videoIndex
            })
          }
          
          if (droneInfraredWebrtcUrl && droneInfraredDevice) {
            const switchableTypes = getSwitchableTypesFromCapacity(droneInfraredDevice.deviceSn, droneInfraredDevice.videoId)
            videoStreams.push({ 
              type: 'drone_infrared', 
              url: droneInfraredWebrtcUrl,
              switchable_video_types: switchableTypes,
              device_sn: droneInfraredDevice.deviceSn,
              camera_index: droneInfraredDevice.cameraIndex,
              video_index: droneInfraredDevice.videoIndex
            })
          }
          localStorage.setItem('video_streams', JSON.stringify(videoStreams))
          
        } catch (videoError) {
          console.warn('登录时获取视频流失败:', videoError)
          // 不抛出错误，避免影响登录流程
        }
      } catch (deviceError) {
        console.warn('登录时获取设备列表失败:', deviceError)
        // 不抛出错误，避免影响登录流程
      }
      
      return { user: userData, token: access_token }
    } catch (err: any) {
      error.value = err.message || '登录失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (err) {
      console.error('登出API调用失败:', err)
    } finally {
      // 清除本地状态
      user.value = null
      token.value = null
      apiClient.clearAuthToken()
      
      // 清除localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }

  // 获取当前用户信息
  const getCurrentUser = async () => {
    try {
      const response = await authApi.getCurrentUser()
      user.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取用户信息失败'
      throw err
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    error: readonly(error),
    login,
    logout,
    getCurrentUser,
    initAuth
  }
}

// 机巢管理的组合式API
export function useDocks() {
  const docks = ref<Dock[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 获取机巢列表
  const fetchDocks = async (params?: { page?: number; pageSize?: number; status?: string }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await dockApi.getDocks(params)
      docks.value = response.data.items
      pagination.total = response.data.total
      pagination.page = response.data.page
      pagination.pageSize = response.data.pageSize
      
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取机巢列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取单个机巢
  const fetchDock = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await dockApi.getDock(id)
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取机巢信息失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    docks: readonly(docks),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    fetchDocks,
    fetchDock
  }
}

// 无人机管理的组合式API
export function useDrones() {
  const drones = ref<Drone[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 获取无人机列表
  const fetchDrones = async (params?: { page?: number; pageSize?: number; status?: string; dockId?: string }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await droneApi.getDrones(params)
      drones.value = response.data.items
      pagination.total = response.data.total
      pagination.page = response.data.page
      pagination.pageSize = response.data.pageSize
      
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取无人机列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 控制无人机起飞
  const takeoff = async (droneId: string) => {
    try {
      const response = await droneApi.takeoff(droneId)
      return response.data
    } catch (err: any) {
      error.value = err.message || '无人机起飞失败'
      throw err
    }
  }

  // 控制无人机降落
  const land = async (droneId: string) => {
    try {
      const response = await droneApi.land(droneId)
      return response.data
    } catch (err: any) {
      error.value = err.message || '无人机降落失败'
      throw err
    }
  }

  return {
    drones: readonly(drones),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    fetchDrones,
    takeoff,
    land
  }
}

// 任务管理的组合式API
export function useMissions() {
  const missions = ref<Mission[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 获取任务列表
  const fetchMissions = async (params?: { page?: number; pageSize?: number; status?: string; droneId?: string }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await missionApi.getMissions(params)
      missions.value = response.data.items
      pagination.total = response.data.total
      pagination.page = response.data.page
      pagination.pageSize = response.data.pageSize
      
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取任务列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 创建任务
  const createMission = async (missionData: Partial<Mission>) => {
    try {
      const response = await missionApi.createMission(missionData)
      return response.data
    } catch (err: any) {
      error.value = err.message || '创建任务失败'
      throw err
    }
  }

  // 启动任务
  const startMission = async (missionId: string) => {
    try {
      const response = await missionApi.startMission(missionId)
      return response.data
    } catch (err: any) {
      error.value = err.message || '启动任务失败'
      throw err
    }
  }

  return {
    missions: readonly(missions),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    fetchMissions,
    createMission,
    startMission
  }
}

// 报警管理的组合式API
export function useAlerts() {
  const alerts = ref<Alert[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = reactive({
    page: 1,
    pageSize: 20,
    total: 0
  })

  // 获取报警列表
  const fetchAlerts = async (params?: { page?: number; pageSize?: number; status?: string; deviceType?: string }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await alertApi.getAlerts(params)
      alerts.value = response.data.items
      pagination.total = response.data.total
      pagination.page = response.data.page
      pagination.pageSize = response.data.pageSize
      
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取报警列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 标记报警为已读
  const markAsRead = async (alertId: string) => {
    try {
      const response = await alertApi.markAsRead(alertId)
      // 更新本地状态
      const alert = alerts.value.find(a => a.id === alertId)
      if (alert) {
        alert.status = 'read'
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || '标记报警失败'
      throw err
    }
  }

  return {
    alerts: readonly(alerts),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    fetchAlerts,
    markAsRead
  }
}

// 系统状态的组合式API
export function useSystem() {
  const systemStatus = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取系统状态
  const fetchSystemStatus = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await systemApi.getSystemStatus()
      systemStatus.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取系统状态失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    systemStatus: readonly(systemStatus),
    loading: readonly(loading),
    error: readonly(error),
    fetchSystemStatus
  }
} 

// 设备管理的组合式API
export function useDevices() {
  const devices = ref<Device[]>([])
  const docks = ref<Device[]>([])
  const drones = ref<Device[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 缓存设备信息到本地
  const cacheDeviceSns = (deviceList: Device[]) => {
    // 根据device_type区分机场和无人机
    // device_type=3 是机场，device_type=100 是无人机
    const dockSns = deviceList.filter(device => {
      return device.device_type_info?.device_type === 3
    }).map(device => device.device_sn)
    
    const droneSns = deviceList.filter(device => {
      return device.device_type_info?.device_type === 100
    }).map(device => device.device_sn)
    
    // 为无人机设备添加 zoom_factor 字段
    const enhancedDeviceList = deviceList.map(device => {
      if (device.device_type_info?.device_type === 100) {
        // 无人机设备，添加 zoom_factor 字段
        return {
          ...device,
          zoom_factor: device.zoom_factor || 1 // 默认值为1
        }
      }
      return device
    })
    
    localStorage.setItem('cached_dock_sns', JSON.stringify(dockSns))
    localStorage.setItem('cached_drone_sns', JSON.stringify(droneSns))
    
    // 缓存完整的设备信息（包含 zoom_factor）
    localStorage.setItem('cached_devices', JSON.stringify(enhancedDeviceList))
    
    console.log('设备信息已缓存到本地:', { 
      dockSns, 
      droneSns, 
      totalDevices: enhancedDeviceList.length 
    })
  }

  // 更新无人机的 zoom_factor 并同步 camera_zoom_factor
  const updateDroneZoomFactor = (deviceSn: string, zoomFactor: number) => {
    const devices = getCachedDevices()
    const deviceIndex = devices.findIndex((device: Device) => device.device_sn === deviceSn)
    
    if (deviceIndex !== -1) {
      // 更新设备缓存中的 zoom_factor
      devices[deviceIndex] = {
        ...devices[deviceIndex],
        zoom_factor: zoomFactor
      }
      
      // 重新缓存设备信息
      localStorage.setItem('cached_devices', JSON.stringify(devices))
      
      // 同步更新 camera_zoom_factor
      localStorage.setItem('camera_zoom_factor', zoomFactor.toString())
      
      console.log(`无人机 ${deviceSn} 的 zoom_factor 已更新为: ${zoomFactor}`)
      return true
    }
    
    console.warn(`未找到设备 ${deviceSn}`)
    return false
  }

  // 获取无人机的 zoom_factor
  const getDroneZoomFactor = (deviceSn: string): number => {
    const devices = getCachedDevices()
    const device = devices.find((device: Device) => device.device_sn === deviceSn)
    
    if (device && (device as any).zoom_factor) {
      return (device as any).zoom_factor
    }
    
    // 如果没有找到，从 camera_zoom_factor 获取
    const cachedZoomFactor = localStorage.getItem('camera_zoom_factor')
    if (cachedZoomFactor) {
      const factor = parseInt(cachedZoomFactor, 10)
      return isNaN(factor) ? 1 : Math.max(1, Math.min(200, factor))
    }
    
    return 1 // 默认值
  }

  // 测试函数：验证 zoom_factor 同步功能
  const testZoomFactorSync = () => {
    const devices = getCachedDevices()
    const droneDevices = devices.filter((device: Device) => 
      device.device_type_info?.device_type === 100
    )
    
    console.log('=== Zoom Factor 同步测试 ===')
    console.log('无人机设备数量:', droneDevices.length)
    
    droneDevices.forEach((device: Device) => {
      const cachedZoomFactor = localStorage.getItem('camera_zoom_factor')
      const deviceZoomFactor = (device as any).zoom_factor || 1
      
      console.log(`设备 ${device.device_sn}:`)
      console.log(`  - cached_devices zoom_factor: ${deviceZoomFactor}`)
      console.log(`  - camera_zoom_factor: ${cachedZoomFactor}`)
      console.log(`  - 同步状态: ${deviceZoomFactor === parseInt(cachedZoomFactor || '1', 10) ? '✅ 同步' : '❌ 不同步'}`)
    })
  }

  // 从本地缓存获取设备SN
  const getCachedDeviceSns = () => {
    const dockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    const droneSns = JSON.parse(localStorage.getItem('cached_drone_sns') || '[]')
    return { dockSns, droneSns }
  }

  // 从本地缓存获取完整设备信息
  const getCachedDevices = () => {
    const devices = JSON.parse(localStorage.getItem('cached_devices') || '[]')
    return devices
  }

  // 根据设备SN从缓存获取设备信息
  const getCachedDeviceBySn = (deviceSn: string) => {
    const devices = getCachedDevices()
    return devices.find((device: Device) => device.device_sn === deviceSn)
  }

  const getCachedWorkspaceId = () => {
    return localStorage.getItem('workspace_id')
  }

  // 获取设备列表
  const fetchDevices = async () => {
    loading.value = true
    error.value = null
    
    console.log('useDevices - 开始获取设备列表')
    
    try {
      const response = await deviceApi.getDevices({ skip: 0, limit: 100 })
      console.log('useDevices - 设备列表获取成功:', response)
      devices.value = response
      
      // 分离机场和无人机
      docks.value = response.filter(device => device.child_sn !== '')
      drones.value = response.filter(device => device.child_sn === '')
      
      console.log('useDevices - 机场数量:', docks.value.length)
      console.log('useDevices - 无人机数量:', drones.value.length)
      
      // 缓存设备SN到本地
      cacheDeviceSns(response)
      
      return response
    } catch (err: any) {
      // 只在非网络错误时显示错误信息
      if (!(err instanceof TypeError && err.message.includes('Failed to fetch'))) {
        console.error('useDevices - 获取设备列表失败:', err)
      }
      error.value = err.message || '获取设备列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取机场列表
  const getDocks = () => {
    return docks.value
  }

  // 获取无人机列表
  const getDrones = () => {
    return drones.value
  }

  // 根据设备SN获取设备
  const getDeviceBySn = (deviceSn: string) => {
    return devices.value.find(device => device.device_sn === deviceSn)
  }

  // 设置设备列表
  const setDevices = (deviceList: Device[]) => {
    devices.value = deviceList
  }

  return {
    devices: readonly(devices),
    loading: readonly(loading),
    error: readonly(error),
    fetchDevices,
    getDocks,
    getDrones,
    getDeviceBySn,
    setDevices,
    cacheDeviceSns,
    getCachedDeviceSns,
    getCachedDevices,
    getCachedDeviceBySn,
    getCachedWorkspaceId,
    updateDroneZoomFactor,
    getDroneZoomFactor,
    testZoomFactorSync
  }
} 

// 用户管理的组合式API
export function useUsers() {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取用户列表
  const fetchUsers = async (params?: { skip?: number; limit?: number; search?: string }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await userApi.getUsers(params)
      users.value = response
      return response
    } catch (err: any) {
      error.value = err.message || '获取用户列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 创建用户
  const createUser = async (userData: Partial<User>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await userApi.createUser(userData)
      // 重新获取用户列表
      await fetchUsers()
      return response
    } catch (err: any) {
      error.value = err.message || '创建用户失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新用户
  const updateUser = async (id: string, userData: Partial<User>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await userApi.updateUser(id, userData)
      // 重新获取用户列表
      await fetchUsers()
      return response
    } catch (err: any) {
      error.value = err.message || '更新用户失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 删除用户
  const deleteUser = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await userApi.deleteUser(id)
      // 重新获取用户列表
      await fetchUsers()
    } catch (err: any) {
      error.value = err.message || '删除用户失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取单个用户
  const getUser = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await userApi.getUser(id)
      return response
    } catch (err: any) {
      error.value = err.message || '获取用户信息失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser
  }
} 

// 角色管理的组合式API
export function useRoles() {
  const roles = ref<Role[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取角色列表
  const fetchRoles = async (params?: { skip?: number; limit?: number; search?: string }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await roleApi.getRoles(params)
      roles.value = response
      return response
    } catch (err: any) {
      error.value = err.message || '获取角色列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 创建角色
  const createRole = async (roleData: Partial<Role>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await roleApi.createRole(roleData)
      // 重新获取角色列表
      await fetchRoles()
      return response
    } catch (err: any) {
      error.value = err.message || '创建角色失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新角色
  const updateRole = async (id: string, roleData: Partial<Role>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await roleApi.updateRole(id, roleData)
      // 重新获取角色列表
      await fetchRoles()
      return response
    } catch (err: any) {
      error.value = err.message || '更新角色失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 删除角色
  const deleteRole = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await roleApi.deleteRole(id)
      // 重新获取角色列表
      await fetchRoles()
    } catch (err: any) {
      error.value = err.message || '删除角色失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取单个角色
  const getRole = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await roleApi.getRole(id)
      return response
    } catch (err: any) {
      error.value = err.message || '获取角色信息失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    roles: readonly(roles),
    loading: readonly(loading),
    error: readonly(error),
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    getRole
  }
} 

// HMS报警日志的组合式API
export function useHmsAlerts() {
  const hmsAlerts = ref<HmsAlert[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取设备的HMS报警日志
  const fetchDeviceHms = async (deviceSn: string) => {
    loading.value = true
    error.value = null
    
    console.log('HMS API调用 - 设备SN:', deviceSn)
    console.log('HMS API URL:', `/hms/devices/${deviceSn}/hms`)
    
    try {
      const response = await hmsApi.getDeviceHms(deviceSn)
      console.log('HMS API响应:', response)
      hmsAlerts.value = response
      return response
    } catch (err: any) {
      console.error('HMS API调用失败:', err)
      error.value = err.message || '获取HMS报警日志失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 设置所有报警数据
  const setAllAlerts = (alerts: HmsAlert[]) => {
    hmsAlerts.value = alerts
  }

  return {
    hmsAlerts: readonly(hmsAlerts),
    loading: readonly(loading),
    error: readonly(error),
    fetchDeviceHms,
    setAllAlerts
  }
}

// 任务记录相关的组合式API
export function useWaylineJobs() {
  const jobs = ref<any[]>([])
  const waylineFiles = ref<any[]>([])
  const waylineDetail = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    page_size: 10,
    total: 0,
    pages: 0
  })

  const fetchJobs = async (workspaceId: string, params?: {
    page?: number
    page_size?: number
    status?: number
    task_type?: number
    wayline_type?: number
    file_id?: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await waylineApi.getJobs(workspaceId, params)
      jobs.value = response.data.data
      pagination.value = response.data.pagination
      console.log('任务记录获取成功:', response)
    } catch (err) {
      console.error('获取任务记录失败:', err)
      error.value = err instanceof Error ? err.message : '获取任务记录失败'
    } finally {
      loading.value = false
    }
  }

  const fetchWaylineFiles = async (workspaceId: string, params?: {
    page?: number
    page_size?: number
    name?: string
  }) => {
    try {
      const response = await waylineApi.getWaylineFiles(workspaceId, params)
      waylineFiles.value = response.data.data
      console.log('航线文件获取成功:', response)
      return response.data.data
    } catch (err) {
      console.error('获取航线文件失败:', err)
      error.value = err instanceof Error ? err.message : '获取航线文件失败'
      throw err
    }
  }

  const fetchWaylineDetail = async (workspaceId: string, waylineId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await waylineApi.getWaylineDetail(workspaceId, waylineId)
      waylineDetail.value = response.data
      console.log('航线详情获取成功:', response)
      return response.data
    } catch (err) {
      console.error('获取航线详情失败:', err)
      error.value = err instanceof Error ? err.message : '获取航线详情失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearJobs = () => {
    jobs.value = []
  }

  const clearWaylineDetail = () => {
    waylineDetail.value = null
  }

  const createJob = async (workspaceId: string, data: {
    name: string
    dock_sn: string
    file_id: string
    task_type: number
    out_of_control_action: number
    rth_altitude: number
    rth_mode: number
    exit_wayline_when_rc_lost: number
    wayline_precision_type: number
    begin_time?: string | null
    end_time?: string | null
    // 算法相关字段（移动到flight-tasks接口）
    enable_vision?: boolean
    vision_algorithms?: number[]
    vision_threshold?: number
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await waylineApi.createJob(workspaceId, data)
      console.log('任务创建成功:', response)
      return response.data
    } catch (err) {
      console.error('创建任务失败:', err)
      error.value = err instanceof Error ? err.message : '创建任务失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取航线任务实时进度
  const fetchWaylineProgress = async (workspaceId: string, dockSn: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await waylineApi.getWaylineProgress(workspaceId, dockSn)
      // console.log('航线任务进度获取成功:', response)
      return response.data
    } catch (err) {
      // console.error('获取航线任务进度失败:', err)
      error.value = err instanceof Error ? err.message : '获取航线任务进度失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取航线任务详细信息
  const fetchWaylineJobDetail = async (workspaceId: string, jobId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await waylineApi.getWaylineJobDetail(workspaceId, jobId)
      // console.log('航线任务详情获取成功:', response)
      return response.data
    } catch (err) {
      // console.error('获取航线任务详情失败:', err)
      error.value = err instanceof Error ? err.message : '获取航线任务详情失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 取消返航
  const cancelReturnHome = async (workspaceId: string, dockSn: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await waylineApi.cancelReturnHome(workspaceId, dockSn)
      console.log('取消返航成功:', response)
      return response
    } catch (err) {
      console.error('取消返航失败:', err)
      error.value = err instanceof Error ? err.message : '取消返航失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 取消任务
  const stopJob = async (workspaceId: string, jobId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await waylineApi.stopJob(workspaceId, jobId)
      console.log('取消任务成功:', response)
      return response
    } catch (err) {
      console.error('取消任务失败:', err)
      error.value = err instanceof Error ? err.message : '取消任务失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 航线暂停
  const pauseJob = async (workspaceId: string, jobId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await waylineApi.pauseJob(workspaceId, jobId)
      console.log('航线暂停成功:', response)
      return response
    } catch (err) {
      console.error('航线暂停失败:', err)
      error.value = err instanceof Error ? err.message : '航线暂停失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 航线恢复
  const resumeJob = async (workspaceId: string, jobId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await waylineApi.resumeJob(workspaceId, jobId)
      console.log('航线恢复成功:', response)
      return response
    } catch (err) {
      console.error('航线恢复失败:', err)
      error.value = err instanceof Error ? err.message : '航线恢复失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 执行任务
  const executeJob = async (workspaceId: string, jobId: string, algorithmData?: {
    enable_vision?: boolean
    vision_algorithms?: number[]
    vision_threshold?: number
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await waylineApi.executeJob(workspaceId, jobId, algorithmData)
      console.log('执行任务成功:', response)
      return response
    } catch (err) {
      console.error('执行任务失败:', err)
      error.value = err instanceof Error ? err.message : '执行任务失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    jobs: readonly(jobs),
    waylineFiles: readonly(waylineFiles),
    waylineDetail: readonly(waylineDetail),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    fetchJobs,
    fetchWaylineFiles,
    fetchWaylineDetail,
    fetchWaylineProgress,
    fetchWaylineJobDetail,
    createJob,
    cancelReturnHome,
    stopJob,
    pauseJob,
    resumeJob,
    executeJob,
    clearJobs,
    clearWaylineDetail
  }
} 