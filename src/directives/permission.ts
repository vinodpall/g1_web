import type { DirectiveBinding } from 'vue'
import { usePermissionStore } from '../stores/permission'

// 权限检查函数 - 已禁用权限验证，始终返回true
export function checkPermission(permissions?: string | string[], _desc?: string): boolean {
  // 权限指令检查已禁用
  return true
}

// 显示权限不足提示
function showPermissionDeniedMessage(permission: string) {
  // 可以使用 Element Plus 的 Message 组件，或者自定义弹窗
  if (typeof window !== 'undefined' && window.alert) {
    window.alert(`权限不足：需要 ${permission} 权限`)
  }
}

// 权限验证指令（隐藏无权限元素） - 已禁用，不隐藏任何元素
export const permission = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 权限指令已禁用，显示所有元素
    // 确保元素可见
    el.style.display = ''
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 权限指令已禁用，显示所有元素
    // 确保元素可见
    el.style.display = ''
  }
}

// 权限验证指令（全部满足） - 已禁用，不隐藏任何元素
export const permissionAll = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 权限指令(全部)已禁用，显示所有元素
    // 确保元素可见
    el.style.display = ''
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 权限指令(全部)已禁用，显示所有元素
    // 确保元素可见
    el.style.display = ''
  }
}

// 权限验证指令（点击检查，不隐藏元素，显示弹窗） - 已禁用，允许所有点击
export const permissionClick = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 权限点击指令已禁用，允许所有点击
    // 不做任何权限检查，允许正常点击
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 权限点击指令已禁用，允许所有点击
    // 不做任何权限检查，允许正常点击
  }
}

// 权限验证指令（点击检查，不隐藏元素，使用自定义弹窗） - 已禁用，允许所有点击
export const permissionClickDialog = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 权限点击弹窗指令已禁用，允许所有点击
    // 不做任何权限检查，允许正常点击
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 权限点击弹窗指令已禁用，允许所有点击
    // 不做任何权限检查，允许正常点击
  }
}