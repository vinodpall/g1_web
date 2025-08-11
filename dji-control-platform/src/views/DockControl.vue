<template>
  <div class="drone-control-main">
    <!-- 侧边栏菜单 -->
    <aside class="sidebar-menu">
      <div class="sidebar-tabs">
        <div
          v-for="(item, idx) in sidebarTabs"
          :key="item.key"
          :class="['sidebar-tab', { active: item.path === $route.path }]"
          @click="handleTabClick(item.key)"
        >
          <img :src="item.icon" :alt="item.label" />
        </div>
      </div>
      <div class="sidebar-menu-bottom">
        <img :src="sheetIcon" alt="菜单" />
      </div>
    </aside>
    <!-- 主体内容区 -->
    <main class="main-content">
      <div class="main-flex">
        <!-- 左侧信息区 -->
        <section class="left-panel">
          <!-- 机场信息卡片，结构和样式与DroneControl一致，图片为dock3.png -->
          <div class="card drone-info-card in-box-top-left">
            <div class="on1-l">
              <div class="on1-lt">
                <!-- 左栏：图片+电池 -->
                <div class="on1-ltl on1-ltl-main">
                  <div class="on1-ltlt drone-img-battery-block">
                    <img class="plane-img" src="@/assets/source_data/dock3.png" alt="机场" />
                    <div class="battery-info-block">
                      <img class="battery-img" :src="batteryImg" alt="电池" />
                      <div class="battery-detail-list">
                        <div>电压：{{ formatVoltage(dockStatus?.workingVoltage) }}</div>
                        <div>电流：{{ formatCurrent(dockStatus?.workingCurrent) }}</div>
                        <div>状态：{{ dockStatus?.isOnline ? '在线' : '离线' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 竖线 -->
                <div class="on1-lt-border-vertical"></div>
                <!-- 右侧机场信息表格 -->
                <div class="dock-info-table-custom">
                  <DockInfoRow :items="dockInfoItems.slice(0, 8)" />
                  <DockInfoRow :items="dockInfoItems.slice(8, 16)" />
                </div>
                <!-- 横线 -->
                <div class="on1-lt-border-horizontal"></div>
              </div>
              <!-- 可选：底部状态栏 -->
              <div class="robot-status-footer">
                <span>风速：{{ formatWindSpeed(environment?.windSpeed) }}</span>
                <span>，降水：{{ formatRainfall(environment?.rainfall) }}</span>
                <span>，温度：{{ formatTemperature(environment?.environmentTemperature) }}</span>
                <span>，湿度：{{ formatHumidity(environment?.humidity) }}</span>
              </div>
            </div>
          </div>
          <!-- 地图卡片 -->
          <div class="card map-card">
            <div id="amap-container" class="amap-container">
              <!-- 无人机追踪按钮 -->
              <div class="drone-track-btn" @click="toggleDroneTracking" :class="{ 'active': isDroneTracking }" :title="isDroneTracking ? '取消追踪' : '追踪无人机'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
          </div>
        </section>
        <!-- 右侧视频与控制区 -->
        <section class="right-panel">
          <div class="right-flex">
            <div class="video-card">
              <div class="boxGrid-box">
                <div class="boxGrid-box-content">
                  <div class="player_container">
                    <div class="player_item">
                      <div class="player_box" id="player_box1">
                        <!-- 视频播放器 -->
                        <video 
                          ref="videoElement"
                          style="width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;"
                          autoplay
                          muted
                          playsinline
                          webkit-playsinline
                        >
                          您的浏览器不支持视频播放
                        </video>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="boxGrid-box-bottom">
                  <div class="left-controls">
                    <div class="video-time">
                      <span class="time-display">{{ currentTime }}</span>
                    </div>
                    <div class="play-controls">
                      <button 
                        class="play-btn" 
                        @click="togglePlay"
                        :class="{ 'paused': !isVideoPlaying }"
                      >
                        <svg v-if="isVideoPlaying" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                      <button class="fullscreen-btn" @click="toggleFullscreen" title="全屏">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                      </button>
                      <button class="refresh-btn" @click="reloadVideo" :disabled="refreshingVideo" title="刷新视频">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotating': refreshingVideo }">
                          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="center-controls"></div>
                  <div class="right-controls" :class="{ active: showScreenMenu }" @click="toggleScreenMenu">
                    <img src="@/assets/source_data/svg_data/nine_video.svg" class="screen-icon" />
                    <i class="el-icon dropdown-icon">
                      <svg width="20" height="20" viewBox="0 0 1024 1024">
                        <path fill="#59C0FC" d="m192 384 320 384 320-384z"></path>
                      </svg>
                    </i>
                    <!-- 分屏选择菜单 -->
                    <div class="screen-menu" v-if="showScreenMenu">
                      <div class="menu-item" @click="selectScreenMode('一分屏')">一分屏</div>
                      <div class="menu-item" @click="selectScreenMode('二分屏')">二分屏</div>
                      <div class="menu-item" @click="selectScreenMode('四分屏')">四分屏</div>
                      <div class="menu-item" @click="selectScreenMode('六分屏')">六分屏</div>
                      <div class="menu-item" @click="selectScreenMode('九分屏')">九分屏</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="dock-control-panel">
              <div class="panel-title">
                <span class="dock-title-text">机场控制</span>
                <span class="remote-switch-wrap" style="font-size:13px;font-weight:400;">
                  远程调试
                  <span class="switch-container" :class="{ active: remoteEnabled }" @click="toggleRemote"><span class="switch-toggle"></span></span>
                </span>
              </div>
              <div class="dock-card-list">
                <div class="dock-card-row">
                  <div class="dock-card-item">
                    <img class="dock-card-icon" src="@/assets/source_data/svg_data/dock_control_svg/dock_sys.svg" alt="sys" />
                    <div class="dock-card-content">
                      <div class="dock-card-title">工作中</div>
                      <div class="dock-card-sub">机场系统</div>
                    </div>
                    <button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">开启</button>
                  </div>
                  <div class="dock-card-item">
                    <img class="dock-card-icon" src="@/assets/source_data/svg_data/dock_control_svg/dock_box.svg" alt="box" />
                    <div class="dock-card-content">
                      <div class="dock-card-title">已关闭</div>
                      <div class="dock-card-sub">舱盖状态</div>
                    </div>
                    <button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">开启</button>
                  </div>
                  <div class="dock-card-item">
                    <img class="dock-card-icon" src="@/assets/source_data/svg_data/dock_control_svg/dock_air.svg" alt="air" />
                    <div class="dock-card-content">
                      <div class="dock-card-title">制冷中</div>
                      <div class="dock-card-sub">空调</div>
                    </div>
                    <button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">停止</button>
                  </div>
                </div>
                <div class="dock-card-row">
                  <div class="dock-card-item">
                    <img class="dock-card-icon" src="@/assets/source_data/svg_data/dock_control_svg/dock_voice.svg" alt="voice" />
                    <div class="dock-card-content">
                      <div class="dock-card-title">未开启</div>
                      <div class="dock-card-sub">静音模式</div>
                    </div>
                    <button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">开启</button>
                  </div>
                  <div class="dock-card-item">
                    <img class="dock-card-icon" src="@/assets/source_data/svg_data/dock_control_svg/dock_warning.svg" alt="warning" />
                    <div class="dock-card-content">
                      <div class="dock-card-title">未开启</div>
                      <div class="dock-card-sub">机场声光报警</div>
                    </div>
                    <button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">开启</button>
                  </div>
                  <div class="dock-card-item">
                    <img class="dock-card-icon" src="@/assets/source_data/svg_data/dock_control_svg/dock_storage.svg" alt="storage" />
                    <div class="dock-card-content">
                      <div class="dock-card-title">3.5/50.6GB</div>
                      <div class="dock-card-sub">机场存储</div>
                    </div>
                    <button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">重置</button>
                  </div>
                </div>
                <div class="dock-card-row">
                  <div class="dock-card-item">
                    <img class="dock-card-icon" src="@/assets/source_data/svg_data/dock_control_svg/dock_sim.svg" alt="sim" />
                    <div class="dock-card-content">
                      <div class="dock-card-title">...</div>
                      <div class="dock-card-sub">机场增强图传</div>
                    </div>
                    <button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">设置</button>
                  </div>
                  <div class="dock-card-item">
                    <img class="dock-card-icon" src="@/assets/source_data/svg_data/dock_control_svg/dock_certificate.svg" alt="certificate8" />
                    <div class="dock-card-content">
                      <div class="dock-card-title">解禁证书</div>
                      <div class="dock-card-sub">限飞解禁证书</div>
                    </div>
                    <button class="dock-card-btn" :class="{ active: remoteEnabled }" :disabled="!remoteEnabled">设置</button>
                  </div>
                  <div class="dock-card-item empty"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useDeviceStatus } from '../composables/useDeviceStatus'
import { useDeviceStore } from '../stores/device'
import { useWaylineJobs } from '../composables/useApi'
import { useDevices } from '../composables/useApi'
import { StatusMaps } from '../api/deviceStatus'
import planeIcon from '@/assets/source_data/svg_data/plane.svg'
import stockIcon from '@/assets/source_data/svg_data/stock3.svg'
import sheetIcon from '@/assets/source_data/svg_data/sheet.svg'
import batteryIcon from '@/assets/source_data/svg_data/battery.svg'
import systemIcon from '@/assets/source_data/svg_data/system.svg'
import cameraIcon from '@/assets/source_data/svg_data/camera.svg'
import plane2Img from '@/assets/source_data/plane_2.png'
import batteryImg from '@/assets/source_data/Battery.png'
import AMapLoader from '@amap/amap-jsapi-loader'
import mapDockIcon from '@/assets/source_data/svg_data/map_dock3.svg'
import mapDroneIcon from '@/assets/source_data/svg_data/map_drone.svg'
import droneCloseIcon from '@/assets/source_data/svg_data/drone_close.svg'
import droneBatteryIcon from '@/assets/source_data/svg_data/drone_battery.svg'
import drone4gIcon from '@/assets/source_data/svg_data/drone_4g.svg'
import dockStars from '@/assets/source_data/svg_data/dock_control_svg/dock_stars.svg'
import dockWifi from '@/assets/source_data/svg_data/dock_control_svg/dock_wifi.svg'
import DockInfoRow from '@/components/DockInfoRow.vue'

const router = useRouter()

// 使用设备存储
const deviceStore = useDeviceStore()

// 使用设备状态API
const { 
  fetchDeviceStatus, 
  fetchMainDeviceStatus,
  fetchDroneStatus,
  droneStatus, 
  dockStatus,
  environment,
  gpsStatus,
  osdData,
  formatVoltage,
  formatCurrent,
  formatTemperature,
  formatHumidity,
  formatWindSpeed,
  formatRainfall,
  formatNetworkRate,
  formatAccTime,
  position
} = useDeviceStatus()

// 使用设备API
const { getCachedDeviceSns, getCachedWorkspaceId } = useDevices()

// 使用航线任务API
const { fetchWaylineProgress, fetchWaylineJobDetail, fetchWaylineDetail } = useWaylineJobs()

const sidebarTabs = [
  {
    key: 'plane',
    label: '无人机',
    icon: planeIcon,
    path: '/dashboard/drone-control'
  },
  {
    key: 'stock',
    label: '机巢',
    icon: stockIcon,
    path: '/dashboard/dock-control'
  }
]
const currentTab = ref('stock')
const progressPercent = ref(40)
const currentRouteName = ref('测试航线B')
const amapInstance = ref<any>(null)
const amapApiRef = ref<any>(null)
const remoteEnabled = ref(false)
const dockMarkers = ref<any[]>([])
const droneMarkers = ref<any[]>([])

// 无人机动画相关状态
const droneAnimationState = ref({
  currentPosition: { longitude: 0, latitude: 0, height: 0 },
  targetPosition: { longitude: 0, latitude: 0, height: 0 },
  isAnimating: false,
  animationStartTime: 0,
  animationDuration: 2000, // 2秒动画时长
  lastUpdateTime: 0
})

// 无人机位置插值函数
const interpolatePosition = (start: any, end: any, progress: number) => {
  return {
    longitude: start.longitude + (end.longitude - start.longitude) * progress,
    latitude: start.latitude + (end.latitude - start.latitude) * progress,
    height: start.height + (end.height - start.height) * progress
  }
}

// 更新无人机位置动画
const updateDronePositionAnimation = () => {
  if (!droneAnimationState.value.isAnimating || !droneMarkers.value.length) {
    return
  }

  const now = Date.now()
  const elapsed = now - droneAnimationState.value.animationStartTime
  const progress = Math.min(elapsed / droneAnimationState.value.animationDuration, 1)

  // 使用缓动函数使动画更自然
  const easeProgress = 1 - Math.pow(1 - progress, 3) // 缓出效果

  const currentPos = droneAnimationState.value.currentPosition
  const targetPos = droneAnimationState.value.targetPosition
  const interpolatedPos = interpolatePosition(currentPos, targetPos, easeProgress)

  // 更新无人机标记位置
  const droneMarker = droneMarkers.value[0]
  if (droneMarker) {
    droneMarker.setPosition([interpolatedPos.longitude, interpolatedPos.latitude])
  }

  // 如果动画完成，停止动画
  if (progress >= 1) {
    droneAnimationState.value.isAnimating = false
    droneAnimationState.value.currentPosition = { ...targetPos }
  } else {
    // 继续动画
    requestAnimationFrame(updateDronePositionAnimation)
  }
}

// 开始无人机位置动画
const startDronePositionAnimation = (newPosition: any) => {
  const currentPos = droneAnimationState.value.currentPosition
  const targetPos = {
    longitude: newPosition.longitude,
    latitude: newPosition.latitude,
    height: newPosition.height || 0
  }

  // 计算两点间距离，根据距离调整动画时长
  const distance = Math.sqrt(
    Math.pow(targetPos.longitude - currentPos.longitude, 2) +
    Math.pow(targetPos.latitude - currentPos.latitude, 2)
  )

  // 根据距离调整动画时长，距离越远动画时间越长，但不超过3秒
  const baseDuration = 1000 // 基础1秒
  const distanceFactor = Math.min(distance * 10000, 2) // 距离因子，最大2秒
  const animationDuration = Math.min(baseDuration + distanceFactor * 1000, 3000)

  droneAnimationState.value = {
    currentPosition: { ...currentPos },
    targetPosition: targetPos,
    isAnimating: true,
    animationStartTime: Date.now(),
    animationDuration: animationDuration,
    lastUpdateTime: Date.now()
  }

  // 开始动画
  requestAnimationFrame(updateDronePositionAnimation)
}
const isInitialLoad = ref(true)

// 航点任务相关变量
const waylineProgress = ref<any>(null)
const waylineJobDetail = ref<any>(null)
const waylineProgressTimer = ref<number | null>(null)

// 航点和轨迹相关变量
const waylineMarkers = ref<any[]>([])
const waylinePolyline = ref<any>(null)
const currentWaypointMarker = ref<any>(null)

// 追踪无人机
const isDroneTracking = ref(false)

// 设备状态刷新定时器
const statusRefreshTimer = ref<number | null>(null)
// 无人机状态刷新定时器
const droneStatusRefreshTimer = ref<number | null>(null)
const toggleRemote = () => {
  remoteEnabled.value = !remoteEnabled.value
}
const isSatellite = ref(true) // 默认为卫星图模式
const toggleMapLayer = () => {
  if (!amapInstance.value || !amapApiRef.value) return
  isSatellite.value = !isSatellite.value
  const AMap = amapApiRef.value
  if (isSatellite.value) {
    amapInstance.value.setLayers([
      new AMap.TileLayer.Satellite(),
      new AMap.TileLayer.RoadNet()
    ])
  } else {
    amapInstance.value.setLayers([
      new AMap.TileLayer()
    ])
  }
}
const showScreenMenu = ref(false)
const currentScreenMode = ref('一分屏')
const toggleScreenMenu = () => {
  showScreenMenu.value = !showScreenMenu.value
}
const selectScreenMode = (mode: string) => {
  currentScreenMode.value = mode
  showScreenMenu.value = false
}
const handleTabClick = (key: string) => {
  currentTab.value = key
  if (key === 'plane') {
    router.push('/dashboard/drone-control')
  } else if (key === 'stock') {
    router.push('/dashboard/dock-control')
  }
}
const dockInfoItems = computed(() => {
  // 获取当前机场信息
  const currentDockSn = dockStatus.value ? Object.keys(localStorage).find(key => key.includes('dock')) : null
  const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
  const mainDockSn = cachedDockSns[0] || ''
  const currentDock = deviceStore.getDeviceBySn(mainDockSn)
  const dockName = currentDock?.device_name || currentDock?.nickname || 'DJI Dock3'
  
  return [
  { value: dockName, label: '机场名称' },
  { value: formatAccTime(dockStatus.value?.accTime), label: '运行时长' },
  { value: `${dockStatus.value?.jobNumber || 0} 架次`, label: '作业架次' },
  { value: gpsStatus.value?.rtkNumber || 0, label: '机场搜星', icon: dockStars },
  { value: gpsStatus.value?.fixedText || '未知', label: '标定状态' },
  { value: formatNetworkRate(dockStatus.value?.networkRate), label: '网络状态', icon: dockWifi },
  { 
    value: osdData.value?.alternate_land_point?.is_configured ? '已配置' : '未配置', 
    label: '备降点',
    clickable: osdData.value?.alternate_land_point?.is_configured === 1,
    coordinates: osdData.value?.alternate_land_point?.is_configured === 1 ? {
      longitude: osdData.value.alternate_land_point.longitude,
      latitude: osdData.value.alternate_land_point.latitude,
      height: osdData.value.alternate_land_point.height,
      safe_land_height: osdData.value.alternate_land_point.safe_land_height
    } : null
  },
  { value: osdData.value?.air_conditioner?.air_conditioner_state === 1 ? '运行中' : '空闲中', label: '空调状态' },
  { value: formatTemperature(environment.value?.temperature), label: '舱内温度' },
  { value: formatHumidity(environment.value?.humidity), label: '舱内湿度' },
  { value: formatTemperature(environment.value?.environmentTemperature), label: '舱外温度' },
  { value: formatRainfall(environment.value?.rainfall), label: '降水量' },
  { value: formatWindSpeed(environment.value?.windSpeed), label: '风速' },
  { value: osdData.value?.tilt_angle?.valid ? `${osdData.value.tilt_angle.value.toFixed(2)}°` : '--°', label: '倾斜角度' },
  { value: osdData.value?.mode_code !== undefined ? StatusMaps.dockMode[osdData.value.mode_code as keyof typeof StatusMaps.dockMode] || '未知' : '未知', label: '机场状态' },
  { value: osdData.value?.poe_power_output ? `${osdData.value.poe_power_output}W` : '暂无', label: 'PoE功率' },
]
})

// WGS84坐标转GCJ-02坐标的转换函数
const transformWGS84ToGCJ02 = (wgsLng: number, wgsLat: number) => {
  const PI = Math.PI
  const ee = 0.00669342162296594323
  const a = 6378245.0

  if (isOutOfChina(wgsLng, wgsLat)) {
    return { longitude: wgsLng, latitude: wgsLat }
  }

  let dlat = transformLat(wgsLng - 105.0, wgsLat - 35.0)
  let dlng = transformLng(wgsLng - 105.0, wgsLat - 35.0)
  const radlat = wgsLat / 180.0 * PI
  let magic = Math.sin(radlat)
  magic = 1 - ee * magic * magic
  const sqrtmagic = Math.sqrt(magic)
  dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
  dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
  const mglat = wgsLat + dlat
  const mglng = wgsLng + dlng

  return { longitude: mglng, latitude: mglat }
}

// 判断是否在中国范围外
const isOutOfChina = (lng: number, lat: number) => {
  return (lng < 72.004 || lng > 137.8347) || (lat < 0.8293 || lat > 55.8271)
}

// 辅助函数：纬度转换
const transformLat = (lng: number, lat: number) => {
  const PI = Math.PI
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
  return ret
}

// 辅助函数：经度转换
const transformLng = (lng: number, lat: number) => {
  const PI = Math.PI
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
  return ret
}

// 添加机场标记到地图
const addDockMarker = (longitude: number, latitude: number, dockInfo: any) => {
  if (!amapInstance.value || !amapApiRef.value) {
    return
  }

  const AMap = amapApiRef.value
  
  // 创建机场标记点
  const marker = new AMap.Marker({
    position: [longitude, latitude],
    title: `机场: ${dockInfo?.deviceSn || '未知设备'}`,
    content: `
      <img 
        src="${mapDockIcon}" 
        style="
          width: 32px;
          height: 32px;
          filter: brightness(0) saturate(100%) invert(40%) sepia(100%) saturate(10000%) hue-rotate(200deg) brightness(100%) contrast(100%);
        "
        alt="机场"
      />
    `,
    anchor: 'center',
    offset: new AMap.Pixel(0, 0)
  })

  // 添加到地图
  amapInstance.value.add(marker)
  dockMarkers.value.push(marker)
}

// 清除所有机场标记
const clearDockMarkers = () => {
  if (dockMarkers.value.length > 0) {
    dockMarkers.value.forEach(marker => {
      if (amapInstance.value) {
        amapInstance.value.remove(marker)
      }
    })
    dockMarkers.value = []
  }
}

// 添加无人机标记到地图
const addDroneMarker = (longitude: number, latitude: number, droneInfo: any) => {
  if (!amapInstance.value || !amapApiRef.value) {
    return
  }

  const AMap = amapApiRef.value
  
  // 创建无人机标记点
  const marker = new AMap.Marker({
    position: [longitude, latitude],
    title: `无人机: ${droneInfo?.deviceSn || '未知设备'}`,
    content: `
      <img 
        src="${mapDroneIcon}" 
        style="
          width: 32px;
          height: 32px;
          filter: brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(10000%) hue-rotate(0deg) brightness(100%) contrast(100%);
        "
        alt="无人机"
      />
    `,
    anchor: 'center',
    offset: new AMap.Pixel(0, 0)
  })

  // 添加到地图
  amapInstance.value.add(marker)
  droneMarkers.value.push(marker)
}

// 清除所有无人机标记
const clearDroneMarkers = () => {
  if (droneMarkers.value.length > 0) {
    droneMarkers.value.forEach(marker => {
      if (amapInstance.value) {
        amapInstance.value.remove(marker)
      }
    })
    droneMarkers.value = []
  }
}

// 更新地图标记（机场和无人机）
const updateMapMarkers = (shouldCenter = false) => {
  // 清除现有标记
  clearDockMarkers()
  
  // 检查是否有位置数据
  if (position.value && position.value.longitude && position.value.latitude) {
    const wgsLongitude = position.value.longitude
    const wgsLatitude = position.value.latitude
    
    // 将WGS84坐标转换为GCJ-02坐标
    const gcjCoords = transformWGS84ToGCJ02(wgsLongitude, wgsLatitude)
    const longitude = gcjCoords.longitude
    const latitude = gcjCoords.latitude
    
    // 获取机场设备信息
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    const deviceSn = cachedDockSns.length > 0 ? cachedDockSns[0] : '未知设备'
    
    const dockInfo = {
      deviceSn: deviceSn,
      isOnline: dockStatus.value?.isOnline || false,
      longitude: longitude,
      latitude: latitude,
      height: position.value.height || 0
    }
    
    // 添加机场标记
    addDockMarker(longitude, latitude, dockInfo)
    
    // 获取无人机设备信息
    const cachedDroneSns = JSON.parse(localStorage.getItem('cached_drone_sns') || '[]')
    const droneDeviceSn = cachedDroneSns.length > 0 ? cachedDroneSns[0] : '未知设备'
    
    // 检查无人机是否有独立的坐标数据
    let droneLongitude = longitude
    let droneLatitude = latitude
    let droneHeight = position.value.height || 0
    
    if (droneStatus.value && droneStatus.value.longitude && droneStatus.value.latitude) {
      // 无人机有独立的坐标数据
      const droneWgsLongitude = droneStatus.value.longitude
      const droneWgsLatitude = droneStatus.value.latitude
      
      // 将WGS84坐标转换为GCJ-02坐标
      const droneGcjCoords = transformWGS84ToGCJ02(droneWgsLongitude, droneWgsLatitude)
      droneLongitude = droneGcjCoords.longitude
      droneLatitude = droneGcjCoords.latitude
      droneHeight = droneStatus.value.height || 0
    } else {
      // 无人机没有独立坐标数据，使用机场坐标
    }
    
    const droneInfo = {
      deviceSn: droneDeviceSn,
      isOnline: droneStatus.value?.isOnline || false,
      longitude: droneLongitude,
      latitude: droneLatitude,
      height: droneHeight
    }
    
    // 处理无人机标记的平滑动画
    if (droneMarkers.value.length === 0) {
      // 第一次创建无人机标记
      addDroneMarker(droneLongitude, droneLatitude, droneInfo)
      // 初始化动画状态
      droneAnimationState.value.currentPosition = {
        longitude: droneLongitude,
        latitude: droneLatitude,
        height: droneHeight
      }
    } else {
      // 检查位置是否有变化
      const currentPos = droneAnimationState.value.currentPosition
      const newPos = { longitude: droneLongitude, latitude: droneLatitude, height: droneHeight }
      
      const positionChanged = Math.abs(currentPos.longitude - newPos.longitude) > 0.000001 ||
                             Math.abs(currentPos.latitude - newPos.latitude) > 0.000001
      
      if (positionChanged && !droneAnimationState.value.isAnimating) {
        // 位置有变化且当前没有动画，开始新的动画
        startDronePositionAnimation(newPos)
      }
    }
    
    // 更新无人机追踪
    updateDroneTracking()
    
    // 更新当前航点显示
    updateCurrentWaypoint()
    
    // 只在初始加载或明确要求时才设置地图中心
    if (shouldCenter && amapInstance.value) {
      amapInstance.value.setCenter([longitude, latitude])
      // 确保地图样式保持为卫星图
      if (amapApiRef.value) {
        amapInstance.value.setLayers([
          new amapApiRef.value.TileLayer.Satellite(),
          new amapApiRef.value.TileLayer.RoadNet()
        ])
      }
    }
  } else {
    // 无设备坐标数据，无法添加标记
  }
}

// 获取航线任务进度数据
const loadWaylineProgress = async () => {
  try {
    const workspaceId = getCachedWorkspaceId()
    const { dockSns } = getCachedDeviceSns()
    
    if (!workspaceId || dockSns.length === 0) {
      return
    }
    
    // 获取第一个机场的航线任务进度
    const dockSn = dockSns[0]
    const progressData = await fetchWaylineProgress(workspaceId, dockSn)
    waylineProgress.value = progressData
    
    // 如果有job_id，获取详细信息
    if (progressData.job_id) {
      const jobDetail = await fetchWaylineJobDetail(workspaceId, progressData.job_id)
      waylineJobDetail.value = jobDetail
      
      // 显示航点和轨迹
      await displayWayline()
    } else {
      // 如果没有任务，清除航点和轨迹显示
      clearWaylineDisplay()
    }
  } catch (err) {
    // 静默处理错误
  }
}

// 追踪无人机
const toggleDroneTracking = () => {
  isDroneTracking.value = !isDroneTracking.value
  if (isDroneTracking.value) {
    centerToDroneMarker();
  }
}

// 更新无人机追踪位置
const updateDroneTracking = () => {
  if (isDroneTracking.value) {
    centerToDroneMarker();
  }
}

// 地图定位到无人机标记实际位置
const centerToDroneMarker = () => {
  if (amapInstance.value && droneMarkers.value.length > 0) {
    const markerPos = droneMarkers.value[0].getPosition();
    amapInstance.value.setCenter(markerPos);
  }
}

// 清除航线显示
const clearWaylineDisplay = () => {
  if (amapInstance.value) {
    // 清除航点标记
    waylineMarkers.value.forEach(marker => {
      amapInstance.value.remove(marker)
    })
    waylineMarkers.value = []
    
    // 清除航线
    if (waylinePolyline.value) {
      amapInstance.value.remove(waylinePolyline.value)
      waylinePolyline.value = null
    }
    
    // 清除当前航点标记
    if (currentWaypointMarker.value) {
      amapInstance.value.remove(currentWaypointMarker.value)
      currentWaypointMarker.value = null
    }
  }
}

// 显示航点和航线（仅在需要时重绘，避免每次都清空重画）
const displayWayline = async () => {
  console.log('displayWayline 开始执行')
  console.log('amapInstance:', !!amapInstance.value)
  console.log('amapApiRef:', !!amapApiRef.value)
  console.log('waylineJobDetail:', waylineJobDetail.value)
  
  if (!amapInstance.value || !amapApiRef.value || !waylineJobDetail.value) {
    console.log('displayWayline 条件不满足，退出')
    return
  }
  
  // 判断是否需要重绘：当没有显示或任务ID/状态变化时才重绘
  const hasWaylineDisplay = waylineMarkers.value.length > 0 || waylinePolyline.value
  const currentJobId = waylineProgress.value?.job_id
  const currentTaskStatus = waylineProgress.value?.status
  const shouldRedraw = !hasWaylineDisplay || (displayWayline as any)._lastJobId !== currentJobId || (displayWayline as any)._lastTaskStatus !== currentTaskStatus
  if (!shouldRedraw) {
    // 仅更新当前航点高亮
    updateCurrentWaypoint()
    return
  }
  // 需要重绘时清理旧图层
  clearWaylineDisplay()
  
  try {
    console.log('waylineJobDetail完整数据:', waylineJobDetail.value)
    
    // 检查是否有waylines数据
    let waylines = waylineJobDetail.value.waylines
    console.log('waylines:', waylines)
    
    // 如果没有waylines数据，尝试通过file_id获取航线文件详情
    if (!waylines || waylines.length === 0) {
      console.log('没有找到waylines数据，尝试通过file_id获取航线文件详情')
      const workspaceId = getCachedWorkspaceId()
      const fileId = waylineJobDetail.value.file_id
      
      if (workspaceId && fileId) {
        console.log('获取航线文件详情 - workspaceId:', workspaceId, 'fileId:', fileId)
        try {
          const waylineDetail = await fetchWaylineDetail(workspaceId, fileId)
          console.log('航线文件详情:', waylineDetail)
          waylines = waylineDetail.waylines
          console.log('从文件详情获取的waylines:', waylines)
        } catch (error) {
          console.error('获取航线文件详情失败:', error)
          return
        }
      } else {
        console.log('缺少workspaceId或fileId，无法获取航线文件详情')
        return
      }
    }
    
    if (!waylines || waylines.length === 0) {
      console.log('仍然没有找到waylines数据')
      return
    }
    
    const wayline = waylines[0] // 取第一个航线
    const waypoints = wayline.waypoints || []
    console.log('waypoints:', waypoints)
    
    if (waypoints.length === 0) {
      console.log('没有找到waypoints数据')
      return
    }
    
    // 创建航点标记
    const markers: any[] = []
    const path: [number, number][] = []
    
    console.log('开始创建航点标记，共', waypoints.length, '个航点')
    
    waypoints.forEach((waypoint: any, index: number) => {
      const [wgsLng, wgsLat] = waypoint.coordinates || [0, 0]
      console.log(`航点 ${index + 1}:`, { wgsLng, wgsLat })
      
      if (wgsLng && wgsLat) {
        // 将WGS84坐标转换为GCJ-02坐标
        const gcjCoords = transformWGS84ToGCJ02(wgsLng, wgsLat)
        console.log(`航点 ${index + 1} 转换后坐标:`, gcjCoords)
        
        // 创建航点标记
        const marker = new amapApiRef.value.Marker({
          position: [gcjCoords.longitude, gcjCoords.latitude],
          icon: new amapApiRef.value.Icon({
            size: new amapApiRef.value.Size(20, 20),
            image: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="8" fill="#67d5fd" stroke="#fff" stroke-width="2"/>
                <text x="10" y="13" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">${index + 1}</text>
              </svg>
            `),
            imageSize: new amapApiRef.value.Size(20, 20)
          }),
          title: `航点 ${index + 1}`
        })
        
        markers.push(marker)
        amapInstance.value.add(marker)
        path.push([gcjCoords.longitude, gcjCoords.latitude])
        console.log(`航点 ${index + 1} 已添加到地图`)
      } else {
        console.log(`航点 ${index + 1} 坐标无效，跳过`)
      }
    })
    
    waylineMarkers.value = markers
    console.log('航点标记创建完成，共', markers.length, '个标记')
    
    // 创建航线
    console.log('准备创建航线，路径点数:', path.length)
    if (path.length > 1) {
      waylinePolyline.value = new amapApiRef.value.Polyline({
        path: path,
        strokeColor: '#67d5fd',
        strokeWeight: 3,
        strokeOpacity: 0.8,
        strokeStyle: 'solid'
      })
      amapInstance.value.add(waylinePolyline.value)
      console.log('航线已添加到地图')
    } else {
      console.log('路径点数不足，无法创建航线')
    }
    // 记录本次渲染对应的任务ID与状态
    ;(displayWayline as any)._lastJobId = currentJobId
    ;(displayWayline as any)._lastTaskStatus = currentTaskStatus
    
    // 显示当前航点
    updateCurrentWaypoint()
    
  } catch (error) {
    console.error('显示航线失败:', error)
  }
}

// 更新当前航点显示
const updateCurrentWaypoint = () => {
  if (!amapInstance.value || !amapApiRef.value || !waylineJobDetail.value || !waylineProgress.value) {
    return
  }
  
  // 清除之前的当前航点标记
  if (currentWaypointMarker.value) {
    amapInstance.value.remove(currentWaypointMarker.value)
    currentWaypointMarker.value = null
  }
  
  const currentWaypointIndex = waylineProgress.value.ext?.current_waypoint_index || 0
  const waylines = waylineJobDetail.value.waylines
  
  if (!waylines || waylines.length === 0) {
    return
  }
  
  const wayline = waylines[0]
  const waypoints = wayline.waypoints || []
  
  if (currentWaypointIndex >= 0 && currentWaypointIndex < waypoints.length) {
    const waypoint = waypoints[currentWaypointIndex]
    const [wgsLng, wgsLat] = waypoint.coordinates || [0, 0]
    
    if (wgsLng && wgsLat) {
      const gcjCoords = transformWGS84ToGCJ02(wgsLng, wgsLat)
      
      // 创建当前航点标记
      currentWaypointMarker.value = new amapApiRef.value.Marker({
        position: [gcjCoords.longitude, gcjCoords.latitude],
        icon: new amapApiRef.value.Icon({
          size: new amapApiRef.value.Size(24, 24),
          image: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#ff4d4f" stroke="#fff" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">${currentWaypointIndex + 1}</text>
            </svg>
          `),
          imageSize: new amapApiRef.value.Size(24, 24)
        }),
        title: `当前航点 ${currentWaypointIndex + 1}`
      })
      
      amapInstance.value.add(currentWaypointMarker.value)
      console.log(`当前航点 ${currentWaypointIndex + 1} 已添加到地图`)
    }
  }
}

// 视频播放相关变量
const videoStreamUrl = ref('')
const videoPlayer = ref<any>(null)
const videoElement = ref<HTMLVideoElement | null>(null)
const videoLoading = ref(false)
const videoStatus = ref('正在检查视频流状态...')
const refreshingVideo = ref(false)
const isVideoPlaying = ref(false)
const currentTime = ref('00:00')
let pc: RTCPeerConnection | null = null
let isPlaying = false

// 获取机场视频流地址
const getDockVideoFromCache = () => {
  // 优先从video_streams缓存中获取机场视频
  const videoStreamsStr = localStorage.getItem('video_streams')
  if (videoStreamsStr) {
    try {
      const videoStreams = JSON.parse(videoStreamsStr)
      const dockStream = videoStreams.find((stream: any) => stream.type === 'dock')
      if (dockStream) {
        return dockStream.url
      }
    } catch (error) {
      console.error('解析video_streams缓存失败:', error)
    }
  }
  
  // 备用方案1：使用首页的通用视频地址
  const videoStreamUrl = localStorage.getItem('video_stream_url')
  if (videoStreamUrl) {
    return videoStreamUrl
  }
  
  // 备用方案2：使用机场专用视频地址
  const dockVideoUrl = localStorage.getItem('dock_video_stream_url')
  if (dockVideoUrl) {
    return dockVideoUrl
  }
  
  return ''
}

const initVideoPlayer = async () => {
  try {
    videoLoading.value = true
    videoStatus.value = '正在加载视频流...'
    
    const dockVideoUrl = getDockVideoFromCache()
    if (dockVideoUrl) {
      videoStreamUrl.value = dockVideoUrl
      // 延迟初始化播放器，确保DOM已经渲染
      await nextTick()
      // 再延迟一点确保DOM完全准备好
      setTimeout(() => {
        startVideoPlayback()
      }, 200)
    } else {
      videoStatus.value = '未找到机场视频流地址'
      videoLoading.value = false
    }
  } catch (error) {
    videoStatus.value = '初始化失败'
    videoLoading.value = false
  }
}

const startVideoPlayback = () => {
  if (!videoElement.value || !videoStreamUrl.value) {
    videoStatus.value = '视频未就绪'
    return
  }
  videoLoading.value = true
  videoStatus.value = '正在连接视频流...'
  try {
    if (videoPlayer.value) {
      videoPlayer.value.destroy()
      videoPlayer.value = null
    }
    if (videoElement.value) {
      videoElement.value.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
      videoElement.value.onplay = null
      videoElement.value.onpause = null
      videoElement.value.ontimeupdate = null
      videoElement.value.onloadedmetadata = null
      videoElement.value.onloadeddata = null
      videoElement.value.onerror = null
      videoElement.value.oncanplay = null
      videoElement.value.oncanplaythrough = null
      videoElement.value.oncanplay = () => {
        videoLoading.value = false
        videoStatus.value = '视频已就绪'
        // 延迟播放，确保视频完全准备好
        setTimeout(() => {
          if (videoElement.value && videoElement.value.paused) {
            videoElement.value.play().catch(() => {
              videoStatus.value = '请点击播放按钮'
            })
          }
        }, 100)
      }
      videoElement.value.oncanplaythrough = () => {
        videoLoading.value = false
        videoStatus.value = '视频已就绪'
      }
      videoElement.value.onplay = () => {
        isVideoPlaying.value = true
        videoStatus.value = '正在播放'
      }
      videoElement.value.onpause = () => {
        isVideoPlaying.value = false
        videoStatus.value = '已暂停'
      }
      videoElement.value.ontimeupdate = updateVideoTime
      videoElement.value.onloadedmetadata = () => {
        updateVideoTime()
      }
      videoElement.value.onloadeddata = () => {
        if (videoElement.value) {
          videoElement.value.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
        }
        // 不在这里立即播放，等待canplay事件
      }
      videoElement.value.onerror = () => {
        videoLoading.value = false
        videoStatus.value = '视频加载失败'
      }
    }
    if (videoStreamUrl.value.startsWith('webrtc://')) {
      startWebRTCPlayback()
    } else {
      videoElement.value.src = videoStreamUrl.value
      videoElement.value.load()
      // 不立即播放，等待canplay事件
    }
  } catch (error) {
    videoLoading.value = false
    videoStatus.value = '视频初始化失败'
  }
}

const updateVideoTime = () => {
  if (videoElement.value) {
    const seconds = videoElement.value.currentTime || 0
    currentTime.value = formatTime(seconds)
  }
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
    return '00:00'
  }
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  if (!videoElement.value) return
  
  try {
    if (videoElement.value.paused) {
      // 确保视频已经准备好再播放
      if (videoElement.value.readyState >= 2) { // HAVE_CURRENT_DATA
        videoElement.value.play().catch(() => {
          videoStatus.value = '播放失败，请重试'
        })
      } else {
        videoStatus.value = '视频未准备好，请稍候'
      }
    } else {
      videoElement.value.pause()
    }
  } catch (error) {
    videoStatus.value = '播放控制失败'
  }
}

const toggleFullscreen = () => {
  if (!videoElement.value) return
  if (videoElement.value.requestFullscreen) {
    videoElement.value.requestFullscreen()
  } else if ((videoElement.value as any).webkitRequestFullscreen) {
    (videoElement.value as any).webkitRequestFullscreen()
  }
}

const reloadVideo = async () => {
  refreshingVideo.value = true
  videoStatus.value = '正在刷新视频流...'
  try {
    stopVideoPlayback()
    // 这里只能重新从缓存拉取，若需强制刷新请参考DroneControl.vue的refreshVideoCapacityAndCache
    await nextTick()
    await initVideoPlayer()
    videoStatus.value = '视频流已刷新'
  } catch (error) {
    videoStatus.value = '视频刷新失败'
  } finally {
    refreshingVideo.value = false
  }
}

const startWebRTCPlayback = async () => {
  if (isPlaying) {
    stopWebRTCPlayback()
  }
  const serverUrl = videoStreamUrl.value
  if (!serverUrl) return
  try {
    if (pc) {
      pc.close()
      pc = null
    }
    pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ],
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    })
    const dummyStream = new MediaStream()
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const canvasStream = canvas.captureStream(1)
    const videoTrack = canvasStream.getVideoTracks()[0]
    if (videoTrack) {
      dummyStream.addTrack(videoTrack)
      pc.addTrack(videoTrack, dummyStream)
    }
    pc.ontrack = (e) => {
      if (videoElement.value) {
        videoElement.value.srcObject = e.streams[0]
        videoElement.value.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
      }
    }
    pc.oniceconnectionstatechange = () => {
      if (pc?.iceConnectionState === 'connected') {
        isPlaying = true
      } else if (pc?.iceConnectionState === 'failed') {
        stopWebRTCPlayback()
      }
    }
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    await pc.setLocalDescription(offer)
    const apiUrl = buildApiUrl(serverUrl)
    const response = await fetch(`${apiUrl}/rtc/v1/play/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sdp: offer.sdp, streamurl: serverUrl })
    })
    if (!response.ok) return
    const data = await response.json()
    if (data.code !== 0) return
    if (!data.sdp) return
    try {
      await pc.setRemoteDescription({ type: 'answer', sdp: data.sdp })
    } catch (sdpError: any) {
      return
    }
  } catch (error) {
    stopWebRTCPlayback()
  }
}

const buildApiUrl = (webrtcUrl: string) => {
  try {
    const url = new URL(webrtcUrl)
    return `http://${url.hostname}:1985`
  } catch (error) {
    return webrtcUrl.replace('webrtc://', 'http://').replace(':8000', ':1985').split('/')[0]
  }
}

const stopWebRTCPlayback = () => {
  if (pc) {
    pc.close()
    pc = null
  }
  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
  isPlaying = false
}

const stopVideoPlayback = () => {
  stopWebRTCPlayback()
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.unload && videoPlayer.value.unload()
    videoPlayer.value.detachMediaElement && videoPlayer.value.detachMediaElement()
    videoPlayer.value.destroy && videoPlayer.value.destroy()
    videoPlayer.value = null
  }
  if (videoElement.value) {
    videoElement.value.pause()
    videoElement.value.src = ''
    videoElement.value.load()
  }
}

onMounted(async () => {
  // 加载设备状态数据（使用缓存的设备SN）
  await fetchMainDeviceStatus()
  // 加载无人机状态数据
  await fetchDroneStatus()
  
  // 加载航线任务进度
  await loadWaylineProgress()
  
  // 初始化视频播放器
  await initVideoPlayer()
  
  AMapLoader.load({
    key: '6f9eaf51960441fa4f813ea2d7e7cfff',
    version: '2.0',
    plugins: ['AMap.ToolBar', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.MapType']
  }).then((AMap) => {
    amapApiRef.value = AMap
    amapInstance.value = new AMap.Map('amap-container', {
      zoom: 18,
      center: [116.397428, 39.90923],
      logoEnable: false,
      copyrightEnable: false,
      mapStyle: 'amap://styles/satellite', // 设置为卫星图样式
      layers: [
        new AMap.TileLayer.Satellite(),
        new AMap.TileLayer.RoadNet()
      ]
    })
    
    // 地图加载完成后更新机场标记
    amapInstance.value.on('complete', () => {
      // 延迟一下确保设备状态数据已加载
      setTimeout(() => {
        // 初始加载时需要定位到机场位置
        updateMapMarkers(isInitialLoad.value)
        // 标记初始加载完成
        isInitialLoad.value = false
      }, 1000)
    })
  }).catch((error) => {
    console.error('地图加载失败:', error)
    // 可以在这里添加备用方案，比如显示一个简单的div
  })
  
  // 设置设备状态自动刷新（每5秒）
  statusRefreshTimer.value = setInterval(async () => {
    await fetchMainDeviceStatus()
    // 设备状态更新后，更新地图标记（不定位）
    if (amapInstance.value) {
      updateMapMarkers()
    }
  }, 5000)
  
  // 设置无人机状态自动刷新（每2秒）
  droneStatusRefreshTimer.value = setInterval(async () => {
    await fetchDroneStatus()
    // 无人机状态更新后，更新地图标记（不定位）
    if (amapInstance.value) {
      updateMapMarkers()
    }
  }, 2000)
  
  // 设置航线任务进度自动刷新（每3秒）
  waylineProgressTimer.value = setInterval(async () => {
    await loadWaylineProgress()
  }, 3000)
})
onBeforeUnmount(() => {
  // 停止视频播放并清理视频资源
  stopVideoPlayback()
  
  // 清理设备状态刷新定时器
  if (statusRefreshTimer.value) {
    clearInterval(statusRefreshTimer.value)
    statusRefreshTimer.value = null
  }
  
  // 清理无人机状态刷新定时器
  if (droneStatusRefreshTimer.value) {
    clearInterval(droneStatusRefreshTimer.value)
    droneStatusRefreshTimer.value = null
  }
  
  // 清理航线任务进度刷新定时器
  if (waylineProgressTimer.value) {
    clearInterval(waylineProgressTimer.value)
    waylineProgressTimer.value = null
  }
  
  // 清理地图标记
  clearDockMarkers()
  clearDroneMarkers()
  
  // 清理航点和轨迹
  clearWaylineDisplay()
  
  // 清理地图实例
  if (amapInstance.value) {
    amapInstance.value.destroy()
    amapInstance.value = null
    amapApiRef.value = null
  }
})
const updateProgress = (percent: number) => {
  progressPercent.value = Math.max(0, Math.min(100, percent))
}
</script>

<style scoped>
/* 以下内容复制自DroneControl.vue */
.drone-control-main {
  display: flex;
  height: calc(100vh - 84px);
  background: #0a0f1c;
  color: #fff;
  position: fixed;
  top: 84px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
}
.sidebar-menu {
  width: 4%;
  min-width: 56px;
  max-width: 100px;
  background: linear-gradient(180deg, #004161cc 0%, #051b26cc 100%);
  border-radius: 0 10px 10px 0;
  box-shadow: 2px 0 12px 0 #00334a33;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 15px 0 15px;
  border-right: 1.5px solid #164159;
  z-index: 2;
  margin-top: 20px;
  margin-right: 20px; /* 新增：与主内容区间距20px */
  height: calc(100vh - 104px); /* 修改：使用视口高度减去顶部84px和margin-top 20px */
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: hidden; /* 修改：改为hidden避免滚动条 */
  position: relative;
}
.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.sidebar-menu li {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #16213a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.sidebar-menu li.active {
  background: #223a5e;
  box-shadow: 0 0 8px #59c0fc44;
}
.icon-placeholder {
  display: inline-block;
  width: 24px;
  height: 24px;
  background: #223a5e;
  border-radius: 4px;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  box-sizing: border-box;
  margin: 20px 0 0 0;
  height: calc(100vh - 104px); /* 修改：与侧边栏保持一致的高度计算 */
}
.main-flex {
  display: flex;
  height: 100%;
  gap: 0.8vw;
}
.left-panel {
  flex-basis: 60%;
  max-width: 60%;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
  background: transparent;
  padding-bottom: 20px; /* 新增，确保底部有间距 */
}
.drone-info-card {
  min-height: 220px;
  max-height: 280px;
  margin-bottom: 0;
  display: flex;
  flex-direction: row;
  gap: 0;
}
.drone-info-body {
  display: flex;
  gap: 16px;
}
.drone-io-mini {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
.map-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  background: none !important;
  border: 1.5px solid #164159;
  border-radius: 8px;
  box-shadow: none;
  margin-bottom: 0; /* 修正，避免被flex吞掉 */
}
.amap-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  min-height: 200px;
  position: relative;
}
.map-layer-switch {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 10;
  background: rgba(1,135,191,0.85);
  color: #fff;
  border-radius: 4px;
  padding: 6px 16px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: background 0.2s;
}
.map-layer-switch:hover {
  background: #16bbf2;
}
.right-panel {
  flex-basis: 40%;
  max-width: 40%;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  background: transparent;
  box-sizing: border-box;
  overflow: auto;
  padding-right: 18px;
  padding-bottom: 20px;
}
.right-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
}
.card {
  background: linear-gradient(135deg, #16213a 80%, #0a0f1c 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px #0003;
  padding: 16px;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #59c0fc;
}
.robot-status-body {
  display: flex;
  gap: 16px;
}
.robot-img-battery {
  display: flex;
  gap: 12px;
  align-items: center;
}
.robot-img-placeholder {
  width: 64px;
  height: 64px;
  background: #223a5e;
  border-radius: 8px;
}
.battery-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.battery-bar {
  width: 40px;
  height: 24px;
  background: #223a5e;
  border-radius: 6px;
  color: #67d5fd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.battery-detail {
  font-size: 12px;
  color: #d4edfd;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.task-progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.progress-title {
  font-size: 14px;
  color: #59c0fc;
  display: flex;
  justify-content: space-between;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background: #223a5e;
  border-radius: 4px;
  overflow: hidden;
}
.progress-inner {
  height: 100%;
  background: linear-gradient(90deg, #67d5fd, #59c0fc);
  border-radius: 4px;
}
.task-name {
  font-size: 13px;
  color: #b6b6b6;
  margin-top: 10px;
  text-align: left;
  padding-left: 0;
}
.task-actions {
  display: flex;
  gap: 12px;
  color: #67d5fd;
  font-size: 13px;
}
.task-stats {
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: #d4edfd;
}
.robot-status-footer {
  font-size: 12px;
  color: rgb(202, 133, 48);
  margin-top: 0px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 30px;
  padding-left: 8px;
}
.io-control-card .io-switch-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.io-switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #d4edfd;
}
.switch-placeholder {
  width: 36px;
  height: 20px;
  background: #223a5e;
  border-radius: 10px;
  display: inline-block;
}
.io-input-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #d4edfd;
}
.io-input-item input {
  width: 60px;
  background: #16213a;
  border: 1px solid #223a5e;
  border-radius: 4px;
  color: #fff;
  padding: 2px 6px;
}
.alarm-table-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.alarm-tabs {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #d4edfd;
  margin-bottom: 8px;
}
.alarm-tabs .active {
  color: #59c0fc;
  font-weight: 600;
  border-bottom: 2px solid #59c0fc;
}
.alarm-table-wrap {
  flex: 1;
  overflow: auto;
}
.alarm-table-wrap table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: #d4edfd;
}
.alarm-table-wrap th, .alarm-table-wrap td {
  border: 1px solid #223a5e;
  padding: 4px 8px;
  text-align: center;
}
.img-placeholder {
  width: 52px;
  height: 36px;
  background: #223a5e;
  border-radius: 4px;
  display: inline-block;
}
.video-card {
  flex: 3 1 0;
  min-height: 0;
  background: none !important;
  border: 1.5px solid #164159;
  border-radius: 8px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 0;
}
.boxGrid-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  background: rgba(0, 12, 23, .5);
  border-radius: 4px;
  overflow: hidden;
  padding: 12px 12px 0 12px;
}
.boxGrid-box-content {
  flex: 1;
  position: relative;
  padding: 0;
}
.player_container {
  width: 100%;
  height: 100%;
  position: relative;
}
.player_item {
  width: 100%;
  height: 100%;
  position: relative;
}
.player_box {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  border-radius: 0;
  overflow: hidden;
}
.boxGrid-box-bottom {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: rgba(0, 12, 23, .8);
  position: relative;
  z-index: 3;
  margin-top: 0; /* 修改：去掉margin-top，与无人机控制页面保持一致 */
  flex-shrink: 0; /* 确保底部控制条不会被压缩 */
}
.svg-icon {
  width: 20px;
  height: 20px;
  fill: #59C0FC;
}
.el-icon {
  color: #59C0FC;
  font-size: 20px;
}
.right-controls {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}
.screen-icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}
.el-icon.dropdown-icon {
  color: #59C0FC;
  font-size: 20px;
  display: flex;
  align-items: center;
}
.el-icon.dropdown-icon svg {
  width: 20px;
  height: 20px;
  display: block;
  fill: #59C0FC !important;
}
.screen-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: rgba(0, 12, 23, .9);
  border: 1px solid rgba(89, 192, 252, 0.3);
  border-radius: 4px;
  padding: clamp(6px, 0.5vw, 8px) 0;
  min-width: clamp(100px, 8vw, 120px);
  margin-bottom: 8px;
  z-index: 10;
}
.menu-item {
  padding: clamp(6px, 0.5vw, 8px) clamp(12px, 1vw, 16px);
  color: #fff;
  font-size: clamp(12px, 0.9vw, 14px);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.menu-item:hover {
  background: rgba(89, 192, 252, 0.1);
  color: #59C0FC;
}
.control-bottom {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 8px;
}
.drone-control-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.dock-control-panel .panel-title {
  text-align: center !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.dock-title-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 1;
}

.remote-switch-wrap {
  display: flex;
  align-items: center;
  height: 32px;
  position: relative;
  z-index: 2;
  margin-left: auto;
}

.panel-title {
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  /* margin-bottom: 8px; */
  text-align: center;
  border-radius: 4px 4px 0 0;
  background: #004161;
  padding: 0;
  height: 32px;
  line-height: 32px;
  width: calc(100% + 32px);
  box-sizing: border-box;
  margin-left: -16px;
  margin-right: -16px;
  margin-top: -12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gimbal-control-panel {
  flex: 2 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.switch-container {
  width: 40px;
  height: 20px;
  background: #B0B0B0;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  border: 1px solid #888;
  transition: background 0.3s, border 0.3s;
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
  margin-right: 16px;
}
.switch-container.active {
  background: #16bbf2;
  border: 1px solid #16bbf2;
}
.switch-toggle {
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: left 0.3s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.switch-container.active .switch-toggle {
  left: 21px;
}
.drone-direction-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 24px;
  row-gap: 0px;
}
.drone-bottom-row {
  display: flex;
  flex-direction: row;
  gap: 3px;
}
.gimbal-group {
  margin-bottom: 10px;
}
.gimbal-group-title {
  color: #b6b6b6;
  font-size: 13px;
  margin-bottom: 6px;
  text-align: left;
}
.gimbal-btn-row {
  display: flex;
  gap: 10px;
  margin-bottom: 6px;
}
.gimbal-btn-row button, .drone-direction-grid button, .drone-bottom-row button {
  flex: 1;
  background: rgba(1,135,191,0.30);
  border: 1px solid #164159;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  padding: 6px 0;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.gimbal-btn-row button:hover, .drone-direction-grid button:hover, .drone-bottom-row button:hover {
  background: #16bbf2;
  color: #fff;
}
.gimbal-joystick {
  width: 80px;
  height: 80px;
  background: #223a5e;
  border-radius: 50%;
  margin: 0 auto 8px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gimbal-func-list {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #d4edfd;
  margin-bottom: 4px;
  align-items: center;
}
.gimbal-func-list li {
  display: flex;
  align-items: center;
  gap: 4px;
}
.sidebar-tabs {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 40px;
  align-items: center;
  flex: 1;
  justify-content: flex-start;
  padding-top: 20px;
}
.sidebar-menu-bottom {
  display: none !important;
}
.sidebar-menu-bottom img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  opacity: 0.85;
  transition: opacity 0.2s;
}
.sidebar-menu-bottom img:hover {
  opacity: 1;
}

.sidebar-tab {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  font-size: 16px;
  font-family: 'Source Han Sans CN', 'Microsoft YaHei', Arial, sans-serif;
  font-weight: 400;
  color: #fff;
  margin-top: 10px;
  box-sizing: border-box;
}

.sidebar-tab:first-child {
  margin-top: 0;
}
.sidebar-tab.active {
  background: #01314f !important;
  color: #67d5fd;
  font-weight: 500;
  box-shadow: 0 0 12px #59c0fc33;
}
.sidebar-tab:hover {
  background: #164159;
}
.sidebar-tab img {
  width: 23px;
  height: 23px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transition: filter 0.2s, box-shadow 0.2s;
}
.sidebar-tab.active img {
  filter: brightness(0) invert(1) drop-shadow(0 0 8px #67d5fd) drop-shadow(0 0 2px #67d5fd);
  opacity: 1;
}
.out-box {
  width: 100%;
  height: 100%;
  background-color: #000;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
}
.in-box-top-left {
  width: 100%;
  height: 200px;
  box-shadow: rgb(20, 64, 91) 0px 0px 0px 1px inset;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  border-radius: 5px;
  background: url('@/assets/source_data/bg_data/plane_info_bg.png') 0% 0% / 100% 100% no-repeat;
  padding: 0;
  margin-bottom: 0;
}
.in-box-top-left .on1-l {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.in-box-top-left .on1-lt {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.on1-ltl-main {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  margin-top: 14px;
  width: 220px;
  box-sizing: border-box;
  flex-shrink: 0;
}
.on1-lt-border-horizontal {
  position: absolute;
  left: 0;
  right: 0; /* 顶到最右侧 */
  bottom: 10px;
  height: 1.5px;
  background: linear-gradient(90deg, #59c0fc 0%, #223a5e 100%);
  opacity: 0.7;
  border-radius: 1px;
  z-index: 1;
  display: block;
  pointer-events: none;
}
.on1-lt-border-vertical {
  position: absolute;
  top: 0;
  left: 220px;
  width: 1.5px;
  height: calc(100% - 10px);
  background: linear-gradient(180deg, #59c0fc 0%, #223a5e 100%);
  opacity: 0.7;
  border-radius: 1px;
  z-index: 2;
  pointer-events: none;
}
.in-box-top-left .on1-ltl {
  height: calc(100% - 40px);
  padding: 0;
  color: rgba(212, 237, 253, 0.6);
  position: relative;
}
.in-box-top-left .on1-ltlt {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
}
.plane-img {
  width: 120px;
  height: auto;
  object-fit: contain;
  display: block;
  margin-left: 0;
}
.battery-info-block {
  display: flex;
  width: 95px;
  height: 140px;
  padding: 10px 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  border-radius: 4px;
  background: linear-gradient(180deg, #004161 0%, rgba(5, 27, 38, 0.80) 100%);
  box-sizing: border-box;
}
.battery-img {
  width: 71px;
  height: 44px;
  object-fit: contain;
  margin-bottom: 2px;
}
.battery-detail-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #D4EDFD;
  font-size: 12px;
  font-family: Inter, 'Source Han Sans CN', 'Microsoft YaHei', Arial, sans-serif;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: 1px;
  text-align: center;
  margin-left: 0;
}
.dock-info-table-custom {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.dock-info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 0;
  min-height: 32px;
}
.dock-info-value {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 0;
}
.dock-info-label {
  color: #67D5FD;
  font-size: 14px;
  font-weight: 400;
  margin-top: 0;
  text-align: center;
  letter-spacing: 0.5px;
}
.dock-info-icon {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 2px;
}
.dock-control-panel {
  background: none;
  border: 1.5px solid #164159;
  border-radius: 8px;
  box-shadow: none;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.dock-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-top: 8px;
  height: 100%;
}
.dock-card-row {
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  flex: 1;
}
.dock-card-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(1, 135, 191, 0.30);
  border-radius: 4px;
  padding: 10px 16px;
  min-height: 56px;
  box-sizing: border-box;
  position: relative;
  gap: 0px;
  flex: 1;
  width: 0;
}
.dock-card-item.empty {
  background: transparent;
  border: none;
  box-shadow: none;
  pointer-events: none;
}
.dock-card-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}
.dock-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}
.dock-card-title {
  color: #FFF;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 1px;
  margin-bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dock-card-sub {
  color: #FFF;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 1px;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dock-card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid #16bbf2;
  background: #fff;
  color: #16bbf2;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  outline: none;
  cursor: pointer;
  min-width: unset;
  margin-left: auto;
  transition: border 0.2s, background 0.2s, color 0.2s;
  box-shadow: none;
}
.dock-card-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: #f2f2f2;
  border: 1px solid #b0b3b8;
  color: #b0b3b8;
}
.dock-card-btn:not(:disabled):hover {
  background: #e6f7ff;
  border: 1.5px solid #16bbf2;
  color: #16bbf2;
}
.dock-card-btn.active:not(:disabled) {
  color: #222;
}
/* 视频控制按钮样式 - 与无人机控制页面保持一致 */
.left-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.video-time {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.time-display {
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.play-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.play-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn:hover {
  background: rgba(89, 192, 252, 0.1);
}

.play-btn svg {
  width: 20px;
  height: 20px;
  fill: #59C0FC;
  transition: fill 0.3s ease;
}

.play-btn.paused svg {
  fill: #FF4D4F;
}

.play-btn.paused:hover {
  background: rgba(255, 77, 79, 0.1);
}

.center-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.refresh-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(89, 192, 252, 0.2);
}

.refresh-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.refresh-btn svg {
  width: 20px;
  height: 20px;
  fill: #59C0FC;
  transition: fill 0.3s ease;
}

.refresh-btn svg.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fullscreen-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-btn:hover {
  background: rgba(89, 192, 252, 0.2);
}

.fullscreen-btn svg {
  width: 20px;
  height: 20px;
  fill: #59C0FC;
}

.svg-icon {
  width: 20px;
  height: 20px;
  fill: #59C0FC;
}

.el-icon {
  color: #59C0FC;
  font-size: 20px;
}

/* 右侧控制按钮样式 - 与无人机控制页面保持一致 */
.right-controls {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.screen-icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}

.el-icon.dropdown-icon {
  color: #59C0FC;
  font-size: 20px;
  display: flex;
  align-items: center;
}

.el-icon.dropdown-icon svg {
  width: 20px;
  height: 20px;
  display: block;
  fill: #59C0FC !important;
}

.screen-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: rgba(0, 12, 23, .9);
  border: 1px solid rgba(89, 192, 252, 0.3);
  border-radius: 4px;
  padding: clamp(6px, 0.5vw, 8px) 0;
  min-width: clamp(100px, 8vw, 120px);
  margin-bottom: 8px;
  z-index: 10;
}

.menu-item {
  padding: clamp(6px, 0.5vw, 8px) clamp(12px, 1vw, 16px);
  color: #fff;
  font-size: clamp(12px, 0.9vw, 14px);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.menu-item:hover {
  background: rgba(89, 192, 252, 0.1);
  color: #59C0FC;
}

.screen-menu::after {
  content: '';
  position: absolute;
  bottom: -5px;
  right: 10px;
  width: 10px;
  height: 10px;
  background: rgba(0, 12, 23, .9);
  border-right: 1px solid rgba(89, 192, 252, 0.3);
  border-bottom: 1px solid rgba(89, 192, 252, 0.3);
  transform: rotate(45deg);
}

.right-controls .el-icon.dropdown-icon svg {
  transition: transform 0.2s, fill 0.2s;
}

.right-controls.active .el-icon.dropdown-icon svg {
  transform: rotate(180deg);
  fill: #16bbf2 !important;
}

/* 无人机追踪按钮样式 */
.drone-track-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(22, 34, 51, 0.9);
  border: 1px solid #164159;
  border-radius: 50%;
  color: #b8c7d9;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.drone-track-btn:hover {
  background: rgba(103, 213, 253, 0.1);
  border-color: #67d5fd;
  color: #67d5fd;
}

.drone-track-btn.active {
  background: rgba(103, 213, 253, 0.2);
  border-color: #67d5fd;
  color: #67d5fd;
}

.drone-track-btn svg {
  width: 16px;
  height: 16px;
}

/* 地图类型控件样式 */
:deep(.amap-maptype) {
  color: #000 !important;
  bottom: 110px !important; /* 从底部向上移动80px */
  right: 16px !important;
  z-index: 20 !important;
}

:deep(.amap-maptype-label) {
  color: #000 !important;
}

:deep(.amap-maptype-list) {
  color: #000 !important;
}

:deep(.amap-maptype-list-item) {
  color: #000 !important;
}
</style> 