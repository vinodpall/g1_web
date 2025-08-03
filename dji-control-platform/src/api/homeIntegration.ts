// Home.vue 中添加设备状态数据集成
// 在现有的 <script setup lang="ts"> 部分添加以下代码

import { useDeviceStatusStore } from '@/stores/deviceStatus'

// 添加设备状态管理
const deviceStatusStore = useDeviceStatusStore()

// 响应式状态数据
const droneStatus = computed(() => deviceStatusStore.formattedDroneStatus)
const dockStatus = computed(() => deviceStatusStore.formattedDockStatus)

// 设备状态轮询定时器
let statusPollingTimer: NodeJS.Timeout | null = null

// 启动设备状态监控
const startDeviceStatusMonitoring = () => {
  // 开始轮询设备状态
  statusPollingTimer = deviceStatusStore.startPolling(5000) // 每5秒更新一次
}

// 停止设备状态监控
const stopDeviceStatusMonitoring = () => {
  if (statusPollingTimer) {
    clearInterval(statusPollingTimer)
    statusPollingTimer = null
  }
}

// 组件挂载时启动监控
onMounted(() => {
  // 启动设备状态监控
  startDeviceStatusMonitoring()
  
  // ... 其他现有的onMounted代码保持不变
})

// 组件卸载时清理
onBeforeUnmount(() => {
  // 停止设备状态监控
  stopDeviceStatusMonitoring()
  
  // ... 其他现有的onBeforeUnmount代码保持不变
})

// 格式化显示数据的计算属性
const displayDroneStatus = computed(() => {
  const status = droneStatus.value
  if (!status) {
    return {
      isOnline: false,
      statusText: '离线',
      speed: '0.00m/s',
      runtime: '16天', // 保留原有静态数据作为默认值
      distance: '18.3公里',
      longitude: '116.38°E',
      latitude: '39.90°N',
      altitude: '43m',
      gps: 4,
      battery: {
        voltage: '50V',
        current: '-3A',
        status: '暂无'
      }
    }
  }
  
  return {
    isOnline: status.isOnline,
    statusText: status.isOnline ? '在线' : '离线',
    speed: status.flight.speed,
    runtime: '16天', // 累计运行时间需要额外的API支持
    distance: '18.3公里', // 累计飞行里程需要额外的API支持
    longitude: status.longitude,
    latitude: status.latitude,
    altitude: status.altitude,
    gps: status.flight.gpsCount,
    battery: status.battery
  }
})

const displayDockStatus = computed(() => {
  const status = dockStatus.value
  if (!status) {
    return {
      isOnline: false,
      statusText: '离线',
      networkSpeed: '95KB/s', // 保留原有静态数据
      taskCount: '8次',
      runtime: '15小时',
      longitude: '116.38°E',
      latitude: '39.90°N',
      cover: '关闭',
      temperature: '25°C',
      humidity: '65%'
    }
  }
  
  return {
    isOnline: status.isOnline,
    statusText: status.isOnline ? '在线' : '离线',
    networkSpeed: '95KB/s', // 网络速率需要额外的API支持
    taskCount: '8次', // 任务次数需要额外的API支持
    runtime: '15小时', // 运行时长需要额外的API支持
    longitude: status.longitude,
    latitude: status.latitude,
    cover: status.system.coverClosed ? '关闭' : '开启',
    temperature: status.environment.temperature,
    humidity: status.environment.humidity
  }
})