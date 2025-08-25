# 认证问题修复说明

## 问题描述

当点击任务完成弹窗中的"查看详情"按钮时，系统跳转到了登录页面，而不是预期的任务日志页面。

## 问题原因分析

### 1. 用户Store初始化问题

**问题**: `useUserStore` 只从localStorage读取了token，但没有读取user信息。

**修复前**:
```typescript
state: () => ({
  user: null as User | null,
  token: localStorage.getItem('token') || ''
})
```

**修复后**:
```typescript
state: () => {
  // 从localStorage恢复用户信息
  let user = null
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      user = JSON.parse(userStr)
    }
  } catch (error) {
    console.error('解析用户信息失败:', error)
  }
  
  return {
    user: user as User | null,
    token: localStorage.getItem('token') || ''
  }
}
```

### 2. 用户信息持久化问题

**问题**: `setUser` 方法没有将用户信息保存到localStorage。

**修复前**:
```typescript
setUser(user: User) {
  this.user = user
}
```

**修复后**:
```typescript
setUser(user: User) {
  this.user = user
  localStorage.setItem('user', JSON.stringify(user))
}
```

### 3. 路由跳转方式问题

**问题**: 在Pinia store中直接使用`useRouter()`可能导致路由实例获取失败。

**修复前**:
```typescript
const goToMissionLogs = () => {
  try {
    const router = useRouter()
    router.push(`/dashboard/mission-logs?job_id=${jobId}`)
  } catch (error) {
    window.location.href = `/dashboard/mission-logs?job_id=${jobId}`
  }
}
```

**修复后**:
```typescript
const goToMissionLogs = () => {
  closeTaskCompletionDialog()
  // 使用延迟跳转，确保弹窗完全关闭后再跳转
  const jobId = taskCompletionData.value?.jobId
  setTimeout(() => {
    if (jobId) {
      window.location.href = `/#/dashboard/mission-logs?job_id=${jobId}`
    } else {
      window.location.href = '/#/dashboard/mission-logs'
    }
  }, 100)
}
```

## 路由守卫逻辑

路由守卫会检查以下条件：

1. **Token存在性**: `localStorage.getItem('token')`
2. **用户信息存在性**: `localStorage.getItem('user')`
3. **用户数据有效性**: 包含`workspace_id`字段

如果任一条件不满足，就会跳转到登录页面。

## 修复效果

### 修复前的问题
- 用户store初始化时user为null
- 路由守卫检测到user信息缺失
- 自动跳转到登录页面

### 修复后的效果
- 用户store正确从localStorage恢复用户信息
- 路由守卫检测通过
- 正常跳转到任务日志页面

## 调试信息

为了便于调试，添加了以下日志：

### 路由守卫日志
```javascript
console.log('路由跳转:', to.path)
console.log('localStorage token:', localStorage.getItem('token') ? '存在' : '不存在')
console.log('localStorage user:', localStorage.getItem('user') ? '存在' : '不存在')
```

### 弹窗组件日志
```javascript
console.log('点击查看详情按钮')
console.log('当前认证状态:')
console.log('- token:', localStorage.getItem('token') ? '存在' : '不存在')
console.log('- user:', localStorage.getItem('user') ? '存在' : '不存在')
```

## 测试步骤

1. **登录系统**: 确保正常登录并获取token和user信息
2. **触发任务完成**: 等待任务执行完成或失败
3. **点击查看详情**: 在弹窗中点击"查看详情"按钮
4. **验证跳转**: 应该正常跳转到任务日志页面，并显示对应任务的数据

## 注意事项

1. **localStorage清理**: 确保logout时正确清理所有认证信息
2. **错误处理**: 添加了用户信息解析的错误处理
3. **延迟跳转**: 使用setTimeout确保弹窗完全关闭后再跳转
4. **Hash路由**: 使用`/#/`前缀确保在hash路由模式下正常工作

## 相关文件

- `src/stores/user.ts` - 用户状态管理
- `src/stores/taskProgress.ts` - 任务进度管理
- `src/router/index.ts` - 路由配置和守卫
- `src/components/TaskCompletionDialog.vue` - 任务完成弹窗
- `src/App.vue` - 应用入口
