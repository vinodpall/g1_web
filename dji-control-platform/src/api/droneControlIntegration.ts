// DroneControl.vue 设备状态集成方案

// 在 <script setup lang="ts"> 中添加以下代码

import { useDeviceStatusStore } from '@/stores/deviceStatus'

// 设备状态管理
const deviceStatusStore = useDeviceStatusStore()

// 当前无人机状态
const currentDroneStatus = computed(() => {
  const status = deviceStatusStore.formattedDroneStatus
  if (!status) return null
  
  return {
    // 电池信息
    battery: {
      voltage: status.battery.voltage,
      current: status.battery.current,
      temperature: status.battery.temperature,
      percent: status.battery.percent,
      status: getBatteryStatusText(status.battery.percent)
    },
    
    // 飞行信息
    flight: {
      speed: status.flight.speed,
      linearSpeed: status.flight.speed,
      angularSpeed: '0.00m/s', // 需要从API获取角速度数据
      altitude: status.altitude,
      gps: status.flight.gpsCount
    },
    
    // 环境信息
    environment: {
      temperature: status.environment.temperature,
      humidity: status.environment.humidity,
      windDirection: status.environment.windDirection,
      windSpeed: status.environment.windSpeed,
      precipitation: '0mm' // 需要从API获取降水数据
    },
    
    // 位置信息
    position: {
      longitude: status.longitude,
      latitude: status.latitude,
      altitude: status.altitude
    }
  }
})

// 电池状态文字描述
const getBatteryStatusText = (percent: string): string => {
  const value = parseInt(percent)
  if (value > 80) return '良好'
  if (value > 50) return '正常'
  if (value > 20) return '偏低'
  return '严重'
}

// 遥控调试状态管理
const remoteControlStatus = ref({
  power: {
    status: '关机',
    description: '飞行器电源',
    action: '开机'
  },
  charging: {
    status: '未充电',
    description: '飞行器充电',
    action: '充电'
  },
  enhancement: {
    status: '已开启',
    description: '增强图传',
    action: '关闭'
  }
})

// 更新遥控调试状态
const updateRemoteControlStatus = () => {
  const status = currentDroneStatus.value
  if (!status) return
  
  // 根据设备状态更新遥控调试状态
  // 这里需要根据实际API返回的数据结构进行调整
}

// 监听设备状态变化
watch(() => deviceStatusStore.formattedDroneStatus, (newStatus) => {
  if (newStatus) {
    updateRemoteControlStatus()
  }
}, { immediate: true })

// 任务信息状态（这部分数据可能需要额外的任务管理API）
const taskStatus = ref({
  progress: 65, // 任务进度百分比
  routeName: '巡检路线001', // 当前执行路线
  todayTotal: 8, // 今日任务总数
  unexecuted: 3, // 未执行
  executed: 8, // 已执行
  normal: 6, // 正常
  abnormal: 2 // 异常
})

// 模板中使用的数据绑定示例：

/*
<!-- 电池信息更新 -->
<div class="battery-detail-list">
  <div>电压：{{ currentDroneStatus?.battery.voltage || '50V' }}</div>
  <div>电流：{{ currentDroneStatus?.battery.current || '-3A' }}</div>
  <div>状态：{{ currentDroneStatus?.battery.status || '暂无' }}</div>
</div>

<!-- 飞行信息更新 -->
<span>飞行速度：线速度：{{ currentDroneStatus?.flight.linearSpeed || '0.00m/s' }}</span>
<span>，角速度：{{ currentDroneStatus?.flight.angularSpeed || '0.00m/s' }}</span>

<!-- 环境信息更新 -->
<span>，风向：{{ currentDroneStatus?.environment.windDirection || '东南风' }}</span>
<span>，降水：{{ currentDroneStatus?.environment.precipitation || '0mm' }}</span>
<span>，温度：{{ currentDroneStatus?.environment.temperature || '35℃' }}</span>
<span>，湿度：{{ currentDroneStatus?.environment.humidity || '52%' }}</span>

<!-- 任务进度更新 -->
<div class="task-progress-title">
  <span>任务进度</span>
  <span>{{ taskStatus.progress }}%</span>
</div>
<div class="el-slider__bar" :style="{ width: taskStatus.progress + '%', left: '0%' }"></div>
<div class="route-name">{{ taskStatus.routeName }}</div>

<!-- 任务统计更新 -->
<div class="stat-value">{{ taskStatus.todayTotal }}</div>
<div class="stat-value">{{ taskStatus.unexecuted }}/{{ taskStatus.executed }}</div>
<div class="stat-value">{{ taskStatus.normal }}/{{ taskStatus.abnormal }}</div>

<!-- 遥控调试状态更新 -->
<div class="remote-card-title">{{ remoteControlStatus.power.status }}</div>
<div class="remote-card-sub">{{ remoteControlStatus.power.description }}</div>
<button class="remote-card-btn" :disabled="!remoteEnabled">{{ remoteControlStatus.power.action }}</button>
*/