// WebSocket 数据解析工具函数

import type { 
  ParsedChannel, 
  WebSocketMessage, 
  ChannelDataMap,
  RobotPose,
  CmdStatus,
  CurrentMap,
  RobotSpeed,
  TourEvent,
  WebSocketConfig
} from '@/types/websocket'
import { getCurrentConfig } from '@/config/environment'

/**
 * 解析频道名称
 * @param channel 频道名称，如 'robot:SN001:pose' 或 'tours:run:12'
 * @returns 解析结果
 */
export function parseChannel(channel: string): ParsedChannel {
  const parts = channel.split(':')
  
  if (parts.length < 2) {
    return { type: 'robot', isValid: false }
  }
  
  const [type] = parts
  
  if (type === 'robot') {
    if (parts.length !== 3) {
      return { type: 'robot', isValid: false }
    }
    
    const [, sn, dataType] = parts
    
    if (!['pose', 'cmd_status', 'current_map', 'speed'].includes(dataType)) {
      return { type: 'robot', sn, isValid: false }
    }
    
    return {
      type: 'robot',
      sn,
      dataType: dataType as 'pose' | 'cmd_status' | 'current_map' | 'speed',
      isValid: true
    }
  }
  
  if (type === 'tours') {
    if (parts.length !== 3) {
      return { type: 'tours', isValid: false }
    }
    
    const [, category, identifier] = parts
    
    if (category === 'run') {
      const runId = parseInt(identifier, 10)
      if (isNaN(runId)) {
        return { type: 'tours', category: 'run', isValid: false }
      }
      
      return {
        type: 'tours',
        category: 'run',
        runId,
        isValid: true
      }
    }
    
    if (category === 'robot') {
      return {
        type: 'tours',
        category: 'robot',
        sn: identifier,
        isValid: true
      }
    }
    
    return { type: 'tours', isValid: false }
  }
  
  return { type: 'robot', isValid: false }
}

/**
 * 验证机器人位姿数据
 */
export function validateRobotPose(data: any): data is RobotPose {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.x === 'number' &&
    typeof data.y === 'number' &&
    typeof data.theta === 'number' &&
    typeof data.ts === 'number'
  )
}

/**
 * 验证命令状态数据
 */
export function validateCmdStatus(data: any): data is CmdStatus {
  // 基本结构检查
  if (typeof data !== 'object' || data === null) {
    return false
  }
  
  // 必须有时间戳
  if (typeof data.ts !== 'number') {
    return false
  }
  
  // 可选字段的类型检查
  if (data.slam_process_p !== undefined && (typeof data.slam_process_p !== 'number' || data.slam_process_p < 0 || data.slam_process_p > 100)) {
    return false
  }
  
  if (data.slam_process_ts !== undefined && typeof data.slam_process_ts !== 'number') {
    return false
  }
  
  // nav、slam、data_record 字段可以是 boolean 或 number
  if (data.nav !== undefined && typeof data.nav !== 'boolean' && typeof data.nav !== 'number') {
    return false
  }
  
  if (data.slam !== undefined && typeof data.slam !== 'boolean' && typeof data.slam !== 'number') {
    return false
  }
  
  if (data.data_record !== undefined && typeof data.data_record !== 'boolean' && typeof data.data_record !== 'number') {
    return false
  }
  
  return true
}

/**
 * 验证当前地图数据
 */
export function validateCurrentMap(data: any): data is CurrentMap {
  if (
    typeof data === 'object' &&
    data !== null &&
    typeof data.ts === 'number'
  ) {
    // map_name 可能是字符串或数字，统一转换为字符串
    if (data.map_name !== undefined && data.map_name !== null) {
      // 自动转换为字符串
      data.map_name = String(data.map_name)
      return true
    }
  }
  return false
}

/**
 * 验证机器人速度数据
 */
export function validateRobotSpeed(data: any): data is RobotSpeed {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.ts === 'number' &&
    (
      // 新格式：v, w
      (typeof data.v === 'number' && typeof data.w === 'number') ||
      // 向后兼容：linear_x, linear_y, angular_z
      (typeof data.linear_x === 'number' && 
       typeof data.linear_y === 'number' && 
       typeof data.angular_z === 'number')
    )
  )
}

/**
 * 验证任务事件数据
 */
export function validateTourEvent(data: any): data is TourEvent {
  // console.log('🔍 验证tour事件数据:', data)
  
  if (typeof data !== 'object' || data === null) {
    // console.warn('⚠️ tour数据不是对象或为null:', data)
    return false
  }
  
  if (typeof data.event !== 'string') {
    // console.warn('⚠️ tour数据缺少event字段或event不是字符串:', data)
    return false
  }
  
  // 临时显示所有tour事件，不过滤任何类型
  // console.log('✅ 收到有效tour事件:', data.event, data)
  
  // 基本验证：确保有event字段即可
  return true
  
  // 原来的严格验证逻辑（暂时注释）
  /*
  switch (data.event) {
    case 'started':
      return (
        typeof data.run_id === 'number' &&
        typeof data.robot_sn === 'string'
      )
    
    case 'point':
      return (
        ['pending', 'arriving', 'done', 'failed'].includes(data.status) &&
        typeof data.point_id === 'number' &&
        typeof data.zone_id === 'number'
      )
    
    case 'finished':
      return (
        ['success', 'failed', 'canceled'].includes(data.status) &&
        typeof data.run_id === 'number'
      )
    
    default:
      return false
  }
  */
}

/**
 * 解析 WebSocket 消息
 * @param rawMessage 原始消息对象
 * @returns 解析后的消息，如果解析失败返回 null
 */
export function parseWebSocketMessage(rawMessage: any): WebSocketMessage | null {
  // 检查消息基本结构
  if (typeof rawMessage !== 'object' || rawMessage === null) {
    // WebSocket消息格式错误
    return null
  }
  
  // 如果消息有 channel 和 data 字段，认为是新格式
  if (rawMessage.channel && rawMessage.data !== undefined) {
    const parsed = parseChannel(rawMessage.channel)
    if (!parsed.isValid) {
      // 无效的频道名称
      return null
    }
    
    return {
      channel: rawMessage.channel,
      data: rawMessage.data,
      timestamp: rawMessage.timestamp || Date.now()
    }
  }
  
  // 如果是旧格式，尝试从消息类型推断频道
  if (rawMessage.type) {
    // 这里可以添加对旧格式消息的处理逻辑
    // 检测到旧格式WebSocket消息
    return null
  }
  
  // 无法识别的WebSocket消息格式
  return null
}

/**
 * 根据频道类型验证数据
 */
export function validateChannelData(channel: string, data: any): boolean {
  const parsed = parseChannel(channel)
  
  if (!parsed.isValid) {
    return false
  }
  
  if (parsed.type === 'robot') {
    switch (parsed.dataType) {
      case 'pose':
        return validateRobotPose(data)
      case 'cmd_status':
        return validateCmdStatus(data)
      case 'current_map':
        return validateCurrentMap(data)
      case 'speed':
        return validateRobotSpeed(data)
      default:
        return false
    }
  }
  
  if (parsed.type === 'tours') {
    return validateTourEvent(data)
  }
  
  return false
}

/**
 * 构建 WebSocket 连接 URL
 */
export function buildWebSocketUrl(config: WebSocketConfig): string {
  const envConfig = getCurrentConfig()
  
  const {
    sn = 'broadcast',
    kinds = ['pose', 'cmd_status', 'current_map', 'tour'],
    channels,
    baseUrl = envConfig.websocket.fullUrl
  } = config
  
  const url = new URL('/ws', baseUrl)
  
  // 始终设置 sn 和 kinds
  url.searchParams.set('sn', sn)
  if (kinds.length > 0) {
    url.searchParams.set('kinds', kinds.join(','))
  }
  
  // 如果有自定义频道，也添加channels参数
  if (channels && channels.length > 0) {
    url.searchParams.set('channels', channels.join(','))
  }
  
  return url.toString()
}

/**
 * 格式化角度（弧度转度）
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}

/**
 * 格式化角度（度转弧度）
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * 格式化位置坐标（保留指定小数位）
 */
export function formatPosition(value: number, decimals: number = 2): string {
  return value.toFixed(decimals)
}

/**
 * 格式化时间戳为可读时间
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('zh-CN')
}

/**
 * 获取建图进度的描述文本
 */
export function getSlamProgressText(progress: number): string {
  if (progress < 0) return '未开始'
  if (progress === 0) return '准备中'
  if (progress < 100) return `建图中 ${progress}%`
  return '建图完成'
}

/**
 * 获取自动收尾阶段的描述文本
 */
export function getSlamAutoStageText(stage: string): string {
  switch (stage) {
    case 'closing_slam':
      return '正在关闭建图'
    case 'change_pcd':
      return '正在转换栅格图'
    case 'done':
      return '自动收尾完成'
    case 'error':
      return '执行错误'
    default:
      return '未知状态'
  }
}

/**
 * 获取点位状态的描述文本
 */
export function getPointStatusText(status: string): string {
  switch (status) {
    case 'pending':
      return '等待中'
    case 'arriving':
      return '前往中'
    case 'done':
      return '已完成'
    case 'failed':
      return '失败'
    default:
      return '未知状态'
  }
}

/**
 * 获取任务完成状态的描述文本
 */
export function getFinishedStatusText(status: string): string {
  switch (status) {
    case 'success':
      return '成功完成'
    case 'failed':
      return '执行失败'
    case 'canceled':
      return '已取消'
    default:
      return '未知状态'
  }
}

/**
 * 检查数据是否过期（基于时间戳）
 */
export function isDataExpired(timestamp: number, maxAgeSeconds: number = 30): boolean {
  const now = Date.now() / 1000
  return (now - timestamp) > maxAgeSeconds
}

/**
 * 生成订阅ID
 */
export function generateSubscriptionId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}