import type { DirectiveBinding } from 'vue'
import { usePermissionStore } from '../stores/permission'

// 权限验证指令
export const permission = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const permissionStore = usePermissionStore()
    const { value } = binding
    
    if (value) {
      const permissions = Array.isArray(value) ? value : [value]
      const hasPermission = permissionStore.hasAnyPermission(permissions)
      
      if (!hasPermission) {
        // 隐藏元素
        el.style.display = 'none'
        // 或者禁用元素
        // el.setAttribute('disabled', 'disabled')
        // el.style.opacity = '0.5'
        // el.style.pointerEvents = 'none'
      }
    }
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const permissionStore = usePermissionStore()
    const { value } = binding
    
    if (value) {
      const permissions = Array.isArray(value) ? value : [value]
      const hasPermission = permissionStore.hasAnyPermission(permissions)
      
      if (hasPermission) {
        el.style.display = ''
        // el.removeAttribute('disabled')
        // el.style.opacity = ''
        // el.style.pointerEvents = ''
      } else {
        el.style.display = 'none'
        // el.setAttribute('disabled', 'disabled')
        // el.style.opacity = '0.5'
        // el.style.pointerEvents = 'none'
      }
    }
  }
}

// 权限验证指令（全部满足）
export const permissionAll = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const permissionStore = usePermissionStore()
    const { value } = binding
    
    if (value) {
      const permissions = Array.isArray(value) ? value : [value]
      const hasPermission = permissionStore.hasAllPermissions(permissions)
      
      if (!hasPermission) {
        el.style.display = 'none'
      }
    }
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const permissionStore = usePermissionStore()
    const { value } = binding
    
    if (value) {
      const permissions = Array.isArray(value) ? value : [value]
      const hasPermission = permissionStore.hasAllPermissions(permissions)
      
      if (hasPermission) {
        el.style.display = ''
      } else {
        el.style.display = 'none'
      }
    }
  }
} 