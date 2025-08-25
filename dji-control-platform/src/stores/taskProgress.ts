import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useWaylineJobs } from '../composables/useApi'
import { visionApi } from '../api/services'
import { useDevices } from '../composables/useApi'

export const useTaskProgressStore = defineStore('taskProgress', () => {
  // 任务进度数据
  const waylineProgress = ref<any>(null)
  const waylineJobDetail = ref<any>(null)
  
  // 轮询状态
  const isPolling = ref(false)
  const pollingTimer = ref<number | null>(null)
  
  // 轮询频率配置
  const POLLING_INTERVAL_ACTIVE = 3000  // 有任务时：3秒
  const POLLING_INTERVAL_IDLE = 10000   // 无任务时：10秒
  
  // 任务完成弹窗状态
  const showTaskCompletionDialog = ref(false)
  const taskCompletionData = ref<{
    jobId: string
    taskName: string
    status: string
    alertCount: number
  } | null>(null)
  
  // 记录上次的任务状态，用于检测状态变化
  const lastTaskStatus = ref<string | null>(null)
  const lastJobId = ref<string | null>(null)
  
  // 获取缓存的设备信息
  const { getCachedDeviceSns, getCachedWorkspaceId } = useDevices()
  const { fetchWaylineProgress, fetchWaylineJobDetail } = useWaylineJobs()
  
  // 计算任务状态
  const taskStatus = computed(() => {
    const status = waylineProgress.value?.status
    if (!status) return 'waiting'
    
    const statusMap: Record<string, string> = {
      'canceled': 'failed',
      'failed': 'failed',
      'in_progress': 'running',
      'ok': 'completed',
      'partially_done': 'completed',
      'paused': 'paused',
      'rejected': 'failed',
      'sent': 'waiting',
      'timeout': 'failed'
    }
    
    return statusMap[status] || 'waiting'
  })
  
  // 计算任务进度百分比
  const taskProgressPercent = computed(() => {
    const progress = waylineProgress.value?.progress
    if (!progress) return 0
    
    const currentWaypoint = progress.current_waypoint_index || 0
    const totalWaypoints = progress.total_waypoints || 1
    
    const percent = Math.round((currentWaypoint / totalWaypoints) * 100)
    return Math.max(0, Math.min(100, percent))
  })
  
  // 获取任务异常数量
  const getTaskAlertCount = async (jobId: string): Promise<number> => {
    try {
      const workspaceId = getCachedWorkspaceId()
      if (!workspaceId) return 0
      
      const response = await visionApi.getAlerts(workspaceId, {
        job_id: jobId,
        limit: 1000 // 获取所有异常
      })
      
      return response.total || 0
    } catch (error) {
      console.error('获取任务异常数量失败:', error)
      return 0
    }
  }
  
  // 检测任务状态变化
  const checkTaskStatusChange = () => {
    const currentStatus = taskStatus.value
    const currentJobId = waylineProgress.value?.job_id
    
    // 检查是否有新的任务开始
    if (currentJobId && currentJobId !== lastJobId.value) {
      lastJobId.value = currentJobId
      lastTaskStatus.value = currentStatus
      return
    }
    
    // 检查任务状态是否发生变化
    if (currentStatus !== lastTaskStatus.value) {
      const previousStatus = lastTaskStatus.value
      lastTaskStatus.value = currentStatus
      
      // 如果任务变为完成或失败状态，显示弹窗
      // 支持以下情况：
      // 1. 从running状态变为completed或failed
      // 2. 直接变为failed状态（如任务被拒绝、超时等）
      if ((previousStatus === 'running' && (currentStatus === 'completed' || currentStatus === 'failed')) ||
          (currentStatus === 'failed' && previousStatus !== 'failed')) {
        showTaskCompletionDialog.value = true
        handleTaskCompletion(currentJobId, currentStatus)
      }
    }
  }
  
  // 处理任务完成
  const handleTaskCompletion = async (jobId: string, status: string) => {
    try {
      // 获取任务详情
      const workspaceId = getCachedWorkspaceId()
      if (!workspaceId) return
      
      const jobDetail = await fetchWaylineJobDetail(workspaceId, jobId)
      const taskName = jobDetail?.name || '未知任务'
      
      // 获取异常数量
      const alertCount = await getTaskAlertCount(jobId)
      
      // 设置弹窗数据
      taskCompletionData.value = {
        jobId,
        taskName,
        status,
        alertCount
      }
      
      console.log('任务完成:', { jobId, taskName, status, alertCount })
    } catch (error) {
      console.error('处理任务完成失败:', error)
    }
  }
  
  // 开始轮询任务进度
  const startPolling = () => {
    if (isPolling.value) return
    
    isPolling.value = true
    
    const pollTaskProgress = async () => {
      try {
        const workspaceId = getCachedWorkspaceId()
        const { dockSns } = getCachedDeviceSns()
        
        if (!workspaceId || dockSns.length === 0) {
          return
        }
        
        // 获取第一个机场的任务进度
        const dockSn = dockSns[0]
        const progressData = await fetchWaylineProgress(workspaceId, dockSn)
        
        // 检查progressData是否有效
        if (!progressData) {
          waylineProgress.value = null
          waylineJobDetail.value = null
          return
        }
        
        waylineProgress.value = progressData
        
        // 如果有任务，获取详细信息
        if (progressData.job_id) {
          const jobDetail = await fetchWaylineJobDetail(workspaceId, progressData.job_id)
          waylineJobDetail.value = jobDetail
        } else {
          waylineJobDetail.value = null
        }
        
        // 检查任务状态变化
        checkTaskStatusChange()
        
      } catch (error) {
        console.error('轮询任务进度失败:', error)
        // 设置默认值，避免后续访问null
        waylineProgress.value = null
        waylineJobDetail.value = null
      }
    }
    
    // 动态轮询函数
    const startDynamicPolling = () => {
      // 立即执行一次
      pollTaskProgress()
      
      // 根据任务状态动态调整轮询频率
      const adjustPollingInterval = () => {
        // 清除当前定时器
        if (pollingTimer.value) {
          clearInterval(pollingTimer.value)
        }
        
        // 根据是否有任务来决定轮询频率
        const hasActiveTask = waylineProgress.value && waylineProgress.value.job_id
        const interval = hasActiveTask ? POLLING_INTERVAL_ACTIVE : POLLING_INTERVAL_IDLE
        
        // 设置新的定时器
        pollingTimer.value = setInterval(() => {
          pollTaskProgress()
          // 每次轮询后重新调整频率
          adjustPollingInterval()
        }, interval) as unknown as number
      }
      
      // 启动动态轮询
      adjustPollingInterval()
    }
    
    // 启动动态轮询
    startDynamicPolling()
  }
  
  // 停止轮询
  const stopPolling = () => {
    if (pollingTimer.value) {
      clearInterval(pollingTimer.value)
      pollingTimer.value = null
    }
    isPolling.value = false
  }
  
  // 关闭任务完成弹窗
  const closeTaskCompletionDialog = () => {
    showTaskCompletionDialog.value = false
    taskCompletionData.value = null
  }
  
  // 跳转到任务日志页面
  const goToMissionLogs = () => {
    closeTaskCompletionDialog()
    // 使用延迟跳转，确保弹窗完全关闭后再跳转
    const jobId = taskCompletionData.value?.jobId
    setTimeout(() => {
      if (jobId) {
        window.location.href = `/#/dashboard/mission-logs?job_id=${jobId}`
      } else {
        window.location.href = '/#/dashboard/mission-logs'
      }
    }, 100)
  }
  

  
  return {
    // 状态
    waylineProgress: computed(() => waylineProgress.value),
    waylineJobDetail: computed(() => waylineJobDetail.value),
    isPolling: computed(() => isPolling.value),
    taskStatus: computed(() => taskStatus.value),
    taskProgressPercent: computed(() => taskProgressPercent.value),
    
    // 弹窗状态
    showTaskCompletionDialog: computed(() => showTaskCompletionDialog.value),
    taskCompletionData: computed(() => taskCompletionData.value),
    
    // 方法
    startPolling,
    stopPolling,
    closeTaskCompletionDialog,
    goToMissionLogs
  }
})
