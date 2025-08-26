# 用户管理功能更新说明

## 概述

根据需求，对用户管理功能进行了以下更新：
1. 使用 POST 接口 `/api/v1/users/{user_id}` 来更新用户信息
2. 在修改角色时同步更新角色关联，使用接口 `/api/v1/users/{user_id}/roles/{role_id}`

## 主要修改

### 1. API 接口更新 (`src/api/services.ts`)

**更新用户接口**:
```typescript
// 更新用户 - 从 PUT 改为 POST
updateUser: (id: string, userData: Partial<User>) => {
  return apiClient.post<User>(`/users/${id}`, userData)
},

// 新增同步更新用户角色接口
syncUserRole: (userId: number, roleId: number) => {
  return apiClient.post(`/users/${userId}/roles/${roleId}`)
}
```

### 2. 组合式函数更新 (`src/composables/useApi.ts`)

**新增同步角色方法**:
```typescript
// 同步更新用户角色
const syncUserRole = async (userId: number, roleId: number) => {
  loading.value = true
  error.value = null
  
  try {
    const response = await userApi.syncUserRole(userId, roleId)
    return response
  } catch (err: any) {
    error.value = err.message || '同步角色失败'
    throw err
  } finally {
    loading.value = false
  }
}
```

### 3. 用户管理页面更新 (`src/views/UserManage.vue`)

**编辑用户逻辑优化**:
```typescript
// 确认编辑用户
const onEditUserConfirm = async () => {
  if (currentUser.value) {
    try {
      // 1. 使用POST接口更新用户基本信息
      const apiUserData = {
        username: editUserForm.value.username,
        userfullname: editUserForm.value.name,
        is_activate: editUserForm.value.is_activate,
        is_superuser: editUserForm.value.is_superuser,
        workspace_id: editUserForm.value.workspace_id,
        user_type: editUserForm.value.user_type
      }
      
      await updateUser(currentUser.value.id.toString(), apiUserData)
      
      // 2. 处理角色分配 - 如果修改了角色，同步更新角色关联
      if (selectedRole) {
        const roleId = UserRoleManager.getRoleIdByName(selectedRole.role_name, roleList.value)
        if (roleId) {
          const currentUserRoles = currentUser.value.roles || []
          const currentRoleIds = currentUserRoles.map((role: any) => role.id)
          
          // 检查角色是否发生变化
          if (!currentRoleIds.includes(roleId)) {
            // 删除所有当前角色
            for (const currentRoleId of currentRoleIds) {
              await removeUserRole(currentUser.value.id, currentRoleId)
            }
            
            // 使用同步接口分配新角色
            try {
              await syncUserRole(currentUser.value.id, roleId)
            } catch (err) {
              // 如果同步失败，尝试使用普通分配接口
              await assignUserRole(currentUser.value.id, roleId)
            }
          }
        }
      }
      
      // 3. 重新获取用户列表以更新显示
      await fetchUsers({ skip: 0, limit: 100 })
    } catch (err) {
      console.error('更新用户失败:', err)
    }
  }
}
```

## 接口说明

### 1. 更新用户信息
- **接口**: `POST /api/v1/users/{user_id}`
- **功能**: 更新用户基本信息
- **参数**: 用户数据对象

### 2. 同步更新用户角色
- **接口**: `POST /api/v1/users/{user_id}/roles/{role_id}`
- **功能**: 同步更新用户角色关联
- **参数**: 
  - `user_id`: 用户ID
  - `role_id`: 角色ID

### 3. 删除用户角色
- **接口**: `DELETE /api/v1/users/{user_id}/roles/{role_id}`
- **功能**: 删除用户角色关联

## 更新流程

### 编辑用户时的处理流程：

1. **更新用户基本信息**
   - 使用 POST 接口更新用户的基本信息（用户名、姓名、激活状态等）

2. **检查角色变化**
   - 比较当前用户角色和新选择的角色
   - 如果角色发生变化，执行角色更新流程

3. **角色更新流程**
   - 删除用户当前的所有角色
   - 使用同步接口分配新角色
   - 如果同步接口失败，回退到普通分配接口

4. **刷新数据**
   - 重新获取用户列表以更新页面显示

## 错误处理

### 1. 用户信息更新失败
- 记录错误日志
- 不继续执行角色更新流程

### 2. 角色删除失败
- 记录错误日志
- 继续尝试删除其他角色

### 3. 角色分配失败
- 首先尝试使用同步接口
- 如果同步接口失败，回退到普通分配接口
- 记录详细的错误信息

## 测试验证

### 测试步骤：

1. **基本用户信息更新**
   - 编辑用户，修改用户名、姓名等信息
   - 验证 POST 接口调用成功
   - 验证用户信息更新正确

2. **角色更新测试**
   - 编辑用户，修改角色
   - 验证角色删除和分配接口调用
   - 验证角色更新成功

3. **错误处理测试**
   - 模拟网络错误
   - 验证错误处理和回退机制

### 预期结果：

- ✅ 用户基本信息通过 POST 接口更新成功
- ✅ 角色变化时正确调用删除和分配接口
- ✅ 页面数据自动刷新显示最新信息
- ✅ 错误情况下有适当的处理和提示

## 注意事项

1. **接口兼容性**: 确保后端支持 POST 接口更新用户信息
2. **角色同步**: 确保角色删除和分配接口正常工作
3. **错误处理**: 提供完善的错误处理和用户提示
4. **数据一致性**: 确保用户信息和角色信息的一致性

## 相关文件

- `src/api/services.ts` - API 接口定义
- `src/composables/useApi.ts` - 组合式函数
- `src/views/UserManage.vue` - 用户管理页面
- `src/utils/userRoleManager.ts` - 用户角色管理工具

## 总结

通过以上更新，用户管理功能现在支持：
1. 使用 POST 接口更新用户信息
2. 在修改角色时自动同步更新角色关联
3. 完善的错误处理和回退机制
4. 自动刷新页面数据

确保了用户信息更新的准确性和角色关联的同步性。 