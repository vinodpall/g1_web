import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { guideApi } from '@/api/services'
import { useUserStore } from './user'
import type { GuidePointName, GuideAudience, GuideScript } from '@/types'

export const useGuideStore = defineStore('guide', () => {
  // 状态
  const pointNames = ref<GuidePointName[]>([])
  const audiences = ref<GuideAudience[]>([])
  const scripts = ref<GuideScript[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isPointNamesLoaded = ref(false) // 标记点位名称是否已加载过数据
  const isAudiencesLoaded = ref(false) // 标记讲解对象是否已加载过数据
  const isScriptsLoaded = ref(false) // 标记讲解词是否已加载过数据

  // 计算属性
  const activePointNames = computed(() => 
    pointNames.value.filter(point => point.is_active)
  )

  // 根据讲解对象ID获取对应的讲解词列表
  const getScriptsByAudienceId = (audienceId: number) => {
    return scripts.value.filter(script => script.audience_id === audienceId)
  }

  // 获取点位名称列表
  const fetchPointNames = async (forceRefresh = false) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      return
    }

    // 如果已加载过数据且不是强制刷新，直接返回缓存数据
    if (!forceRefresh && isPointNamesLoaded.value && pointNames.value.length > 0) {
      console.log('使用已缓存的点位名称数据')
      return pointNames.value
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('从API获取点位名称数据')
      const response = await guideApi.getPointNames(token)
      
      // 更新数据和加载状态
      pointNames.value = response
      isPointNamesLoaded.value = true
      
      console.log('点位名称数据已加载并缓存:', pointNames.value)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取点位名称失败'
      console.error('获取点位名称失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 获取讲解对象列表
  const fetchAudiences = async (forceRefresh = false) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      return
    }

    // 如果已加载过数据且不是强制刷新，直接返回缓存数据
    if (!forceRefresh && isAudiencesLoaded.value && audiences.value.length > 0) {
      console.log('使用已缓存的讲解对象数据')
      return audiences.value
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('从API获取讲解对象数据')
      const response = await guideApi.getAudiences(token)
      
      // 更新数据和加载状态
      audiences.value = response
      isAudiencesLoaded.value = true
      
      console.log('讲解对象数据已加载并缓存:', audiences.value)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取讲解对象失败'
      console.error('获取讲解对象失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 获取讲解词列表
  const fetchScripts = async (forceRefresh = false) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      return
    }

    // 如果已加载过数据且不是强制刷新，直接返回缓存数据
    if (!forceRefresh && isScriptsLoaded.value && scripts.value.length > 0) {
      console.log('使用已缓存的讲解词数据')
      return scripts.value
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('从API获取讲解词数据')
      const response = await guideApi.getScripts(token)
      
      // 更新数据和加载状态
      scripts.value = response
      isScriptsLoaded.value = true
      
      console.log('讲解词数据已加载并缓存:', scripts.value)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取讲解词失败'
      console.error('获取讲解词失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 清除缓存
  const clearCache = () => {
    pointNames.value = []
    audiences.value = []
    scripts.value = []
    isPointNamesLoaded.value = false
    isAudiencesLoaded.value = false
    isScriptsLoaded.value = false
    error.value = null
    console.log('点位名称、讲解对象和讲解词缓存已清除')
  }

  // 根据ID获取点位名称
  const getPointNameById = (id: number): GuidePointName | undefined => {
    return pointNames.value.find(point => point.id === id)
  }

  // 根据code获取点位名称
  const getPointNameByCode = (code: string): GuidePointName | undefined => {
    return pointNames.value.find(point => point.code === code)
  }

  // 根据ID获取讲解对象
  const getAudienceById = (id: number): GuideAudience | undefined => {
    return audiences.value.find(audience => audience.id === id)
  }

  // 创建点位名称
  const createPointName = async (name: string) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('创建点位名称:', name)
      const newPointName = await guideApi.createPointName(token, name)
      
      // 将新创建的点位名称添加到本地缓存
      pointNames.value.push(newPointName)
      
      console.log('点位名称创建成功:', newPointName)
      return newPointName
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建点位名称失败'
      console.error('创建点位名称失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 删除点位名称
  const deletePointName = async (pointNameId: number) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('删除点位名称:', pointNameId)
      await guideApi.deletePointName(token, pointNameId)
      
      // 从本地缓存中移除已删除的点位名称
      const index = pointNames.value.findIndex(point => point.id === pointNameId)
      if (index !== -1) {
        pointNames.value.splice(index, 1)
      }
      
      console.log('点位名称删除成功')
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除点位名称失败'
      console.error('删除点位名称失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 创建讲解对象
  const createAudience = async (name: string) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('创建讲解对象:', name)
      const newAudience = await guideApi.createAudience(token, name)
      
      // 将新创建的讲解对象添加到本地缓存
      audiences.value.push(newAudience)
      
      console.log('讲解对象创建成功:', newAudience)
      return newAudience
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建讲解对象失败'
      console.error('创建讲解对象失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 删除讲解对象
  const deleteAudience = async (audienceId: number) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('删除讲解对象:', audienceId)
      await guideApi.deleteAudience(token, audienceId)
      
      // 从本地缓存中移除讲解对象
      const audienceIndex = audiences.value.findIndex(audience => audience.id === audienceId)
      if (audienceIndex > -1) {
        audiences.value.splice(audienceIndex, 1)
      }
      
      console.log('讲解对象删除成功')
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除讲解对象失败'
      console.error('删除讲解对象失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 创建讲解词
  const createScript = async (audienceId: number, pointNameId: number, content: string) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    try {
      isLoading.value = true
      error.value = null
      
      const scriptData = {
        audience_id: audienceId,
        point_name_id: pointNameId,
        content: content
      }
      
      console.log('创建讲解词:', scriptData)
      const newScript = await guideApi.createScript(token, scriptData)
      
      // 将新创建的讲解词添加到本地缓存
      scripts.value.push(newScript)
      
      console.log('讲解词创建成功:', newScript)
      return newScript
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建讲解词失败'
      console.error('创建讲解词失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 更新讲解词
  const updateScript = async (scriptId: number, content: string) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('更新讲解词:', { scriptId, content })
      const updatedScript = await guideApi.updateScript(token, scriptId, content)
      
      // 更新本地缓存中的讲解词
      const scriptIndex = scripts.value.findIndex(script => script.id === scriptId)
      if (scriptIndex > -1) {
        scripts.value[scriptIndex] = updatedScript
      }
      
      console.log('讲解词更新成功:', updatedScript)
      return updatedScript
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新讲解词失败'
      console.error('更新讲解词失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 删除讲解词
  const deleteScript = async (scriptId: number) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (!token) {
      error.value = '未找到认证token'
      throw new Error('未找到认证token')
    }

    try {
      isLoading.value = true
      error.value = null
      
      console.log('删除讲解词:', scriptId)
      await guideApi.deleteScript(token, scriptId)
      
      // 从本地缓存中移除讲解词
      const scriptIndex = scripts.value.findIndex(script => script.id === scriptId)
      if (scriptIndex > -1) {
        scripts.value.splice(scriptIndex, 1)
      }
      
      console.log('讲解词删除成功')
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除讲解词失败'
      console.error('删除讲解词失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 状态
    pointNames,
    audiences,
    scripts,
    isLoading,
    error,
    isPointNamesLoaded,
    isAudiencesLoaded,
    isScriptsLoaded,
    
    // 计算属性
    activePointNames,
    
    // 方法
    fetchPointNames,
    fetchAudiences,
    fetchScripts,
    clearCache,
    getPointNameById,
    getPointNameByCode,
    getAudienceById,
    getScriptsByAudienceId,
    createPointName,
    deletePointName,
    createAudience,
    deleteAudience,
    createScript,
    updateScript,
    deleteScript
  }
})
