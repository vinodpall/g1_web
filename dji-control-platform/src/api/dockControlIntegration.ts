// DockControl.vue 机场状态集成方案

// 在 <script setup lang="ts"> 中添加以下代码

import { useDeviceStatusStore } from '@/stores/deviceStatus'

// 设备状态管理
const deviceStatusStore = useDeviceStatusStore()

// 当前机场状态
const currentDockStatus = computed(() => {
  const status = deviceStatusStore.formattedDockStatus
  if (!status) return null
  
  return {
    // 基础状态
    isOnline: status.isOnline,
    statusText: status.isOnline ? '在线' : '离线',
    
    // 系统状态
    system: {
      working: status.isOnline,
      coverClosed: status.system.coverClosed,
      temperature: status.system.temperature,
      humidity: status.system.humidity
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
      latitude: status.latitude
    }
  }
})

// 机场控制状态管理
const dockControlStatus = ref({
  system: {
    status: '工作中',
    description: '机场系统',
    action: '停止',
    isWorking: true
  },
  cover: {
    status: '已关闭',
    description: '舱盖状态',
    action: '开启',
    isClosed: true
  },
  airCondition: {
    status: '制冷中',
    description: '空调',
    action: '停止',
    isRunning: true
  },
  silentMode: {
    status: '未开启',
    description: '静音模式',
    action: '开启',
    isEnabled: false
  }
})

// 更新机场控制状态
const updateDockControlStatus = () => {
  const status = currentDockStatus.value
  if (!status) return
  
  // 根据设备状态更新控制状态
  dockControlStatus.value.system.isWorking = status.system.working
  dockControlStatus.value.system.status = status.system.working ? '工作中' : '已停止'
  dockControlStatus.value.system.action = status.system.working ? '停止' : '启动'
  
  dockControlStatus.value.cover.isClosed = status.system.coverClosed
  dockControlStatus.value.cover.status = status.system.coverClosed ? '已关闭' : '已开启'
  dockControlStatus.value.cover.action = status.system.coverClosed ? '开启' : '关闭'
  
  // 空调状态需要根据温度等条件判断
  // 这里可以添加更复杂的逻辑
}

// 监听设备状态变化
watch(() => deviceStatusStore.formattedDockStatus, (newStatus) => {
  if (newStatus) {
    updateDockControlStatus()
  }
}, { immediate: true })

// 机场信息表格数据（dockInfoItems的动态更新）
const dockInfoItems = computed(() => {
  const status = currentDockStatus.value
  if (!status) {
    // 返回默认静态数据
    return [
      { label: '机场状态', value: '离线' },
      { label: '经度', value: '116.38°E' },
      { label: '纬度', value: '39.90°N' },
      { label: '温度', value: '25°C' },
      { label: '湿度', value: '65%' },
      { label: '风向', value: '东南风' },
      { label: '风速', value: '1.2m/s' },
      { label: '舱盖', value: '关闭' },
      // 更多静态数据...
    ]
  }
  
  return [
    { label: '机场状态', value: status.statusText },
    { label: '经度', value: status.position.longitude },
    { label: '纬度', value: status.position.latitude },
    { label: '温度', value: status.environment.temperature },
    { label: '湿度', value: status.environment.humidity },
    { label: '风向', value: status.environment.windDirection },
    { label: '风速', value: status.environment.windSpeed },
    { label: '舱盖', value: status.system.coverClosed ? '关闭' : '开启' },
    { label: '系统', value: status.system.working ? '运行中' : '停止' },
    { label: '网络', value: '正常' }, // 需要额外API
    { label: '电源', value: '正常' }, // 需要额外API
    { label: '存储', value: '正常' }, // 需要额外API
    // 更多动态数据...
  ]
})

// 模板中使用的数据绑定示例：

/*
<!-- 机场状态更新 -->
<div class="zhuangtai4" :class="{ online: currentDockStatus?.isOnline }">
  <div>{{ currentDockStatus?.statusText || '离线' }}</div>
</div>

<!-- 环境信息更新 -->
<span>风向：{{ currentDockStatus?.environment.windDirection || '东南风' }}</span>
<span>，风速：{{ currentDockStatus?.environment.windSpeed || '1.2m/s' }}</span>
<span>，降水：{{ currentDockStatus?.environment.precipitation || '0mm' }}</span>
<span>，温度：{{ currentDockStatus?.environment.temperature || '35℃' }}</span>
<span>，湿度：{{ currentDockStatus?.environment.humidity || '52%' }}</span>

<!-- 机场控制状态更新 -->
<div class="dock-card-title">{{ dockControlStatus.system.status }}</div>
<div class="dock-card-sub">{{ dockControlStatus.system.description }}</div>
<button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">
  {{ dockControlStatus.system.action }}
</button>

<div class="dock-card-title">{{ dockControlStatus.cover.status }}</div>
<div class="dock-card-sub">{{ dockControlStatus.cover.description }}</div>
<button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">
  {{ dockControlStatus.cover.action }}
</button>

<div class="dock-card-title">{{ dockControlStatus.airCondition.status }}</div>
<div class="dock-card-sub">{{ dockControlStatus.airCondition.description }}</div>
<button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">
  {{ dockControlStatus.airCondition.action }}
</button>

<div class="dock-card-title">{{ dockControlStatus.silentMode.status }}</div>
<div class="dock-card-sub">{{ dockControlStatus.silentMode.description }}</div>
<button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">
  {{ dockControlStatus.silentMode.action }}
</button>

<!-- 机场信息表格动态更新 -->
<DockInfoRow :items="dockInfoItems.slice(0, 8)" />
<DockInfoRow :items="dockInfoItems.slice(8, 16)" />
*/