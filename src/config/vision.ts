// 视觉WebSocket配置
import { getCurrentConfig } from './environment'

// 动态获取 WebSocket 服务器地址
function getVisionServerHost(): string {
  return import.meta.env.VITE_VISION_WS_HOST || getCurrentConfig().websocket.fullUrl
}

export const visionConfig = {
  // WebSocket服务器地址（使用函数动态获取，避免在模块加载时固定）
  get serverHost() {
    return getVisionServerHost()
  },
  
  // 连接配置
  maxReconnectAttempts: 5,
  reconnectDelay: 3000,
  heartbeatInterval: 30000,
  
  // 推送配置 - 实时模式（事件驱动）
  defaultPushInterval: 0,  // 0ms，实时推送
  minPushInterval: 0,      // 0ms，无延迟
  maxPushInterval: 1000,
  
  // 默认订阅的算法ID
  defaultAlgorithms: [49, 50, 51],
  
  // 绘制配置
  colors: {
    highConfidence: '#00ff00',    // 绿色：高置信度 >0.8
    mediumConfidence: '#ffff00',  // 黄色：中置信度 >0.5
    lowConfidence: '#ff6600',     // 橙色：低置信度
    inactive: '#888888',          // 灰色：未激活算法
    error: '#ff4444'              // 红色：错误状态
  },
  
  // 置信度阈值
  confidenceThresholds: {
    high: 0.8,
    medium: 0.5
  }
}

// 导出类型定义
export type VisionConfig = typeof visionConfig

// 调试函数 - 显示当前配置
export function logVisionConfig() {
  console.log('🔧 Vision WebSocket 配置:')
  console.log('- 服务器地址:', visionConfig.serverHost)
  console.log('- 环境变量 VITE_VISION_WS_HOST:', import.meta.env.VITE_VISION_WS_HOST)
  console.log('- 最大重连次数:', visionConfig.maxReconnectAttempts)
  console.log('- 默认算法:', visionConfig.defaultAlgorithms)
}