import { usePermissionStore } from '../stores/permission'
import { usePermissions } from '../composables/useApi'
import { mapBackendToFrontendPermissions } from './permissionMapper'

// 初始化用户权限
export async function initUserPermissions() {
  const permissionStore = usePermissionStore()
  const { fetchUserPermissions } = usePermissions()
  
  try {
    // 获取当前用户信息
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      console.warn('用户信息不存在，跳过权限初始化')
      return
    }
    
    const user = JSON.parse(userStr)
    if (!user.id) {
      console.warn('用户ID不存在，跳过权限初始化')
      return
    }
    
    // 获取用户权限
    const backendPermissions = await fetchUserPermissions(user.id)
    
    // 获取所有权限配置用于映射
    const allPermissions = await fetchAllPermissions()
    
    // 将后端权限代码映射为前端权限键值
    const frontendPermissions = mapBackendToFrontendPermissions(backendPermissions, allPermissions)
    
    // 设置用户权限到Store
    permissionStore.setUserPermissions(frontendPermissions)
    
    console.log('后端权限:', backendPermissions)
    console.log('映射后的前端权限:', frontendPermissions)
    
    console.log('用户权限初始化完成:', frontendPermissions)
  } catch (err) {
    console.error('初始化用户权限失败:', err)
  }
}

// 初始化所有权限配置
export async function initAllPermissions() {
  const permissionStore = usePermissionStore()
  const { fetchAllPermissions } = usePermissions()
  
  try {
    // 获取所有权限列表
    const allPermissions = await fetchAllPermissions()
    
    // 设置权限列表到Store
    permissionStore.setAllPermissions(allPermissions)
    
    console.log('权限配置初始化完成:', allPermissions.length, '个权限')
  } catch (err) {
    console.error('初始化权限配置失败:', err)
  }
}
