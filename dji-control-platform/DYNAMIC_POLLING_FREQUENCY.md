# 动态轮询频率实现说明

## 功能概述

实现了基于任务状态的动态轮询频率机制：
- **有任务时**: 2秒轮询一次（高频，及时获取任务进度）
- **无任务时**: 8秒轮询一次（低频，减少服务器压力）

## 实现原理

### 1. 轮询频率配置

```typescript
// 轮询频率配置
const POLLING_INTERVAL_ACTIVE = 2000  // 有任务时：2秒
const POLLING_INTERVAL_IDLE = 8000    // 无任务时：8秒
```

### 2. 动态轮询逻辑

```typescript
const startDynamicPolling = () => {
  // 立即执行一次
  pollTaskProgress()
  
  // 根据任务状态动态调整轮询频率
  const adjustPollingInterval = () => {
    // 清除当前定时器
    if (pollingTimer.value) {
      clearInterval(pollingTimer.value)
    }
    
    // 根据是否有任务来决定轮询频率
    const hasActiveTask = waylineProgress.value && waylineProgress.value.job_id
    const interval = hasActiveTask ? POLLING_INTERVAL_ACTIVE : POLLING_INTERVAL_IDLE
    
    // 设置新的定时器
    pollingTimer.value = setInterval(() => {
      pollTaskProgress()
      // 每次轮询后重新调整频率
      adjustPollingInterval()
    }, interval) as unknown as number
  }
  
  // 启动动态轮询
  adjustPollingInterval()
}
```

## 工作流程

### 1. 启动阶段
1. 应用启动时调用 `startPolling()`
2. 立即执行一次任务进度查询
3. 根据当前任务状态设置初始轮询频率

### 2. 运行阶段
1. 每次轮询完成后，检查当前任务状态
2. 根据任务状态动态调整下次轮询间隔
3. 重新设置定时器

### 3. 状态判断
- **有任务**: `waylineProgress.value && waylineProgress.value.job_id` 为真
- **无任务**: 任务进度为空或没有job_id

## 性能优化

### 1. 资源节约
- 无任务时降低轮询频率，减少API调用次数
- 减少服务器压力和网络带宽消耗

### 2. 响应性保证
- 有任务时保持高频轮询，确保任务进度及时更新
- 用户界面能够实时反映任务状态变化

### 3. 智能切换
- 任务状态变化时自动调整轮询频率
- 无需手动干预，系统自动优化

## 配置参数

| 参数 | 值 | 说明 |
|------|----|----|
| `POLLING_INTERVAL_ACTIVE` | 2000ms | 有任务时的轮询间隔 |
| `POLLING_INTERVAL_IDLE` | 8000ms | 无任务时的轮询间隔 |

## 使用场景

### 1. 任务执行期间
- 轮询频率：2秒
- 目的：及时获取任务进度，实时更新界面

### 2. 任务空闲期间
- 轮询频率：8秒
- 目的：保持连接状态，减少资源消耗

### 3. 任务状态切换
- 自动检测任务开始/结束
- 动态调整轮询频率

## 错误处理

### 1. 网络异常
- API调用失败时不影响轮询机制
- 继续按当前频率进行下次轮询

### 2. 数据异常
- 任务数据为空时正确识别为无任务状态
- 自动切换到低频轮询模式

## 监控建议

### 1. 性能监控
- 监控API调用频率
- 观察服务器响应时间

### 2. 用户体验监控
- 任务进度更新及时性
- 界面响应速度

### 3. 资源使用监控
- 网络带宽使用情况
- 客户端资源消耗

## 扩展性

### 1. 可配置参数
- 轮询频率可以根据实际需求调整
- 支持更复杂的轮询策略

### 2. 多任务支持
- 可以扩展支持多个任务同时监控
- 根据任务优先级调整轮询频率

### 3. 智能预测
- 可以根据历史数据预测任务完成时间
- 动态调整轮询策略
