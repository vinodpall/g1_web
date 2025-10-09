import { defineStore } from 'pinia'
import type { User } from '@/types'
import { userApi } from '@/api/services'

export const useUserStore = defineStore('user', {
  state: () => {
    // 从localStorage恢复用户信息
    let user = null
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        user = JSON.parse(userStr)
      }
    } catch (error) {
      console.error('解析用户信息失败:', error)
    }
    
    return {
      user: user as User | null,
      token: localStorage.getItem('token') || ''
    }
  },
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (permission: string) => {
      if (!state.user) return false
      // 若后端返回字符串角色数组（含'super_admin'）或对象角色数组（含role_name==='超级管理员'），判定为超管
      if (Array.isArray(state.user.roles)) {
        const rolesArr = state.user.roles as unknown[]
        const isSuper = rolesArr.some((r: any) => (typeof r === 'string' ? r === 'super_admin' : r?.role_name === '超级管理员'))
        if (isSuper) return true
      }
      // 这里可以根据角色和权限进行更复杂的判断
      return true
    }
  },
  
  actions: {
    setUser(user: User) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    // 获取当前用户信息
    async fetchCurrentUser() {
      if (!this.token) {
        console.warn('未找到token，无法获取用户信息')
        return
      }
      
      try {
        console.log('开始获取当前用户信息...')
        const userData = await userApi.getCurrentUser(this.token)
        this.setUser(userData)
        console.log('当前用户信息已更新:', userData)
        return userData
      } catch (error) {
        console.error('获取当前用户信息失败:', error)
        throw error
      }
    },
    
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})