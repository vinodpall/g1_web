# 任务失败弹窗问题排查

## 问题描述

任务失败时没有显示弹窗通知。

## 可能的原因

### 1. 状态变化检测逻辑问题

**原始逻辑**:
```typescript
// 只检测从running状态变为completed或failed
if (previousStatus === 'running' && (currentStatus === 'completed' || currentStatus === 'failed')) {
  showTaskCompletionDialog.value = true
  handleTaskCompletion(currentJobId, currentStatus)
}
```

**问题**: 如果任务直接失败（没有经过running状态），弹窗不会显示。

**修复后**:
```typescript
// 支持更多失败场景
if ((previousStatus === 'running' && (currentStatus === 'completed' || currentStatus === 'failed')) ||
    (currentStatus === 'failed' && previousStatus !== 'failed')) {
  showTaskCompletionDialog.value = true
  handleTaskCompletion(currentJobId, currentStatus)
}
```

### 2. 状态映射问题

检查API返回的状态值是否正确映射：

```typescript
const statusMap: Record<string, string> = {
  'canceled': 'failed',
  'failed': 'failed',
  'in_progress': 'running',
  'ok': 'completed',
  'partially_done': 'completed',
  'paused': 'paused',
  'rejected': 'failed',
  'sent': 'waiting',
  'timeout': 'failed'
}
```

### 3. 轮询频率问题

如果轮询频率太低，可能错过状态变化。

## 调试方法

### 1. 查看控制台日志

添加了详细的状态变化日志：

```typescript
console.log('任务状态变化:', { 
  jobId: currentJobId, 
  previousStatus, 
  currentStatus,
  shouldShowDialog: (previousStatus === 'running' && (currentStatus === 'completed' || currentStatus === 'failed')) ||
                   (currentStatus === 'failed' && previousStatus !== 'failed')
})
```

### 2. 测试弹窗功能

在开发环境中，右上角有"测试弹窗"按钮，可以手动触发弹窗测试功能是否正常。

### 3. 检查弹窗状态

弹窗组件会输出显示状态：

```typescript
console.log('弹窗显示状态:', show, '数据:', taskProgressStore.taskCompletionData)
```

## 排查步骤

### 1. 检查任务状态变化

1. 打开浏览器控制台
2. 触发一个任务失败
3. 查看是否有"任务状态变化"的日志
4. 检查 `shouldShowDialog` 是否为 `true`

### 2. 检查弹窗触发

1. 查看是否有"触发任务完成弹窗"的日志
2. 检查弹窗显示状态日志

### 3. 检查弹窗数据

1. 查看 `taskCompletionData` 是否正确设置
2. 检查任务名称、状态、异常数量等信息

### 4. 测试弹窗功能

1. 点击右上角的"测试弹窗"按钮
2. 确认弹窗能正常显示
3. 测试"查看详情"和"关闭"功能

## 常见问题

### 1. 任务直接失败

**现象**: 任务没有经过running状态就直接失败
**解决**: 已修复状态检测逻辑，支持直接失败的情况

### 2. 状态映射错误

**现象**: API返回的状态值没有正确映射
**解决**: 检查 `statusMap` 是否包含所有可能的状态值

### 3. 轮询错过状态变化

**现象**: 状态变化发生在两次轮询之间
**解决**: 确保轮询频率足够高（有任务时2秒一次）

### 4. 弹窗被其他元素遮挡

**现象**: 弹窗显示但看不到
**解决**: 检查z-index值，确保弹窗在最顶层

## 修复内容

### 1. 状态检测逻辑优化

- 支持任务直接失败的情况
- 添加详细的状态变化日志
- 增加弹窗触发条件

### 2. 调试功能增强

- 添加测试弹窗功能
- 增加详细的控制台日志
- 提供调试面板

### 3. 错误处理改进

- 更好的异常处理
- 状态变化检测的容错性

## 测试建议

### 1. 正常流程测试

1. 启动一个任务
2. 等待任务完成或失败
3. 确认弹窗正常显示

### 2. 异常流程测试

1. 启动一个任务
2. 手动取消或让任务失败
3. 确认弹窗正常显示

### 3. 边界情况测试

1. 快速连续启动多个任务
2. 网络异常情况下的处理
3. 页面刷新后的状态恢复

## 后续优化

### 1. 状态持久化

- 将任务状态保存到localStorage
- 页面刷新后能恢复状态

### 2. 通知机制

- 添加浏览器通知
- 支持声音提醒

### 3. 历史记录

- 保存任务完成历史
- 支持查看历史任务状态
