import { computed } from 'vue'
import { usePermissionStore } from '../stores/permission'

/**
 * 权限检查组合式函数
 * 提供便捷的权限检查方法
 */
export function usePermissionCheck() {
  const permissionStore = usePermissionStore()

  /**
   * 检查是否有指定权限
   * @param permission 权限键
   * @returns 是否有权限
   */
  const hasPermission = (permission: string): boolean => {
    return permissionStore.hasPermission(permission)
  }

  /**
   * 检查是否有任一权限
   * @param permissions 权限键数组
   * @returns 是否有任一权限
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissionStore.hasAnyPermission(permissions)
  }

  /**
   * 检查是否有所有权限
   * @param permissions 权限键数组
   * @returns 是否有所有权限
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissionStore.hasAllPermissions(permissions)
  }

  /**
   * 获取用户权限列表
   */
  const userPermissions = computed(() => permissionStore.getUserPermissions)

  /**
   * 获取当前用户角色
   */
  const currentRole = computed(() => permissionStore.getCurrentRole)

  /**
   * 获取所有可用权限
   */
  const allPermissions = computed(() => permissionStore.getAllPermissions)

  /**
   * 检查页面访问权限
   * @param pagePermission 页面权限键
   * @returns 是否可以访问页面
   */
  const canAccessPage = (pagePermission: string): boolean => {
    return hasPermission(pagePermission)
  }

  /**
   * 检查操作权限
   * @param actionPermission 操作权限键
   * @returns 是否可以执行操作
   */
  const canPerformAction = (actionPermission: string): boolean => {
    return hasPermission(actionPermission)
  }

  /**
   * 检查是否为超级管理员
   * @returns 是否为超级管理员
   */
  const isSuperAdmin = computed(() => {
    return currentRole.value === '超级管理员' || hasPermission('system_manage:super_admin')
  })

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions,
    currentRole,
    allPermissions,
    canAccessPage,
    canPerformAction,
    isSuperAdmin
  }
}
