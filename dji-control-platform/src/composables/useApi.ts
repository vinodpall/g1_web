import { ref, reactive, readonly } from 'vue'
import { authApi, userApi, dockApi, droneApi, missionApi, alertApi, systemApi, deviceApi, roleApi, hmsApi, livestreamApi, waylineApi } from '../api/services'
import { apiClient } from '../api/config'
import type { User, Dock, Drone, Mission, Alert, Device, Role, HmsAlert } from '../types'
import { useDeviceStore } from '../stores/device'

// 认证相关的组合式API
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
      
      // 获取设备列表并缓存SN
      try {
        console.log('登录后开始获取设备列表...')
        const deviceResponse = await deviceApi.getDevices({ skip: 0, limit: 100 })
        console.log('设备列表获取成功:', deviceResponse)
        
        // 缓存设备SN到本地
        const dockSns = deviceResponse.filter(device => {
          const deviceType = `${device.device_type_info?.domain}-${device.device_type_info?.device_type}-${device.device_type_info?.sub_type}`
          return deviceType === '3-3-0'
        }).map(device => device.device_sn)
        
        const droneSns = deviceResponse.filter(device => {
          const deviceType = `${device.device_type_info?.domain}-${device.device_type_info?.device_type}-${device.device_type_info?.sub_type}`
          return deviceType === '0-100-0'
        }).map(device => device.device_sn)
        
        localStorage.setItem('cached_dock_sns', JSON.stringify(dockSns))
        localStorage.setItem('cached_drone_sns', JSON.stringify(droneSns))
        
        console.log('登录时设备SN已缓存到本地:', { dockSns, droneSns })
        
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
          
          if (capacityResponse.available_devices && capacityResponse.available_devices.length > 0) {
            const firstDevice = capacityResponse.available_devices[0]
            console.log('第一个可用设备:', firstDevice)
            
            if (firstDevice.camera_list && firstDevice.camera_list.length > 0) {
              const firstCamera = firstDevice.camera_list[0]
              console.log('第一个摄像头:', firstCamera)
              
              if (firstCamera.video_list && firstCamera.video_list.length > 0) {
                const firstVideo = firstCamera.video_list[0]
                console.log('第一个视频:', firstVideo)
                
                // 构建video_id: {sn}/{camera_index}/{video_index}
                const videoId = `${firstDevice.sn}/${firstCamera.camera_index}/${firstVideo.video_index}`
                console.log('构建的video_id:', videoId)
                
                // 启动视频流，只传递video_id
                console.log('开始启动视频流...')
                const livestreamResponse = await livestreamApi.startLivestream(firstDevice.sn, {
                  video_id: videoId
                })
                console.log('视频流启动成功:', livestreamResponse)
                
                // 处理push_url地址，替换为webrtc地址
                const pushUrl = livestreamResponse.push_url
                const webrtcUrl = pushUrl.replace(/^rtmp:\/\/[^\/]+/, 'webrtc://10.10.1.3:8000')
                console.log('原始push_url:', pushUrl)
                console.log('转换后的webrtc地址:', webrtcUrl)
                
                // 保存视频流地址到localStorage
                localStorage.setItem('video_stream_url', webrtcUrl)
                localStorage.setItem('video_bid', livestreamResponse.bid)
                
                console.log('视频流地址已保存到localStorage')
              } else {
                console.warn('没有可用的视频流')
              }
            } else {
              console.warn('没有可用的摄像头')
            }
          } else {
            console.warn('没有可用的设备')
          }
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

  // 缓存设备SN到本地
  const cacheDeviceSns = (deviceList: Device[]) => {
    // 根据device_type区分机场和无人机
    // 3-3-0 是机场，0-100-0 是无人机
    const dockSns = deviceList.filter(device => {
      const deviceType = `${device.device_type_info?.domain}-${device.device_type_info?.device_type}-${device.device_type_info?.sub_type}`
      return deviceType === '3-3-0'
    }).map(device => device.device_sn)
    
    const droneSns = deviceList.filter(device => {
      const deviceType = `${device.device_type_info?.domain}-${device.device_type_info?.device_type}-${device.device_type_info?.sub_type}`
      return deviceType === '0-100-0'
    }).map(device => device.device_sn)
    
    localStorage.setItem('cached_dock_sns', JSON.stringify(dockSns))
    localStorage.setItem('cached_drone_sns', JSON.stringify(droneSns))
    
    console.log('设备SN已缓存到本地:', { dockSns, droneSns })
  }

  // 从本地缓存获取设备SN
  const getCachedDeviceSns = () => {
    const dockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    const droneSns = JSON.parse(localStorage.getItem('cached_drone_sns') || '[]')
    return { dockSns, droneSns }
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
      console.error('useDevices - 获取设备列表失败:', err)
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
    getCachedWorkspaceId
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
    createJob,
    clearJobs,
    clearWaylineDetail
  }
} 