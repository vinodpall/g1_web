# 任务进度轮询错误修复说明

## 问题描述

在任务进度轮询过程中出现以下错误：
```
taskProgress.ts:168 轮询任务进度失败: TypeError: Cannot read properties of null (reading 'job_id')
    at pollTaskProgress (taskProgress.ts:157:26)
```

## 问题原因分析

### 1. API响应处理不当

**问题**: `fetchWaylineProgress` 函数在API调用失败时会抛出异常，但调用方没有正确处理 `null` 返回值。

**错误代码**:
```typescript
const progressData = await fetchWaylineProgress(workspaceId, dockSn)
// progressData 可能为 null，但直接访问 progressData.job_id
if (progressData.job_id) {
  // 这里会抛出 TypeError
}
```

### 2. 异常处理策略不一致

**问题**: API函数在出错时抛出异常，但轮询逻辑需要更优雅的错误处理。

## 修复方案

### 1. 修改API函数返回策略

**修复前**:
```typescript
const fetchWaylineProgress = async (workspaceId: string, dockSn: string) => {
  try {
    const response = await waylineApi.getWaylineProgress(workspaceId, dockSn)
    return response.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取航线任务进度失败'
    throw err  // 抛出异常
  }
}
```

**修复后**:
```typescript
const fetchWaylineProgress = async (workspaceId: string, dockSn: string) => {
  try {
    const response = await waylineApi.getWaylineProgress(workspaceId, dockSn)
    return response.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取航线任务进度失败'
    return null  // 返回null而不是抛出异常
  }
}
```

### 2. 增强轮询逻辑的空值检查

**修复前**:
```typescript
const progressData = await fetchWaylineProgress(workspaceId, dockSn)
waylineProgress.value = progressData

if (progressData.job_id) {
  // 直接访问，可能出错
}
```

**修复后**:
```typescript
const progressData = await fetchWaylineProgress(workspaceId, dockSn)
console.log('获取到的进度数据:', progressData)

// 检查progressData是否有效
if (!progressData) {
  console.log('进度数据为空，设置默认值')
  waylineProgress.value = null
  waylineJobDetail.value = null
  return
}

waylineProgress.value = progressData

if (progressData.job_id) {
  // 安全访问
}
```

### 3. 添加详细的调试日志

**新增日志**:
```typescript
console.log('轮询任务进度:', { workspaceId, dockSn })
console.log('获取到的进度数据:', progressData)
console.log('获取任务详情:', progressData.job_id)
console.log('无任务或任务数据为空')
console.log('进度数据为空，设置默认值')
```

## 修复效果

### 修复前的问题
- API调用失败时抛出异常
- 轮询逻辑崩溃，无法继续
- 错误信息不明确，难以调试

### 修复后的效果
- API调用失败时返回 `null`
- 轮询逻辑继续运行，不会崩溃
- 详细的调试日志便于问题排查
- 优雅的错误处理，用户体验更好

## 相关文件修改

### 1. `src/composables/useApi.ts`
- 修改 `fetchWaylineProgress` 函数，出错时返回 `null`
- 修改 `fetchWaylineJobDetail` 函数，出错时返回 `null`

### 2. `src/stores/taskProgress.ts`
- 增强空值检查逻辑
- 添加详细的调试日志
- 改进错误处理流程

## 测试场景

### 1. 正常情况
- 有任务正在执行时，轮询正常工作
- 任务完成后，轮询继续但不会出错

### 2. 异常情况
- 网络连接失败时，轮询不会崩溃
- API返回错误时，轮询继续运行
- 设备离线时，轮询优雅处理

### 3. 边界情况
- 无任务时，轮询正常处理
- 任务数据不完整时，不会出错

## 注意事项

1. **错误处理**: API函数现在返回 `null` 而不是抛出异常，调用方需要检查返回值
2. **日志监控**: 添加了详细的调试日志，便于监控和排查问题
3. **性能考虑**: 轮询失败时不会停止，确保系统稳定性
4. **用户体验**: 错误不会影响用户界面，系统继续正常运行

## 后续优化建议

1. **重试机制**: 可以考虑添加API调用的重试机制
2. **错误统计**: 可以统计API调用失败次数，用于监控系统健康状态
3. **降级策略**: 可以考虑在API持续失败时降低轮询频率
