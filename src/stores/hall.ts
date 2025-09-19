import { ref, computed } from 'vue'
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

  return {
    // 状态
    halls,
    isLoading,
    error,
    isLoaded,
    
    // 计算属性
    enabledHalls,
    
    // 方法
    fetchHalls,
    clearCache,
    getHallById,
    getHallByNavName
  }
})
