export interface User {
  id: string
  username: string
  name: string
  role: string
  avatar: string
}

export interface Dock {
  id: string
  name: string
  model: string
  serialNumber: string
  status: 'online' | 'offline'
  location: {
    lat: number
    lng: number
  }
  droneId?: string
  createdAt: string
}

export interface Drone {
  id: string
  name: string
  model: string
  serialNumber: string
  status: 'online' | 'offline' | 'flying' | 'charging'
  battery: number
  dockId?: string
  location: {
    lat: number
    lng: number
    altitude: number
  }
  createdAt: string
}

export interface Mission {
  id: string
  name: string
  droneId: string
  dockId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  waypoints: Array<{
    lat: number
    lng: number
    altitude: number
    action: string
  }>
  startTime?: string
  endTime?: string
  creator: string
}

export interface MissionRecord {
  id: string
  missionName: string
  droneId: string
  dockId: string
  startTime: string
  endTime: string
  status: 'completed' | 'failed'
  creator: string
}

export interface Alert {
  id: string
  deviceType: 'drone' | 'dock'
  deviceId: string
  deviceName: string
  alertType: 'warning' | 'error' | 'info'
  message: string
  status: 'unread' | 'read'
  timestamp: string
}

export interface Role {
  id: string
  name: string
  permissions: string[]
  createdAt: string
}