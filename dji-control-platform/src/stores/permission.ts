import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePermissionStore = defineStore('permission', () => {
  // 用户权限列表
  const userPermissions = ref<string[]>([])
  
  // 当前用户角色
  const currentRole = ref<string>('')
  
  // 权限检查函数
  const hasPermission = (permission: string): boolean => {
    return userPermissions.value.includes(permission)
  }
  
  // 检查多个权限（任一满足即可）
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => userPermissions.value.includes(permission))
  }
  
  // 检查多个权限（全部满足）
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => userPermissions.value.includes(permission))
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
  
  // 获取用户权限列表
  const getUserPermissions = computed(() => userPermissions.value)
  
  // 获取当前角色
  const getCurrentRole = computed(() => currentRole.value)
  
  return {
    userPermissions,
    currentRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    setUserPermissions,
    setCurrentRole,
    clearPermissions,
    getUserPermissions,
    getCurrentRole
  }
}) 