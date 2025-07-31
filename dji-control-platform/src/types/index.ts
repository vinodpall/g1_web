export interface User {
  id: number
  username: string
  userfullname: string
  is_activate: string
  is_superuser: string
  created_by: string | null
  created_time: string
  updated_by: string | null
  updated_time: string
  workspace_id: string
  user_type: number
  roles: any[]
  workspace_name: string | null
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
  id: number
  role_name: string
  role_description: string
  created_time: string
  updated_time: string
  permissions: string[]
}

export interface Device {
  id: number
  device_sn: string
  device_name: string
  nickname: string
  workspace_id: string
  device_type: number
  sub_type: number
  domain: number
  firmware_version: string
  compatible_status: boolean
  version: string
  device_index: string
  child_sn: string
  create_time: number
  update_time: number
  bound_time: number | null
  bound_status: boolean
  login_time: number | null
  device_desc: string
  url_normal: string
  url_select: string
  device_type_display: string
  device_type_info: {
    domain: number
    device_type: number
    sub_type: number
    device_name: string
    device_desc: string | null
    full_type: string
  }
  full_device_type: string
}