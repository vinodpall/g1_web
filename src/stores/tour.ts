import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { tourApi } from '@/api/services'
import { useUserStore } from './user'
import type { TourPreset, TourPresetItem } from '@/types'

export const useTourStore = defineStore('tour', () => {
  const tourPresets = ref<TourPreset[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isLoaded = ref(false)

  // 任务预设详情相关状态
  const currentPresetItems = ref<TourPresetItem[]>([])
  const isLoadingItems = ref(false)
  const itemsError = ref<string | null>(null)

  // 根据展厅ID获取展厅任务预设列表
  const getTourPresetsByHallId = computed(() => {
    return (hallId: number | string) => {
      const numericHallId = typeof hallId === 'string' ? parseInt(hallId) : hallId
      return tourPresets.value.filter(preset => preset.hall_id === numericHallId)
    }
  })

  // 获取启用的展厅任务预设
  const enabledTourPresets = computed(() => tourPresets.value)

  // 获取展厅任务预设数据
  const fetchTourPresets = async (forceRefresh = false) => {
    console.log('=== tourStore.fetchTourPresets 被调用 ===')
    console.log('forceRefresh:', forceRefresh)
    console.log('isLoaded.value:', isLoaded.value)
    console.log('tourPresets.value.length:', tourPresets.value.length)
    
    const userStore = useUserStore()
    const token = userStore.token
    console.log('token存在:', !!token)

    if (!token) {
      console.error('未找到认证token')
      error.value = '未找到认证token'
      return
    }

    // 如果已经加载过且不强制刷新，直接返回缓存数据
    if (!forceRefresh && isLoaded.value && tourPresets.value.length > 0) {
      console.log('使用已缓存的展厅任务预设数据')
      return tourPresets.value
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('=== 准备调用tourApi.getTourPresets ===')
      console.log('API BASE URL检查...')
      const response = await tourApi.getTourPresets(token)
      
      // 更新数据和加载状态
      tourPresets.value = response
      isLoaded.value = true
      
      console.log('展厅任务预设数据已加载并缓存:', tourPresets.value)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取展厅任务预设失败'
      console.error('=== 获取展厅任务预设失败 ===', err)
      throw err
    } finally {
      isLoading.value = false
      console.log('=== tourStore.fetchTourPresets 执行完成 ===')
    }
  }

  // 清除缓存
  const clearCache = () => {
    tourPresets.value = []
    isLoaded.value = false
    error.value = null
    console.log('展厅任务预设缓存已清除')
  }

  // 根据ID获取展厅任务预设
  const getTourPresetById = (id: number): TourPreset | undefined => {
    return tourPresets.value.find(preset => preset.id === id)
  }

  // 创建新展厅任务预设
  const createTourPreset = async (name: string, description: string | null, hallId: number) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    if (!name.trim()) {
      error.value = '展厅任务名称不能为空'
      throw new Error('展厅任务名称不能为空')
    }

    try {
      isLoading.value = true
      error.value = null

      // 准备请求数据
      const presetData = {
        name: name.trim(),
        description: description,
        hall_id: hallId
      }

      console.log('创建展厅任务预设:', presetData)
      const response = await tourApi.createTourPreset(token, presetData)

      // 将新预设添加到本地缓存
      tourPresets.value.push(response)
      
      console.log('展厅任务预设创建成功:', response)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建展厅任务预设失败'
      console.error('创建展厅任务预设失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 获取任务预设详情
  const fetchTourPresetItems = async (presetId: number) => {
    const userStore = useUserStore()
    const token = userStore.token
    
    console.log('=== 获取任务预设详情 ===')
    console.log('预设ID:', presetId)
    
    if (!token) {
      itemsError.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    try {
      isLoadingItems.value = true
      itemsError.value = null
      
      console.log('开始获取任务预设详情...')
      const response = await tourApi.getTourPresetItems(token, presetId)
      currentPresetItems.value = response || []
      
      console.log('任务预设详情获取成功:', response)
      return response
    } catch (err) {
      itemsError.value = err instanceof Error ? err.message : '获取任务预设详情失败'
      console.error('获取任务预设详情失败:', err)
      throw err
    } finally {
      isLoadingItems.value = false
    }
  }

  // 清空任务预设详情
  const clearPresetItems = () => {
    currentPresetItems.value = []
    itemsError.value = null
  }

  // 添加任务预设项（展区任务）
  const addTourPresetItem = async (presetId: number, zoneId: number, seq?: number) => {
    const userStore = useUserStore()
    const token = userStore.token
    
    console.log('=== 添加任务预设项 ===')
    console.log('预设ID:', presetId)
    console.log('展区ID:', zoneId)
    console.log('序号:', seq)
    
    if (!token) {
      const errorMsg = '未找到认证token'
      itemsError.value = errorMsg
      throw new Error(errorMsg)
    }

    try {
      isLoadingItems.value = true
      itemsError.value = null
      
      const itemData: { zone_id: number, seq?: number } = { zone_id: zoneId }
      if (seq !== undefined) {
        itemData.seq = seq
      }
      
      console.log('开始添加任务预设项...')
      const response = await tourApi.addTourPresetItem(token, presetId, itemData)
      
      // 添加成功后，重新获取任务预设详情以刷新列表
      await fetchTourPresetItems(presetId)
      
      console.log('任务预设项添加成功:', response)
      return response
    } catch (err) {
      itemsError.value = err instanceof Error ? err.message : '添加任务预设项失败'
      console.error('添加任务预设项失败:', err)
      throw err
    } finally {
      isLoadingItems.value = false
    }
  }

  return {
    tourPresets,
    isLoading,
    error,
    isLoaded,
    enabledTourPresets,
    getTourPresetsByHallId,
    fetchTourPresets,
    createTourPreset,
    clearCache,
    getTourPresetById,
    // 任务预设详情相关
    currentPresetItems,
    isLoadingItems,
    itemsError,
    fetchTourPresetItems,
    clearPresetItems,
    addTourPresetItem
  }
})