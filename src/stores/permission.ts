import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Permission } from '../types'

export const usePermissionStore = defineStore('permission', () => {
  // 用户权限列表
  const userPermissions = ref<string[]>([])
  
  // 当前用户角色
  const currentRole = ref<string>('')
  
  // 所有权限列表
  const allPermissions = ref<Permission[]>([])
  
  // 权限检查函数 - 已禁用权限验证，始终返回true
  const hasPermission = (permission: string): boolean => {
    console.log('权限检查已禁用，允许权限:', permission)
    return true
  }
  
  // 检查多个权限（任一满足即可） - 已禁用权限验证，始终返回true
  const hasAnyPermission = (permissions: string[]): boolean => {
    console.log('权限检查已禁用，允许权限:', permissions)
    return true
  }
  
  // 检查多个权限（全部满足） - 已禁用权限验证，始终返回true
  const hasAllPermissions = (permissions: string[]): boolean => {
    console.log('权限检查已禁用，允许权限:', permissions)
    return true
  }
  
  // 设置用户权限
  const setUserPermissions = (permissions: string[]) => {
    userPermissions.value = permissions
  }
  
  // 设置用户角色
  const setCurrentRole = (role: string) => {
    currentRole.value = role
  }
  
  // 清除权限
  const clearPermissions = () => {
    userPermissions.value = []
    currentRole.value = ''
  }
  
  // 设置所有权限列表
  const setAllPermissions = (permissions: Permission[]) => {
    allPermissions.value = permissions
  }
  
  // 获取用户权限列表
  const getUserPermissions = computed(() => userPermissions.value)
  
  // 获取当前角色
  const getCurrentRole = computed(() => currentRole.value)
  
  // 获取所有权限列表
  const getAllPermissions = computed(() => allPermissions.value)
  
  return {
    userPermissions,
    currentRole,
    allPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    setUserPermissions,
    setCurrentRole,
    clearPermissions,
    setAllPermissions,
    getUserPermissions,
    getCurrentRole,
    getAllPermissions
  }
}) 