import type { Role } from '../types'

// 用户角色管理工具函数
export class UserRoleManager {
  /**
   * 为用户分配角色
   * @param userId 用户ID
   * @param roleId 角色ID
   * @param assignUserRole 分配角色的API函数
   */
  static async assignRole(
    userId: number, 
    roleId: number, 
    assignUserRole: (userId: number, roleId: number) => Promise<any>
  ) {
    try {
      await assignUserRole(userId, roleId)
      return { success: true }
    } catch (error) {
      console.error(`为用户 ${userId} 分配角色 ${roleId} 失败:`, error)
      return { success: false, error }
    }
  }

  /**
   * 删除用户角色
   * @param userId 用户ID
   * @param roleId 角色ID
   * @param removeUserRole 删除角色的API函数
   */
  static async removeRole(
    userId: number, 
    roleId: number, 
    removeUserRole: (userId: number, roleId: number) => Promise<any>
  ) {
    try {
      await removeUserRole(userId, roleId)
      return { success: true }
    } catch (error) {
      console.error(`删除用户 ${userId} 角色 ${roleId} 失败:`, error)
      return { success: false, error }
    }
  }

  /**
   * 更新用户角色（先删除旧角色，再分配新角色）
   * @param userId 用户ID
   * @param currentRoles 当前角色列表
   * @param newRoleId 新角色ID
   * @param assignUserRole 分配角色的API函数
   * @param removeUserRole 删除角色的API函数
   */
  static async updateUserRole(
    userId: number,
    currentRoles: Role[],
    newRoleId: number,
    assignUserRole: (userId: number, roleId: number) => Promise<any>,
    removeUserRole: (userId: number, roleId: number) => Promise<any>
  ) {
    const currentRoleIds = currentRoles.map(role => role.id)
    
    // 如果新角色不在当前角色列表中，则进行更新
    if (!currentRoleIds.includes(newRoleId)) {
      // 删除所有当前角色
      for (const roleId of currentRoleIds) {
        await this.removeRole(userId, roleId, removeUserRole)
      }
      
      // 分配新角色
      return await this.assignRole(userId, newRoleId, assignUserRole)
    }
    
    return { success: true, message: '角色未发生变化' }
  }

  /**
   * 批量分配用户角色
   * @param userId 用户ID
   * @param roleIds 角色ID列表
   * @param assignUserRole 分配角色的API函数
   */
  static async assignMultipleRoles(
    userId: number,
    roleIds: number[],
    assignUserRole: (userId: number, roleId: number) => Promise<any>
  ) {
    const results = []
    
    for (const roleId of roleIds) {
      const result = await this.assignRole(userId, roleId, assignUserRole)
      results.push({ roleId, ...result })
    }
    
    return results
  }

  /**
   * 获取角色ID（通过角色名称）
   * @param roleName 角色名称
   * @param roleList 角色列表
   */
  static getRoleIdByName(roleName: string, roleList: readonly Role[] | Role[]): number | null {
    const role = (roleList as readonly Role[]).find(role => role.role_name === roleName)
    return role ? role.id : null
  }

  /**
   * 获取角色名称（通过角色ID）
   * @param roleId 角色ID
   * @param roleList 角色列表
   */
  static getRoleNameById(roleId: number, roleList: readonly Role[] | Role[]): string | null {
    const role = (roleList as readonly Role[]).find(role => role.id === roleId)
    return role ? role.role_name : null
  }
}
