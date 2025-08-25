import type { DirectiveBinding } from 'vue'
import { usePermissionStore } from '../stores/permission'

// 权限检查函数
function checkPermission(permissions: string | string[]): boolean {
  const permissionStore = usePermissionStore()
  const permissionArray = Array.isArray(permissions) ? permissions : [permissions]
  return permissionStore.hasAnyPermission(permissionArray)
}

// 显示权限不足提示
function showPermissionDeniedMessage(permission: string) {
  // 可以使用 Element Plus 的 Message 组件，或者自定义弹窗
  if (typeof window !== 'undefined' && window.alert) {
    window.alert(`权限不足：需要 ${permission} 权限`)
  }
}

// 权限验证指令（隐藏无权限元素）
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
      } else {
        el.style.display = 'none'
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

// 权限验证指令（点击检查，不隐藏元素，显示弹窗）
export const permissionClick = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    
    if (value) {
      const permissions = Array.isArray(value) ? value : [value]
      

      
      // 保存原始点击事件
      const originalClick = el.onclick
      
      // 重写点击事件
      el.onclick = (event: MouseEvent) => {
        // 检查权限
        if (!checkPermission(permissions)) {
          event.preventDefault()
          event.stopPropagation()
          
          // 显示权限不足提示
          const permissionText = Array.isArray(value) ? value.join(' 或 ') : value
          showPermissionDeniedMessage(permissionText)
          
          return false
        }
        
        // 有权限，执行原始点击事件
        if (originalClick) {
          return originalClick.call(el, event)
        }
      }
    }
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 重新绑定点击事件
    const { value } = binding
    
    if (value) {
      const permissions = Array.isArray(value) ? value : [value]
      
      console.log('权限点击指令更新:', {
        element: el,
        permissions: permissions
      })
      
      // 保存原始点击事件
      const originalClick = el.onclick
      
      // 重写点击事件
      el.onclick = (event: MouseEvent) => {
        // 检查权限
        if (!checkPermission(permissions)) {
          event.preventDefault()
          event.stopPropagation()
          
          // 显示权限不足提示
          const permissionText = Array.isArray(value) ? value.join(' 或 ') : value
          showPermissionDeniedMessage(permissionText)
          
          return false
        }
        
        // 有权限，执行原始点击事件
        if (originalClick) {
          return originalClick.call(el, event)
        }
      }
    }
  }
}

// 权限验证指令（点击检查，不隐藏元素，使用自定义弹窗）
export const permissionClickDialog = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    
    if (value) {
      const permissions = Array.isArray(value) ? value : [value]
      

      
      // 添加权限检查属性
      el.setAttribute('data-permission', Array.isArray(value) ? value.join(',') : value)
      
      // 重写点击事件
      el.addEventListener('click', (event: MouseEvent) => {
        // 检查权限
        if (!checkPermission(permissions)) {
          event.preventDefault()
          event.stopPropagation()
          event.stopImmediatePropagation()
          
          // 触发自定义权限不足事件
          const permissionText = Array.isArray(value) ? value.join(' 或 ') : value
          const customEvent = new CustomEvent('permission-denied', {
            detail: { permission: permissionText },
            bubbles: true
          })
          el.dispatchEvent(customEvent)
          
          // 阻止所有后续事件
          return false
        }
        
        // 有权限，继续执行（Vue会处理@click事件）
      }, true) // 使用捕获阶段，确保在Vue事件之前执行
    }
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 移除旧的事件监听器
    if ((el as any)._permissionClickHandler) {
      el.removeEventListener('click', (el as any)._permissionClickHandler, true)
    }
    
    const { value } = binding
    
    if (value) {
      const permissions = Array.isArray(value) ? value : [value]
      
      // 更新权限检查属性
      el.setAttribute('data-permission', Array.isArray(value) ? value.join(',') : value)
      
      // 重新绑定点击事件
      const clickHandler = (event: MouseEvent) => {
        // 检查权限
        if (!checkPermission(permissions)) {
          event.preventDefault()
          event.stopPropagation()
          
          // 触发自定义权限不足事件
          const permissionText = Array.isArray(value) ? value.join(' 或 ') : value
          const customEvent = new CustomEvent('permission-denied', {
            detail: { permission: permissionText },
            bubbles: true
          })
          el.dispatchEvent(customEvent)
          
          return false
        }
        
        // 有权限，继续执行（Vue会处理@click事件）
      }
      
      // 保存引用以便后续移除
      ;(el as any)._permissionClickHandler = clickHandler
      el.addEventListener('click', clickHandler, true) // 使用捕获阶段
    }
  }
}