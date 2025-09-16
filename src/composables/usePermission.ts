import { ref } from 'vue'
import { usePermissionStore } from '../stores/permission'

export function usePermission() {
  const permissionStore = usePermissionStore()
  const showPermissionDenied = ref(false)
  const requiredPermission = ref('')

  // 权限检查并显示提示
  const checkPermission = (permission: string, action?: string): boolean => {
    const hasPermission = permissionStore.hasPermission(permission)
    
    if (!hasPermission) {
      requiredPermission.value = permission
      showPermissionDenied.value = true
      console.warn(`权限不足: ${permission}`, action)
    }
    
    return hasPermission
  }

  // 检查多个权限（任一满足）
  const checkAnyPermission = (permissions: string[], action?: string): boolean => {
    const hasPermission = permissionStore.hasAnyPermission(permissions)
    
    if (!hasPermission) {
      requiredPermission.value = permissions.join(' 或 ')
      showPermissionDenied.value = true
      console.warn(`权限不足: ${permissions.join(' 或 ')}`, action)
    }
    
    return hasPermission
  }

  // 检查多个权限（全部满足）
  const checkAllPermissions = (permissions: string[], action?: string): boolean => {
    const hasPermission = permissionStore.hasAllPermissions(permissions)
    
    if (!hasPermission) {
      requiredPermission.value = permissions.join(' 和 ')
      showPermissionDenied.value = true
      console.warn(`权限不足: ${permissions.join(' 和 ')}`, action)
    }
    
    return hasPermission
  }

  // 关闭权限提示
  const closePermissionDenied = () => {
    showPermissionDenied.value = false
  }

  // 联系管理员
  const contactAdmin = () => {
    // 这里可以实现联系管理员的逻辑
    console.log('联系管理员')
    showPermissionDenied.value = false
    // 可以跳转到联系页面或显示联系方式
  }

  // 权限装饰器（用于按钮点击等）
  const withPermission = (permission: string, callback: () => void) => {
    return () => {
      if (checkPermission(permission)) {
        callback()
      }
    }
  }

  // 权限装饰器（多个权限任一满足）
  const withAnyPermission = (permissions: string[], callback: () => void) => {
    return () => {
      if (checkAnyPermission(permissions)) {
        callback()
      }
    }
  }

  // 权限装饰器（多个权限全部满足）
  const withAllPermissions = (permissions: string[], callback: () => void) => {
    return () => {
      if (checkAllPermissions(permissions)) {
        callback()
      }
    }
  }

  return {
    showPermissionDenied,
    requiredPermission,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    closePermissionDenied,
    contactAdmin,
    withPermission,
    withAnyPermission,
    withAllPermissions,
    hasPermission: permissionStore.hasPermission,
    hasAnyPermission: permissionStore.hasAnyPermission,
    hasAllPermissions: permissionStore.hasAllPermissions
  }
} 