import { apiClient, API_BASE_URL, type ApiResponse, type PaginatedResponse } from './config'
import type { User, Dock, Drone, Mission, MissionRecord, Alert, Role, Device, HmsAlert } from '../types'

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
    
    return fetch(`${API_BASE_URL}/login/access-token`, {
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

// HMS报警日志接口
export const hmsApi = {
  // 获取设备的HMS报警日志
  getDeviceHms: (deviceSn: string) => {
    return apiClient.get<HmsAlert[]>(`/hms/devices/${deviceSn}/hms`)
  }
}

// 视频流接口
export const livestreamApi = {
  // 获取视频容量信息
  getCapacity: () => {
    return apiClient.get<{
      available_devices: Array<{
        sn: string
        available_video_number: number
        coexist_video_number_max: number
        camera_list: Array<{
          camera_index: string
          available_video_number: number
          coexist_video_number_max: number
          video_list: Array<{
            video_index: string
            video_type: string
            switchable_video_types: string[]
          }>
        }>
      }>
      total_devices: number
      total_cameras: number
      total_videos: number
    }>('/livestream/capacity')
  },

  // 启动视频流
  startLivestream: (deviceSn: string, data: {
    video_id: string
  }) => {
    return apiClient.post<{
      message: string
      bid: string
      push_url: string
      play_urls: {
        rtmp: string
        http_flv: string
        hls: string
      }
      protocol: string
    }>(`/livestream/devices/${deviceSn}/livestream/start`, data)
  },

  // 切换镜头
  changeLens: (deviceSn: string, data: {
    video_id: string
    video_type: string
  }) => {
    return apiClient.post<{
      message: string
      bid: string
    }>(`/livestream/devices/${deviceSn}/livestream/lens-change`, data)
  },

  // 设置清晰度
  setQuality: (deviceSn: string, data: {
    video_id: string
    video_quality: number
  }) => {
    return apiClient.post<{
      message: string
      bid: string
    }>(`/livestream/devices/${deviceSn}/livestream/set-quality`, data)
  },

  // 分屏控制
  setScreenSplit: (deviceSn: string, data: {
    payload_index: string
    enable: boolean
  }) => {
    return apiClient.post<{
      message: string
      code: number
    }>(`/control/devices/${deviceSn}/camera/screen-split`, data)
  }
}

// 控制权限接口
export const controlApi = {
  // 获取飞行控制权限
  getFlightAuthority: (deviceSn: string) => {
    return apiClient.post<{
      message: string
      code: number
    }>(`/control/devices/${deviceSn}/authority/flight`)
  },

  // 释放飞行控制权限
  releaseFlightAuthority: (deviceSn: string) => {
    return apiClient.delete<{
      message: string
      code: number
    }>(`/control/devices/${deviceSn}/authority/flight`)
  },

  // 获取载荷控制权限
  getPayloadAuthority: (deviceSn: string, payloadIndex: string) => {
    return apiClient.post<{
      message: string
      code: number
    }>(`/control/devices/${deviceSn}/authority/payload`, {
      payload_index: payloadIndex
    })
  },

  // 释放载荷控制权限
  releasePayloadAuthority: (deviceSn: string, payloadIndex: string) => {
    return apiClient.delete<{
      message: string
      code: number
    }>(`/control/devices/${deviceSn}/authority/payload/${payloadIndex}`)
  },

  // 获取权限状态
  getAuthorityStatus: (deviceSn: string) => {
    return apiClient.get<{
      message: string
      code: number
      data: {
        flight_authority: {
          username: string
          user_id: string
          obtained_at: number
        } | null
        payload_authorities: {
          [payloadIndex: string]: {
            username: string
            user_id: string
            obtained_at: number
          }
        }
      }
    }>(`/control/devices/${deviceSn}/authority`)
  },

  // 云台方向控制
  gimbalDirectionControl: (deviceSn: string, payloadIndex: string, direction: 'up' | 'down' | 'left' | 'right') => {
    return apiClient.post<{
      message: string
      code: number
    }>(`/control/devices/${deviceSn}/gimbal/direction-control`, {
      payload_index: payloadIndex,
      direction: direction,
      speed: 10,
      locked: false
    })
  },

  // 一键返航
  returnHome: (deviceSn: string) => {
    return apiClient.post<{
      message: string
      code: number
    }>(`/control/devices/${deviceSn}/return-home`)
  },

  // 摄像头变焦控制
  cameraZoom: (deviceSn: string, payloadIndex: string, zoomFactor: number) => {
    return apiClient.post<{
      message: string
      code: number
    }>(`/control/devices/${deviceSn}/camera/zoom`, {
      payload_index: payloadIndex,
      camera_type: "zoom",
      zoom_factor: zoomFactor
    })
  },

  // 一键起飞到指定点
  takeoffToPoint: (deviceSn: string, params: {
    target_latitude: number
    target_longitude: number
    target_height: number
    security_takeoff_height: number
    rth_mode: number
    rth_altitude: number
    rc_lost_action: number
    commander_mode_lost_action: number
    commander_flight_mode: number
    commander_flight_height: number
    max_speed: number
    vision_algorithms?: number[]
    vision_threshold?: number
    simulate_mission: {
      is_enable: number
      latitude?: number
      longitude?: number
    }
  }) => {
    return apiClient.post<{
      code: number
      message: string
      data?: any
    }>(`/control/devices/${deviceSn}/takeoff-to-point`, params)
  },

  // 分屏控制
  setScreenSplit: (deviceSn: string, data: {
    payload_index: string
    enable: boolean
  }) => {
    return apiClient.post<{
      message: string
      code: number
    }>(`/control/devices/${deviceSn}/camera/screen-split`, data)
  }
}

// DRC模式接口
export const drcApi = {
  // 检查DRC是否准备就绪
  checkDrcReady: (deviceSn: string) => {
    return apiClient.get<{
      code: number
      message: string
      data: {
        ready: boolean
        reason?: string
      }
    }>(`/drc/devices/${deviceSn}/drc/ready`)
  },

  // 获取DRC状态
  getDrcStatus: (deviceSn: string) => {
    return apiClient.get<{
      code: number
      message: string
      data: {
        drc_mode: 'active' | 'inactive'
        session: string | null
      }
    }>(`/drc/devices/${deviceSn}/drc/status`)
  },

  // 进入DRC模式
  enterDrcMode: (deviceSn: string) => {
    return apiClient.post<{
      message: string
      code: number
    }>(`/drc/devices/${deviceSn}/drc/enter`, {
      osd_frequency: 10,
      hsi_frequency: 4
    })
  },

  // 退出DRC模式
  exitDrcMode: (deviceSn: string) => {
    return apiClient.post<{
      message: string
      code: number
    }>(`/drc/devices/${deviceSn}/drc/exit`)
  },

  // 简单控制
  simpleControl: (deviceSn: string, control: {
    forward?: number
    right?: number
    up?: number
    turn_right?: number
  }) => {
    return apiClient.post<{
      message: string
      code: number
    }>(`/drc/devices/${deviceSn}/drc/control/simple`, {
      forward: control.forward || 0,
      right: control.right || 0,
      up: control.up || 0,
      turn_right: control.turn_right || 0
    })
  }
}

// 任务记录相关接口
export const waylineApi = {
  // 获取任务记录列表
  getJobs: (workspaceId: string, params?: { 
    page?: number; 
    page_size?: number; 
    status?: number;
    task_type?: number;
    wayline_type?: number;
    file_id?: string;
  }) => {
    return apiClient.get<{
      code: number
      message: string
      data: {
        data: Array<{
          job_id: string
          name: string
          file_id: string
          file_name: string
          dock_sn: string
          dock_name: string
          workspace_id: string
          task_type: number
          wayline_type: number
          status: number
          progress: number | null
          out_of_control_action: number
          rth_altitude: number
          media_count: number
          uploaded_count: number
          username: string
          begin_time: string
          end_time: string | null
          execute_time: string | null
          completed_time: string | null
          error_code: string | null
          create_time: string
          update_time: string
          uploading: boolean
        }>
        pagination: {
          page: number
          page_size: number
          total: number
          pages: number
        }
      }
    }>(`/wayline/workspaces/${workspaceId}/jobs`, params)
  },

  // 获取航线文件列表
  getWaylineFiles: (workspaceId: string, params?: {
    page?: number
    page_size?: number
    name?: string
  }) => {
    return apiClient.get<{
      code: number
      message: string
      data: {
        data: Array<{
          wayline_id: string
          name: string
          object_key: string
          sign: string
          drone_model_key: string
          payload_model_keys: string
          template_types: string
          favorited: boolean
          create_time: string
          update_time: string
          waypoint_count: number
          action_count: number
          action_types: string[]
          height_range: {
            min: number
            max: number
          }
        }>
        pagination: {
          total: number
          page: number
          page_size: number
        }
      }
    }>(`/wayline/workspaces/${workspaceId}/files`, params)
  },

  // 获取航线详情
  getWaylineDetail: (workspaceId: string, waylineId: string) => {
    return apiClient.get<{
      code: number
      message: string
      data: {
        wayline_id: string
        name: string
        object_key: string
        sign: string
        drone_model_key: string
        payload_model_keys: string
        template_types: string
        favorited: boolean
        create_time: string
        update_time: string
        mission_config: {
          flyToWaylineMode: string
          finishAction: string
          exitOnRCLost: string
          executeRCLostAction: string
          takeOffSecurityHeight: string
          globalTransitionalSpeed: string
          globalRTHHeight: string
          droneInfo: any
          payloadInfo: any
        }
        waylines: Array<{
          templateId: string
          waylineId: string
          executeHeightMode: string
          autoFlightSpeed: string
          waypointCount: number
          waypoints: Array<{
            index: number
            coordinates: [number, number]
            executeHeight: number
            waypointSpeed: number
            headingParam: {
              mode: string
              angle: string
              pathMode: string
            }
            turnParam: {
              mode: string
              dampingDist: string
            }
            actions: Array<{
              actionId: string
              type: string
              typeName: string
              params: any
              trigger: {
                type: string
                param: string
              }
              groupInfo: {
                actionGroupId: string
                startIndex: string
                endIndex: string
                mode: string
              }
            }>
          }>
        }>
        summary: {
          totalWaypoints: number
          totalActions: number
          actionTypes: string[]
          waypointRange: {
            minHeight: number
            maxHeight: number
          }
          speedRange: {
            min: number
            max: number
          }
        }
      }
    }>(`/wayline/workspaces/${workspaceId}/files/${waylineId}`)
  },

  // 创建任务
  createJob: (workspaceId: string, data: {
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
    return apiClient.post<{
      code: number
      message: string
      data: {
        job_id: string
        name: string
        file_id: string
        file_name: string
        dock_sn: string
        dock_name: string
        workspace_id: string
        task_type: number
        wayline_type: number
        status: number
        progress: number
        out_of_control_action: number
        rth_altitude: number
        media_count: number
        uploaded_count: number
        username: string
        begin_time: string
        end_time: string
        execute_time: string
        completed_time: string
        error_code: number
        create_time: string
        update_time: string
        uploading: boolean
      }
    }>(`/wayline/workspaces/${workspaceId}/flight-tasks`, data)
  },

  // 获取航线任务实时进度
  getWaylineProgress: (workspaceId: string, dockSn: string) => {
    return apiClient.get<{
      code: number
      message: string
      data: {
        dock_sn: string
        job_id: string
        status: string
        progress: {
          current_step: number
          percent: number
          current_waypoint_index: number
          total_waypoints: number
        }
        ext: {
          current_waypoint_index: number
          media_count: number
          flight_id: string
          track_id: string
          wayline_mission_state: number
          wayline_id: number
        }
        timestamp: number
        result: number
      }
    }>(`/wayline/workspaces/${workspaceId}/docks/${dockSn}/progress`)
  },

  // 获取航线任务详细信息
  getWaylineJobDetail: (workspaceId: string, jobId: string) => {
    return apiClient.get<{
      code: number
      message: string
      data: {
        job_id: string
        name: string
        file_id: string
        file_name: string
        dock_sn: string
        dock_name: string
        workspace_id: string
        task_type: number
        wayline_type: number
        status: number
        progress: any
        out_of_control_action: number
        rth_altitude: number
        media_count: number
        uploaded_count: number
        username: string
        begin_time: string
        end_time: string | null
        execute_time: string | null
        completed_time: string | null
        error_code: string | null
        create_time: string
        update_time: string
        uploading: boolean
      }
    }>(`/wayline/workspaces/${workspaceId}/jobs/${jobId}`)
  },

  // 取消返航
  cancelReturnHome: (workspaceId: string, dockSn: string) => {
    return apiClient.post<{
      code: number
      message: string
    }>(`/wayline/workspaces/${workspaceId}/docks/${dockSn}/cancel-return-home`)
  },

  // 取消任务
  stopJob: (workspaceId: string, jobId: string) => {
    return apiClient.post<{
      code: number
      message: string
    }>(`/wayline/workspaces/${workspaceId}/jobs/${jobId}/stop`)
  },

  // 航线暂停
  pauseJob: (workspaceId: string, jobId: string) => {
    return apiClient.post<{
      code: number
      message: string
    }>(`/wayline/workspaces/${workspaceId}/jobs/${jobId}/pause`)
  },

  // 航线恢复
  resumeJob: (workspaceId: string, jobId: string) => {
    return apiClient.post<{
      code: number
      message: string
    }>(`/wayline/workspaces/${workspaceId}/jobs/${jobId}/resume`)
  },

  // 执行任务
  executeJob: (workspaceId: string, jobId: string) => {
    return apiClient.post<{
      code: number
      message: string
    }>(`/wayline/workspaces/${workspaceId}/jobs/${jobId}/execute`)
  },

  // 获取飞行统计报表
  getFlightStatistics: (workspaceId: string, days?: number) => {
    return apiClient.get<{
      code: number
      message: string
      data: {
        summary: {
          total_tasks: number
          completed_tasks: number
          failed_tasks: number
          canceled_tasks: number
          in_progress_tasks: number
          total_flight_time: number
          total_distance: number
          total_media_count: number
        }
        daily_stats: Array<{
          date: string
          total_tasks: number
          completed_tasks: number
          failed_tasks: number
          canceled_tasks: number
          in_progress_tasks: number
          total_flight_time: number
          total_distance: number
          total_media_count: number
        }>
        status_stats: Array<{
          status: number
          status_name: string
          count: number
          percentage: number
        }>
        date_range: {
          start_date: string
          end_date: string
        }
      }
    }>(`/wayline/workspaces/${workspaceId}/reports/flight-statistics`, days ? { days } : {})
  }
} 