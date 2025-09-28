// WebSocket 数据类型定义

// 基础时间戳接口
export interface TimestampData {
  ts: number // 服务器时间戳（秒）
}

// 机器人位姿数据 - robot:{sn}:pose
export interface RobotPose extends TimestampData {
  x: number     // 米
  y: number     // 米  
  theta: number // 弧度
}

// 当前地图信息 - robot:{sn}:current_map
export interface CurrentMap extends TimestampData {
  map_name: string
  [key: string]: any // 设备侧上报的其他字段透传
}

// 机器人速度信息 - robot:{sn}:speed
export interface RobotSpeed extends TimestampData {
  v: number   // 线速度 (m/s)
  w: number   // 角速度 (rad/s)
  // 为了向后兼容，保留原有字段
  linear_x?: number   // 线速度 X (m/s) - 向后兼容
  linear_y?: number   // 线速度 Y (m/s) - 向后兼容  
  angular_z?: number  // 角速度 Z (rad/s) - 向后兼容
  [key: string]: any // 设备侧上报的其他字段透传
}

// 自动收尾流程状态
export interface SlamAutoStatus {
  sn: string           // SN 或 broadcast
  map_name: string     // 建图使用地图名
  data_name: string    // 录包/数据名
  stage: 'closing_slam' | 'change_pcd' | 'done' | 'error'
  ok: boolean | null   // null: 等待回包, true: 成功, false: 失败
  resp?: {             // 设备回复原文
    error_code?: number
    error_msg?: string
    result?: number
    [key: string]: any
  }
  reason?: string      // 仅 stage=error 时可能出现
}

// 设备/任务状态 - robot:{sn}:cmd_status
export interface CmdStatus extends TimestampData {
  // 增强字段（服务添加）
  slam_process_p: number    // 0-100，建图进度
  slam_process_ts: number   // 最近进度时间戳
  slam_auto?: SlamAutoStatus // 自动收尾流程状态
  
  // 设备态透传字段
  data_record?: boolean | number  // 展厅录包状态
  nav?: boolean | number         // 导航开启状态
  slam?: boolean | number        // 建图状态
  
  // 电量百分比（0-100），设备上报字段
  battery_soc?: number
  
  // 其他设备态透传字段（字段名依设备而定）
  [key: string]: any
}

// 任务运行事件类型
export type TourEventType = 'started' | 'point' | 'finished'

// 点位状态
export type PointStatus = 'pending' | 'arriving' | 'done' | 'failed'

// 任务完成状态
export type FinishedStatus = 'success' | 'failed' | 'canceled'

// 任务开始事件
export interface TourStartedEvent {
  event: 'started'
  run_id: number
  robot_sn: string
}

// 任务点位事件
export interface TourPointEvent {
  event: 'point'
  status: PointStatus
  point_id: number
  zone_id: number
  note?: string
}

// 任务完成事件
export interface TourFinishedEvent {
  event: 'finished'
  status: FinishedStatus
  run_id: number
  error?: string
}

// 任务事件联合类型
export type TourEvent = TourStartedEvent | TourPointEvent | TourFinishedEvent

// WebSocket 频道类型
export type ChannelType = 
  | `robot:${string}:pose`
  | `robot:${string}:cmd_status`  
  | `robot:${string}:current_map`
  | `robot:${string}:speed`
  | `tours:run:${number}`
  | `tours:robot:${string}`

// WebSocket 消息包装器
export interface WebSocketMessage<T = any> {
  channel: ChannelType
  data: T
  timestamp?: number
}

// 解析后的频道数据类型映射
export interface ChannelDataMap {
  pose: RobotPose
  cmd_status: CmdStatus
  current_map: CurrentMap
  speed: RobotSpeed
  tour: TourEvent
}

// WebSocket 连接配置
export interface WebSocketConfig {
  sn?: string                    // 机器人序列号，默认 'broadcast'
  kinds?: string[]              // 订阅的数据类型
  channels?: string[]           // 自定义频道列表
  baseUrl?: string              // WebSocket 基础 URL
}

// 解析频道名称的结果
export interface ParsedChannel {
  type: 'robot' | 'tours'
  sn?: string
  dataType?: 'pose' | 'cmd_status' | 'current_map' | 'speed'
  runId?: number
  category?: 'run' | 'robot'
  isValid: boolean
}

// WebSocket 客户端状态
export interface WebSocketState {
  isConnected: boolean
  isConnecting: boolean
  error: string
  dataCount: number
  lastUpdateTime: Date | null
  reconnectAttempts: number
}

// 实时数据存储接口
export interface RealtimeData {
  // 按SN组织的机器人数据
  robots: Record<string, {
    pose?: RobotPose
    cmdStatus?: CmdStatus
    currentMap?: CurrentMap
    speed?: RobotSpeed
    lastUpdate: Date
  }>
  
  // 任务运行数据
  tours: {
    runs: Record<number, TourEvent[]>     // 按 run_id 组织
    robots: Record<string, TourEvent[]>   // 按 robot_sn 组织
  }
}

// 数据处理回调函数类型
export type DataHandler<T = any> = (data: T, channel: string) => void

// 订阅配置
export interface Subscription {
  channels: string[]
  handler: DataHandler
  id: string
}