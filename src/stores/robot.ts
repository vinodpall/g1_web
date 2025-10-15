import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Robot } from '../types'
import { robotApi } from '../api/services'

export const useRobotStore = defineStore('robot', () => {
  const robots = ref<Robot[]>([])
  const selectedRobotId = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 当前选中的机器人
  const selectedRobot = computed(() => {
    if (!selectedRobotId.value) return null
    return robots.value.find(robot => robot.id === selectedRobotId.value) || null
  })

  // 在线的机器人列表
  const onlineRobots = computed(() => {
    return robots.value.filter(robot => robot.online)
  })

  // 机器人选项列表（用于下拉框）
  const robotOptions = computed(() => {
    return robots.value.map(robot => ({
      value: robot.id,
      label: robot.name,
      sn: robot.sn,
      online: robot.online,
      status: robot.status
    }))
  })

  // 获取机器人列表
  const fetchRobots = async (token: string, searchQuery?: string, skip: number = 0, limit: number = 50) => {
    console.log('robotStore.fetchRobots 被调用')
    console.log('参数 - token:', token ? '存在' : '不存在')
    console.log('参数 - searchQuery:', searchQuery)
    console.log('参数 - skip:', skip)
    console.log('参数 - limit:', limit)
    
    loading.value = true
    error.value = null
    
    try {
      console.log('准备调用 robotApi.getRobots')
      const data = await robotApi.getRobots(token, searchQuery, skip, limit)
      console.log('API调用成功，返回数据:', data)
      
      robots.value = data
      
      // 只有在没有搜索查询时才缓存（避免搜索结果覆盖完整列表）
      if (!searchQuery || !searchQuery.trim()) {
        localStorage.setItem('robots', JSON.stringify(data))
        localStorage.setItem('robots_cache_time', Date.now().toString())
        console.log('数据已缓存到localStorage')
      } else {
        console.log('搜索模式，不更新缓存')
      }
      
      // 列表更新时，检查当前选中的机器人是否还在列表中
      if (robots.value.length > 0) {
        const currentSelectedExists = selectedRobotId.value && robots.value.some(r => r.id === selectedRobotId.value)
        
        // 如果没有选中机器人，或当前选中的机器人不在列表中，自动选择第一个
        if (!currentSelectedExists) {
          selectedRobotId.value = robots.value[0].id
          localStorage.setItem('selectedRobotId', robots.value[0].id.toString())
          console.log('自动选择第一个机器人:', robots.value[0].name)
        }
      }
      
      return data
    } catch (err: any) {
      console.error('robotApi.getRobots 调用失败:', err)
      error.value = err.message || '获取机器人列表失败'
      throw err
    } finally {
      loading.value = false
      console.log('robotStore.fetchRobots 执行完成')
    }
  }

  // 选择机器人
  const selectRobot = (robotId: number) => {
    const robot = robots.value.find(r => r.id === robotId)
    if (robot) {
      selectedRobotId.value = robotId
      localStorage.setItem('selectedRobotId', robotId.toString())
    }
  }

  // 清空数据
  const clearRobots = () => {
    robots.value = []
    selectedRobotId.value = null
    error.value = null
    localStorage.removeItem('selectedRobotId')
    localStorage.removeItem('robots')
    localStorage.removeItem('robots_cache_time')
  }

  // 从缓存恢复机器人数据
  const hydrateFromCache = () => {
    try {
      const cachedRobots = localStorage.getItem('robots')
      const cacheTime = localStorage.getItem('robots_cache_time')
      
      if (cachedRobots && cacheTime) {
        // 检查缓存是否过期（24小时）
        const now = Date.now()
        const cached = parseInt(cacheTime)
        const maxAge = 24 * 60 * 60 * 1000 // 24小时
        
        if (now - cached < maxAge) {
          robots.value = JSON.parse(cachedRobots)
          console.log('已从缓存恢复机器人数据:', robots.value.length, '个机器人')
        } else {
          // 缓存过期，清除
          localStorage.removeItem('robots')
          localStorage.removeItem('robots_cache_time')
          console.log('机器人缓存已过期，已清除')
        }
      }
    } catch (error) {
      console.error('恢复机器人缓存失败:', error)
      // 清除损坏的缓存
      localStorage.removeItem('robots')
      localStorage.removeItem('robots_cache_time')
    }
  }

  // 初始化选中的机器人（从localStorage恢复）
  const initSelectedRobot = () => {
    const savedRobotId = localStorage.getItem('selectedRobotId')
    if (savedRobotId) {
      selectedRobotId.value = parseInt(savedRobotId)
    }
  }

  // 获取缓存的机器人数据（供其他地方使用）
  const getCachedRobots = (): Robot[] => {
    try {
      const cachedRobots = localStorage.getItem('robots')
      if (cachedRobots) {
        return JSON.parse(cachedRobots)
      }
    } catch (error) {
      console.error('获取缓存机器人数据失败:', error)
    }
    return []
  }

  // 根据ID获取缓存的机器人信息
  const getCachedRobotById = (robotId: number): Robot | null => {
    const cached = getCachedRobots()
    return cached.find(robot => robot.id === robotId) || null
  }

  // 根据SN获取缓存的机器人信息
  const getCachedRobotBySn = (sn: string): Robot | null => {
    const cached = getCachedRobots()
    return cached.find(robot => robot.sn === sn) || null
  }

  // 创建机器人
  const createRobot = async (token: string, robotData: {
    sn: string
    name: string
    model: string
    firmware_version: string
    ip_address: string
    voice_ip: string
    mac_address: string
    location: string
    status: string
    online: boolean
    mqtt_client_id: string
    mqtt_status_topic: string
    notes: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const newRobot = await robotApi.createRobot(token, robotData)
      robots.value.push(newRobot)
      
      // 更新缓存
      localStorage.setItem('robots', JSON.stringify(robots.value))
      localStorage.setItem('robots_cache_time', Date.now().toString())
      
      return newRobot
    } catch (err: any) {
      error.value = err.message || '创建机器人失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新机器人
  const updateRobot = async (token: string, robotId: number, robotData: Partial<{
    name: string
    model: string
    firmware_version: string
    ip_address: string
    voice_ip: string
    mac_address: string
    location: string
    status: string
    online: boolean
    mqtt_client_id: string
    mqtt_status_topic: string
    notes: string
    photo_url: string
  }>) => {
    loading.value = true
    error.value = null
    
    try {
      const updatedRobot = await robotApi.updateRobot(token, robotId, robotData)
      
      // 更新本地数据
      const index = robots.value.findIndex(robot => robot.id === robotId)
      if (index !== -1) {
        robots.value[index] = updatedRobot
      }
      
      // 更新缓存
      localStorage.setItem('robots', JSON.stringify(robots.value))
      localStorage.setItem('robots_cache_time', Date.now().toString())
      
      return updatedRobot
    } catch (err: any) {
      error.value = err.message || '更新机器人失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 删除机器人
  const deleteRobot = async (token: string, robotId: number) => {
    loading.value = true
    error.value = null
    
    try {
      await robotApi.deleteRobot(token, robotId)
      robots.value = robots.value.filter(robot => robot.id !== robotId)
      
      // 更新缓存
      localStorage.setItem('robots', JSON.stringify(robots.value))
      localStorage.setItem('robots_cache_time', Date.now().toString())
      
      // 如果删除的是当前选中的机器人，清空选择
      if (selectedRobotId.value === robotId) {
        selectedRobotId.value = null
        localStorage.removeItem('selectedRobotId')
      }
      
      return true
    } catch (err: any) {
      error.value = err.message || '删除机器人失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新机器人在线状态（根据SN）
  const updateRobotOnlineStatus = (sn: string, online: boolean) => {
    const robot = robots.value.find(r => r.sn === sn)
    if (robot) {
      robot.online = online
      // 更新缓存
      localStorage.setItem('robots', JSON.stringify(robots.value))
      localStorage.setItem('robots_cache_time', Date.now().toString())
      // console.log(`机器人 ${robot.name} (SN: ${sn}) 状态更新为: ${online ? '在线' : '离线'}`)
    }
  }

  return {
    // state
    robots: computed(() => robots.value),
    selectedRobotId: computed(() => selectedRobotId.value),
    selectedRobot,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // getters
    onlineRobots,
    robotOptions,
    
    // actions
    fetchRobots,
    createRobot,
    updateRobot,
    deleteRobot,
    selectRobot,
    clearRobots,
    hydrateFromCache,
    initSelectedRobot,
    updateRobotOnlineStatus,
    
    // cache utilities
    getCachedRobots,
    getCachedRobotById,
    getCachedRobotBySn
  }
})