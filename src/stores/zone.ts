import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { zoneApi } from '@/api/services'
import { useUserStore } from './user'
import type { Zone } from '@/types'

export const useZoneStore = defineStore('zone', () => {
  const zones = ref<Zone[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isLoaded = ref(false)

  // 根据展厅ID获取展区列表
  const getZonesByHallId = computed(() => {
    return (hallId: number | string) => {
      const numericHallId = typeof hallId === 'string' ? parseInt(hallId) : hallId
      return zones.value.filter(zone => zone.hall_id === numericHallId && zone.is_enabled)
    }
  })

  // 获取启用的展区
  const enabledZones = computed(() =>
    zones.value.filter(zone => zone.is_enabled)
  )

  // 获取展区数据
  const fetchZones = async (forceRefresh = false, hallId?: number) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      return
    }

    // 如果指定了展厅ID，总是重新获取数据（因为筛选条件不同）
    // 如果没有指定展厅ID且已经加载过且不强制刷新，直接返回缓存数据
    if (!hallId && !forceRefresh && isLoaded.value && zones.value.length > 0) {
      console.log('使用已缓存的展区数据')
      return zones.value
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('从API获取展区数据', hallId ? `(展厅ID: ${hallId})` : '(全部)')
      const response = await zoneApi.getZones(token, hallId)
      
      // 如果没有指定展厅ID，更新全局缓存
      if (!hallId) {
        zones.value = response
        isLoaded.value = true
        console.log('展区数据已加载并缓存:', zones.value)
      } else {
        console.log('获取指定展厅的展区数据:', response)
      }
      
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取展区失败'
      console.error('获取展区失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 清除缓存
  const clearCache = () => {
    zones.value = []
    isLoaded.value = false
    error.value = null
    console.log('展区缓存已清除')
  }

  // 根据ID获取展区
  const getZoneById = (id: number): Zone | undefined => {
    return zones.value.find(zone => zone.id === id)
  }

  // 根据展厅ID和展区名称获取展区
  const getZoneByHallAndName = (hallId: number, name: string): Zone | undefined => {
    return zones.value.find(zone => zone.hall_id === hallId && zone.name === name)
  }

  // 创建新展区
  const createZone = async (name: string, hallId: number) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    if (!name.trim()) {
      error.value = '展区名称不能为空'
      throw new Error('展区名称不能为空')
    }

    try {
      isLoading.value = true
      error.value = null

      // 计算下一个序号（当前展厅展区数量 + 1）
      const currentHallZones = zones.value.filter(zone => zone.hall_id === hallId)
      const nextSeq = currentHallZones.length + 1

      // 准备请求数据
      const zoneData = {
        hall_id: hallId,
        name: name.trim(),
        seq: nextSeq,
        is_enabled: true
      }

      console.log('创建展区:', zoneData)
      const response = await zoneApi.createZone(token, zoneData)

      // 将新展区添加到本地缓存
      zones.value.push(response)
      
      console.log('展区创建成功:', response)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建展区失败'
      console.error('创建展区失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 删除展区
  const deleteZone = async (zoneId: number) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    try {
      isLoading.value = true
      error.value = null

      console.log('删除展区:', zoneId)
      await zoneApi.deleteZone(token, zoneId)

      // 从本地缓存中移除已删除的展区
      const index = zones.value.findIndex(zone => zone.id === zoneId)
      if (index !== -1) {
        zones.value.splice(index, 1)
      }
      
      console.log('展区删除成功:', zoneId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除展区失败'
      console.error('删除展区失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    zones,
    isLoading,
    error,
    isLoaded,
    enabledZones,
    getZonesByHallId,
    fetchZones,
    createZone,
    deleteZone,
    clearCache,
    getZoneById,
    getZoneByHallAndName
  }
})
