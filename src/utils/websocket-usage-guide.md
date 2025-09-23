# WebSocket 数据解析使用指南

## 概述

已为你的项目完成了完整的 WebSocket 数据解析功能，支持你提供的所有数据格式，包括：

- 机器人位姿数据 (`robot:{sn}:pose`)
- 设备/任务状态 (`robot:{sn}:cmd_status`)
- 当前地图信息 (`robot:{sn}:current_map`)
- 任务运行生命周期 (`tours:run:{run_id}` 和 `tours:robot:{sn}`)

## 核心文件

### 1. 类型定义 (`src/types/websocket.ts`)
- 定义了所有 WebSocket 数据结构的 TypeScript 类型
- 包含频道类型、数据验证接口等

### 2. 数据解析工具 (`src/utils/websocketParser.ts`)
- 频道名称解析函数
- 数据验证函数
- 格式化工具函数（角度转换、时间戳格式化等）

### 3. 数据存储 (`src/stores/websocketData.ts`)
- 使用 Pinia 的响应式数据存储
- 自动管理实时数据
- 提供订阅和查询功能

### 4. WebSocket 客户端 (`src/utils/simpleWebSocket.ts`)
- 增强的 WebSocket 客户端
- 支持新的数据格式和配置
- 消息处理器管理

### 5. 组合式函数 (`src/composables/useWebSocketData.ts`)
- 整合连接和数据管理
- 提供便捷的 API

## 快速开始

### 基础用法

```vue
<template>
  <div>
    <!-- 连接状态 -->
    <div>状态: {{ isConnected ? '已连接' : '未连接' }}</div>
    
    <!-- 机器人数据 -->
    <div v-for="sn in robotSNs" :key="sn">
      <h3>{{ sn }}</h3>
      <div v-if="getRobotPose(sn)">
        位置: {{ getRobotPose(sn).x }}, {{ getRobotPose(sn).y }}
      </div>
      <div v-if="getRobotSlamProgress(sn) !== undefined">
        建图进度: {{ getRobotSlamProgress(sn) }}%
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWebSocketData } from '@/composables/useWebSocketData'

// 使用默认配置（广播模式，订阅所有数据类型）
const {
  isConnected,
  robotSNs,
  getRobotPose,
  getRobotSlamProgress
} = useWebSocketData()
</script>
```

### 配置特定机器人

```js
// 订阅特定机器人的数据
const { ... } = useWebSocketData({
  sn: 'SN001',  // 指定机器人序列号
  kinds: ['pose', 'cmd_status']  // 只订阅位姿和状态
})
```

### 自定义频道订阅

```js
// 使用自定义频道
const { ... } = useWebSocketData({
  channels: [
    'robot:SN001:pose',
    'robot:SN002:cmd_status',
    'tours:run:123'
  ]
})
```

## 主要功能

### 1. 机器人数据查询

```js
const { getRobotPose, getRobotCmdStatus, getRobotCurrentMap } = useWebSocketData()

// 获取位姿
const pose = getRobotPose('SN001')
if (pose) {
  console.log(`位置: ${pose.x}, ${pose.y}, 角度: ${pose.theta}`)
}

// 获取建图进度
const progress = getRobotSlamProgress('SN001')
console.log(`建图进度: ${progress}%`)

// 获取自动收尾状态
const autoStatus = getRobotSlamAutoStatus('SN001')
if (autoStatus) {
  console.log(`当前阶段: ${autoStatus.stage}`)
}
```

### 2. 在线状态检查

```js
const { isRobotOnline, isRobotDataExpired } = useWebSocketData()

// 检查机器人是否在线（30秒内有数据）
const online = isRobotOnline('SN001')

// 检查特定数据是否过期
const poseExpired = isRobotDataExpired('SN001', 'pose', 60) // 60秒
```

### 3. 任务监控

```js
const { getTourRunEvents, getRobotTourEvents } = useWebSocketData()

// 获取任务运行事件
const runEvents = getTourRunEvents(123)
runEvents.forEach(event => {
  if (event.event === 'point') {
    console.log(`点位 ${event.point_id}: ${event.status}`)
  }
})

// 获取机器人任务事件
const robotTourEvents = getRobotTourEvents('SN001')
```

### 4. 数据订阅

```js
const { subscribe, unsubscribe } = useWebSocketData()

// 订阅特定频道
const subscriptionId = subscribe(
  ['robot:SN001:pose'],
  (data, channel) => {
    console.log(`收到 ${channel} 数据:`, data)
  }
)

// 取消订阅
unsubscribe(subscriptionId)
```

### 5. 便捷订阅方法

```js
const { subscribeToRobot, subscribeToTourRun } = useWebSocketData()

// 订阅机器人所有数据
const robotSubId = subscribeToRobot('SN001', (data, channel) => {
  console.log('机器人数据更新:', data)
})

// 订阅任务运行
const tourSubId = subscribeToTourRun(123, (data, channel) => {
  console.log('任务事件:', data)
})
```

## 数据格式说明

### 机器人位姿 (`robot:{sn}:pose`)
```json
{
  "x": 1.23,        // 米
  "y": 4.56,        // 米
  "theta": 0.78,    // 弧度
  "ts": 1727000000.12
}
```

### 设备状态 (`robot:{sn}:cmd_status`)
```json
{
  "slam_process_p": 85,     // 建图进度 0-100
  "slam_process_ts": 1727000010.12,
  "slam_auto": {            // 自动收尾状态
    "sn": "SN001",
    "map_name": "hall1",
    "stage": "change_pcd",  // closing_slam | change_pcd | done | error
    "ok": null              // null | true | false
  },
  "ts": 1727000010.12
}
```

### 任务事件 (`tours:run:{run_id}`)
```json
// 开始事件
{ "event": "started", "run_id": 1, "robot_sn": "SN001" }

// 点位事件
{ "event": "point", "status": "done", "point_id": 21, "zone_id": 10 }

// 完成事件
{ "event": "finished", "status": "success", "run_id": 1 }
```

## 工具函数

```js
import { 
  formatPosition, 
  formatTimestamp, 
  radiansToDegrees,
  getSlamProgressText,
  getSlamAutoStageText,
  getPointStatusText 
} from '@/utils/websocketParser'

// 格式化位置（保留2位小数）
const posText = formatPosition(1.234567) // "1.23"

// 格式化时间戳
const timeText = formatTimestamp(1727000000) // "2024-09-22 17:46:40"

// 弧度转角度
const degrees = radiansToDegrees(1.57) // 约 90

// 获取建图进度描述
const progressText = getSlamProgressText(85) // "建图中 85%"

// 获取自动收尾阶段描述
const stageText = getSlamAutoStageText('change_pcd') // "正在转换栅格图"
```

## 示例页面

查看 `src/examples/websocket-usage.vue` 获取完整的使用示例，包括：
- 连接状态管理
- 实时数据显示
- 建图进度可视化
- 任务状态监控
- 配置管理

## 注意事项

1. **自动连接**: 默认会在组件挂载时自动连接 WebSocket
2. **数据清理**: 每5分钟自动清理过期数据
3. **错误处理**: 包含完整的错误处理和重连机制
4. **性能优化**: 使用响应式数据和计算属性优化性能
5. **类型安全**: 完整的 TypeScript 类型定义确保类型安全

## 扩展

如果需要添加新的数据类型或频道，只需要：
1. 在 `src/types/websocket.ts` 中添加类型定义
2. 在 `src/utils/websocketParser.ts` 中添加验证函数
3. 在 `src/stores/websocketData.ts` 中添加数据处理逻辑