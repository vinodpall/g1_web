import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { pointApi } from '@/api/services'
import { useUserStore } from './user'
import { useGuideStore } from './guide'
import type { Point } from '@/types'

export const usePointStore = defineStore('point', () => {
  const points = ref<Point[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isLoaded = ref(false)

  // 根据展区ID获取任务点列表
  const getPointsByZoneId = computed(() => {
    return (zoneId: number | string) => {
      const numericZoneId = typeof zoneId === 'string' ? parseInt(zoneId) : zoneId
      return points.value.filter(point => point.zone_id === numericZoneId && point.is_enabled)
    }
  })

  // 获取启用的任务点
  const enabledPoints = computed(() =>
    points.value.filter(point => point.is_enabled)
  )

  // 获取讲解点
  const explainPoints = computed(() =>
    points.value.filter(point => point.type === 'explain' && point.is_enabled)
  )

  // 获取辅助点
  const actionPoints = computed(() =>
    points.value.filter(point => point.type === 'action' && point.is_enabled)
  )

  // 获取任务点数据
  const fetchPoints = async (zoneId?: number, forceRefresh = false) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      return
    }

    // 如果已经加载过且不强制刷新，直接返回缓存数据
    if (!forceRefresh && isLoaded.value && points.value.length > 0) {
      console.log('使用已缓存的任务点数据')
      return points.value
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('从API获取任务点数据', zoneId ? `(展区ID: ${zoneId})` : '(全部)')
      const response = await pointApi.getPoints(token, zoneId)
      
      // 更新数据和加载状态
      points.value = response
      isLoaded.value = true
      
      console.log('任务点数据已加载并缓存:', points.value)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取任务点失败'
      console.error('获取任务点失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 根据展区ID获取任务点（支持参数查询）
  const fetchPointsByZone = async (zoneId: number, forceRefresh = false) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      return []
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('从API获取指定展区的任务点数据, 展区ID:', zoneId)
      const response = await pointApi.getPoints(token, zoneId)
      
      // 只更新该展区的任务点数据
      const otherZonePoints = points.value.filter(point => point.zone_id !== zoneId)
      points.value = [...otherZonePoints, ...response]
      
      console.log(`展区${zoneId}的任务点数据已加载:`, response)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取任务点失败'
      console.error('获取任务点失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 清除缓存
  const clearCache = () => {
    points.value = []
    isLoaded.value = false
    error.value = null
    console.log('任务点缓存已清除')
  }

  // 根据ID获取任务点
  const getPointById = (id: number): Point | undefined => {
    return points.value.find(point => point.id === id)
  }

  // 根据类型获取任务点
  const getPointsByType = (type: 'explain' | 'action'): Point[] => {
    return points.value.filter(point => point.type === type && point.is_enabled)
  }

  // 获取任务点的点位名称（需要结合 guideStore）
  const getPointDisplayInfo = computed(() => {
    return (pointId: number) => {
      const point = getPointById(pointId)
      if (!point) return null

      const guideStore = useGuideStore()
      const pointName = guideStore.getPointNameById(point.point_name_id)
      
      return {
        ...point,
        pointName: pointName?.name || '未知点位',
        typeDisplay: point.type === 'explain' ? '讲解点' : '辅助点'
      }
    }
  })

  // 创建新任务点
  const createPoint = async (pointData: {
    zone_id: number,
    type: 'explain' | 'action',
    point_name_id: number,
    custom_name: string,
    pose_x: number,
    pose_y: number,
    pose_theta: number,
    action_code?: string,
    action_params?: string,
    robot_sn: string,
    screen_video_id?: number
  }) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    // 验证必填字段
    if (!pointData.zone_id) {
      error.value = '展区ID不能为空'
      throw new Error('展区ID不能为空')
    }

    if (!pointData.point_name_id) {
      error.value = '点位名称不能为空'
      throw new Error('点位名称不能为空')
    }

    if (!pointData.robot_sn) {
      error.value = '机器人序列号不能为空'
      throw new Error('机器人序列号不能为空')
    }

    try {
      isLoading.value = true
      error.value = null

      // 准备请求数据
      const requestData: any = {
        zone_id: pointData.zone_id,
        type: pointData.type,
        point_name_id: pointData.point_name_id,
        custom_name: pointData.custom_name,
        is_enabled: true, // 默认启用
        pose_x: pointData.pose_x,
        pose_y: pointData.pose_y,
        pose_theta: pointData.pose_theta,
        action_code: pointData.action_code || '',
        action_params: pointData.action_params || '',
        robot_sn: pointData.robot_sn
      }
      
      // 如果提供了screen_video_id，添加到请求数据中
      if (pointData.screen_video_id !== undefined) {
        requestData.screen_video_id = pointData.screen_video_id
      }

      console.log('创建任务点:', requestData)
      const response = await pointApi.createPoint(token, requestData)

      // 将新任务点添加到本地缓存
      points.value.push(response)
      
      console.log('任务点创建成功:', response)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建任务点失败'
      console.error('创建任务点失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 更新任务点
  const updatePoint = async (pointId: number, pointData: {
    name?: string,
    type?: 'explain' | 'action',
    point_name_id?: number,
    custom_name?: string,
    pose_x?: number,
    pose_y?: number,
    pose_theta?: number,
    action_code?: string,
    action_params?: string,
    robot_sn?: string,
    screen_video_id?: number
  }) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    try {
      isLoading.value = true
      error.value = null

      // 准备请求数据，只包含非空字段
      const requestData: any = {}
      
      if (pointData.type) requestData.type = pointData.type
      if (pointData.point_name_id) requestData.point_name_id = pointData.point_name_id
      if (pointData.custom_name !== undefined) requestData.custom_name = pointData.custom_name
      if (pointData.pose_x !== undefined) requestData.pose_x = pointData.pose_x
      if (pointData.pose_y !== undefined) requestData.pose_y = pointData.pose_y
      if (pointData.pose_theta !== undefined) requestData.pose_theta = pointData.pose_theta
      if (pointData.action_code) requestData.action_code = pointData.action_code
      if (pointData.action_params !== undefined) requestData.action_params = pointData.action_params
      if (pointData.robot_sn) requestData.robot_sn = pointData.robot_sn
      
      // 如果提供了screen_video_id，添加到请求数据中
      if (pointData.screen_video_id !== undefined) {
        requestData.screen_video_id = pointData.screen_video_id
      }

      console.log('更新任务点:', pointId, requestData)
      const response = await pointApi.updatePoint(token, pointId, requestData)

      // 更新本地缓存中的任务点
      const index = points.value.findIndex(point => point.id === pointId)
      if (index !== -1) {
        points.value[index] = response
      }
      
      console.log('任务点更新成功:', response)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新任务点失败'
      console.error('更新任务点失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 删除任务点
  const deletePoint = async (pointId: number) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    try {
      isLoading.value = true
      error.value = null

      console.log('删除任务点:', pointId)
      await pointApi.deletePoint(token, pointId)

      // 从本地缓存中移除任务点
      points.value = points.value.filter(point => point.id !== pointId)
      
      console.log('任务点删除成功:', pointId)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除任务点失败'
      console.error('删除任务点失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    points,
    isLoading,
    error,
    isLoaded,
    enabledPoints,
    explainPoints,
    actionPoints,
    getPointsByZoneId,
    fetchPoints,
    fetchPointsByZone,
    createPoint,
    updatePoint,
    deletePoint,
    clearCache,
    getPointById,
    getPointsByType,
    getPointDisplayInfo
  }
})
