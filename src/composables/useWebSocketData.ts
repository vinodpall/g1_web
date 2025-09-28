// 组合式函数：整合 WebSocket 连接和数据管理

import { onMounted, onUnmounted, watch } from 'vue'
import { useSimpleWebSocket } from '@/utils/simpleWebSocket'
import { useWebSocketDataStore } from '@/stores/websocketData'
import type { WebSocketConfig, WebSocketMessage } from '@/types/websocket'

/**
 * 使用 WebSocket 实时数据的组合式函数
 * @param config WebSocket 配置
 * @param autoConnect 是否自动连接，默认 true
 * @param token 认证 token
 */
export function useWebSocketData(
  config: WebSocketConfig = {},
  autoConnect: boolean = true,
  token: string = ''
) {
  // 获取 WebSocket 客户端
  const webSocket = useSimpleWebSocket(config, token)
  
  // 获取数据存储
  const dataStore = useWebSocketDataStore()
  
  // 消息处理函数
  const handleMessage = (message: WebSocketMessage) => {
    dataStore.handleMessage(message)
  }
  
  // 组件挂载时的初始化
  onMounted(async () => {
    // 添加消息处理器
    webSocket.addMessageHandler(handleMessage)
    
    // 自动连接
    if (autoConnect) {
      try {
        console.log('🔄 开始WebSocket自动连接')
        await webSocket.connect()
        console.log('✅ WebSocket自动连接成功')
      } catch (error) {
        console.error('❌ 自动连接失败:', error)
      }
    }
    
    // 定时清理过期数据（每5分钟）
    const cleanupInterval = setInterval(() => {
      dataStore.cleanupExpiredData()
    }, 5 * 60 * 1000)
    
    // 组件卸载时清理
    onUnmounted(() => {
      clearInterval(cleanupInterval)
      webSocket.removeMessageHandler(handleMessage)
    })
  })
  
  // 监听连接状态变化
  watch(webSocket.isConnected, (connected) => {
    // 连接状态变化已在simpleWebSocket中记录，这里不重复输出
  })
  
  return {
    // WebSocket 状态和方法
    ...webSocket,
    
    // 数据存储状态和方法
    ...dataStore,
    
    // 便捷方法
    /**
     * 手动连接 WebSocket
     */
    async connectWebSocket() {
      try {
        await webSocket.connect()
        return true
      } catch (error) {
        // WebSocket 连接失败
        return false
      }
    },
    
    /**
     * 断开 WebSocket 连接
     */
    disconnectWebSocket() {
      webSocket.disconnect()
    },
    
    /**
     * 重置所有数据
     */
    resetAllData() {
      dataStore.resetData()
    },
    
    /**
     * 更新 WebSocket 配置并重连
     */
    async updateWebSocketConfig(newConfig: Partial<WebSocketConfig>) {
      const wasConnected = webSocket.isConnected.value
      
      if (wasConnected) {
        webSocket.disconnect()
      }
      
      webSocket.updateConfig(newConfig)
      
      if (wasConnected) {
        try {
          await webSocket.connect()
        } catch (error) {
          // 重连失败
        }
      }
    },
    
    /**
     * 订阅特定机器人的数据
     */
    subscribeToRobot(sn: string, handler: (data: any, channel: string) => void) {
      const channels = [
        `robot:${sn}:pose`,
        `robot:${sn}:cmd_status`,
        `robot:${sn}:current_map`,
        `robot:${sn}:speed`
      ]
      return dataStore.subscribe(channels, handler)
    },
    
    /**
     * 订阅任务运行数据
     */
    subscribeToTourRun(runId: number, handler: (data: any, channel: string) => void) {
      const channels = [`tours:run:${runId}`]
      return dataStore.subscribe(channels, handler)
    },
    
    /**
     * 订阅机器人任务数据
     */
    subscribeToRobotTours(sn: string, handler: (data: any, channel: string) => void) {
      const channels = [`tours:robot:${sn}`]
      return dataStore.subscribe(channels, handler)
    }
  }
}

/**
 * 仅用于数据访问的轻量级组合式函数（不处理连接）
 */
export function useWebSocketDataOnly() {
  const dataStore = useWebSocketDataStore()
  
  return {
    // 只返回数据相关的方法和状态
    realtimeData: dataStore.realtimeData,
    robotSNs: dataStore.robotSNs,
    onlineRobotCount: dataStore.onlineRobotCount,
    activeTourRuns: dataStore.activeTourRuns,
    dataStats: dataStore.dataStats,
    
    // 查询方法
    getRobotPose: dataStore.getRobotPose,
    getRobotCmdStatus: dataStore.getRobotCmdStatus,
    getRobotCurrentMap: dataStore.getRobotCurrentMap,
    getRobotSpeed: dataStore.getRobotSpeed,
    getRobotSlamProgress: dataStore.getRobotSlamProgress,
    getRobotSlamAutoStatus: dataStore.getRobotSlamAutoStatus,
    getTourRunEvents: dataStore.getTourRunEvents,
    getRobotTourEvents: dataStore.getRobotTourEvents,
    isRobotOnline: dataStore.isRobotOnline,
    isRobotDataExpired: dataStore.isRobotDataExpired,
    
    // 订阅方法
    subscribe: dataStore.subscribe,
    unsubscribe: dataStore.unsubscribe
  }
}