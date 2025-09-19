import { ref, readonly } from 'vue'
import { authApi } from '../api/services'
import { apiClient } from '../api/config'
import { refreshEnvironmentConfig } from '../config/environment'
import { useRobotStore } from '../stores/robot'
import { useGuideStore } from '../stores/guide'
import { useHallStore } from '../stores/hall'
import { useZoneStore } from '../stores/zone'
import { usePointStore } from '../stores/point'
import type { User } from '../types'

export function useAuth() {
  const user = ref<User | null>(null)
  const robotStore = useRobotStore()
  const guideStore = useGuideStore()
  const hallStore = useHallStore()
  const zoneStore = useZoneStore()
  const pointStore = usePointStore()
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 初始化时从localStorage恢复用户信息
  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
      apiClient.setAuthToken(savedToken)
    }
  }

  // 登录
  const login = async (loginData: { username: string; password: string }) => {
    loading.value = true
    error.value = null
    
    try {
      // 强制刷新环境配置，确保使用最新的环境设置
      const currentConfig = refreshEnvironmentConfig()
      console.log('🔧 登录时环境配置验证:')
      console.log('- 当前环境变量:', import.meta.env.VITE_APP_ENVIRONMENT)
      console.log('- 当前视频配置:', currentConfig.video.webrtcDomain)
      
      const response = await authApi.login(loginData.username, loginData.password)
      const { access_token, token_type } = response
      
      console.log('登录响应:', response)
      console.log('获取到的token:', access_token)
      console.log('token类型:', token_type)
      
      // 设置认证token
      apiClient.setAuthToken(access_token)
      
      // 直接使用登录响应中的用户信息，不再调用/users/me接口
      const userData = response.user || response // 根据实际登录接口返回结构调整
      console.log('登录响应中的用户数据:', userData)
      console.log('workspace_id:', userData?.workspace_id)
      
      user.value = userData
      token.value = access_token
      
      // 保存到localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', access_token)
      
      // 缓存workspace_id
      if (userData?.workspace_id) {
        localStorage.setItem('workspace_id', userData.workspace_id)
      }
      
      // 登录成功后获取机器人列表
      try {
        await robotStore.fetchRobots(access_token)
      } catch (robotErr) {
        // 机器人列表获取失败不影响登录流程
        console.warn('获取机器人列表失败:', robotErr)
      }
      
      // 登录成功后按顺序获取讲解相关数据
      try {
        // 先获取点位名称和讲解对象（这两个可以并行）
        await Promise.all([
          guideStore.fetchPointNames(),
          guideStore.fetchAudiences()
        ])
        console.log('点位名称和讲解对象数据已在登录时加载')
        
        // 然后获取讲解词（依赖前面的数据）
        await guideStore.fetchScripts()
        console.log('讲解词数据已在登录时加载')
      } catch (guideErr) {
        // 讲解相关数据获取失败不影响登录流程
        console.warn('获取讲解相关数据失败:', guideErr)
      }
      
      // 登录成功后获取展厅、展区和任务点列表
      try {
        await Promise.all([
          hallStore.fetchHalls(),
          zoneStore.fetchZones(),
          pointStore.fetchPoints()
        ])
        console.log('展厅、展区和任务点数据已在登录时加载')
      } catch (hallZonePointErr) {
        // 展厅、展区和任务点数据获取失败不影响登录流程
        console.warn('获取展厅、展区或任务点数据失败:', hallZonePointErr)
      }
      
      return { user: userData, token: access_token }
    } catch (err: any) {
      error.value = err.message || '登录失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async () => {
      // 清除本地状态
      user.value = null
      token.value = null
      apiClient.clearAuthToken()
      
      // 清除机器人数据
      robotStore.clearRobots()
      
      // 清除点位名称数据
      guideStore.clearCache()
      
      // 清除展厅、展区和任务点数据
      hallStore.clearCache()
      zoneStore.clearCache()
      pointStore.clearCache()
      
      // 清除localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('workspace_id')
  }

  return {
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    error: readonly(error),
    login,
    logout,
    initAuth
  }
}

// 其他API组合函数已移除，等待重新对接