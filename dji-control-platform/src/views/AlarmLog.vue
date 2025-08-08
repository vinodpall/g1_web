<template>
  <div class="drone-control-main">
    <!-- 侧边栏菜单 -->
    <aside class="sidebar-menu">
      <div class="sidebar-tabs">
        <div
          v-for="tab in sidebarTabs"
          :key="tab.key"
          :class="['sidebar-tab', { active: currentTab === tab.key }]"
          @click="handleTabClick(tab.key)"
        >
          <img :src="tab.icon" :alt="tab.label" />
        </div>
      </div>
    </aside>
    <!-- 主体内容区 -->
    <main class="main-content">
      <div class="main-flex">
        <section class="right-panel">
          <!-- 筛选区 -->
          <div class="mission-top-card card">
            <div class="mission-top-header">
              <img src="@/assets/source_data/bg_data/card_logo.png" style="width:22px;height:22px;margin-right:8px;vertical-align:middle;" alt="logo" />
              <span class="mission-top-title">报警日志</span>
            </div>
            <div class="mission-top-row">
              <div class="filter-item">
                <span class="filter-label">设备选择：</span>
                <div class="custom-select-wrapper">
                  <select v-model="selectedDeviceType" class="mission-select" @change="handleDeviceTypeChange">
                    <option v-for="option in getDeviceTypeOptions()" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                  <span class="custom-select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div class="filter-item">
                <span class="filter-label">报警等级：</span>
                <div class="custom-select-wrapper">
                  <select v-model="filter.level" class="mission-select">
                    <option value="">全部等级</option>
                    <option value="1">普通</option>
                    <option value="2">严重</option>
                  </select>
                  <span class="custom-select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
              </div>
              <button class="mission-btn mission-btn-pause" @click="handleSearch">查询</button>
              <button class="mission-btn mission-btn-reset" @click="handleReset">重置</button>
            </div>
          </div>
          <!-- 列表区 -->
          <div class="mission-table-card card">
            <div class="mission-table-header">
              <div class="mission-th" v-for="col in columns" :key="col.key">{{ col.title }}</div>
            </div>
            <div class="mission-table-body">
              <div v-if="loading" class="loading-row">
                <div class="mission-td" style="text-align:center;grid-column:1/-1;padding:20px;">
                  加载中...
                </div>
              </div>
              <div v-else-if="error" class="error-row">
                <div class="mission-td" style="text-align:center;grid-column:1/-1;padding:20px;color:#ff6b6b;">
                  {{ error }}
                </div>
              </div>
              <div v-else-if="alarmList.length === 0" class="empty-row">
                <div class="mission-td" style="text-align:center;grid-column:1/-1;padding:20px;color:#b8c7d9;">
                  暂无报警数据
                </div>
              </div>
              <div v-else class="mission-tr" v-for="(row, idx) in alarmList" :key="row.id">
                <div class="mission-td">{{ idx + 1 }}</div>
                <div class="mission-td">{{ row.deviceName }}</div>
                <div class="mission-td">{{ row.type }}</div>
                <div class="mission-td">{{ row.content }}</div>
                <div class="mission-td">
                  <span :class="['level-badge', `level-${row.level}`]">{{ row.levelText }}</span>
                </div>
                <div class="mission-td">{{ row.time }}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHmsAlerts, useDevices } from '../composables/useApi'
import equipmengStoreIcon from '@/assets/source_data/svg_data/equipmeng_store.svg'
import equipmentWarningsIcon from '@/assets/source_data/svg_data/equipment_warnings.svg'

const router = useRouter()

// 使用HMS报警API和设备管理API
const { hmsAlerts, loading, error, fetchDeviceHms, setAllAlerts } = useHmsAlerts()
const { getCachedDeviceSns, fetchDevices } = useDevices()

const sidebarTabs = [
  { key: 'manage', label: '设备管理', icon: equipmengStoreIcon },
  { key: 'warning', label: '设备告警', icon: equipmentWarningsIcon }
]
const currentTab = ref('warning')
const handleTabClick = (key: string) => {
  currentTab.value = key
  if (key === 'manage') {
    router.push('/dashboard/device-manage')
  } else if (key === 'warning') {
    router.push('/dashboard/alarm-log')
  }
}

// 筛选相关
const selectedDeviceType = ref('')
const filter = ref({ level: '' })
const alarmList = ref<any[]>([])

// 从本地缓存获取设备列表
const getCachedDevices = () => {
  const { dockSns, droneSns } = getCachedDeviceSns()
  
  console.log('从本地缓存获取设备SN:', { dockSns, droneSns })
  
  // 返回所有设备SN，包括机场和无人机
  const allDevices = [
    ...dockSns.map((sn: string) => ({
      device_sn: sn,
      device_name: sn,
      nickname: sn,
      device_type: '3-3-0' // 机场类型
    })),
    ...droneSns.map((sn: string) => ({
      device_sn: sn,
      device_name: sn,
      nickname: sn,
      device_type: '0-100-0' // 无人机类型
    }))
  ]
  
  return allDevices
}

// 获取设备类型选项
const getDeviceTypeOptions = () => {
  return [
    { value: '', label: '全部设备' },
    { value: 'dock', label: '机场' },
    { value: 'drone', label: '无人机' }
  ]
}

// 初始化：从本地缓存获取设备并加载所有设备的报警数据
const initDevice = () => {
  console.log('AlarmLog组件开始初始化')
  const cachedDevices = getCachedDevices()
  console.log('AlarmLog组件初始化，缓存设备列表:', cachedDevices)
  
  if (cachedDevices.length === 0) {
    console.log('没有缓存设备，尝试从设备管理页面获取设备列表')
    // 如果没有缓存设备，尝试获取设备列表
    loadDevicesAndAlarmData()
  } else {
    // 默认显示所有设备的报警数据
    console.log('有缓存设备，开始加载报警数据')
    loadAllAlarmData()
  }
}

// 加载设备列表并获取报警数据
const loadDevicesAndAlarmData = async () => {
  try {
    console.log('开始获取设备列表')
    const devices = await fetchDevices()
    console.log('设备列表获取成功:', devices)
    
    // 重新获取缓存设备并加载报警数据
    const cachedDevices = getCachedDevices()
    console.log('重新获取缓存设备:', cachedDevices)
    
    if (cachedDevices.length > 0) {
      loadAllAlarmData()
    } else {
      console.log('仍然没有设备数据')
    }
  } catch (err) {
    console.error('获取设备列表失败:', err)
  }
}

// 设备类型选择变化
const handleDeviceTypeChange = async () => {
  console.log('设备类型选择变化:', selectedDeviceType.value)
  if (selectedDeviceType.value === '') {
    // 选择全部设备，显示所有设备的报警数据
    loadAllAlarmData()
  } else if (selectedDeviceType.value === 'dock') {
    // 选择机场，显示机场的报警数据
    loadDockAlarmData()
  } else if (selectedDeviceType.value === 'drone') {
    // 选择无人机，先清空报警数据，然后显示无人机的报警数据
    setAllAlerts([])
    updateAlarmList()
    loadDroneAlarmData()
  }
}

// 查询
const handleSearch = async () => {
  console.log('执行查询，当前设备类型:', selectedDeviceType.value)
  if (selectedDeviceType.value === '') {
    loadAllAlarmData()
  } else if (selectedDeviceType.value === 'dock') {
    loadDockAlarmData()
  } else if (selectedDeviceType.value === 'drone') {
    // 选择无人机，先清空报警数据，然后显示无人机的报警数据
    setAllAlerts([])
    updateAlarmList()
    loadDroneAlarmData()
  }
}

// 重置
const handleReset = () => {
  console.log('执行重置')
  filter.value = { level: '' }
  selectedDeviceType.value = ''
  loadAllAlarmData()
}

// 加载所有设备的报警数据
const loadAllAlarmData = async () => {
  const cachedDevices = getCachedDevices()
  console.log('开始加载所有设备的报警数据，设备数量:', cachedDevices.length)
  
  if (cachedDevices.length === 0) {
    console.log('没有缓存设备，跳过加载报警数据')
    return
  }
  
  try {
    // 获取所有设备的报警数据
    const allAlerts: any[] = []
    
    for (const device of cachedDevices) {
      try {
        console.log('加载设备报警数据:', device.device_sn)
        const response = await fetchDeviceHms(device.device_sn)
        if (response && response.length > 0) {
          allAlerts.push(...response)
        }
      } catch (err) {
        console.error(`获取设备 ${device.device_sn} 报警数据失败:`, err)
        // 继续获取其他设备的数据
      }
    }
    
    console.log('所有设备报警数据加载完成，总数:', allAlerts.length)
    setAllAlerts(allAlerts)
    updateAlarmList()
  } catch (err) {
    console.error('获取所有设备报警数据失败:', err)
  }
}

// 加载机场的报警数据
const loadDockAlarmData = async () => {
  const cachedDevices = getCachedDevices()
  const dockDevices = cachedDevices.filter((device: any) => device.device_type === '3-3-0')
  
  console.log('开始加载机场的报警数据，机场数量:', dockDevices.length)
  
  if (dockDevices.length === 0) {
    console.log('没有缓存机场，跳过加载报警数据')
    return
  }
  
  try {
    // 获取所有机场的报警数据
    const allAlerts: any[] = []
    
    for (const device of dockDevices) {
      try {
        console.log('加载机场报警数据:', device.device_sn)
        const response = await fetchDeviceHms(device.device_sn)
        if (response && response.length > 0) {
          allAlerts.push(...response)
        }
      } catch (err) {
        console.error(`获取机场 ${device.device_sn} 报警数据失败:`, err)
        // 继续获取其他机场的数据
      }
    }
    
    console.log('所有机场报警数据加载完成，总数:', allAlerts.length)
    setAllAlerts(allAlerts)
    updateAlarmList()
  } catch (err) {
    console.error('获取所有机场报警数据失败:', err)
  }
}

// 加载无人机的报警数据
const loadDroneAlarmData = async () => {
  const cachedDevices = getCachedDevices()
  const droneDevices = cachedDevices.filter((device: any) => device.device_type === '0-100-0')
  
  console.log('开始加载无人机的报警数据，无人机数量:', droneDevices.length)
  
  if (droneDevices.length === 0) {
    console.log('没有缓存无人机，跳过加载报警数据')
    return
  }
  
  try {
    // 获取所有无人机的报警数据
    const allAlerts: any[] = []
    
    for (const device of droneDevices) {
      try {
        console.log('加载无人机报警数据:', device.device_sn)
        const response = await fetchDeviceHms(device.device_sn)
        if (response && response.length > 0) {
          allAlerts.push(...response)
        }
      } catch (err) {
        console.error(`获取无人机 ${device.device_sn} 报警数据失败:`, err)
        // 继续获取其他无人机的数据
      }
    }
    
    console.log('所有无人机报警数据加载完成，总数:', allAlerts.length)
    setAllAlerts(allAlerts)
    updateAlarmList()
  } catch (err) {
    console.error('获取所有无人机报警数据失败:', err)
  }
}

// 更新报警列表
const updateAlarmList = () => {
  if (!hmsAlerts.value.length) {
    alarmList.value = []
    return
  }
  
  const cachedDevices = getCachedDevices()
  
  alarmList.value = hmsAlerts.value
    .filter(alert => {
      if (filter.value.level && alert.level.toString() !== filter.value.level) {
        return false
      }
      return true
    })
    .map(alert => {
      const device = cachedDevices.find((d: any) => d.device_sn === alert.device_sn)
      return {
        id: alert.id,
        deviceName: device?.device_name || device?.nickname || alert.device_sn,
        type: getDeviceTypeText(device?.device_type),
        content: alert.message_zh,
        level: alert.level,
        levelText: getLevelText(alert.level),
        time: formatTime(alert.create_time)
      }
    })
    .sort((a, b) => b.time.localeCompare(a.time)) // 按时间倒序
}

// 获取设备类型文本
const getDeviceTypeText = (deviceType: string) => {
  switch (deviceType) {
    case '3-3-0':
      return '机场'
    case '0-100-0':
      return '无人机'
    default:
      return '未知设备'
  }
}

// 监听筛选条件变化
const watchFilter = () => {
  if (hmsAlerts.value.length > 0) {
    updateAlarmList()
  }
}

// 监听筛选条件变化
watch(() => filter.value.level, watchFilter)

// 获取报警类型
const getAlertType = (module: number) => {
  const typeMap: Record<number, string> = {
    1: '系统告警',
    2: '设备告警',
    3: '系统告警',
    4: '设备告警'
  }
  return typeMap[module] || '未知告警'
}

// 获取等级文本
const getLevelText = (level: number) => {
  return level === 1 ? '普通' : '严重'
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const columns = [
  { key: 'index', title: '序号' },
  { key: 'deviceName', title: '设备名称' },
  { key: 'type', title: '报警类型' },
  { key: 'content', title: '报警内容' },
  { key: 'level', title: '报警等级' },
  { key: 'time', title: '报警时间' }
]

// 页面加载时初始化
onMounted(() => {
  console.log('AlarmLog组件挂载')
  initDevice()
})
</script>

<style scoped>
@import './mission-common.css';

.alarm-input {
  height: 32px;
  border-radius: 4px;
  border: 1px solid #164159;
  background: transparent;
  color: #fff;
  padding: 0 12px;
  font-size: 14px;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
}
.alarm-input:focus {
  outline: none;
  border: 1.5px solid #16bbf2;
  box-shadow: 0 0 0 2px rgba(22,187,242,0.15);
}
.custom-select-wrapper {
  position: relative;
  display: inline-block;
  min-width: 140px;
  max-width: 180px;
  width: 100%;
  vertical-align: middle;
  flex-shrink: 0;
}
.custom-select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
}
.mission-select {
  background: transparent !important;
  background-color: transparent !important;
  width: 100%;
  min-width: 140px;
  max-width: 180px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #164159;
  color: #fff;
  font-size: 14px;
  padding: 0 12px;
  padding-right: 30px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-sizing: border-box;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
}
.mission-select:focus {
  outline: none;
  border: 1.5px solid #67d5fd;
  box-shadow: 0 0 0 2px rgba(103, 213, 253, 0.15);
}
/* 隐藏所有浏览器的默认下拉箭头 */
.mission-select::-ms-expand {
  display: none;
}
.mission-select::-webkit-select-placeholder {
  display: none;
}
.mission-select::-moz-select-placeholder {
  display: none;
}
/* 针对不同浏览器的额外隐藏规则 */
.mission-select::-webkit-inner-spin-button,
.mission-select::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.mission-select::-webkit-calendar-picker-indicator {
  display: none;
}
/* 确保在Safari中也不显示默认箭头 */
.mission-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
/* 覆盖mission-common.css中的::after伪元素，移除重复箭头 */
.custom-select-wrapper::after {
  display: none !important;
}
/* 保证下拉菜单（option）背景色不变 */
.mission-select option {
  background: #172233;
  color: #fff;
}
/* 筛选项布局 */
.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-right: 24px; /* 增加右侧间距，从16px改为24px */
}
.filter-label {
  color: #b8c7d9;
  font-size: 14px;
  min-width: 64px;
  white-space: nowrap;
  flex-shrink: 0;
}
/* 按钮样式优化 */
.mission-btn {
  min-width: 72px;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  margin-left: 12px; /* 增加左侧间距，从8px改为12px */
}
/* 调整mission-top-row的间距 */
.mission-top-row {
  gap: 24px; /* 增加整体间距，从20px改为24px */
}
/* 其余 alarm-xxx 样式已移除，统一复用 mission-common.css */
.mission-th:last-child,
.mission-td:last-child {
  min-width: 220px;
  max-width: 320px;
  text-align: center;
  padding-left: 16px;
  padding-right: 16px;
}

/* 等级徽章样式 */
.level-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.level-1 {
  background: rgba(103, 213, 253, 0.2);
  color: #67d5fd;
  border: 1px solid rgba(103, 213, 253, 0.3);
}
.level-2 {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

/* 重置按钮样式 */
.mission-btn-reset {
  background: #232b3a;
  color: #fff;
  border: 1px solid #232b3a;
}
.mission-btn-reset:hover {
  background: #2d3648;
  color: #fff;
}
</style> 