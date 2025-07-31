import { apiClient, type ApiResponse, type PaginatedResponse } from './config'
import type { User, Dock, Drone, Mission, MissionRecord, Alert, Role, Device } from '../types'

// 认证相关接口
export const authApi = {
  // 用户登录 - 适配后端API
  login: (username: string, password: string) => {
    // 使用原生fetch确保请求格式正确
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)
    
    console.log('登录请求参数:', { username, password })
    console.log('登录请求体:', formData.toString())
    
    return fetch('/api/v1/login/access-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    }).then(response => {
      console.log('登录响应状态:', response.status)
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('登录失败:', response.status, errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json().then(data => {
        console.log('登录成功响应:', data)
        return data
      })
    })
  },

  // 用户登出
  logout: () => {
    return apiClient.post<ApiResponse>('/auth/logout')
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return apiClient.get<ApiResponse<User>>('/users/me')
  },

  // 刷新token
  refreshToken: () => {
    return apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh')
  }
}

// 用户管理接口
export const userApi = {
  // 获取用户列表
  getUsers: (params?: { skip?: number; limit?: number; search?: string }) => {
    return apiClient.get<User[]>('/users/', params)
  },

  // 获取单个用户
  getUser: (id: string) => {
    return apiClient.get<User>(`/users/${id}`)
  },

  // 创建用户
  createUser: (userData: Partial<User>) => {
    return apiClient.post<User>('/users/', userData)
  },

  // 更新用户
  updateUser: (id: string, userData: Partial<User>) => {
    return apiClient.put<User>(`/users/${id}`, userData)
  },

  // 删除用户
  deleteUser: (id: string) => {
    return apiClient.delete(`/users/${id}`)
  }
}

// 机巢管理接口
export const dockApi = {
  // 获取机巢列表
  getDocks: (params?: { page?: number; pageSize?: number; status?: string }) => {
    return apiClient.get<ApiResponse<PaginatedResponse<Dock>>>('/docks', params)
  },

  // 获取单个机巢
  getDock: (id: string) => {
    return apiClient.get<ApiResponse<Dock>>(`/docks/${id}`)
  },

  // 创建机巢
  createDock: (dockData: Partial<Dock>) => {
    return apiClient.post<ApiResponse<Dock>>('/docks', dockData)
  },

  // 更新机巢
  updateDock: (id: string, dockData: Partial<Dock>) => {
    return apiClient.put<ApiResponse<Dock>>(`/docks/${id}`, dockData)
  },

  // 删除机巢
  deleteDock: (id: string) => {
    return apiClient.delete<ApiResponse>(`/docks/${id}`)
  },

  // 获取机巢状态
  getDockStatus: (id: string) => {
    return apiClient.get<ApiResponse<{ status: string; battery?: number }>>(`/docks/${id}/status`)
  }
}

// 无人机管理接口
export const droneApi = {
  // 获取无人机列表
  getDrones: (params?: { page?: number; pageSize?: number; status?: string; dockId?: string }) => {
    return apiClient.get<ApiResponse<PaginatedResponse<Drone>>>('/drones', params)
  },

  // 获取单个无人机
  getDrone: (id: string) => {
    return apiClient.get<ApiResponse<Drone>>(`/drones/${id}`)
  },

  // 创建无人机
  createDrone: (droneData: Partial<Drone>) => {
    return apiClient.post<ApiResponse<Drone>>('/drones', droneData)
  },

  // 更新无人机
  updateDrone: (id: string, droneData: Partial<Drone>) => {
    return apiClient.put<ApiResponse<Drone>>(`/drones/${id}`, droneData)
  },

  // 删除无人机
  deleteDrone: (id: string) => {
    return apiClient.delete<ApiResponse>(`/drones/${id}`)
  },

  // 获取无人机状态
  getDroneStatus: (id: string) => {
    return apiClient.get<ApiResponse<{ status: string; battery: number; location?: any }>>(`/drones/${id}/status`)
  },

  // 控制无人机起飞
  takeoff: (id: string) => {
    return apiClient.post<ApiResponse>(`/drones/${id}/takeoff`)
  },

  // 控制无人机降落
  land: (id: string) => {
    return apiClient.post<ApiResponse>(`/drones/${id}/land`)
  },

  // 控制无人机返航
  returnToHome: (id: string) => {
    return apiClient.post<ApiResponse>(`/drones/${id}/return-home`)
  }
}

// 任务管理接口
export const missionApi = {
  // 获取任务列表
  getMissions: (params?: { page?: number; pageSize?: number; status?: string; droneId?: string }) => {
    return apiClient.get<ApiResponse<PaginatedResponse<Mission>>>('/missions', params)
  },

  // 获取单个任务
  getMission: (id: string) => {
    return apiClient.get<ApiResponse<Mission>>(`/missions/${id}`)
  },

  // 创建任务
  createMission: (missionData: Partial<Mission>) => {
    return apiClient.post<ApiResponse<Mission>>('/missions', missionData)
  },

  // 更新任务
  updateMission: (id: string, missionData: Partial<Mission>) => {
    return apiClient.put<ApiResponse<Mission>>(`/missions/${id}`, missionData)
  },

  // 删除任务
  deleteMission: (id: string) => {
    return apiClient.delete<ApiResponse>(`/missions/${id}`)
  },

  // 启动任务
  startMission: (id: string) => {
    return apiClient.post<ApiResponse>(`/missions/${id}/start`)
  },

  // 停止任务
  stopMission: (id: string) => {
    return apiClient.post<ApiResponse>(`/missions/${id}/stop`)
  },

  // 暂停任务
  pauseMission: (id: string) => {
    return apiClient.post<ApiResponse>(`/missions/${id}/pause`)
  },

  // 恢复任务
  resumeMission: (id: string) => {
    return apiClient.post<ApiResponse>(`/missions/${id}/resume`)
  }
}

// 任务记录接口
export const missionRecordApi = {
  // 获取任务记录列表
  getMissionRecords: (params?: { page?: number; pageSize?: number; status?: string; startDate?: string; endDate?: string }) => {
    return apiClient.get<ApiResponse<PaginatedResponse<MissionRecord>>>('/mission-records', params)
  },

  // 获取单个任务记录
  getMissionRecord: (id: string) => {
    return apiClient.get<ApiResponse<MissionRecord>>(`/mission-records/${id}`)
  },

  // 删除任务记录
  deleteMissionRecord: (id: string) => {
    return apiClient.delete<ApiResponse>(`/mission-records/${id}`)
  }
}

// 报警管理接口
export const alertApi = {
  // 获取报警列表
  getAlerts: (params?: { page?: number; pageSize?: number; status?: string; deviceType?: string }) => {
    return apiClient.get<ApiResponse<PaginatedResponse<Alert>>>('/alerts', params)
  },

  // 获取单个报警
  getAlert: (id: string) => {
    return apiClient.get<ApiResponse<Alert>>(`/alerts/${id}`)
  },

  // 标记报警为已读
  markAsRead: (id: string) => {
    return apiClient.put<ApiResponse<Alert>>(`/alerts/${id}/read`)
  },

  // 标记所有报警为已读
  markAllAsRead: () => {
    return apiClient.put<ApiResponse>('/alerts/read-all')
  },

  // 删除报警
  deleteAlert: (id: string) => {
    return apiClient.delete<ApiResponse>(`/alerts/${id}`)
  }
}

// 角色管理接口
export const roleApi = {
  // 获取角色列表
  getRoles: (params?: { skip?: number; limit?: number; search?: string }) => {
    return apiClient.get<Role[]>('/roles/', params)
  },

  // 获取单个角色
  getRole: (id: string) => {
    return apiClient.get<Role>(`/roles/${id}`)
  },

  // 创建角色
  createRole: (roleData: Partial<Role>) => {
    return apiClient.post<Role>('/roles/', roleData)
  },

  // 更新角色
  updateRole: (id: string, roleData: Partial<Role>) => {
    return apiClient.put<Role>(`/roles/${id}`, roleData)
  },

  // 删除角色
  deleteRole: (id: string) => {
    return apiClient.delete(`/roles/${id}`)
  }
}

// 系统状态接口
export const systemApi = {
  // 获取系统状态概览
  getSystemStatus: () => {
    return apiClient.get<ApiResponse<{
      totalDocks: number
      onlineDocks: number
      totalDrones: number
      onlineDrones: number
      activeMissions: number
      unreadAlerts: number
    }>>('/system/status')
  },

  // 获取系统健康状态
  getSystemHealth: () => {
    return apiClient.get<ApiResponse<{
      status: string
      uptime: number
      version: string
      lastCheck: string
    }>>('/system/health')
  }
} 

// 设备管理接口
export const deviceApi = {
  // 获取设备列表
  getDevices: (params?: { skip?: number; limit?: number }) => {
    console.log('设备API调用 - 参数:', params)
    console.log('当前ApiClient状态 - 检查Authorization头')
    return apiClient.get<Device[]>('/devices/', params)
  },

  // 获取单个设备
  getDevice: (deviceSn: string) => {
    return apiClient.get<Device>(`/devices/${deviceSn}`)
  },

  // 更新设备信息
  updateDevice: (deviceSn: string, deviceData: Partial<Device>) => {
    return apiClient.put<Device>(`/devices/${deviceSn}`, deviceData)
  },

  // 删除设备
  deleteDevice: (deviceSn: string) => {
    return apiClient.delete(`/devices/${deviceSn}`)
  }
} 