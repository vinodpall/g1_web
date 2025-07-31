import { ref, reactive, readonly } from 'vue'
import { authApi, userApi, dockApi, droneApi, missionApi, alertApi, systemApi, deviceApi, roleApi } from '../api/services'
import { apiClient } from '../api/config'
import type { User, Dock, Drone, Mission, Alert, Device, Role } from '../types'
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
      const userData = userResponse.data
      
      user.value = userData
      token.value = access_token
      
      // 保存到localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', access_token)
      
      console.log('localStorage中的token:', localStorage.getItem('token'))
      
      // 获取设备列表
      const deviceStore = useDeviceStore()
      try {
        console.log('开始获取设备列表...')
        const deviceResponse = await deviceApi.getDevices({ skip: 0, limit: 100 })
        console.log('设备列表获取成功:', deviceResponse)
        
        deviceStore.setDevices(deviceResponse)
        
        // 如果有机场，设置第一个为默认选中
        if (deviceStore.docks.length > 0) {
          deviceStore.setSelectedDock(deviceStore.docks[0].device_sn)
        }
      } catch (deviceError) {
        console.warn('获取设备列表失败:', deviceError)
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

  // 获取设备列表
  const fetchDevices = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await deviceApi.getDevices({ skip: 0, limit: 100 })
      devices.value = response
      
      // 分离机场和无人机
      docks.value = response.filter(device => device.child_sn !== '')
      drones.value = response.filter(device => device.child_sn === '')
      
      return response
    } catch (err: any) {
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

  return {
    devices: readonly(devices),
    docks: readonly(docks),
    drones: readonly(drones),
    loading: readonly(loading),
    error: readonly(error),
    fetchDevices,
    getDocks,
    getDrones,
    getDeviceBySn
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