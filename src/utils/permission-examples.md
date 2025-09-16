# 权限验证使用指南

## 1. 权限验证组件

### 权限拒绝提示组件
当用户没有相应权限时，会显示权限不足的提示弹窗。

```vue
<template>
  <!-- 权限拒绝提示 -->
  <PermissionDenied 
    :show="showPermissionDenied"
    :required-permission="requiredPermission"
    @close="closePermissionDenied"
    @contact-admin="contactAdmin"
  />
</template>

<script setup>
import { usePermission } from '../composables/usePermission'
import PermissionDenied from '../components/PermissionDenied.vue'

const { 
  showPermissionDenied, 
  requiredPermission, 
  closePermissionDenied, 
  contactAdmin 
} = usePermission()
</script>
```

## 2. 权限验证组合式函数

### 基本权限检查
```javascript
import { usePermission } from '../composables/usePermission'

const { checkPermission, withPermission } = usePermission()

// 直接检查权限
if (checkPermission('user_manage:add')) {
  // 执行添加用户操作
}

// 使用权限装饰器
const handleAddUser = withPermission('user_manage:add', () => {
  // 添加用户逻辑
})
```

### 多个权限检查
```javascript
const { checkAnyPermission, checkAllPermissions } = usePermission()

// 检查任一权限满足
if (checkAnyPermission(['user_manage:add', 'user_manage:edit'])) {
  // 有添加或编辑权限
}

// 检查全部权限满足
if (checkAllPermissions(['user_manage:view', 'user_manage:add'])) {
  // 同时有查看和添加权限
}
```

## 3. 权限指令

### v-permission 指令（任一权限满足）
```vue
<template>
  <!-- 单个权限 -->
  <button v-permission="'user_manage:add'">添加用户</button>
  
  <!-- 多个权限（任一满足） -->
  <button v-permission="['user_manage:add', 'user_manage:edit']">操作按钮</button>
</template>
```

### v-permission-all 指令（全部权限满足）
```vue
<template>
  <!-- 多个权限（全部满足） -->
  <button v-permission-all="['user_manage:view', 'user_manage:add']">高级操作</button>
</template>
```

## 4. 路由权限验证

路由会自动检查页面访问权限，权限不足时会跳转到首页。

```javascript
// 路由配置示例
{
  path: 'users',
  name: 'UserManage',
  component: () => import('../views/UserManage.vue'),
  meta: { 
    requiresAuth: true,
    permission: 'user_manage:view'  // 需要查看用户管理权限
  }
}
```

## 5. 实际使用示例

### 按钮权限验证
```vue
<template>
  <div>
    <!-- 使用指令隐藏无权限的按钮 -->
    <button v-permission="'user_manage:add'" @click="addUser">添加用户</button>
    
    <!-- 使用权限装饰器 -->
    <button @click="handleDeleteUser">删除用户</button>
  </div>
</template>

<script setup>
import { usePermission } from '../composables/usePermission'

const { withPermission } = usePermission()

const addUser = () => {
  console.log('添加用户')
}

const deleteUser = () => {
  console.log('删除用户')
}

// 使用权限装饰器包装函数
const handleDeleteUser = withPermission('user_manage:delete', deleteUser)
</script>
```

### 页面元素权限控制
```vue
<template>
  <div>
    <!-- 整个区块的权限控制 -->
    <div v-permission="'user_manage:edit'">
      <h3>用户编辑区域</h3>
      <button @click="editUser">编辑用户</button>
    </div>
    
    <!-- 单个按钮的权限控制 -->
    <button 
      v-permission="'user_manage:delete'"
      @click="deleteUser"
      class="danger-btn"
    >
      删除用户
    </button>
  </div>
</template>
```

## 6. 权限配置

### 权限键值规范
权限键值采用 `module:action` 格式：
- `home:view` - 查看首页
- `user_manage:add` - 添加用户
- `drone_control:start_pause` - 开始/暂停任务

### 权限分类
- **查看权限**: `module:view`
- **操作权限**: `module:action`
- **管理权限**: `module:manage`

## 7. 权限提示效果

当用户没有相应权限时：

1. **按钮点击**: 显示权限不足弹窗
2. **页面访问**: 自动跳转到首页
3. **元素显示**: 无权限的元素会被隐藏
4. **控制台警告**: 在控制台输出权限不足信息

## 8. 权限管理

### 设置用户权限
```javascript
import { usePermissionStore } from '../stores/permission'

const permissionStore = usePermissionStore()

// 设置用户权限
permissionStore.setUserPermissions([
  'home:view',
  'user_manage:view',
  'user_manage:add'
])

// 设置用户角色
permissionStore.setCurrentRole('管理员')
```

### 清除权限
```javascript
// 用户登出时清除权限
permissionStore.clearPermissions()
``` 