import { usePermissionStore } from '../stores/permission'

// 初始化用户权限
export async function initUserPermissions() {
  const permissionStore = usePermissionStore()
  
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
    
    // 从用户信息中提取权限
    const frontendPermissions: string[] = []
    

    
    // 处理方式1：从顶层的permissions数组中提取（从登录响应数据中获取）
    if (user.permissions && Array.isArray(user.permissions)) {
      console.log('从顶层permissions数组提取权限:', user.permissions)
      user.permissions.forEach((permission: any) => {
        if (permission.code) {
          frontendPermissions.push(permission.code)
        }
      })
    }
    
    // 处理方式2：从roles数组中提取（用户列表接口返回的数据结构）
    if (user.roles && Array.isArray(user.roles)) {
      console.log('从roles数组提取权限:', user.roles)
      user.roles.forEach((role: any) => {
        if (role.permissions && Array.isArray(role.permissions)) {
          role.permissions.forEach((permission: any) => {
            // 支持两种字段名：permission_code 和 code
            const permissionCode = permission.permission_code || permission.code
            if (permissionCode) {
              frontendPermissions.push(permissionCode)
            }
          })
        }
      })
    }
    
    // 去重权限列表
    const uniquePermissions = [...new Set(frontendPermissions)]
    
    console.log('最终提取的权限列表:', uniquePermissions)
    
    // 设置用户权限到Store
    permissionStore.setUserPermissions(uniquePermissions)
    

  } catch (err) {
    console.error('初始化用户权限失败:', err)
  }
}

// 初始化所有权限配置
export async function initAllPermissions() {
  const permissionStore = usePermissionStore()
  
  try {
    // 由于我们直接从用户信息中获取权限，这里可以跳过获取所有权限配置
    // 或者如果需要，可以从用户信息中构建权限配置

  } catch (err) {
    console.error('初始化权限配置失败:', err)
  }
}
