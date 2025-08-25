import { usePermissionStore } from '../stores/permission'
import { useUserStore } from '../stores/user'

// 权限调试工具
export function debugPermissions() {
  const permissionStore = usePermissionStore()
  const userStore = useUserStore()
  
  console.log('=== 权限调试信息 ===')
  console.log('当前用户:', userStore.user)
  console.log('用户权限列表:', permissionStore.userPermissions)
  console.log('所有权限配置:', permissionStore.allPermissions)
  
  // 测试常见权限
  const testPermissions = [
    'home.view',
    'drone_control.view',
    'dock_control.view',
    'wayline_management.view',
    'task_logs.view',
    'task_records.view',
    'device_management.view'
  ]
  
  console.log('=== 权限检查结果 ===')
  testPermissions.forEach(permission => {
    const hasPermission = permissionStore.hasPermission(permission)
    console.log(`${permission}: ${hasPermission ? '✅' : '❌'}`)
  })
  
  console.log('=== 权限调试完成 ===')
}

// 在控制台暴露调试函数
if (typeof window !== 'undefined') {
  (window as any).debugPermissions = debugPermissions
}
