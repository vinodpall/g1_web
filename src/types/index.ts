export interface User {
  id: number
  username: string
  email: string
  full_name: string
  is_active: boolean
  is_superuser: boolean
  // 保留旧字段以兼容现有代码
  userfullname?: string
  is_activate?: string
  created_by?: string | null
  created_time?: string
  updated_by?: string | null
  updated_time?: string
  workspace_id?: string
  user_type?: number
  roles?: Role[] | string[] | ReadonlyArray<Role> | ReadonlyArray<string>
  workspace_name?: string | null
}

export interface Robot {
  sn: string
  name: string
  model: string
  firmware_version: string
  ip_address: string
  mac_address: string
  location: string
  status: 'active' | 'inactive' | 'maintenance' | 'error'
  online: boolean
  mqtt_client_id: string
  mqtt_status_topic: string
  notes: string
  id: number
  created_at: string
  updated_at: string
  last_seen_at: string | null
}

export interface TourRun {
  id: number
  preset_id: number
  hall_id: number
  audience_id: number
  robot_sn: string
  map_name: string
  status: 'running' | 'completed' | 'failed' | 'canceled' | 'paused' | 'pending'
  error: string | null
  created_at: string
  started_at: string | null
  ended_at: string | null
}

export interface TourPresetItem {
  id: number
  preset_id: number
  seq: number
  zone_id: number
  zone_name: string
  zone_enabled: boolean
  hall_id: number
  hall_alias: string
  hall_nav_name: string
  points: TourPresetPoint[]
  points_count: number
  enabled_points_count: number
}

export interface TourPresetPoint {
  id: number
  type: 'explain' | 'action'
  custom_name: string | null
  is_enabled: boolean
  point_name_id: number
  pose_x: number
  pose_y: number
  pose_theta: number
  zone_name?: string
  hall_alias?: string
  hall_nav_name?: string
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
  permissions: Permission[] | ReadonlyArray<Permission>
}

export interface Device {
  id: number
  device_sn: string
  device_name: string
  nickname: string
  workspace_id: string
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
  status?: {
    emergency_stop_state?: boolean
  }
  zoom_factor?: number // 无人机变焦倍率字段
}

export interface HmsAlert {
  device_sn: string
  level: number
  module: number
  hms_key: string
  message_zh: string
  message_en: string
  id: number
  hms_id: string
  tid: string
  bid: string
  create_time: number
  update_time: number
  code: string
  device_type: string
  in_the_sky: number
  imminent: number
  args: {
    sensor_index: number
    component_index: number
  }
  raw_data: string
  is_read: boolean
  read_time: number
}

export interface VisionAlert {
  id: string
  device_sn: string
  cam_key: string
  job_id: string
  workspace_id: string
  mission_name: string
  wayline_name: string
  alert_level: 'LOW' | 'MEDIUM' | 'HIGH'
  target_type: string
  target_count: number
  max_confidence: number
  threat_summary: string
  threat_analysis: Array<{
    type: number
    count: number
    algorithm: string
    confidence: number
    description: string
  }>
  detection_boxes: Array<Array<{
    bbox: [number, number, number, number]
    label: string
    confidence: number
  }>>
  has_images: boolean
  original_image_url: string
  marked_image_url: string
  thumbnail_image_url?: string
  latitude?: number
  longitude?: number
  altitude?: number
  status: 'PENDING' | 'HANDLED' | 'IGNORED'
  handler_id: string | null
  handler_name?: string
  handle_time: number | null
  handle_note: string | null
  detection_time: number
  create_time: number
  update_time: number | null
}

export interface VisionAlertsResponse {
  alerts: VisionAlert[]
  total: number
  has_more: boolean
}

export interface Permission {
  id: number
  permission_name: string
  permission_code: string
  permission_description: string
  created_time: string
  updated_time: string
}

// 讲解词管理相关类型
export interface GuidePointName {
  id: number
  name: string
  code: string
  is_active: boolean
}

export interface GuideAudience {
  id: number
  name: string
  description: string | null
  tts_config: any | null
}

export interface GuideScript {
  id: number
  audience_id: number
  point_name_id: number
  content: string
}

export interface Hall {
  id: number
  nav_name: string
  nav_source: string | null
  alias: string
  is_enabled: boolean
}

export interface Zone {
  id: number
  hall_id: number
  name: string
  seq: number
  is_enabled: boolean
}

export interface TourPreset {
  id: number
  name: string
  description: string | null
  hall_id: number
}

export interface Point {
  id: number
  zone_id: number
  type: 'explain' | 'action'  // explain为讲解点，action为辅助点
  point_name_id: number
  custom_name: string // 自定义任务点名称
  is_enabled: boolean
  pose_x: number
  pose_y: number
  pose_theta: number
  action_code: string | null
  action_params: string | null
}

// 任务预设详情中的任务点信息（已在上方定义）

// 任务预设详情项
export interface TourPresetItem {
  id: number
  preset_id: number
  seq: number
  zone_id: number
  zone_name: string
  zone_enabled: boolean
  hall_id: number
  hall_alias: string
  hall_nav_name: string
  points: TourPresetPoint[]
  points_count: number
  enabled_points_count: number
}