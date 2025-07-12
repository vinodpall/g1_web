import type { User, Dock, Drone, Mission, MissionRecord, Alert, Role } from '@/types'

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'admin',
    role: 'super_admin',
    avatar: '/src/assets/source_data/avatar.jpg'
  },
  {
    id: '2',
    username: 'jack',
    name: '张三',
    role: 'admin',
    avatar: '/src/assets/source_data/avatar.jpg'
  },
  {
    id: '3',
    username: 'rose',
    name: '李四',
    role: 'operator',
    avatar: '/src/assets/source_data/avatar.jpg'
  }
]

// 模拟机巢数据
export const mockDocks: Dock[] = [
  {
    id: 'dock-1',
    name: '大疆机巢3',
    model: 'DJI Dock 3',
    serialNumber: 'DK20240731001',
    status: 'online',
    location: { lat: 31.230416, lng: 121.473701 },
    droneId: 'drone-1',
    createdAt: '2025-07-06 16:55:19'
  },
  {
    id: 'dock-2',
    name: 'M4TD-1',
    model: 'Matrice 4TD',
    serialNumber: 'MD20240731002',
    status: 'online',
    location: { lat: 31.235416, lng: 121.478701 },
    droneId: 'drone-2',
    createdAt: '2025-07-06 16:55:19'
  }
]

// 模拟无人机数据
export const mockDrones: Drone[] = [
  {
    id: 'drone-1',
    name: 'M4TD',
    model: 'Matrice 4TD',
    serialNumber: '1ZMPAG005F1G9V',
    status: 'online',
    battery: 89,
    dockId: 'dock-1',
    location: { lat: 31.230416, lng: 121.473701, altitude: 0 },
    createdAt: '2025-07-06 16:55:19'
  },
  {
    id: 'drone-2',
    name: 'M4TD-2',
    model: 'Matrice 4TD',
    serialNumber: '1ZMPAG005F1G9W',
    status: 'charging',
    battery: 67,
    dockId: 'dock-2',
    location: { lat: 31.235416, lng: 121.478701, altitude: 0 },
    createdAt: '2025-07-06 16:55:19'
  }
]

// 模拟任务数据
export const mockMissions: Mission[] = [
  {
    id: 'mission-1',
    name: '巡航巡检',
    droneId: 'drone-1',
    dockId: 'dock-1',
    status: 'completed',
    waypoints: [
      { lat: 31.230416, lng: 121.473701, altitude: 50, action: 'takeoff' },
      { lat: 31.232416, lng: 121.475701, altitude: 50, action: 'photo' },
      { lat: 31.230416, lng: 121.473701, altitude: 0, action: 'land' }
    ],
    startTime: '2025-07-06 15:47:20',
    endTime: '2025-07-06 15:57:40',
    creator: '张三'
  }
]

// 模拟任务记录
export const mockMissionRecords: MissionRecord[] = [
  {
    id: 'record-1',
    missionName: '巡航巡检',
    droneId: 'drone-1',
    dockId: 'dock-1',
    startTime: '2025-07-06 15:47:20',
    endTime: '2025-07-06 15:57:40',
    status: 'completed',
    creator: '张三'
  }
]

// 模拟报警数据
export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    deviceType: 'dock',
    deviceId: 'dock-1',
    deviceName: '大疆机巢3',
    alertType: 'warning',
    message: '外部风速过大，不宜起飞',
    status: 'unread',
    timestamp: '2025-07-06 16:55:19'
  },
  {
    id: 'alert-2',
    deviceType: 'drone',
    deviceId: 'drone-1',
    deviceName: 'M4TD',
    alertType: 'error',
    message: '电池电量低，请及时充电',
    status: 'unread',
    timestamp: '2025-07-06 16:55:19'
  }
]

// 模拟角色数据
export const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: '超级管理员',
    permissions: ['all'],
    createdAt: '2025-07-06 16:55:19'
  },
  {
    id: 'role-2',
    name: '管理员',
    permissions: ['device_manage', 'mission_manage', 'user_manage'],
    createdAt: '2025-07-06 16:55:19'
  },
  {
    id: 'role-3',
    name: '操作员',
    permissions: ['mission_view', 'device_view'],
    createdAt: '2025-07-06 16:55:19'
  },
  {
    id: 'role-4',
    name: '演示员',
    permissions: ['mission_view'],
    createdAt: '2025-07-06 16:55:19'
  }
]

// 登录API
export const loginApi = (username: string, password: string) => {
  return new Promise<{ user: User; token: string }>((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username)
      if (user && password === '123456') {
        resolve({
          user,
          token: 'mock-jwt-token'
        })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 1000)
  })
}