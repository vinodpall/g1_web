// WebSocket 实时数据存储

import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type { 
  RealtimeData, 
  RobotPose, 
  CmdStatus, 
  CurrentMap, 
  TourEvent,
  WebSocketMessage,
  Subscription,
  DataHandler
} from '@/types/websocket'
import { 
  parseChannel, 
  validateChannelData,
  generateSubscriptionId,
  isDataExpired
} from '@/utils/websocketParser'

export const useWebSocketDataStore = defineStore('websocketData', () => {
  // ============= 状态定义 =============
  
  // 实时数据存储
  const realtimeData = reactive<RealtimeData>({
    robots: {},
    tours: {
      runs: {},
      robots: {}
    }
  })
  
  // 订阅管理
  const subscriptions = ref<Map<string, Subscription>>(new Map())
  
  // 统计信息
  const messageCount = ref(0)
  const lastMessageTime = ref<Date | null>(null)
  const errorCount = ref(0)
  const lastError = ref<string>('')
  
  // ============= 计算属性 =============
  
  // 获取所有已知的机器人SN列表
  const robotSNs = computed(() => Object.keys(realtimeData.robots))
  
  // 获取在线机器人数量（最近30秒内有数据更新）
  const onlineRobotCount = computed(() => {
    const now = new Date()
    return robotSNs.value.filter(sn => {
      const robot = realtimeData.robots[sn]
      if (!robot?.lastUpdate) return false
      return (now.getTime() - robot.lastUpdate.getTime()) < 30000 // 30秒
    }).length
  })
  
  // 获取活跃的任务运行数量
  const activeTourRuns = computed(() => Object.keys(realtimeData.tours.runs))
  
  // 获取数据统计信息
  const dataStats = computed(() => ({
    messageCount: messageCount.value,
    errorCount: errorCount.value,
    lastMessageTime: lastMessageTime.value,
    lastError: lastError.value,
    robotCount: robotSNs.value.length,
    onlineRobotCount: onlineRobotCount.value,
    activeTourCount: activeTourRuns.value.length,
    subscriptionCount: subscriptions.value.size
  }))
  
  // ============= 核心方法 =============
  
  /**
   * 处理 WebSocket 消息
   */
  function handleMessage(message: WebSocketMessage): void {
    try {
      messageCount.value++
      lastMessageTime.value = new Date()
      
      const { channel, data } = message
      // console.log('📨 收到WebSocket消息:', channel, data)
      const parsed = parseChannel(channel)
      
      if (!parsed.isValid) {
        console.warn('⚠️ 无效频道:', channel)
        return
      }
      
      // 验证数据格式
      if (!validateChannelData(channel, data)) {
        console.warn('⚠️ 数据格式错误:', channel)
        return
      }
      
      // 根据频道类型处理数据
      if (parsed.type === 'robot' && parsed.sn && parsed.dataType) {
        handleRobotData(parsed.sn, parsed.dataType, data)
      } else if (parsed.type === 'tours') {
        handleTourData(parsed, data as TourEvent)
      }
      
      // 触发订阅回调
      triggerSubscriptions(channel, data)
      
    } catch (error) {
      console.error('❌ 消息处理失败:', error)
      errorCount.value++
      lastError.value = `处理消息失败: ${error}`
    }
  }
  
  /**
   * 处理机器人数据
   */
  function handleRobotData(sn: string, dataType: string, data: any): void {
    // 确保机器人数据结构存在
    if (!realtimeData.robots[sn]) {
      realtimeData.robots[sn] = {
        lastUpdate: new Date()
      }
    }
    
    const robot = realtimeData.robots[sn]
    robot.lastUpdate = new Date()
    
    switch (dataType) {
      case 'pose':
        console.log(`pose [${sn}]`, data)
        robot.pose = data as RobotPose
        break
      case 'cmd_status':
        console.log(`cmd_status [${sn}]`, data)
        robot.cmdStatus = data as CmdStatus
        break
      case 'current_map':
        // console.log(`current_map [${sn}]`, data)
        robot.currentMap = data as CurrentMap
        break
      default:
        console.warn(`⚠️ 未知数据类型 [${sn}] ${dataType}`, data)
    }
  }
  
  /**
   * 处理任务数据
   */
  function handleTourData(parsed: any, data: TourEvent): void {
    if (parsed.category === 'run' && parsed.runId !== undefined) {
      console.log(`tour_run [${parsed.runId}]`, data)
      // 按运行ID存储
      if (!realtimeData.tours.runs[parsed.runId]) {
        realtimeData.tours.runs[parsed.runId] = []
      }
      realtimeData.tours.runs[parsed.runId].push(data)
    } else if (parsed.category === 'robot' && parsed.sn) {
      console.log(`tour_robot [${parsed.sn}]`, data)
      // 按机器人SN存储
      if (!realtimeData.tours.robots[parsed.sn]) {
        realtimeData.tours.robots[parsed.sn] = []
      }
      realtimeData.tours.robots[parsed.sn].push(data)
    }
  }
  
  /**
   * 触发订阅回调
   */
  function triggerSubscriptions(channel: string, data: any): void {
    for (const subscription of subscriptions.value.values()) {
      if (subscription.channels.includes(channel) || subscription.channels.includes('*')) {
        try {
          subscription.handler(data, channel)
        } catch (error) {
          // 订阅回调函数执行失败
        }
      }
    }
  }
  
  // ============= 订阅管理 =============
  
  /**
   * 添加数据订阅
   */
  function subscribe(channels: string[], handler: DataHandler): string {
    const id = generateSubscriptionId()
    subscriptions.value.set(id, {
      id,
      channels,
      handler
    })
    return id
  }
  
  /**
   * 取消订阅
   */
  function unsubscribe(id: string): boolean {
    return subscriptions.value.delete(id)
  }
  
  /**
   * 清除所有订阅
   */
  function clearSubscriptions(): void {
    subscriptions.value.clear()
  }
  
  // ============= 数据查询方法 =============
  
  /**
   * 获取机器人位姿数据
   */
  function getRobotPose(sn: string): RobotPose | undefined {
    return realtimeData.robots[sn]?.pose
  }
  
  /**
   * 获取机器人命令状态
   */
  function getRobotCmdStatus(sn: string): CmdStatus | undefined {
    return realtimeData.robots[sn]?.cmdStatus
  }
  
  /**
   * 获取机器人当前地图
   */
  function getRobotCurrentMap(sn: string): CurrentMap | undefined {
    return realtimeData.robots[sn]?.currentMap
  }
  
  /**
   * 获取机器人建图进度
   */
  function getRobotSlamProgress(sn: string): number | undefined {
    return realtimeData.robots[sn]?.cmdStatus?.slam_process_p
  }
  
  /**
   * 获取机器人自动收尾状态
   */
  function getRobotSlamAutoStatus(sn: string) {
    return realtimeData.robots[sn]?.cmdStatus?.slam_auto
  }
  
  /**
   * 获取任务运行事件
   */
  function getTourRunEvents(runId: number): TourEvent[] {
    return realtimeData.tours.runs[runId] || []
  }
  
  /**
   * 获取机器人任务事件
   */
  function getRobotTourEvents(sn: string): TourEvent[] {
    return realtimeData.tours.robots[sn] || []
  }
  
  /**
   * 检查机器人是否在线
   */
  function isRobotOnline(sn: string, maxAgeSeconds: number = 30): boolean {
    const robot = realtimeData.robots[sn]
    if (!robot?.lastUpdate) return false
    
    const now = new Date()
    return (now.getTime() - robot.lastUpdate.getTime()) < (maxAgeSeconds * 1000)
  }
  
  /**
   * 检查机器人数据是否过期
   */
  function isRobotDataExpired(sn: string, dataType: 'pose' | 'cmd_status' | 'current_map', maxAgeSeconds: number = 30): boolean {
    const robot = realtimeData.robots[sn]
    if (!robot) return true
    
    let timestamp: number | undefined
    
    switch (dataType) {
      case 'pose':
        timestamp = robot.pose?.ts
        break
      case 'cmd_status':
        timestamp = robot.cmdStatus?.ts
        break
      case 'current_map':
        timestamp = robot.currentMap?.ts
        break
    }
    
    if (!timestamp) return true
    return isDataExpired(timestamp, maxAgeSeconds)
  }
  
  // ============= 数据清理方法 =============
  
  /**
   * 清理过期数据
   */
  function cleanupExpiredData(maxAgeSeconds: number = 300): void {
    const now = new Date()
    const maxAge = maxAgeSeconds * 1000
    
    // 清理过期的机器人数据
    for (const sn of Object.keys(realtimeData.robots)) {
      const robot = realtimeData.robots[sn]
      if (robot.lastUpdate && (now.getTime() - robot.lastUpdate.getTime()) > maxAge) {
        delete realtimeData.robots[sn]
      }
    }
    
    // 清理过期的任务数据（保留最近的事件）
    for (const runId of Object.keys(realtimeData.tours.runs)) {
      const events = realtimeData.tours.runs[parseInt(runId)]
      if (events.length > 100) { // 限制事件数量
        realtimeData.tours.runs[parseInt(runId)] = events.slice(-50)
      }
    }
    
    for (const sn of Object.keys(realtimeData.tours.robots)) {
      const events = realtimeData.tours.robots[sn]
      if (events.length > 100) { // 限制事件数量
        realtimeData.tours.robots[sn] = events.slice(-50)
      }
    }
  }
  
  /**
   * 重置所有数据
   */
  function resetData(): void {
    realtimeData.robots = {}
    realtimeData.tours.runs = {}
    realtimeData.tours.robots = {}
    messageCount.value = 0
    errorCount.value = 0
    lastMessageTime.value = null
    lastError.value = ''
  }
  
  // ============= 导出 =============
  
  return {
    // 状态
    realtimeData,
    
    // 计算属性
    robotSNs,
    onlineRobotCount,
    activeTourRuns,
    dataStats,
    
    // 核心方法
    handleMessage,
    
    // 订阅管理
    subscribe,
    unsubscribe,
    clearSubscriptions,
    
    // 数据查询
    getRobotPose,
    getRobotCmdStatus,
    getRobotCurrentMap,
    getRobotSlamProgress,
    getRobotSlamAutoStatus,
    getTourRunEvents,
    getRobotTourEvents,
    isRobotOnline,
    isRobotDataExpired,
    
    // 数据管理
    cleanupExpiredData,
    resetData
  }
})