import { defineStore } from 'pinia'
import type { User } from '@/types'

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
      // 简化校验：若后端包含 roles 数组，超级管理员判定可根据其中是否包含 'super_admin'
      if (Array.isArray(state.user.roles) && state.user.roles.includes('super_admin')) return true
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
    
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})