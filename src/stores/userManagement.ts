import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'
import { userApi } from '../api/services'

export const useUserManagementStore = defineStore('userManagement', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取用户列表
  const fetchUsers = async (token: string, searchQuery?: string, skip: number = 0, limit: number = 50) => {
    console.log('userManagementStore.fetchUsers 被调用')
    console.log('参数 - token:', token ? '存在' : '不存在')
    console.log('参数 - searchQuery:', searchQuery)
    console.log('参数 - skip:', skip)
    console.log('参数 - limit:', limit)
    
    loading.value = true
    error.value = null
    
    try {
      console.log('准备调用 userApi.getUsers')
      const data = await userApi.getUsers(token, searchQuery, skip, limit)
      console.log('用户API调用成功，返回数据:', data)
      
      users.value = data
      
      return data
    } catch (err: any) {
      console.error('userApi.getUsers 调用失败:', err)
      error.value = err.message || '获取用户列表失败'
      throw err
    } finally {
      loading.value = false
      console.log('userManagementStore.fetchUsers 执行完成')
    }
  }

  // 创建用户
  const createUser = async (token: string, userData: {
    username: string
    email: string
    full_name: string
    password: string
    is_active?: boolean
    is_superuser?: boolean
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const newUser = await userApi.createUser(token, userData)
      users.value.push(newUser)
      return newUser
    } catch (err: any) {
      error.value = err.message || '创建用户失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新用户
  const updateUser = async (token: string, userId: number, userData: Partial<{
    username: string
    email: string
    full_name: string
    password: string
    is_active: boolean
    is_superuser: boolean
  }>) => {
    loading.value = true
    error.value = null
    
    try {
      const updatedUser = await userApi.updateUser(token, userId, userData)
      const index = users.value.findIndex(user => user.id === userId)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      return updatedUser
    } catch (err: any) {
      error.value = err.message || '更新用户失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 删除用户
  const deleteUser = async (token: string, userId: number) => {
    loading.value = true
    error.value = null
    
    try {
      await userApi.deleteUser(token, userId)
      users.value = users.value.filter(user => user.id !== userId)
      return true
    } catch (err: any) {
      error.value = err.message || '删除用户失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 清空数据
  const clearUsers = () => {
    users.value = []
    error.value = null
  }

  return {
    // state
    users: computed(() => users.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearUsers
  }
})