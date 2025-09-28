import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { hallApi } from '@/api/services'
import { useUserStore } from './user'
import type { Hall } from '@/types'

export const useHallStore = defineStore('hall', () => {
  // 状态
  const halls = ref<Hall[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isLoaded = ref(false) // 标记是否已加载过数据
  
  // 全局展厅选择状态
  const selectedHallId = ref<string>('')
  const HALL_CACHE_KEY = 'selected_hall_cache'

  // 计算属性
  const enabledHalls = computed(() => 
    halls.value.filter(hall => hall.is_enabled)
  )

  // 获取展厅列表
  const fetchHalls = async (forceRefresh = false) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      return
    }

    // 如果已加载过数据且不是强制刷新，直接返回缓存数据
    if (!forceRefresh && isLoaded.value && halls.value.length > 0) {
      console.log('使用已缓存的展厅数据')
      return halls.value
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('从API获取展厅数据')
      const response = await hallApi.getHalls(token)
      
      // 更新数据和加载状态
      halls.value = response
      isLoaded.value = true
      
      console.log('展厅数据已加载并缓存:', halls.value)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取展厅列表失败'
      console.error('获取展厅列表失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 清除缓存
  const clearCache = () => {
    halls.value = []
    isLoaded.value = false
    error.value = null
    console.log('展厅缓存已清除')
  }

  // 根据ID获取展厅
  const getHallById = (id: number): Hall | undefined => {
    return halls.value.find(hall => hall.id === id)
  }

  // 根据nav_name获取展厅
  const getHallByNavName = (navName: string): Hall | undefined => {
    return halls.value.find(hall => hall.nav_name === navName)
  }

  // 全局展厅选择管理方法
  const saveHallToCache = (hallId: string) => {
    try {
      localStorage.setItem(HALL_CACHE_KEY, hallId)
      console.log('展厅已保存到缓存:', hallId)
    } catch (error) {
      console.warn('保存展厅到缓存失败:', error)
    }
  }

  const getHallFromCache = (): string => {
    try {
      const cached = localStorage.getItem(HALL_CACHE_KEY)
      // 验证缓存的展厅ID是否有效
      if (cached && halls.value.some(h => h.id.toString() === cached)) {
        return cached
      }
    } catch (error) {
      console.warn('从缓存获取展厅失败:', error)
    }
    // 默认返回第一个展厅的ID，如果没有展厅则返回空字符串
    return halls.value.length > 0 ? halls.value[0].id.toString() : ''
  }

  // 初始化展厅选择
  const initSelectedHall = () => {
    if (!selectedHallId.value) {
      selectedHallId.value = getHallFromCache()
      console.log('初始化展厅选择:', selectedHallId.value)
    }
  }

  // 设置选中的展厅
  const setSelectedHall = (hallId: string) => {
    if (hallId !== selectedHallId.value) {
      selectedHallId.value = hallId
      saveHallToCache(hallId)
      console.log('展厅选择已更新:', hallId)
      
      // 触发storage事件，实现跨页面同步
      try {
        const event = new StorageEvent('storage', {
          key: HALL_CACHE_KEY,
          newValue: hallId,
          oldValue: localStorage.getItem(HALL_CACHE_KEY),
          url: window.location.href
        })
        window.dispatchEvent(event)
      } catch (error) {
        console.warn('触发storage事件失败:', error)
      }
    }
  }

  // 监听展厅数据变化，自动初始化选择
  watch(halls, (newHalls) => {
    if (newHalls.length > 0 && !selectedHallId.value) {
      initSelectedHall()
    }
  }, { immediate: true })

  // 计算属性：当前选中的展厅
  const currentHall = computed(() => {
    return halls.value.find(hall => hall.id.toString() === selectedHallId.value)
  })

  // 计算属性：当前展厅名称
  const currentHallName = computed(() => {
    return currentHall.value ? currentHall.value.nav_name : ''
  })

  return {
    // 状态
    halls,
    isLoading,
    error,
    isLoaded,
    selectedHallId,
    
    // 计算属性
    enabledHalls,
    currentHall,
    currentHallName,
    
    // 方法
    fetchHalls,
    clearCache,
    getHallById,
    getHallByNavName,
    setSelectedHall,
    initSelectedHall,
    getHallFromCache
  }
})
