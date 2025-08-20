import { ref, onUnmounted, readonly, computed, onMounted } from 'vue'
import { useDeviceStatus } from './useDeviceStatus'
import { useWaylineJobs } from './useApi'

// 全局轮询实例管理，防止多个页面同时启动轮询
let globalPollingInstance: ReturnType<typeof createPollingInstance> | null = null

/**
 * 创建轮询实例
 */
function createPollingInstance() {
  const { 
    fetchDeviceStatus, 
    fetchMainDeviceStatus,
    fetchDroneStatus,
    position,
    environment,
    dockStatus,
    droneStatus,
    gpsStatus,
    osdData
  } = useDeviceStatus()

  const { fetchWaylineProgress, fetchWaylineJobDetail } = useWaylineJobs()

  // 统一的轮询定时器
  const unifiedPollingTimer = ref<number | null>(null)
  
  // 轮询状态
  const isPolling = ref(false)
  const lastPollTime = ref<number>(0)
  
  // 轮询配置
  const BASE_POLLING_INTERVAL = 3000 // 基础轮询间隔：3秒
  const ACTIVE_POLLING_INTERVAL = 2000 // 活跃状态轮询间隔：2秒
  const INACTIVE_POLLING_INTERVAL = 8000 // 非活跃状态轮询间隔：8秒
  
  // 轮询数据缓存
  const pollingCache = ref({
    deviceStatus: null as any,
    droneStatus: null as any,
    waylineProgress: null as any,
    lastUpdate: 0
  })

  // 条件轮询状态
  const waylineProgressTimer = ref<number | null>(null)
  const isWaylinePolling = ref(false)

  // 页面可见性状态
  const isPageVisible = ref(true)
  const wasPollingBeforeHidden = ref(false)
  const wasWaylinePollingBeforeHidden = ref(false)

  /**
   * 计算当前应该使用的轮询间隔
   */
  const currentPollingInterval = computed(() => {
    // 检查是否有活跃的航线任务
    const hasActiveWayline = pollingCache.value.waylineProgress?.status === 'in_progress' || 
                            pollingCache.value.waylineProgress?.status === 'paused'
    
    // 检查设备是否处于活跃状态
    const isDeviceActive = droneStatus.value?.isOnline === 1 || 
                          droneStatus.value?.inDock === 0 ||
                          dockStatus.value?.coverState !== 0
    
    if (hasActiveWayline || isDeviceActive) {
      return ACTIVE_POLLING_INTERVAL // 2秒
    } else {
      return INACTIVE_POLLING_INTERVAL // 8秒
    }
  })

  /**
   * 检查是否需要轮询航线进度
   */
  const shouldPollWayline = computed(() => {
    const waylineData = pollingCache.value.waylineProgress
    if (!waylineData) return false
    
    // 只在有任务且任务状态为活跃时轮询
    const activeStatuses = ['in_progress', 'paused', 'sent']
    return activeStatuses.includes(waylineData.status)
  })

  /**
   * 处理页面可见性变化
   */
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // 页面变为不可见
      isPageVisible.value = false
      wasPollingBeforeHidden.value = isPolling.value
      wasWaylinePollingBeforeHidden.value = isWaylinePolling.value
      
      // 暂停所有轮询
      if (isPolling.value) {
        console.log('👁️ 页面不可见，暂停设备状态轮询')
        stopUnifiedPolling(false) // 不重置状态，只是暂停
      }
      
      if (isWaylinePolling.value) {
        console.log('👁️ 页面不可见，暂停航线进度轮询')
        stopWaylineProgressPolling(false) // 不重置状态，只是暂停
      }
    } else {
      // 页面变为可见
      isPageVisible.value = true
      
      // 恢复轮询（如果之前是活跃状态）
      if (wasPollingBeforeHidden.value) {
        console.log('👁️ 页面可见，恢复设备状态轮询')
        startUnifiedPolling()
      }
      
      if (wasWaylinePollingBeforeHidden.value) {
        console.log('👁️ 页面可见，恢复航线进度轮询')
        startWaylineProgressPolling()
      }
    }
  }

  /**
   * 统一的设备状态获取函数
   * 一次调用获取所有相关状态
   */
  const fetchAllDeviceStatus = async () => {
    if (isPolling.value) return // 防止重复调用
    
    isPolling.value = true
    const startTime = Date.now()
    
    try {
      // 并行获取机场状态和无人机状态
      const [deviceStatus, droneStatus] = await Promise.allSettled([
        fetchMainDeviceStatus(),
        fetchDroneStatus()
      ])
      
      // 更新缓存
      pollingCache.value.deviceStatus = deviceStatus.status === 'fulfilled' ? deviceStatus.value : null
      pollingCache.value.droneStatus = droneStatus.status === 'fulfilled' ? droneStatus.value : null
      pollingCache.value.lastUpdate = Date.now()
      
      lastPollTime.value = Date.now()
      
      // 返回获取到的状态
      return {
        deviceStatus: pollingCache.value.deviceStatus,
        droneStatus: pollingCache.value.droneStatus,
        waylineProgress: pollingCache.value.waylineProgress,
        success: true
      }
      
    } catch (error) {
      console.error('统一状态获取失败:', error)
      return {
        deviceStatus: null,
        droneStatus: null,
        waylineProgress: null,
        success: false,
        error
      }
    } finally {
      isPolling.value = false
    }
  }

  /**
   * 条件轮询航线进度
   */
  const startWaylineProgressPolling = () => {
    if (waylineProgressTimer.value) {
      stopWaylineProgressPolling()
    }
    
    // 获取必要的参数
    const workspaceId = localStorage.getItem('workspace_id')
    const dockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    
    if (!workspaceId || dockSns.length === 0) {
      console.log('📊 无法启动航线进度轮询：缺少workspace_id或dock_sn')
      return
    }
    
    const dockSn = dockSns[0]
    
    // 立即执行一次，获取初始状态
    fetchWaylineProgress(workspaceId, dockSn).then(progress => {
      if (progress) {
        pollingCache.value.waylineProgress = progress
        console.log('📊 初始航线进度:', progress.status)
      }
    })
    
    // 启动定时轮询
    waylineProgressTimer.value = setInterval(async () => {
      // 每次轮询前检查是否需要继续轮询
      if (!shouldPollWayline.value) {
        console.log('📊 停止航线进度轮询：当前无活跃任务')
        stopWaylineProgressPolling()
        return
      }
      
      try {
        const progress = await fetchWaylineProgress(workspaceId, dockSn)
        if (progress) {
          pollingCache.value.waylineProgress = progress
          
          // 检查任务状态是否变为非活跃
          if (!shouldPollWayline.value) {
            console.log('📊 停止航线进度轮询：任务状态变为非活跃')
            stopWaylineProgressPolling()
          }
        }
      } catch (error) {
        console.error('航线进度轮询失败:', error)
      }
    }, 3000) // 航线进度轮询间隔：3秒
    
    isWaylinePolling.value = true
    console.log('📊 航线进度条件轮询已启动，间隔: 3000 ms')
  }

  /**
   * 停止航线进度轮询
   */
  const stopWaylineProgressPolling = (resetState = true) => {
    if (waylineProgressTimer.value) {
      clearInterval(waylineProgressTimer.value)
      waylineProgressTimer.value = null
      
      if (resetState) {
        isWaylinePolling.value = false
        console.log('⏹️ 航线进度条件轮询已停止')
      }
    }
  }

  /**
   * 启动统一轮询（支持动态间隔调整）
   */
  const startUnifiedPolling = () => {
    if (unifiedPollingTimer.value) {
      stopUnifiedPolling()
    }
    
    // 立即执行一次
    fetchAllDeviceStatus()
    
    // 启动动态间隔轮询
    const startDynamicPolling = () => {
      const interval = currentPollingInterval.value
      
      unifiedPollingTimer.value = setInterval(async () => {
        await fetchAllDeviceStatus()
        
        // 检查是否需要调整轮询间隔
        const newInterval = currentPollingInterval.value
        if (newInterval !== interval) {
          console.log(`🔄 轮询间隔调整: ${interval}ms → ${newInterval}ms`)
          // 重新启动轮询以应用新间隔
          stopUnifiedPolling()
          startDynamicPolling()
        }
      }, interval)
    }
    
    startDynamicPolling()
    
    console.log(`🚀 统一设备状态轮询已启动，初始间隔: ${currentPollingInterval.value}ms`)
    
    // 启动条件轮询
    startWaylineProgressPolling()
  }

  /**
   * 停止统一轮询
   */
  const stopUnifiedPolling = (resetState = true) => {
    if (unifiedPollingTimer.value) {
      clearInterval(unifiedPollingTimer.value)
      unifiedPollingTimer.value = null
      
      if (resetState) {
        isPolling.value = false
        console.log('⏹️ 统一设备状态轮询已停止')
      }
    }
    
    // 同时停止航线进度轮询
    stopWaylineProgressPolling(resetState)
  }

  /**
   * 手动刷新状态
   */
  const refreshStatus = async () => {
    return await fetchAllDeviceStatus()
  }

  /**
   * 手动刷新航线进度
   */
  const refreshWaylineProgress = async () => {
    try {
      const workspaceId = localStorage.getItem('workspace_id')
      const dockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
      
      if (!workspaceId || dockSns.length === 0) {
        console.error('无法刷新航线进度：缺少workspace_id或dock_sn')
        return null
      }
      
      const dockSn = dockSns[0]
      const progress = await fetchWaylineProgress(workspaceId, dockSn)
      pollingCache.value.waylineProgress = progress
      return progress
    } catch (error) {
      console.error('刷新航线进度失败:', error)
      return null
    }
  }

  /**
   * 获取轮询状态
   */
  const getPollingStatus = () => ({
    isPolling: isPolling.value,
    isWaylinePolling: isWaylinePolling.value,
    lastPollTime: lastPollTime.value,
    currentInterval: currentPollingInterval.value,
    shouldPollWayline: shouldPollWayline.value,
    isPageVisible: isPageVisible.value,
    wasPollingBeforeHidden: wasPollingBeforeHidden.value,
    wasWaylinePollingBeforeHidden: wasWaylinePollingBeforeHidden.value,
    cache: pollingCache.value,
    baseInterval: BASE_POLLING_INTERVAL
  })

  /**
   * 获取航线进度数据
   */
  const getWaylineProgress = computed(() => pollingCache.value.waylineProgress)

  // 组件挂载时设置页面可见性监听
  onMounted(() => {
    // 检查页面可见性API支持
    if (typeof document !== 'undefined' && 'hidden' in document) {
      // 设置初始可见性状态
      isPageVisible.value = !document.hidden
      
      // 添加页面可见性变化监听器
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      console.log('👁️ 页面可见性检测已启用')
    } else {
      console.log('⚠️ 当前环境不支持页面可见性检测，轮询将始终运行')
    }
  })

  // 组件卸载时自动清理
  onUnmounted(() => {
    // 移除页面可见性监听器
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
    
    // 停止所有轮询
    stopUnifiedPolling()
  })

  return {
    // 状态
    isPolling: readonly(isPolling),
    isWaylinePolling: readonly(isWaylinePolling),
    lastPollTime: readonly(lastPollTime),
    pollingCache: readonly(pollingCache),
    waylineProgress: getWaylineProgress,
    
    // 计算属性
    currentPollingInterval: readonly(currentPollingInterval),
    shouldPollWayline: readonly(shouldPollWayline),
    
    // 页面可见性状态
    isPageVisible: readonly(isPageVisible),
    
    // 方法
    startUnifiedPolling,
    stopUnifiedPolling,
    startWaylineProgressPolling,
    stopWaylineProgressPolling,
    refreshStatus,
    refreshWaylineProgress,
    getPollingStatus,
    
    // 原始状态数据（保持兼容性）
    position,
    environment,
    dockStatus,
    droneStatus,
    gpsStatus,
    osdData
  }
}

/**
 * 统一的设备状态轮询管理
 * 合并多个相似轮询，提高性能和可维护性
 * 支持条件轮询：根据任务状态和设备活跃状态智能调整轮询策略
 * 支持页面可见性检测：页面不可见时自动暂停轮询
 * 支持全局实例管理：防止多个页面同时启动轮询
 */
export function useDevicePolling() {
  // 如果全局实例不存在，创建一个新的
  if (!globalPollingInstance) {
    globalPollingInstance = createPollingInstance()
    console.log('🌐 创建全局轮询实例')
  } else {
    console.log('🌐 使用现有全局轮询实例')
  }
  
  return globalPollingInstance
} 