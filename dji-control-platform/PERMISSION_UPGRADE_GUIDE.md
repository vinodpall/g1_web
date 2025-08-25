# 权限管理系统升级指南

## 概述

本次升级改进了权限管理系统，主要变化是：

1. **不再隐藏无权限的按钮**：按钮保持正常样式，点击时检查权限
2. **点击时显示权限不足弹窗**：提供更好的用户体验
3. **不影响整体样式和逻辑**：保持界面的一致性

## 新的权限指令

### 1. v-permission-click-dialog（推荐使用）

这个指令不会隐藏元素，而是在点击时检查权限并显示弹窗提示。

```vue
<template>
  <!-- 单个权限 -->
  <button v-permission-click-dialog="'home.task.issue'" @click="handleDispatchTask">
    下发任务
  </button>
  
  <!-- 多个权限（任一满足） -->
  <button v-permission-click-dialog="['home.task.issue', 'home.task.edit']" @click="handleTask">
    任务操作
  </button>
</template>
```

### 2. v-permission-click

这个指令也不会隐藏元素，但使用简单的alert提示。

```vue
<template>
  <button v-permission-click="'home.task.issue'" @click="handleDispatchTask">
    下发任务
  </button>
</template>
```

### 3. v-permission（原有功能）

这个指令会隐藏无权限的元素。

```vue
<template>
  <button v-permission="'home.task.issue'" @click="handleDispatchTask">
    下发任务
  </button>
</template>
```

## 使用示例

### 首页按钮权限控制

```vue
<template>
  <div class="button-group">
    <!-- 下发任务 -->
    <span class="span" v-permission-click-dialog="'home.task.issue'" @click="handleDispatchTask">
      下发任务
    </span>
    
    <!-- 取消任务 -->
    <span class="span1" v-permission-click-dialog="'home.task.cancel'" @click="handleCancelTask">
      取消任务
    </span>
  </div>
  
  <div class="control-row">
    <!-- 航线暂停 -->
    <span class="span" v-permission-click-dialog="'home.wayline.pause'" @click="handlePauseRoute">
      航线暂停
    </span>
    
    <!-- 航线恢复 -->
    <span class="span" v-permission-click-dialog="'home.wayline.resume'" @click="handleResumeRoute">
      航线恢复
    </span>
    
    <!-- 一键返航 -->
    <span class="span" v-permission-click-dialog="'home.drone.return'" @click="handleReturnHome">
      一键返航
    </span>
    
    <!-- 取消返航 -->
    <span class="span1" v-permission-click-dialog="'home.drone.cancel_return'" @click="handleCancelReturnHome">
      取消返航
    </span>
  </div>
</template>
```

### 无人机控制页面

```vue
<template>
  <!-- 无人机控制按钮 -->
  <button v-permission-click-dialog="'drone_control.drone.control'" @click="handleDroneControl">
    无人机控制
  </button>
  
  <!-- 云台控制按钮 -->
  <button v-permission-click-dialog="'drone_control.gimbal.control'" @click="handleGimbalControl">
    云台控制
  </button>
  
  <!-- 远程调试按钮 -->
  <button v-permission-click-dialog="'drone_control.remote_debug'" @click="handleRemoteDebug">
    远程调试
  </button>
</template>
```

### 设备管理页面

```vue
<template>
  <!-- 添加设备 -->
  <button v-permission-click-dialog="'device_management.device.create'" @click="handleAddDevice">
    添加设备
  </button>
  
  <!-- 删除设备 -->
  <button v-permission-click-dialog="'device_management.device.delete'" @click="handleDeleteDevice">
    删除设备
  </button>
</template>
```

## 权限键值对照表

### 首页权限
- `home.view` - 首页-页面查看
- `home.task.issue` - 首页-下发任务
- `home.task.cancel` - 首页-取消任务
- `home.wayline.pause` - 首页-航线暂停
- `home.wayline.resume` - 首页-航线恢复
- `home.drone.return` - 首页-一键返航
- `home.drone.cancel_return` - 首页-取消返航
- `home.drone.emergency_stop` - 首页-急停

### 无人机控制权限
- `drone_control.view` - 无人机控制-页面查看
- `drone_control.wayline.pause` - 无人机控制-航线暂停
- `drone_control.wayline.stop` - 无人机控制-航线停止
- `drone_control.remote_debug` - 无人机控制-远程调试
- `drone_control.drone.control` - 无人机控制-无人机控制
- `drone_control.gimbal.control` - 无人机控制-云台控制

### 机场控制权限
- `dock_control.view` - 机场控制-页面查看
- `dock_control.remote_debug` - 机场控制-远程调试

### 航线管理权限
- `wayline_management.view` - 航线管理-页面查看
- `wayline_management.folder.delete` - 航线管理-删除文件夹
- `wayline_management.wayline.delete` - 航线管理-删除航线
- `wayline_management.wayline.create` - 航线管理-新增航线
- `wayline_management.task.issue` - 航线管理-下发任务
- `wayline_management.waypoint.delete` - 航线管理-删除航点

### 任务记录权限
- `task_records.view` - 任务记录-页面查看

### 任务日志权限
- `task_logs.view` - 任务日志-页面查看

### 设备管理权限
- `device_management.view` - 设备管理-页面查看
- `device_management.device.create` - 设备管理-添加设备
- `device_management.device.delete` - 设备管理-删除设备

## 迁移指南

### 从旧版本迁移

1. **移除样式禁用逻辑**：
   ```vue
   <!-- 旧版本 -->
   <button :class="{ 'disabled': !canPerformAction }" :disabled="!canPerformAction" @click="handleAction">
   
   <!-- 新版本 -->
   <button v-permission-click-dialog="'permission.key'" @click="handleAction">
   ```

2. **移除条件渲染**：
   ```vue
   <!-- 旧版本 -->
   <button v-if="hasPermission" @click="handleAction">
   
   <!-- 新版本 -->
   <button v-permission-click-dialog="'permission.key'" @click="handleAction">
   ```

3. **移除权限检查函数**：
   ```vue
   <!-- 旧版本 -->
   <script setup>
   const canPerformAction = computed(() => {
     return permissionStore.hasPermission('permission.key')
   })
   </script>
   
   <!-- 新版本 -->
   <script setup>
   // 不需要额外的权限检查逻辑
   </script>
   ```

## 最佳实践

1. **使用 v-permission-click-dialog**：提供最好的用户体验
2. **保持按钮样式一致**：不要因为权限而改变按钮外观
3. **提供清晰的权限提示**：弹窗中显示具体的权限名称
4. **测试不同权限级别**：确保各种权限组合都能正常工作

## 注意事项

1. **权限指令优先级**：v-permission-click-dialog > v-permission-click > v-permission
2. **事件处理**：权限检查失败时，原始点击事件不会执行
3. **弹窗样式**：权限不足弹窗使用全局样式，确保一致性
4. **调试信息**：权限检查失败时会在控制台输出调试信息

## 测试建议

1. **使用admin6账号测试**：验证只有查看权限时的行为
2. **测试各种权限组合**：确保多个权限的检查逻辑正确
3. **测试弹窗显示**：验证权限不足时的提示效果
4. **测试按钮样式**：确保按钮外观不受权限影响
