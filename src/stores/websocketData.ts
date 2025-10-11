// WebSocket 实时数据存储

import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type { 
  RealtimeData, 
  RobotPose, 
  CmdStatus, 
  CurrentMap, 
  RobotSpeed,
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
  
  // Tour 状态管理
  const currentTourRunId = ref<number | null>(null)
  const currentTourPresetId = ref<number | null>(null)
  const tourRunStatus = ref<'idle' | 'running' | 'finished'>('idle')
  const tourRunPoints = ref<any[]>([])
  const tourPresetItems = ref<any[]>([])
  const isTaskExecuting = ref(false)
  
  // 新增：任务运行列表管理
  const tourRuns = ref<any[]>([])
  const currentTourRun = ref<any | null>(null)
  
  // 任务进度管理
  const currentTaskProgress = ref<{current: number, total: number} | null>(null)
  const currentPointStatus = ref<string>('')
  const currentPointNote = ref<string>('')
  
  // 认证 token
  const authToken = ref<string>('')
  
  // API 调用状态管理
  const fetchingRunIds = new Set<number>()
  
  // 任务完成回调函数
  const taskCompletionCallbacks = ref<Array<() => void>>([])
  
  // 注册任务完成回调
  function onTaskCompletion(callback: () => void) {
    taskCompletionCallbacks.value.push(callback)
  }
  
  // 移除任务完成回调
  function offTaskCompletion(callback: () => void) {
    const index = taskCompletionCallbacks.value.indexOf(callback)
    if (index > -1) {
      taskCompletionCallbacks.value.splice(index, 1)
    }
  }

  // 机器人在线状态检测
  const robotLastCmdStatusTime = ref<Record<string, number>>({}) // 记录每个机器人最后接收cmd_status的时间
  let onlineCheckTimer: number | null = null
  
  // 启动在线状态检测
  function startOnlineStatusCheck() {
    if (onlineCheckTimer) return // 避免重复启动
    
    onlineCheckTimer = setInterval(() => {
      const now = Date.now()
      const timeout = 5000 // 5秒超时
      
      // 检查每个机器人的状态
      Object.keys(robotLastCmdStatusTime.value).forEach(async (sn) => {
        const lastTime = robotLastCmdStatusTime.value[sn]
        if (now - lastTime > timeout) {
          // 超时，更新为离线
          const { useRobotStore } = await import('./robot')
          const robotStore = useRobotStore()
          robotStore.updateRobotOnlineStatus(sn, false)
        }
      })
    }, 1000) as unknown as number // 每秒检测一次
    
    console.log('✅ 机器人在线状态检测已启动')
  }
  
  // 停止在线状态检测
  function stopOnlineStatusCheck() {
    if (onlineCheckTimer) {
      clearInterval(onlineCheckTimer)
      onlineCheckTimer = null
      console.log('⏹️ 机器人在线状态检测已停止')
    }
  }
  
  // 更新机器人最后接收时间
  async function updateRobotLastCmdStatusTime(sn: string) {
    robotLastCmdStatusTime.value[sn] = Date.now()
    // 接收到数据，更新为在线
    const { useRobotStore } = await import('./robot')
    const robotStore = useRobotStore()
    robotStore.updateRobotOnlineStatus(sn, true)
  }
  
  // 触发任务完成回调
  function triggerTaskCompletionCallbacks() {
    console.log('🔔 触发任务完成回调，共', taskCompletionCallbacks.value.length, '个回调')
    taskCompletionCallbacks.value.forEach(callback => {
      try {
        callback()
      } catch (error) {
        console.error('❌ 任务完成回调执行失败:', error)
      }
    })
  }
  
  // ============= API 方法 =============
  
  /**
   * 获取任务运行列表
   */
  async function fetchTourRuns(token?: string): Promise<void> {
    try {
      if (!token) {
        console.warn('⚠️ 缺少 token，无法获取任务运行列表')
        return
      }
      
      console.log('🚀 开始获取任务运行列表')
      
      const { tourApi } = await import('@/api/services')
      const response = await tourApi.getTourRuns(token)
      tourRuns.value = response
      
      // 检查第一条数据的status
      if (response.length > 0) {
        const firstTask = response[0]
        currentTourRun.value = firstTask
        currentTourRunId.value = firstTask.id
        currentTourPresetId.value = firstTask.preset_id
        
        // 设置任务执行状态（只有running状态才算执行中）
        isTaskExecuting.value = firstTask.status === 'running'
        
        // 只有当第一条任务状态为running时，才获取预设点位数据用于显示
        if (firstTask.status === 'running') {
          await fetchTourPresetItems(firstTask.preset_id, token)
        } else {
          // 如果不是running状态，清空任务点位数据
          tourPresetItems.value = []
          tourRunPoints.value = []
        }
      } else {
        currentTourRun.value = null
        currentTourRunId.value = null
        currentTourPresetId.value = null
        isTaskExecuting.value = false
        tourPresetItems.value = [] // 清空任务点位
      }
      
      console.log('✅ 获取任务运行列表成功:', response)
    } catch (error) {
      console.error('❌ 获取任务运行列表异常:', error)
      tourRuns.value = []
      currentTourRun.value = null
      currentTourRunId.value = null
      currentTourPresetId.value = null
      isTaskExecuting.value = false
      tourPresetItems.value = []
    }
  }

  /**
   * 停止当前正在运行的任务
   */
  async function stopCurrentTourRun(token?: string): Promise<void> {
    try {
      if (!token) {
        throw new Error('未登录或token过期，无法停止任务')
      }
      
      // 确保有当前任务且状态为running
      if (!currentTourRun.value || !currentTourRun.value.id) {
        throw new Error('没有正在运行的任务可停止')
      }
      
      if (currentTourRun.value.status !== 'running') {
        throw new Error(`任务状态为${currentTourRun.value.status}，无法停止`)
      }
      
      const runId = currentTourRun.value.id
      console.log(`🚀 开始停止任务 [运行ID: ${runId}]，来源：runs接口第一条数据`)
      
      const { stopTourRun } = await import('@/api/services')
      await stopTourRun(token, runId)
      console.log(`✅ 任务 ${runId} 已发送停止指令`)
      
      // 停止成功后，更新本地状态
      if (currentTourRun.value) {
        currentTourRun.value = { ...currentTourRun.value, status: 'canceled' } // 乐观更新
      }
      currentTourRunId.value = null
      currentTourPresetId.value = null
      isTaskExecuting.value = false
      tourPresetItems.value = []
    } catch (error) {
      console.error('❌ 停止任务失败:', error)
      throw error
    }
  }
  
  /**
   * 获取任务详情并获取任务点数据
   */
  async function fetchTourRunDetailsAndPoints(runId: number, token?: string): Promise<void> {
    try {
      if (!token) {
        console.warn('⚠️ 缺少 token，无法获取任务详情')
        return
      }
      
      // 防止重复调用同一个 runId
      if (fetchingRunIds.has(runId)) {
        console.log(`⏳ API 调用进行中，跳过重复请求 [${runId}]`)
        return
      }
      
      fetchingRunIds.add(runId)
      console.log(`🚀 开始获取任务详情 [${runId}]`)
      
      // 1. 先获取任务详情
      const { getTourRunDetails } = await import('@/api/services')
      const runDetails = await getTourRunDetails(token, runId)
      console.log(`✅ 获取任务详情成功 [${runId}]:`, runDetails)
      
      // 2. 从任务详情中获取 preset_id
      const presetId = runDetails.preset_id
      if (!presetId) {
        console.warn(`⚠️ 任务详情中没有preset_id [${runId}]`)
        return
      }
      
      console.log(`🚀 开始获取任务点数据，preset_id: ${presetId}`)
      
      // 3. 使用 preset_id 获取任务点数据
      await fetchTourPresetItems(presetId, token)
      
    } catch (error) {
      console.error(`❌ 获取任务详情和任务点异常 [${runId}]:`, error)
    } finally {
      // 无论成功还是失败，都要清除状态
      fetchingRunIds.delete(runId)
    }
  }

  /**
   * 获取 tour run points 数据
   */
  async function fetchTourRunPoints(runId: number, token?: string): Promise<void> {
    try {
      if (!token) {
        console.warn('⚠️ 缺少 token，无法获取 tour run points')
        return
      }
      
      // 防止重复调用同一个 runId
      if (fetchingRunIds.has(runId)) {
        console.log(`⏳ API 调用进行中，跳过重复请求 [${runId}]`)
        return
      }
      
      fetchingRunIds.add(runId)
      console.log(`🚀 开始获取 tour run points [${runId}]`)
      
      const { getTourRunPoints } = await import('@/api/services')
      const points = await getTourRunPoints(token, runId)
      tourRunPoints.value = points
      console.log(`✅ 获取 tour run points 成功 [${runId}]:`, points)
    } catch (error) {
      console.error(`❌ 获取 tour run points 异常 [${runId}]:`, error)
    } finally {
      // 无论成功还是失败，都要清除状态
      fetchingRunIds.delete(runId)
    }
  }

  /**
   * 获取 tour preset items 数据（只调用一次）
   */
  async function fetchTourPresetItems(presetId: number, token?: string): Promise<void> {
    try {
      if (!token) {
        console.warn('⚠️ 缺少 token，无法获取 tour preset items')
        return
      }
      
      // 防止重复调用同一个 presetId
      if (fetchingRunIds.has(presetId)) {
        console.log(`⏳ API 调用进行中，跳过重复请求 preset [${presetId}]`)
        return
      }
      
      fetchingRunIds.add(presetId)
      console.log(`🚀 开始获取 tour preset items [${presetId}]`)
      
      const { tourApi } = await import('@/api/services')
      const items = await tourApi.getTourPresetItems(token, presetId)
      
      // 将嵌套的点位数据展平，用于UI显示
      const flattenedPoints: any[] = []
      if (items && Array.isArray(items)) {
        items.forEach((zone: any) => {
          if (zone.points && Array.isArray(zone.points)) {
            zone.points.forEach((point: any, pointIndex: number) => {
              flattenedPoints.push({
                ...point,
                zone_id: zone.zone_id,
                zone_name: zone.zone_name,
                hall_id: zone.hall_id,
                hall_alias: zone.hall_alias,
                status: 'pending', // 初始状态为待执行
                // 为UI显示添加更多字段
                name: point.custom_name || `点位 ${point.id}`,
                x: point.pose_x,
                y: point.pose_y,
                angle: point.pose_theta,
                type: point.type,
                arrive_at: null
              })
            })
          }
        })
      }
      
      // 存储展平后的数据到 tourPresetItems，供UI使用
      tourPresetItems.value = flattenedPoints
      // 为了向后兼容，也更新 tourRunPoints
      tourRunPoints.value = flattenedPoints
      console.log(`✅ 获取 tour preset items 成功 [${presetId}]:`, items)
      console.log(`🔄 展平后的点位数据:`, flattenedPoints)
    } catch (error) {
      console.error(`❌ 获取 tour preset items 异常 [${presetId}]:`, error)
    } finally {
      // 无论成功还是失败，都要清除状态
      fetchingRunIds.delete(presetId)
    }
  }
  
  /**
   * 设置认证 token
   */
  function setAuthToken(token: string): void {
    authToken.value = token
  }

  /**
   * 开始任务时设置preset_id并获取点位数据
   */
  async function startTourWithPreset(presetId: number, token?: string): Promise<void> {
    currentTourPresetId.value = presetId
    console.log(`🎯 设置当前任务预设ID: ${presetId}`)
    
    // 获取预设的点位数据
    await fetchTourPresetItems(presetId, token || authToken.value)
  }
  
  
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
    // console.log('📨 收到WebSocket消息:', {
    //   channel: message.channel,
    //   dataType: message.data ? typeof message.data : 'undefined',
    //   timestamp: message.timestamp
    // })
    try {
      messageCount.value++
      lastMessageTime.value = new Date()
      
      const { channel, data } = message
      
      // 特别关注tour相关的消息
      if (channel.startsWith('tours:')) {
        console.log('🔔 收到tours消息:', channel, data)
        // 特别关注finished事件
        if (data && data.event === 'finished') {
          console.log('🎉 检测到finished事件在原始消息中:', {
            channel,
            event: data.event,
            data
          })
        }
      }
      
      const parsed = parseChannel(channel)
      
      if (!parsed.isValid) {
        console.warn('⚠️ 无效频道:', channel)
        return
      }
      
      // 验证数据格式
      if (!validateChannelData(channel, data)) {
        console.warn('⚠️ 数据格式错误:', channel, '数据:', data)
        // 对于tours频道，暂时不返回，让它继续处理
        if (!channel.startsWith('tours:')) {
          return
        } else {
          console.log('🔧 强制处理tours数据，跳过验证:', channel, data)
        }
      }
      
      // 根据频道类型处理数据
      if (parsed.type === 'robot' && parsed.sn && parsed.dataType) {
        handleRobotData(parsed.sn, parsed.dataType, data)
      } else if (parsed.type === 'tours') {
        handleTourData(parsed, data as TourEvent, authToken.value)
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
        // console.log(`pose [${sn}]`, data)
        robot.pose = data as RobotPose
        break
      case 'cmd_status':
        // console.log(`cmd_status [${sn}]`, data)
        robot.cmdStatus = data as CmdStatus
        // 更新最后接收cmd_status的时间
        updateRobotLastCmdStatusTime(sn)
        break
      case 'current_map':
        // console.log(`current_map [${sn}]`, data)
        robot.currentMap = data as CurrentMap
        break
      case 'speed':
        // console.log(`speed [${sn}]`, data)
        robot.speed = data as RobotSpeed
        break
      default:
        console.warn(`⚠️ 未知数据类型 [${sn}] ${dataType}`, data)
    }
  }
  
  /**
   * 处理任务数据
   */
  function handleTourData(parsed: any, data: TourEvent, token?: string): void {
    console.log('🎯 处理tour数据:', {
      category: parsed.category,
      runId: parsed.runId,
      sn: parsed.sn,
      event: data.event,
      data: data
    })
    
    // 特别关注finished事件
    if (data.event === 'finished') {
      console.log('🚨 收到finished事件！详细信息:', {
        event: data.event,
        run_id: (data as any).run_id,
        status: (data as any).status,
        authToken: !!token,
        category: parsed.category,
        runId: parsed.runId
      })
      
      // 无论频道格式如何，都处理finished事件
      console.log('🏁 任务完成（全局处理） - run_id:', (data as any).run_id)
      tourRunStatus.value = 'finished'
      isTaskExecuting.value = false
      
      // 任务完成后清空任务相关数据
      console.log('🧹 清空任务完成后的数据')
      tourPresetItems.value = []
      tourRunPoints.value = []
      currentTourRunId.value = null
      currentTourPresetId.value = null
      currentTaskProgress.value = null
      currentPointStatus.value = ''
      currentPointNote.value = ''
      
      // 触发任务完成回调（用于清空栅格图等UI更新）
      triggerTaskCompletionCallbacks()
      
      // 任务完成后自动刷新任务运行列表状态
      console.log('🔄 准备自动刷新任务状态（全局），authToken存在:', !!authToken.value)
      const tokenToUse = token || authToken.value
      if (tokenToUse) {
        setTimeout(async () => {
          try {
            console.log('🚀 开始执行任务完成后的自动刷新（全局）...')
            await fetchTourRuns(tokenToUse)
            console.log('✅ 任务完成后自动刷新任务列表成功（全局）')
          } catch (error) {
            console.warn('❌ 任务完成后刷新任务列表失败（全局）:', error)
          }
        }, 1000) // 延迟1秒刷新，确保后端状态已更新
      } else {
        console.warn('⚠️ 无法自动刷新（全局）：缺少token')
      }
    }
    
    if (parsed.category === 'run' && parsed.runId !== undefined) {
      console.log(`📍 tour_run [${parsed.runId}] - 事件: ${data.event}`, data)
      
      // 处理 started 事件
      if (data.event === 'started') {
        console.log('🚀 任务开始 - run_id:', (data as any).run_id)
        currentTourRunId.value = (data as any).run_id
        tourRunStatus.value = 'running'
        isTaskExecuting.value = true
        // 首先获取任务详情，然后获取任务点数据
        fetchTourRunDetailsAndPoints((data as any).run_id, token)
      }
      
      // 处理 point 事件（任务点状态更新）
      if (data.event === 'point') {
        console.log('📍 任务点状态更新 (run频道):', data)
        
        // 更新进度信息
        if ((data as any).progress) {
          currentTaskProgress.value = (data as any).progress
          console.log('📊 更新任务进度 (run频道):', currentTaskProgress.value)
        }
        
        // 更新当前点状态和备注
        currentPointStatus.value = (data as any).status || ''
        currentPointNote.value = (data as any).note || ''
      }
      
      // 处理 finished 事件
      if (data.event === 'finished') {
        console.log('🏁 任务完成 - run_id:', (data as any).run_id)
        tourRunStatus.value = 'finished'
        isTaskExecuting.value = false
        
        // 任务完成后清空任务相关数据（run频道处理）
        console.log('🧹 清空任务完成后的数据（run频道）')
        tourPresetItems.value = []
        tourRunPoints.value = []
        currentTourRunId.value = null
        currentTourPresetId.value = null
        currentTaskProgress.value = null
        currentPointStatus.value = ''
        currentPointNote.value = ''
        
        // 触发任务完成回调（用于清空栅格图等UI更新）
        triggerTaskCompletionCallbacks()
        
        // 任务完成后自动刷新任务运行列表状态
        console.log('🔄 准备自动刷新任务状态，authToken存在:', !!authToken.value)
        if (authToken.value) {
          setTimeout(async () => {
            try {
              console.log('🚀 开始执行任务完成后的自动刷新...')
              await fetchTourRuns(authToken.value)
              console.log('✅ 任务完成后自动刷新任务列表成功')
            } catch (error) {
              console.warn('❌ 任务完成后刷新任务列表失败:', error)
            }
          }, 1000) // 延迟1秒刷新，确保后端状态已更新
        } else {
          console.warn('⚠️ 无法自动刷新：缺少authToken')
        }
      }
      
      // 按运行ID存储
      if (!realtimeData.tours.runs[parsed.runId]) {
        realtimeData.tours.runs[parsed.runId] = []
      }
      realtimeData.tours.runs[parsed.runId].push(data)
    } else if (parsed.category === 'robot' && parsed.sn) {
      console.log(`🤖 tour_robot [${parsed.sn}] - 事件: ${data.event}`, data)
      
      // 处理 started 事件（无论是来自 run 还是 robot 频道）
      if (data.event === 'started') {
        console.log('🚀 任务开始 - run_id:', (data as any).run_id)
        currentTourRunId.value = (data as any).run_id
        tourRunStatus.value = 'running'
        isTaskExecuting.value = true
        
        // 不再调用 fetchTourRunPoints，因为点位数据已经通过 preset items 获取
        console.log('📍 使用预设点位数据，跳过 run points 获取')
      }
      
      // 处理 point 事件（任务点状态更新）
      if (data.event === 'point') {
        console.log('📍 任务点状态更新 (robot频道):', data)
        
        // 更新进度信息
        if ((data as any).progress) {
          currentTaskProgress.value = (data as any).progress
          console.log('📊 更新任务进度 (robot频道):', currentTaskProgress.value)
        }
        
        // 更新当前点状态和备注
        currentPointStatus.value = (data as any).status || ''
        currentPointNote.value = (data as any).note || ''
        
        console.log('📍 当前任务状态 (robot频道):', {
          progress: currentTaskProgress.value,
          status: currentPointStatus.value,
          note: currentPointNote.value,
          point_id: (data as any).point_id,
          zone_id: (data as any).zone_id
        })
      }
      
      // 处理 finished 事件（无论是来自 run 还是 robot 频道）
      if (data.event === 'finished') {
        console.log('🏁 任务完成 - run_id:', (data as any).run_id)
        tourRunStatus.value = 'finished'
        isTaskExecuting.value = false
        // 清理当前任务数据（可选，根据需求决定）
        // currentTourRunId.value = null
        // tourRunPoints.value = []
      }
      
      // 按机器人SN存储
      if (!realtimeData.tours.robots[parsed.sn]) {
        realtimeData.tours.robots[parsed.sn] = []
      }
      realtimeData.tours.robots[parsed.sn].push(data)
    } else {
      console.warn('⚠️ 未知tour数据格式:', parsed, data)
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
   * 获取机器人速度数据
   */
  function getRobotSpeed(sn: string): RobotSpeed | undefined {
    return realtimeData.robots[sn]?.speed
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
    currentTourRunId,
    currentTourPresetId,
    tourRunStatus,
    tourRunPoints,
    tourPresetItems,
    isTaskExecuting,
    
    // 新增：任务运行列表管理
    tourRuns,
    currentTourRun,
    
    // 任务进度状态
    currentTaskProgress,
    currentPointStatus,
    currentPointNote,
    
    // 计算属性
    robotSNs,
    onlineRobotCount,
    activeTourRuns,
    dataStats,
    
    // 核心方法
    handleMessage,
    fetchTourRuns,
    fetchTourRunDetailsAndPoints,
    fetchTourRunPoints,
    fetchTourPresetItems,
    startTourWithPreset,
    stopCurrentTourRun,
    setAuthToken,
    
    // 任务完成回调管理
    onTaskCompletion,
    offTaskCompletion,
    
    // 订阅管理
    subscribe,
    unsubscribe,
    clearSubscriptions,
    
    // 数据查询
    getRobotPose,
    getRobotCmdStatus,
    getRobotCurrentMap,
    getRobotSpeed,
    getRobotSlamProgress,
    getRobotSlamAutoStatus,
    getTourRunEvents,
    getRobotTourEvents,
    isRobotOnline,
    isRobotDataExpired,
    
    // 数据管理
    cleanupExpiredData,
    resetData,
    
    // 在线状态检测
    startOnlineStatusCheck,
    stopOnlineStatusCheck
  }
})