import { usePermissionStore } from '../stores/permission'
import { useUserStore } from '../stores/user'

// 权限调试工具 - 已禁用
export function debugPermissions() {
  // 调试功能已禁用
}

// 在控制台暴露调试函数
if (typeof window !== 'undefined') {
  (window as any).debugPermissions = debugPermissions
}
