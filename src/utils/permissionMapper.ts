import type { Permission } from '../types'

// 权限名称映射表 - 将后端权限名称映射到前端权限键值
const permissionNameMapping: Record<string, string> = {
  // 首页权限
  '首页-页面查看': 'home.view',
  '首页-下发任务': 'home.task.issue',
  '首页-取消任务': 'home.task.cancel',
  '首页-航线暂停': 'home.wayline.pause',
  '首页-航线恢复': 'home.wayline.resume',
  '首页-一键返航': 'home.drone.return',
  '首页-取消返航': 'home.drone.cancel_return',
  '首页-急停': 'home.drone.emergency_stop',
  
  
  // 机场控制权限
  '机场控制-页面查看': 'dock_control.view',
  '机场控制-远程调试': 'dock_control.remote_debug',
  
  // 航线管理权限
  '航线管理-页面查看': 'wayline_management.view',
  '航线管理-删除文件夹': 'wayline_management.folder.delete',
  '航线管理-删除航线': 'wayline_management.wayline.delete',
  '航线管理-新增航线': 'wayline_management.wayline.create',
  '航线管理-下发任务': 'wayline_management.task.issue',
  '航线管理-删除航点': 'wayline_management.waypoint.delete',
  
  // 任务记录权限
  '任务记录-页面查看': 'task_records.view',
  
  // 任务日志权限
  '任务日志-页面查看': 'task_logs.view',
  
  // 设备管理权限
  '设备管理-页面查看': 'device_management.view',
  '设备管理-添加设备': 'device_management.device.create',
  '设备管理-删除设备': 'device_management.device.delete',
  '设备管理-报警日志': 'device_management.log.view',
  
  // 系统管理权限
  '系统管理-页面查看': 'system_management.view',
  '系统管理-添加用户': 'system_management.user.create',
  '系统管理-编辑用户': 'system_management.user.edit',
  '系统管理-删除用户': 'system_management.user.delete',
  
  // 角色管理权限
  '角色管理-页面查看': 'role_management.view',
  '角色管理-添加角色': 'role_management.role.create',
  '角色管理-编辑角色': 'role_management.role.edit',
  '角色管理-删除角色': 'role_management.role.delete',
  '角色管理-分配权限': 'role_management.permission.set'
}

// 前端权限配置结构
export interface PermissionSection {
  key: string
  title: string
  viewPermission: string
  permissions: Array<{
    key: string
    label: string
    permission_code?: string
  }>
}

// 将后端权限数据映射到前端权限配置
export function mapPermissionsToSections(permissions: Permission[]): PermissionSection[] {
  const permissionMap = new Map<string, Permission>()
  permissions.forEach(permission => {
    permissionMap.set(permission.permission_name, permission)
  })

  const sections: PermissionSection[] = [
    {
      key: 'home',
      title: '首页',
      viewPermission: 'home.view',
      permissions: [
        { key: 'home.task.issue', label: '下发任务' },
        { key: 'home.task.cancel', label: '取消任务' },
        { key: 'home.wayline.pause', label: '航线暂停' },
        { key: 'home.wayline.resume', label: '航线恢复' },
        { key: 'home.drone.return', label: '一键返航' },
        { key: 'home.drone.cancel_return', label: '取消返航' },
        { key: 'home.drone.emergency_stop', label: '急停' }
      ]
    },
    {
      key: 'drone_control',
  // title: '无人机控制',
      viewPermission: 'drone_control.view',
      permissions: [
        { key: 'drone_control.wayline.pause', label: '航线暂停' },
        { key: 'drone_control.wayline.stop', label: '航线停止' },
        { key: 'drone_control.remote_debug', label: '远程调试' },
  // { key: 'drone_control.drone.control', label: '无人机控制' },
        { key: 'drone_control.gimbal.control', label: '云台控制' }
      ]
    },
    {
      key: 'dock_control',
      title: '机场控制',
      viewPermission: 'dock_control.view',
      permissions: [
        { key: 'dock_control.remote_debug', label: '远程调试' }
      ]
    },
    {
      key: 'wayline_management',
      title: '航线管理',
      viewPermission: 'wayline_management.view',
      permissions: [
        { key: 'wayline_management.folder.delete', label: '删除文件夹' },
        { key: 'wayline_management.wayline.delete', label: '删除航线' },
        { key: 'wayline_management.wayline.create', label: '新增航线' },
        { key: 'wayline_management.task.issue', label: '下发任务' },
        { key: 'wayline_management.waypoint.delete', label: '删除航点' }
      ]
    },
    {
      key: 'task_records',
      title: '任务记录',
      viewPermission: 'task_records.view',
      permissions: []
    },
    {
      key: 'task_logs',
      title: '任务日志',
      viewPermission: 'task_logs.view',
      permissions: []
    },
    {
      key: 'device_management',
      title: '设备管理',
      viewPermission: 'device_management.view',
      permissions: [
        { key: 'device_management.device.create', label: '添加设备' },
        { key: 'device_management.device.delete', label: '删除设备' },
        { key: 'device_management.log.view', label: '报警日志' }
      ]
    },
    {
      key: 'system_management',
      title: '系统管理',
      viewPermission: 'system_management.view',
      permissions: [
        { key: 'system_management.user.create', label: '添加用户' },
        { key: 'system_management.user.edit', label: '编辑用户' },
        { key: 'system_management.user.delete', label: '删除用户' }
      ]
    },
    {
      key: 'role_management',
      title: '角色管理',
      viewPermission: 'role_management.view',
      permissions: [
        { key: 'role_management.role.create', label: '添加角色' },
        { key: 'role_management.role.edit', label: '编辑角色' },
        { key: 'role_management.role.delete', label: '删除角色' },
        { key: 'role_management.permission.set', label: '分配权限' }
      ]
    }
  ]

  // 为每个权限添加对应的permission_code
  sections.forEach(section => {
    section.permissions.forEach(permission => {
      // 查找对应的后端权限
      for (const [name, code] of Object.entries(permissionNameMapping)) {
        if (code === permission.key) {
          const backendPermission = permissionMap.get(name)
          if (backendPermission) {
            permission.permission_code = backendPermission.permission_code
          }
          break
        }
      }
    })
  })

  return sections
}

// 将前端权限键值转换为后端权限代码
export function mapFrontendToBackendPermissions(frontendPermissions: string[], permissions: Permission[]): string[] {
  const permissionMap = new Map<string, string>()
  permissions.forEach(permission => {
    permissionMap.set(permission.permission_name, permission.permission_code)
  })

  const backendPermissions: string[] = []
  
  frontendPermissions.forEach(frontendPermission => {
    // 查找对应的后端权限名称
    for (const [name, code] of Object.entries(permissionNameMapping)) {
      if (code === frontendPermission) {
        const backendCode = permissionMap.get(name)
        if (backendCode) {
          backendPermissions.push(backendCode)
        }
        break
      }
    }
  })

  return backendPermissions
}

// 将后端权限代码转换为前端权限键值
export function mapBackendToFrontendPermissions(backendPermissions: string[], permissions: Permission[]): string[] {
  const permissionMap = new Map<string, string>()
  permissions.forEach(permission => {
    permissionMap.set(permission.permission_code, permission.permission_name)
  })

  const frontendPermissions: string[] = []
  
  backendPermissions.forEach(backendPermission => {
    const permissionName = permissionMap.get(backendPermission)
    if (permissionName) {
      const frontendCode = permissionNameMapping[permissionName]
      if (frontendCode) {
        frontendPermissions.push(frontendCode)
      }
    }
  })

  return frontendPermissions
}

// 将后端权限对象数组转换为前端权限键值
export function mapBackendPermissionObjectsToFrontend(backendPermissions: Permission[], permissions: Permission[]): string[] {
  const frontendPermissions: string[] = []
  
  backendPermissions.forEach(backendPermission => {
    const permissionName = backendPermission.permission_name
    const frontendCode = permissionNameMapping[permissionName]
    if (frontendCode) {
      frontendPermissions.push(frontendCode)
    }
  })

  return frontendPermissions
}
