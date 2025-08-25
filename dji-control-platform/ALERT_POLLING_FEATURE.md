# HMS报警轮询功能实现说明

## 功能概述

在全局轮询中添加了HMS报警日志的轮询功能，当检测到警告级别的HMS报警时，会自动触发全局弹窗提醒用户。系统会智能地只显示最新的一条警告报警，并且30秒内不会重复显示。

## 实现组件

### 1. 报警通知弹窗组件

**文件**: `src/components/AlertNotificationDialog.vue`

**功能**:
- 显示警告级别的HMS报警信息
- 显示设备名称、报警等级、时间等详细信息
- 只有一个"确定"按钮，点击后关闭弹窗
- 智能防重复：30秒内只显示一条报警

**样式特点**:
- 警告图标（黄色三角形）
- 警告文字颜色（#faad14）
- 渐变按钮效果
- 动画进入效果

### 2. 报警通知Store

**文件**: `src/stores/alertNotification.ts`

**功能**:
- 管理HMS报警弹窗的显示状态
- 记录已显示的报警ID，避免重复显示
- 检查报警等级是否为警告级别
- 时间间隔控制：30秒内只显示一条报警

**核心方法**:
- `triggerAlertDialog(alert)`: 触发报警弹窗
- `closeAlertDialog()`: 关闭报警弹窗
- `clearShownAlerts()`: 清除已显示记录

### 3. 全局轮询增强

**文件**: `src/composables/useDevicePolling.ts`

**新增功能**:
- HMS报警轮询（每10秒）
- 页面可见性检测支持
- 自动触发警告级别HMS报警弹窗

## HMS报警等级判断

```typescript
// HmsAlert.level
0: '通知'
1: '提醒'  
2: '警告'  // 触发弹窗
```

## 轮询策略

### 轮询频率
- **报警轮询**: 10秒间隔
- **设备状态轮询**: 2-8秒（动态调整）
- **航线进度轮询**: 3秒（条件轮询）

### 轮询内容
1. **HMS报警**: 获取所有设备的HMS报警日志

### 智能轮询
- 页面不可见时自动暂停轮询
- 页面可见时自动恢复轮询
- 避免重复显示相同报警
- 只处理最新的一条警告报警
- 30秒内不重复显示报警弹窗

## 使用流程

### 1. 应用启动
```typescript
// App.vue
onMounted(() => {
  taskProgressStore.startPolling() // 启动任务进度轮询
  // useDevicePolling会自动启动报警轮询
})
```

### 2. 报警检测
```typescript
// useDevicePolling.ts
const pollHmsAlerts = async () => {
  // 获取所有设备的HMS报警
  const warningAlerts = newAlerts.filter(alert => alert.level === 2)
  
  // 只处理最新的一条警告报警
  if (warningAlerts.length > 0) {
    // 按创建时间排序，获取最新的一条
    const latestWarningAlert = warningAlerts.sort((a, b) => 
      (b.create_time || 0) - (a.create_time || 0)
    )[0]
    
    // 触发报警弹窗（store内部会处理30秒间隔限制）
    alertNotificationStore.triggerAlertDialog(latestWarningAlert)
  }
}
```

### 3. 弹窗显示
```vue
<!-- AlertNotificationDialog.vue -->
<template>
  <div v-if="showAlertDialog" class="alert-notification-dialog-mask">
    <!-- HMS报警信息显示 -->
    <div class="alert-notification-message">
      {{ alertData?.message_zh || '检测到新的HMS报警信息' }}
    </div>
    
    <!-- 确定按钮 -->
    <button @click="confirmAlert">确定</button>
  </div>
</template>
```

## 配置参数

### 轮询间隔
```typescript
const ALERT_POLLING_INTERVAL = 10000 // 10秒
```

### 缓存限制
```typescript
// 限制已显示报警ID的数量，避免内存泄漏
if (shownAlertIds.value.size > 1000) {
  const idsArray = Array.from(shownAlertIds.value)
  shownAlertIds.value = new Set(idsArray.slice(-500))
}
```



## 错误处理

### 网络异常
- HMS报警获取失败时继续获取其他设备
- 不影响其他轮询功能

### 数据异常
- 无效的报警数据会被过滤
- 缺少必要字段的报警不会触发弹窗
- 时间戳异常时显示默认时间

## 性能优化

### 1. 避免重复显示
- 使用Set记录已显示的报警ID
- 基于报警ID和时间戳生成唯一标识
- 定期清理过期记录
- 30秒时间间隔控制，避免频繁弹窗

### 2. 智能轮询
- 页面不可见时暂停轮询
- 并行获取多个设备的HMS报警
- 只处理最新的一条警告报警

### 3. 内存管理
- 限制已显示报警ID的数量
- 定期清理过期记录
- 避免内存泄漏

## 调试信息

轮询过程中会输出以下日志：
```
🚨 报警轮询已启动，间隔: 10000 ms
👁️ 页面不可见，暂停报警轮询
👁️ 页面可见，恢复报警轮询
⏹️ 报警轮询已停止
```

## 测试建议

### 1. 功能测试
- 模拟HMS警告级别报警
- 测试弹窗显示和关闭

### 2. 性能测试
- 大量报警数据时的性能
- 长时间运行的内存使用
- 页面切换时的轮询状态

### 3. 异常测试
- 网络异常时的处理
- 无效数据的过滤
- 重复报警的防重复

## 相关文件

- `src/components/AlertNotificationDialog.vue` - HMS报警弹窗组件
- `src/stores/alertNotification.ts` - HMS报警通知Store
- `src/composables/useDevicePolling.ts` - 全局轮询管理
- `src/App.vue` - 应用入口，注册全局组件
- `src/types/index.ts` - HMS报警数据类型定义

## 扩展性

### 1. 支持更多HMS报警类型
- 可以轻松添加新的HMS报警源
- 支持自定义HMS报警等级判断
- 支持不同的HMS报警格式

### 2. 弹窗样式定制
- 支持不同报警等级的不同样式
- 支持自定义按钮和操作
- 支持多语言显示

### 3. 通知方式扩展
- 可以添加声音提醒
- 可以添加桌面通知
- 可以添加邮件/短信通知
