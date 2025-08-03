<template>
  <div class="home-container">
    <!-- 左侧状态栏 -->
    <div class="left-box">
      <!-- 无人机状态 -->
      <div class="left-on1">
        <div class="cardTitle">
          <img src="@/assets/source_data/bg_data/card_logo.png" alt="" />
          无人机状态
        </div>
        <div class="on1-bottom">
          <div class="b-top">
            <div class="b-top-left">
              <div class="zhuangtai4">
                <div>{{ droneStatus?.isOnline ? '在线' : '离线' }}</div>
              </div>
              <div class="img">
                <img src="@/assets/source_data/plane_2.png" alt="" />
              </div>
            </div>
            <div class="b-top-right">
              <div class="b-top-rightCard">
                <div class="b-top-rightDiv">
                  <img src="@/assets/source_data/speed.png" alt="" />
                  <div>
                    <p>{{ formatSpeed(gpsStatus?.totalSpeed) }}</p>
                    <p>当前飞行速度</p>
                  </div>
                </div>
                <div class="b-top-rightDiv">
                  <img src="@/assets/source_data/today_time.png" alt="" />
                  <div>
                    <p>16天</p>
                    <p>累计运行时间</p>
                  </div>
                </div>
                <div class="b-top-rightDiv">
                  <img src="@/assets/source_data/total_miles.png" alt="" />
                  <div>
                    <p>18.3公里</p>
                    <p>累计飞行里程</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="b-bottom">
            <div class="status-row">
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/longitude.svg" alt="经度" />
                  <span class="label">经度</span>
                </div>
                <span class="value">{{ formatCoordinate(position?.longitude, 'longitude') }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/latitude.svg" alt="纬度" />
                  <span class="label">纬度</span>
                </div>
                <span class="value">{{ formatCoordinate(position?.latitude, 'latitude') }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/altitude.svg" alt="高度" />
                  <span class="label">高度</span>
                </div>
                <span class="value">{{ formatHeight(position?.height) }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/speed.svg" alt="速度" />
                  <span class="label">速度</span>
                </div>
                <span class="value">{{ formatSpeed(gpsStatus?.totalSpeed) }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/stars.svg" alt="搜星" />
                  <span class="label">搜星</span>
                </div>
                <span class="value">{{ gpsStatus?.gpsNumber || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 机场状态 -->
      <div class="left-on2">
        <div class="cardTitle">
          <img src="@/assets/source_data/bg_data/card_logo.png" alt="card logo" />
          机场状态
        </div>
        <div class="on2-bottom">
          <div class="b-top">
            <div class="b-top-left">
              <div class="zhuangtai4">
                <div>{{ dockStatus?.isOnline ? '在线' : '离线' }}</div>
              </div>
              <div class="img">
                <img src="@/assets/source_data/dock3.png" alt="" />
              </div>
            </div>
            <div class="b-top-right">
              <div class="b-top-rightCard">
                <div class="b-top-rightDiv">
                  <img src="@/assets/source_data/speed.png" alt="" />
                  <div>
                    <p>95KB/s</p>
                    <p>机场网络速率</p>
                  </div>
                </div>
                <div class="b-top-rightDiv">
                  <img src="@/assets/source_data/today_time.png" alt="" />
                  <div>
                    <p>{{ dockStatus?.jobNumber || 0 }}次</p>
                    <p>累计任务次数</p>
                  </div>
                </div>
                <div class="b-top-rightDiv">
                  <img src="@/assets/source_data/total_miles.png" alt="" />
                  <div>
                    <p>15小时</p>
                    <p>累计运行时长</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="b-bottom">
            <div class="status-row">
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/longitude.svg" alt="经度" />
                  <span class="label">经度</span>
                </div>
                <span class="value">{{ formatCoordinate(position?.longitude, 'longitude') }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/latitude.svg" alt="纬度" />
                  <span class="label">纬度</span>
                </div>
                <span class="value">{{ formatCoordinate(position?.latitude, 'latitude') }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/stock.svg" alt="舱盖" />
                  <span class="label">舱盖</span>
                </div>
                <span class="value">{{ dockStatus?.coverText || '--' }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/temperature.svg" alt="温度" />
                  <span class="label">温度</span>
                </div>
                <span class="value">{{ formatTemperature(environment?.environmentTemperature) }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/humidity.svg" alt="湿度" />
                  <span class="label">湿度</span>
                </div>
                <span class="value">{{ formatHumidity(environment?.humidity) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 任务下发 -->
      <div class="left-on3">
        <div class="cardTitle">
          <img src="@/assets/source_data/bg_data/card_logo.png" alt="card logo" />
          任务下发
        </div>
        <div class="on3-bottom">
          <div class="on3-bottom-center">
            <div class="control-row">
              <div class="div">航线名称：</div>
              <div class="el-select">
                <div class="el-select__wrapper">
                  <div class="el-select__selection">
                    <div class="el-select__selected-item el-select__placeholder">
                      <span>请选择</span>
                    </div>
                  </div>
                  <div class="el-select__suffix">
                    <i class="el-select__caret">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                        <path fill="currentColor" d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"></path>
                      </svg>
                    </i>
                  </div>
                </div>
              </div>
              <div class="button-group">
                <span class="span" @click="handleDispatchTask">下发任务</span>
                <span class="span1">取消任务</span>
              </div>
            </div>
            <!-- 修改第二行的结构 -->
            <div class="control-row second-row">
              <div class="button-group-second">
                <span class="span">航线暂停</span>
                <span class="span">航线恢复</span>
                <span class="span">一键返航</span>
                <span class="span1">取消返航</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 环境状态 -->
      <div class="left-on4">
        <div class="cardTitle">
          <img src="@/assets/source_data/bg_data/card_logo.png" alt="card logo" />
          环境状态
        </div>
        <div class="on4-bottom">
          <div class="env-status">
            <div class="env-item">
              <img src="@/assets/source_data/svg_data/env_temperature.svg" alt="温度" />
              <div class="env-info">
                <div class="env-label">环境温度</div>
                <div class="env-value">{{ formatTemperature(environment?.environmentTemperature) }}</div>
              </div>
            </div>
            <div class="env-item">
              <img src="@/assets/source_data/svg_data/env_wind.svg" alt="风速" />
              <div class="env-info">
                <div class="env-label">风速</div>
                <div class="env-value">{{ formatWindSpeed(environment?.windSpeed) }}</div>
              </div>
            </div>
            <div class="env-item">
              <img src="@/assets/source_data/svg_data/env_rain.svg" alt="降水量" />
              <div class="env-info">
                <div class="env-label">降水量</div>
                <div class="env-value">{{ formatRainfall(environment?.rainfall) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间区域 -->
    <div class="center-column">
      <!-- 视频播放区域 -->
      <div class="content-on1">
        <div class="boxGrid-box">
          <div class="boxGrid-box-content">
            <div class="player_container">
              <div class="player_item">
                <div class="player_box" id="player_box1">
                  <!-- 视频播放器 -->
                  <video 
                    ref="videoElement"
                    style="width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;"
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
              <!-- 视频时间显示 -->
              <div class="video-time">
                <span class="time-display">{{ currentTime }}</span>
              </div>
              <!-- 播放控制按钮 -->
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
                <!-- 全屏按钮放在播放按钮右侧 -->
                <button class="fullscreen-btn" @click="toggleFullscreen" title="全屏">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="center-controls">
              <!-- 中央控制区域现在为空 -->
            </div>
            <div class="right-controls" @click="toggleScreenMenu">
              <img src="@/assets/source_data/svg_data/nine_video.svg" class="screen-icon" />
              <i class="el-icon dropdown-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                  <path fill="currentColor" d="m192 384 320 384 320-384z"></path>
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

      <!-- 告警信息区域 -->
      <div class="content-on2">
        <div class="on2-top">
          <span :class="{ active: currentTab === 'device' }" @click="switchTab('device')">设备告警</span>
          <span :class="{ active: currentTab === 'inspection' }" @click="switchTab('inspection')">巡检告警</span>
        </div>
        <div class="on2-bottom">
          <table class="tableOne">
            <thead>
              <tr>
                <th>设备名称</th>
                <th>报警内容</th>
                <th>报警类型</th>
                <th>告警等级</th>
                <th>告警时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in currentAlarmData" :key="index">
                <td>{{ item.deviceName }}</td>
                <td>{{ item.content }}</td>
                <td>{{ item.type }}</td>
                <td>
                  <span :style="{ color: item.level === '严重' ? '#FF8000' : '' }">
                    {{ item.level }}
                  </span>
                </td>
                <td>{{ item.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="right-column">
      <!-- 告警趋势卡片 -->
      <div class="right-on1">
        <div class="cardTitle">
          <img src="@/assets/source_data/bg_data/card_logo.png" alt="card logo" />
          航线报表
        </div>
        <div class="chart-container">
          <div :ref="el => lineChartRef = el as HTMLElement" class="trend-chart"></div>
        </div>
      </div>

      <!-- 航线任务卡片 -->
      <div class="right-on2">
        <div class="cardTitle">
          <img src="@/assets/source_data/bg_data/card_logo.png" alt="card logo" />
          航线任务
        </div>
        <div class="chart-container">
          <div class="task-content">
            <div class="task-header">
              <div class="task-time">
                <div class="task-name">任务名称：高架路灯巡检</div>
                <div class="time-item">
                  <span class="label">任务开始时间：2025-07-16 17:00:00</span>
                  <span class="label">当前航点：第8个</span>
                </div>
              </div>
              <div class="task-status">
                <div class="status-btn waiting">未开始</div>
              </div>
            </div>
            <div class="task-progress">
              <div class="chart-box">
                <div class="progress-circle-container">
                  <div class="progress-circle">
                    <div class="progress-circle-outer-ring"></div>
                    <div class="progress-circle-left">
                      <div class="progress-circle-bar blue"></div>
                    </div>
                    <div class="progress-circle-right">
                      <div class="progress-circle-bar orange"></div>
                    </div>
                    <div class="progress-circle-center">
                      <div class="progress-text">
                        <span>进度</span>
                        <span class="percentage">50%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="chart-legend">
                  <div class="legend-item">
                    <span class="legend-color blue-gradient"></span>
                    <span>已巡检</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color orange-gradient"></span>
                    <span>待巡检</span>
                  </div>
                </div>
              </div>
              
              <div class="chart-box">
                <div class="progress-circle-container">
                  <div class="progress-circle">
                    <div class="circle-status">
                      <div :class="['status-circle', {'error': taskStatus === 'error'}]"></div>
                    </div>
                    <div class="progress-circle-center">
                      <div class="progress-text">
                        <span>任务</span>
                        <span>状态</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="chart-legend">
                  <div class="legend-item" @click="toggleTaskStatus">
                    <span class="legend-color green-gradient"></span>
                    <span>正常</span>
                  </div>
                  <div class="legend-item" @click="toggleTaskStatus">
                    <span class="legend-color red-gradient"></span>
                    <span>异常</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 地图信息卡片 -->
      <div class="right-on3">
        <div class="cardTitle">
          <img src="@/assets/source_data/bg_data/card_logo.png" alt="card logo" />
          地图信息
        </div>
        <div class="map-container" ref="mapContainer">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHmsAlerts, useDevices } from '../composables/useApi'
import { useDeviceStatus } from '../composables/useDeviceStatus'
import * as echarts from 'echarts'
import AMapLoader from '@amap/amap-jsapi-loader'
import flvjs from 'flv.js'

const router = useRouter()

// 使用HMS报警API和设备管理API
const { hmsAlerts, loading, error, fetchDeviceHms, setAllAlerts } = useHmsAlerts()
const { getCachedDeviceSns } = useDevices()

// 使用设备状态API
const { 
  fetchDeviceStatus, 
  fetchMainDeviceStatus,
  position, 
  environment, 
  dockStatus, 
  droneStatus, 
  gpsStatus,
  formatCoordinate,
  formatHeight,
  formatSpeed,
  formatTemperature,
  formatHumidity,
  formatWindSpeed,
  formatRainfall,
  formatBattery
} = useDeviceStatus()

// 当前标签页
const currentTab = ref('device')

// 设备告警数据
const deviceAlarmData = ref<any[]>([])

// 巡检告警数据
const inspectionAlarmData = ref([
  {
    deviceName: 'DJI-01',
    time: '2025-07-01 13:00:00',
    type: '巡检告警',
    level: '严重',
    content: '发现设备异常'
  },
  {
    deviceName: 'DJI-02',
    time: '2025-07-01 13:01:00',
    type: '巡检告警',
    level: '严重',
    content: '路灯损坏'
  },
  {
    deviceName: 'DJI-03',
    time: '2025-07-01 13:02:00',
    type: '巡检告警',
    level: '严重',
    content: '呼吸灯缺失'
  }
])

// 设备状态刷新定时器
let statusRefreshTimer: number | null = null

// 获取设备状态数据
const loadDeviceStatus = async () => {
  try {
    // 使用主要设备状态获取（自动使用第一个机场）
    await fetchMainDeviceStatus()
  } catch (err) {
    console.error('获取设备状态失败:', err)
  }
}

// 获取最新的三条报警数据
const loadLatestAlarmData = async () => {
  try {
    console.log('首页开始获取最新报警数据')
    const { dockSns, droneSns } = getCachedDeviceSns()
    const allSns = [...dockSns, ...droneSns]
    
    if (allSns.length === 0) {
      console.log('没有缓存设备，跳过获取报警数据')
      return
    }
    
    // 获取所有设备的报警数据
    const allAlerts: any[] = []
    
    for (const sn of allSns) {
      try {
        console.log('加载设备报警数据:', sn)
        const response = await fetchDeviceHms(sn)
        if (response && response.length > 0) {
          allAlerts.push(...response)
        }
      } catch (err) {
        console.error(`获取设备 ${sn} 报警数据失败:`, err)
      }
    }
    
    // 按时间排序，取最新的三条
    const sortedAlerts = allAlerts
      .sort((a, b) => b.create_time - a.create_time)
      .slice(0, 3)
    
    // 转换为首页需要的格式
    deviceAlarmData.value = sortedAlerts.map(alert => {
      const deviceType = dockSns.includes(alert.device_sn) ? '机场' : '无人机'
      return {
        deviceName: alert.device_sn,
        time: formatTimestamp(alert.create_time),
        type: deviceType,
        level: alert.level === 1 ? '普通' : '严重',
        content: alert.message_zh
      }
    })
    
    console.log('首页报警数据加载完成:', deviceAlarmData.value)
  } catch (err) {
    console.error('获取最新报警数据失败:', err)
  }
}

// 格式化时间
const formatTime = (seconds: number) => {
  // 处理NaN和Infinity的情况
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
    return '00:00'
  }
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 格式化时间戳为日期时间字符串
const formatTimestamp = (timestamp: number) => {
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

// 设置任务状态（正常/异常）
const taskStatus = ref('normal') // 'normal' 或 'error'

// 切换任务状态
const toggleTaskStatus = () => {
  taskStatus.value = taskStatus.value === 'normal' ? 'error' : 'normal'
}

// 计算当前显示的数据
const currentAlarmData = computed(() => {
  return currentTab.value === 'device' ? deviceAlarmData.value : inspectionAlarmData.value
})

// 切换标签
const switchTab = (tab: string) => {
  currentTab.value = tab
}

// 分屏控制
const showScreenMenu = ref(false)
const currentScreenMode = ref('一分屏')

const toggleScreenMenu = () => {
  showScreenMenu.value = !showScreenMenu.value
}

const selectScreenMode = (mode: string) => {
  currentScreenMode.value = mode
  showScreenMenu.value = false
}

// 告警趋势图表实例
let alarmTrendChart: echarts.ECharts | null = null
// 任务饼图实例
let taskPieChart1: echarts.ECharts | null = null
let taskPieChart2: echarts.ECharts | null = null

// 航线报表图表实例
let lineChart: echarts.ECharts | null = null

// 图表容器引用
const alarmTrendChartRef = ref<HTMLElement | null>(null)
const taskPieChart1Ref = ref<HTMLElement | null>(null)
const taskPieChart2Ref = ref<HTMLElement | null>(null)
const lineChartRef = ref<HTMLElement | null>(null)

// 地图容器ref和地图实例
const mapContainer = ref<HTMLElement | null>(null)
let amapInstance: any = null

// 视频播放器相关
const videoStreamUrl = ref<string>('')
const videoPlayer = ref<any>(null)
const videoElement = ref<HTMLVideoElement | null>(null)

// 视频播放控制相关
const isVideoPlaying = ref(false)
const currentTime = ref('00:00')
const totalTime = ref('00:00')

// 初始化视频播放器
const initVideoPlayer = () => {
  const savedVideoUrl = localStorage.getItem('video_stream_url')
  if (savedVideoUrl) {
    videoStreamUrl.value = savedVideoUrl
    console.log('从localStorage获取到视频流地址:', savedVideoUrl)
    
    // 延迟初始化播放器，确保DOM已经渲染
    nextTick(() => {
      startVideoPlayback()
    })
  } else {
    console.log('没有找到视频流地址')
  }
}

// 开始视频播放
const startVideoPlayback = () => {
  if (!videoElement.value || !videoStreamUrl.value) {
    console.log('视频元素或地址不存在')
    return
  }

  console.log('开始视频播放，地址:', videoStreamUrl.value)

  try {
    // 销毁之前的播放器实例
    if (videoPlayer.value) {
      videoPlayer.value.destroy()
      videoPlayer.value = null
    }

    // 添加视频事件监听器
    if (videoElement.value) {
      // 强制设置视频样式
      videoElement.value.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
      
      videoElement.value.addEventListener('play', () => {
        isVideoPlaying.value = true
      })
      
      videoElement.value.addEventListener('pause', () => {
        isVideoPlaying.value = false
      })
      
      videoElement.value.addEventListener('timeupdate', updateVideoTime)
      
      videoElement.value.addEventListener('loadedmetadata', () => {
        updateVideoTime()
      })
      
      // 确保视频加载后也应用样式
      videoElement.value.addEventListener('loadeddata', () => {
        videoElement.value!.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
      })
    }

    // 检查是否是webrtc地址
    if (videoStreamUrl.value.startsWith('webrtc://')) {
      console.log('检测到webrtc地址，使用WebRTC播放')
      startWebRTCPlayback()
    } else if (videoStreamUrl.value.startsWith('rtmp://')) {
      console.log('检测到rtmp地址，使用flv.js播放')
      
      if (flvjs.isSupported()) {
        console.log('浏览器支持flv.js，开始播放flv视频')
        
        // 将rtmp地址转换为http-flv地址
        const flvUrl = videoStreamUrl.value.replace(/^rtmp:\/\/[^\/]+/, 'http://10.10.1.3:8000')
        console.log('转换后的flv地址:', flvUrl)
        
        // 创建flv播放器
        videoPlayer.value = flvjs.createPlayer({
          type: 'flv',
          url: flvUrl,
          isLive: true,
          hasAudio: false,
          hasVideo: true
        }, {
          enableStashBuffer: false,
          stashInitialSize: 128,
          enableWorker: true,
          lazyLoad: false,
          autoCleanupSourceBuffer: true
        })

        // 绑定到video元素
        videoPlayer.value.attachMediaElement(videoElement.value)
        videoPlayer.value.load()
        videoPlayer.value.play()

        // 强制设置flv播放器的视频元素样式
        if (videoElement.value) {
          videoElement.value.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
        }

        console.log('flv播放器初始化成功')
      } else {
        console.error('浏览器不支持flv.js')
      }
    } else {
      console.log('未知地址格式，尝试直接播放:', videoStreamUrl.value)
      videoElement.value.src = videoStreamUrl.value
      videoElement.value.load()
      
      // 强制设置原生视频播放器样式
      videoElement.value.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
      
      videoElement.value.play().catch(error => {
        console.error('视频播放失败:', error)
      })
    }
  } catch (error) {
    console.error('视频播放器初始化失败:', error)
  }
}

// WebRTC播放器实例
let pc: RTCPeerConnection | null = null
let isPlaying = false

// 构建SRS API地址
const buildApiUrl = (webrtcUrl: string) => {
  try {
    // webrtc://server:8000/app/stream -> http://server:1985
    const url = new URL(webrtcUrl)
    return `http://${url.hostname}:1985`
  } catch (error) {
    console.error('解析WebRTC URL失败:', error)
    // 后备方案
    return webrtcUrl.replace('webrtc://', 'http://').replace(':8000', ':1985').split('/')[0]
  }
}

// 开始WebRTC播放
const startWebRTCPlayback = async () => {
  if (isPlaying) {
    console.log('WebRTC已在播放中，先停止当前播放')
    stopWebRTCPlayback()
  }

  const serverUrl = videoStreamUrl.value
  if (!serverUrl) {
    console.error('请输入服务器地址')
    return
  }

  try {
    console.log('正在连接WebRTC...')
    
    // 确保之前的连接已清理
    if (pc) {
      pc.close()
      pc = null
    }
    
    // 创建新的RTCPeerConnection
    pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    })

    // 处理远程流
    pc.ontrack = (e) => {
      console.log('收到远程流:', e.streams[0])
      if (videoElement.value) {
        videoElement.value.srcObject = e.streams[0]
        
        // 强制设置WebRTC视频播放器样式
        videoElement.value.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
        
        videoElement.value.play().catch(err => console.error('播放失败:', err))
      }
    }

    // ICE连接状态监听
    pc.oniceconnectionstatechange = () => {
      console.log('ICE连接状态:', pc?.iceConnectionState)
      if (pc?.iceConnectionState === 'connected') {
        console.log('WebRTC连接成功，正在播放...')
        isPlaying = true
      } else if (pc?.iceConnectionState === 'failed') {
        console.error('WebRTC连接失败')
        stopWebRTCPlayback()
      }
    }

    // 创建offer
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    
    await pc.setLocalDescription(offer)

    // 构建SRS API地址
    const apiUrl = buildApiUrl(serverUrl)
    console.log('API地址:', apiUrl)
    
    console.log('发送的请求数据:', {
      sdp: offer.sdp,
      streamurl: serverUrl
    })

    const response = await fetch(`${apiUrl}/rtc/v1/play/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sdp: offer.sdp,
        streamurl: serverUrl
      })
    })

    if (!response.ok) {
      throw new Error(`服务器响应错误: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.code !== 0) {
      throw new Error(`SRS错误: ${data.msg}`)
    }

    // 设置远程描述
    await pc.setRemoteDescription({
      type: 'answer',
      sdp: data.sdp
    })

    console.log('WebRTC连接建立成功')

  } catch (error) {
    console.error('WebRTC播放失败:', error)
    stopWebRTCPlayback()
  }
}

// 停止WebRTC播放
const stopWebRTCPlayback = () => {
  if (pc) {
    pc.close()
    pc = null
  }

  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
  
  isPlaying = false
  console.log('WebRTC播放已停止')
}

// 停止视频播放
const stopVideoPlayback = () => {
  // 停止WebRTC播放
  stopWebRTCPlayback()
  
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.unload()
    videoPlayer.value.detachMediaElement()
    videoPlayer.value.destroy()
    videoPlayer.value = null
    console.log('flv播放器已停止')
  }
  
  if (videoElement.value) {
    videoElement.value.pause()
    videoElement.value.src = ''
    videoElement.value.load()
    console.log('原生video播放器已停止')
  }
}

// 重新加载视频
const reloadVideo = () => {
  console.log('重新加载视频')
  stopVideoPlayback()
  // 增加延迟确保资源完全清理
  setTimeout(() => {
    startVideoPlayback()
  }, 500)
}

// 基本功能函数
const handleDispatchTask = () => {
  console.log('下发任务')
}

// 初始化告警趋势图表
const initAlarmTrendChart = () => {
  if (!alarmTrendChartRef.value) return
  
  alarmTrendChart = echarts.init(alarmTrendChartRef.value)
  const option = {
    grid: {
      top: '15%',
      left: '5%',
      right: '5%',
      bottom: '8%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['设备告警', '巡检告警', '环境告警', '任务告警'],
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12
      }
    },
    series: [
      {
        data: [180, 150, 90, 120],
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#FF8000'
              },
              {
                offset: 1,
                color: 'rgba(255, 128, 0, 0.1)'
              }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }
  alarmTrendChart.setOption(option)
}

// 初始化任务饼图
const initTaskPieCharts = () => {
  if (!taskPieChart1Ref.value || !taskPieChart2Ref.value) return

  // 进度环形图配置
  const progressOption = {
    backgroundColor: 'transparent',
    series: [
      {
        name: '巡检进度',
        type: 'pie',
        radius: ['75%', '90%'],
        center: ['50%', '45%'],
        startAngle: 90,
        silent: true,
        label: {
          show: false
        },
        emphasis: {
          scale: false,
          scaleSize: 0
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.3)'
        },
        data: [
          { 
            value: 25, 
            name: '已巡检',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#67d5fd' },
                  { offset: 1, color: '#2683b6' }
                ]
              },
              shadowBlur: 10,
              shadowColor: 'rgba(103, 213, 253, 0.3)'
            }
          },
          { 
            value: 75, 
            name: '待巡检',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#FF8000' },
                  { offset: 1, color: '#B25000' }
                ]
              },
              borderWidth: 1,
              borderColor: 'rgba(255, 128, 0, 0.3)'
            }
          }
        ],
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDuration: 1000
      }
    ]
  };

  // 状态环形图配置
  const statusOption = {
    backgroundColor: 'transparent',
    series: [
      {
        name: '任务状态',
        type: 'pie',
        radius: ['75%', '90%'],
        center: ['50%', '45%'],
        startAngle: 90,
        silent: true,
        label: {
          show: false
        },
        emphasis: {
          scale: false,
          scaleSize: 0
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.3)'
        },
        data: [
          { 
            value: 75, 
            name: '正常',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#52C41A' },
                  { offset: 1, color: '#3d9213' }
                ]
              },
              shadowBlur: 10,
              shadowColor: 'rgba(82, 196, 26, 0.3)'
            }
          },
          { 
            value: 25, 
            name: '异常',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#FF4D4F' },
                  { offset: 1, color: '#B22426' }
                ]
              },
              borderWidth: 1,
              borderColor: 'rgba(255, 77, 79, 0.3)'
            }
          }
        ],
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDuration: 1000
      }
    ]
  };

  taskPieChart1 = echarts.init(taskPieChart1Ref.value)
  taskPieChart2 = echarts.init(taskPieChart2Ref.value)

  taskPieChart1.setOption(progressOption)
  taskPieChart2.setOption(statusOption)
  
  // 添加图表动画效果
  const animateCharts = () => {
    if (taskPieChart1 && taskPieChart2) {
      // 为第一个图表添加旋转动画
      taskPieChart1.setOption({
        series: [{
          animation: true,
          animationDuration: 3000,
          animationEasingUpdate: 'cubicInOut'
        }]
      });
      
      // 为第二个图表添加旋转动画
      taskPieChart2.setOption({
        series: [{
          animation: true,
          animationDuration: 3000,
          animationEasingUpdate: 'cubicInOut'
        }]
      });
    }
  };
  
  // 初始动画
  animateCharts();
  
  // 每隔一段时间刷新动画效果
  setInterval(() => {
    animateCharts();
  }, 10000);
}

// 初始化航线报表图表
const initLineChart = () => {
  if (!lineChartRef.value) return
  
  lineChart = echarts.init(lineChartRef.value)
  const option = {
    grid: {
      top: '12%',
      left: '1%',
      right: '1%',
      bottom: '2%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      }
    },
    xAxis: {
      type: 'category',
      data: ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06', '10-07'],
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        margin: 8
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        margin: 8
      }
    },
    series: [
      {
        data: [120, 180, 150, 210, 190, 230, 200],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#59C0FC',
          borderWidth: 2,
          borderColor: '#fff'
        },
        lineStyle: {
          color: '#59C0FC',
          width: 3
        },
        label: {
          show: true,
          position: 'top',
          distance: 5,
          color: '#fff',
          fontSize: 11,
          backgroundColor: 'rgba(89, 192, 252, 0.2)',
          borderRadius: 4,
          padding: [2, 4],
          formatter: '{c}'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(89, 192, 252, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(89, 192, 252, 0.1)'
              }
            ]
          }
        }
      }
    ]
  }
  lineChart.setOption(option)
}

// 监听视频流地址变化
watch(() => videoStreamUrl.value, (newUrl) => {
  if (newUrl) {
    console.log('视频流地址已更新，重新初始化播放器')
    nextTick(() => {
      startVideoPlayback()
    })
  }
})

// 组件挂载时初始化
onMounted(async () => {
  // 获取最新报警数据
  await loadLatestAlarmData()
  
  // 加载设备状态数据
  await loadDeviceStatus()
  
  // 初始化视频播放器
  initVideoPlayer()
  
  // 初始化图表
  nextTick(() => {
    setTimeout(() => {
      initAlarmTrendChart()
      initTaskPieCharts()
      initLineChart()
    }, 100)
  })

  window.addEventListener('resize', () => {
    alarmTrendChart?.resize()
    taskPieChart1?.resize()
    taskPieChart2?.resize()
    lineChart?.resize()
  })

  // 初始化地图
  if (mapContainer.value) {
    AMapLoader.load({
      key: '6f9eaf51960441fa4f813ea2d7e7cfff',
      version: '2.0',
      plugins: ['AMap.ToolBar', 'AMap.Geolocation', 'AMap.PlaceSearch']
    }).then((AMap) => {
      amapInstance = new AMap.Map(mapContainer.value, {
        zoom: 12,
        center: [116.397428, 39.90923],
        logoEnable: false,
        copyrightEnable: false
      })
      // 放大缩小工具放左上角
      amapInstance.addControl(new AMap.ToolBar({ liteStyle: true, position: 'LT' }))
    }).catch((error) => {
      console.warn('地图加载失败:', error)
    })
  }
  
  // 设置设备状态自动刷新（每5秒）
  statusRefreshTimer = setInterval(async () => {
    await loadDeviceStatus()
  }, 5000)
})

// 组件卸载时清理
onUnmounted(() => {
  // 清理设备状态刷新定时器
  if (statusRefreshTimer) {
    clearInterval(statusRefreshTimer)
    statusRefreshTimer = null
  }
  
  // 停止视频播放
  stopVideoPlayback()
  
  // 清理WebRTC资源
  if (pc) {
    pc.close()
    pc = null
  }
  
  if (amapInstance) {
    amapInstance.destroy()
    amapInstance = null
  }
  if (alarmTrendChart) {
    alarmTrendChart.dispose()
  }
  if (taskPieChart1) {
    taskPieChart1.dispose()
  }
  if (taskPieChart2) {
    taskPieChart2.dispose()
  }
  if (lineChart) {
    lineChart.dispose()
  }
})

// 切换播放/暂停
const togglePlay = () => {
  if (!videoElement.value) return
  
  if (isVideoPlaying.value) {
    videoElement.value.pause()
  } else {
    videoElement.value.play()
  }
}

// 更新视频时间
const updateVideoTime = () => {
  if (!videoElement.value) return
  
  const current = videoElement.value.currentTime
  const duration = videoElement.value.duration
  
  // 处理无效的currentTime
  if (isNaN(current) || !isFinite(current) || current < 0) {
    currentTime.value = '00:00'
  } else {
    currentTime.value = formatTime(current)
  }
  
  // 处理无效的duration
  if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
    totalTime.value = formatTime(duration)
  } else {
    totalTime.value = '00:00'
  }
}

// 全屏功能
const toggleFullscreen = () => {
  const playerElement = document.querySelector('.player_box')
  
  if (!playerElement) {
    console.warn('视频播放器元素未找到')
    return
  }

  try {
    if (!document.fullscreenElement) {
      // 进入全屏
      if (playerElement.requestFullscreen) {
        playerElement.requestFullscreen()
      } else if ((playerElement as any).webkitRequestFullscreen) {
        // Safari
        (playerElement as any).webkitRequestFullscreen()
      } else if ((playerElement as any).mozRequestFullScreen) {
        // Firefox
        (playerElement as any).mozRequestFullScreen()
      } else if ((playerElement as any).msRequestFullscreen) {
        // IE/Edge
        (playerElement as any).msRequestFullscreen()
      }
    } else {
      // 退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        // Safari
        (document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        // Firefox
        (document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        // IE/Edge
        (document as any).msExitFullscreen()
      }
    }
  } catch (error) {
    console.error('全屏操作失败:', error)
    alert('全屏功能暂时不可用，请检查浏览器设置')
  }
}
</script>

<style scoped>
.home-container {
  display: grid;
  grid-template-columns: clamp(280px, 28vw, 480px) 1fr clamp(280px, 28vw, 480px);
  gap: 12px;
  padding: 20px;
  height: calc(100vh - 84px); /* 64px导航栏 + 20px间距 */
  background-color: #0a0f1c;
  color: #fff;
  box-sizing: border-box;
  position: fixed;
  top: 84px; /* 64px导航栏 + 20px间距 */
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
}

/* 左侧列样式 */
.left-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 124px); /* 64px导航栏 + 20px间距 + 40px内边距 */
  overflow-y: auto;
  width: clamp(280px, 28vw, 480px);
  gap: 20px; /* 统一卡片间距 */
}

/* 自定义滚动条样式 */
.left-box::-webkit-scrollbar {
  width: 4px;
}

.left-box::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.left-box::-webkit-scrollbar-thumb {
  background: rgba(0, 168, 255, 0.3);
  border-radius: 2px;
}

.left-box::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 168, 255, 0.5);
}

/* 左侧卡片通用样式 */
.left-on1, .left-on2, .left-on3, .left-on4 {
  overflow: hidden;
  margin-bottom: 0; /* 移除margin-bottom，使用gap控制间距 */
}

.left-on1 {
  width: 100%;
  height: calc((100vh - 124px) * 0.333 - 20px);
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
}

.left-on2 {
  width: 100%;
  height: calc((100vh - 124px) * 0.333 - 20px);
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
}

.left-on3 {
  width: 100%;
  height: calc((100vh - 124px) * 0.2 - 20px);
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
}

.left-on4 {
  width: 100%;
  height: calc((100vh - 124px) * 0.134);
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
  margin-bottom: 0;
}

.cardTitle {
  width: calc(100% - 10px);
  height: 41px;
  display: flex;
  justify-content: start;
  align-items: center;
  padding-left: 10px;
  background-image: url('@/assets/source_data/bg_data/card_title.png');
  background-size: 100% 100%;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  flex-shrink: 0;
}

.cardTitle img {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.on1-bottom, .on2-bottom, .on3-bottom, .on4-bottom {
  width: calc(100% - 40px);
  padding: 0 20px;
  height: calc(100% - 41px);
  position: relative;
}

/* 顶部区域 */
.b-top {
  width: 440px;
  height: 65%;
  display: flex;
  margin-top: -5px;
}

.b-top-left {
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  gap: clamp(10px, 2vw, 20px);
}

.b-top-right {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zhuangtai4 {
  width: 45%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: linear-gradient(270deg, #0187bf00, #0187bf66);
}

.zhuangtai4 > div {
  width: 64px;
  height: 68px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c6c7c7;
  font-size: 14px;
  font-weight: 500;
  background: url('@/assets/source_data/status.png') no-repeat;
  background-size: 100% 100%;
}

.img {
  width: 55%;
  aspect-ratio: 100/100;
  max-width: 100px;
  max-height: 100px;
}

.img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.b-top-rightCard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
  padding-right: 5px;
  padding-top: 15px;
  gap: 1px;
}

.b-top-rightDiv {
  width: 85%;
  min-height: 38px;
  height: auto;
  border-radius: 10px;
  background: linear-gradient(270deg, #0187bf4d, #0187bf00);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #d4edfd;
  padding: 0.5rem 0;
}

.b-top-rightDiv img {
  width: clamp(35px, 4vw, 48px);
  height: clamp(25px, 3vw, 35px);
  margin-right: 10px;
}

.b-top-rightDiv p:first-child {
  color: #d4edfd;
  font-size: clamp(14px, 1vw, 16px);
  font-weight: 600;
  margin-bottom: 3px;
  line-height: 1;
}

.b-top-rightDiv p:last-child {
  color: rgba(212, 237, 253, 0.7);
  font-size: clamp(10px, 0.8vw, 11px);
  line-height: 1;
}

.b-top-rightDiv .icon-back {
  width: 24px;
  height: 24px;
  color: #00a8ff;
}

/* 底部区域 */
.b-bottom {
  width: 440px;
  height: 30%;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  padding-bottom: 2%;
}

.status-row {
  width: 440px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  gap: 45px;
  height: 55px;
  padding: 0 10px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  justify-content: center;
  width: clamp(50px, 12%, 60px);
}

.status-item .top-row {
  display: flex;
  align-items: center;
  gap: 2px;
}

.status-item img {
  width: clamp(20px, 2.5vw, 24px);
  height: clamp(20px, 2.5vw, 24px);
  filter: brightness(0) saturate(100%) invert(69%) sepia(28%) saturate(469%) hue-rotate(169deg) brightness(91%) contrast(87%);
}

.status-item .label {
  color: rgba(212, 237, 253, 0.8);
  font-size: clamp(10px, 0.8vw, 11px);
  font-weight: 500;
}

.status-item .value {
  color: #d4edfd;
  font-size: clamp(12px, 0.9vw, 13px);
  font-weight: 600;
  text-align: center;
}

.icon-back {
  width: 16px;
  height: 16px;
  fill: currentColor;
  color: #00a8ff;
}

/* 状态网格样式 */
.status-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  padding: 0 20px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(0, 168, 255, 0.1);
  border-radius: 8px;
  padding: 12px 8px;
}

.grid-item .icon {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.grid-item .value {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

/* 下拉框样式 */
.el-select {
  width: 190px;
  border: 1px rgba(201, 59, 59, 0) solid;
  display: inline-block;
  position: relative;
  vertical-align: middle;
}

.el-select__wrapper {
  width: 190px;
  height: 32px;
  background-color: transparent;
  box-shadow: 0 0 0 1px #164159 inset;
  align-items: center;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  gap: 6px;
  line-height: 24px;
  padding: 4px 12px;
  position: relative;
  text-align: left;
}

.el-select__selection {
  flex: 1;
  position: relative;
}

.el-select__placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.el-select__suffix {
  display: flex;
  align-items: center;
}

.el-select__caret {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  height: 16px;
  width: 16px;
  display: inline-flex;
}

.el-select__caret svg {
  height: 100%;
  width: 100%;
}

/* 巡检点样式 */
.on2-bottom-center {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
}

.fabu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fabu .div {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  min-width: 60px;
}

.fabu .span {
  background: rgba(0, 168, 255, 0.1);
  border: 1px solid #00a8ff;
  color: #00a8ff;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
}

.fabu .span:hover {
  background: rgba(0, 168, 255, 0.2);
}

.fabu .span1 {
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
}

.fabu .span1:hover {
  background: rgba(255, 77, 79, 0.2);
}

/* 任务下发样式 */
.on3-bottom-center {
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2vh, 15px);
  height: 100%;
  padding: clamp(5px, 1vh, 10px) 0;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding-right: 20px;
  justify-content: flex-start;
}

.control-row .div {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  white-space: nowrap;
}

.control-row .span {
  width: clamp(60px, 6vw, 70px);
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #0c3c56;
  border-radius: 4px;
  border: 1px solid rgba(38, 131, 182, 0);
  color: #67d5fd;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  transition: all 0.3s;
}

.control-row .span:hover {
  border-color: rgba(38, 131, 182, 0.8);
  background: #0c4666;
}

.control-row .span1 {
  width: clamp(60px, 6vw, 70px);
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #561c1c;
  border-radius: 4px;
  border: 1px solid rgba(182, 38, 38, 0);
  color: #fd6767;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  transition: all 0.3s;
}

.control-row .span1:hover {
  border-color: rgba(182, 38, 38, 0.8);
  background: #662626;
}

/* 任务信息样式 */
.on4-bottom-t {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.on4-bottom-tl p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 5px 0;
}

.on4-bottom-tl span {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.on4-bottom-tr span {
  color: #00a8ff;
  font-size: 16px;
  font-weight: 500;
}

.on4-bottom-b {
  display: flex;
  gap: 10px;
}

.divon4 {
  flex: 1;
  height: 131px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

/* 中间列样式 */
.center-column {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 统一卡片间距 */
  height: calc(100vh - 124px);
  background: transparent;
  overflow: hidden;
  flex: 1;
}

/* 中间列内容样式 */
.content-on1 {
  width: 100%;
  height: calc((100vh - 124px) * 0.333 * 2 - 20px);
  background: transparent;
  border-radius: 4px;
  position: relative;
  padding: 20px;
}

.content-on1::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/source_data/bg_data/video_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 1;
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
}

.boxGrid-box-content {
  flex: 1;
  position: relative;
  padding: 0 !important;
  margin: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
}

.player_container {
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  overflow: hidden !important;
  background: #000 !important;
}

.player_item {
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  overflow: hidden !important;
}

.player_box {
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  background: #000 !important;
  border-radius: 0 !important;
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

/* 强制视频元素填满整个容器 */
.player_box video,
.player_box canvas,
.player_box img,
.player_box > * {
  width: 100% !important;
  height: 100% !important;
  object-fit: fill !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  outline: none !important;
  box-sizing: border-box !important;
  display: block !important;
}

/* 专门针对 flv.js 播放器的样式 */
.player_box .flv-player,
.player_box .flv-player *,
.player_box .video-js,
.player_box .video-js *,
.player_box .vjs-tech {
  width: 100% !important;
  height: 100% !important;
  object-fit: fill !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  outline: none !important;
  box-sizing: border-box !important;
}

/* WebRTC 和其他流媒体播放器 */
.player_box canvas[data-webrtc],
.player_box video[data-webrtc] {
  width: 100% !important;
  height: 100% !important;
  object-fit: fill !important;
  transform: none !important;
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

/* 告警信息区域样式 */
.content-on2 {
  width: 100%;
  height: calc((100vh - 124px) * 0.334);
  background-image: url('@/assets/source_data/bg_data/card_second_body.png');
  background-size: 100% 100%;
  overflow: hidden;
}

.on2-top {
  height: 41px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-image: url('@/assets/source_data/bg_data/card_second_body_title.png');
  background-size: 100% 100%;
}

.on2-top span {
  padding: 0 20px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 14px;
  height: 100%;
  display: flex;
  align-items: center;
}

.on2-top span.active {
  color: rgb(89, 192, 252);
  font-weight: 500;
}

.on2-bottom {
  height: calc(100% - 41px);
  width: 100%;
  padding: 8px 15px;
  overflow: hidden;
}

.tableOne {
  width: calc(100% - 2px);
  height: calc(100% - 4px);
  border-collapse: collapse;
  background: transparent;
  color: #fff;
  border-spacing: 0;
  table-layout: fixed;
  margin: 0 auto;
  border-radius: 4px;
  overflow: hidden;
}

.tableOne thead {
  width: 100%;
}

.tableOne tbody {
  width: 100%;
  display: block;
  height: 156px; /* 固定高度为3行的高度 52px * 3 */
  overflow-y: hidden;
}

.tableOne tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.tableOne th,
.tableOne td {
  padding: 0;
  text-align: center;
  border: none;
  font-size: 14px;
  line-height: 52px;
  height: 52px;
  color: rgba(255, 255, 255, 0.9);
}

/* 删除列分隔线的样式，改为行分隔线 */
.tableOne tr:not(:last-child) td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* 表头底部的分隔线稍微加深一点 */
.tableOne thead tr th {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

/* 设置列宽 */
.tableOne th:nth-child(1),
.tableOne td:nth-child(1) {
  width: 15%;
}

.tableOne th:nth-child(2),
.tableOne td:nth-child(2) {
  width: 35%;
}

.tableOne th:nth-child(3),
.tableOne td:nth-child(3) {
  width: 15%;
}

.tableOne th:nth-child(4),
.tableOne td:nth-child(4) {
  width: 10%;
}

.tableOne th:nth-child(5),
.tableOne td:nth-child(5) {
  width: 25%;
}

.tableOne th {
  background-color: rgba(0, 28, 46, 0.95);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
}

.tableOne td {
  background-color: rgba(0, 28, 46, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tableOne tr:nth-child(even) td {
  background-color: rgba(0, 28, 46, 0.4);
}

.tableOne tr:hover td {
  background-color: rgba(0, 28, 46, 0.6);
}

.tableOne td span[style*="color: #FF8000"] {
  color: #FF4D4F !important;
}

:deep(.el-table) {
  background-color: transparent;
  color: #fff;
}

:deep(.el-table tr) {
  background-color: transparent;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: rgba(255, 255, 255, 0.05);
}

:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-table__inner-wrapper::before) {
  display: none;
}

/* 右侧列样式 */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 统一卡片间距 */
  height: calc(100vh - 124px);
  overflow-y: auto;
  width: clamp(280px, 28vw, 480px);
}

.right-column::-webkit-scrollbar {
  width: 4px;
}

.right-column::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.right-column::-webkit-scrollbar-thumb {
  background: rgba(0, 168, 255, 0.3);
  border-radius: 2px;
}

.right-column::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 168, 255, 0.5);
}

.icon-back {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.cardTitle .icon-back {
  width: 18px;
  height: 18px;
  color: #00a8ff;
}

.b-top-rightDiv .icon-back {
  width: 24px;
  height: 24px;
  color: #00a8ff;
}

.b-bottom-top .icon-back,
.b-bottom-bottom .icon-back {
  width: 16px;
  height: 16px;
  color: #00a8ff;
}

.button-group {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.button-group-second {
  display: flex;
  gap: clamp(20px, 2vw, 26px);
  margin-left: auto;  /* 靠右对齐 */
  padding-right: 20px;
}

.button-group-second .span,
.button-group-second .span1 {
  width: clamp(80px, 8vw, 90px);
}

.button-group-second .span:first-child {
  margin-left: 0;
}

.button-group-second .span1:last-child {
  margin-right: 0;
}

/* 环境状态样式 */
.env-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(15px, 2vh, 20px) clamp(15px, 2vw, 20px) clamp(15px, 2vh, 20px) clamp(8px, 1vw, 10px);
  height: 100%;
  gap: clamp(30px, 4vw, 40px);
}

.env-item {
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.5vw, 15px);
}

.env-item img {
  width: clamp(32px, 4vw, 38px);
  height: clamp(32px, 4vw, 38px);
  filter: brightness(0) saturate(100%) invert(80%) sepia(33%) saturate(7493%) hue-rotate(157deg) brightness(101%) contrast(101%);
}

.env-info {
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 0.8vh, 6px);
}

.env-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: clamp(12px, 1vw, 13px);
  min-width: clamp(60px, 5vw, 65px);
  white-space: nowrap;
}

.env-value {
  color: #67d5fd;
  font-size: clamp(16px, 1.2vw, 18px);
  font-weight: 500;
}

.right-controls {
  display: flex;
  align-items: center;
  gap: clamp(6px, 0.5vw, 8px);
  cursor: pointer;
  position: relative;
  padding: clamp(4px, 0.4vw, 6px) clamp(6px, 0.5vw, 8px);
  border-radius: 4px;
  transition: all 0.3s;
}

.right-controls:hover {
  background: rgba(255, 255, 255, 0.1);
}

.screen-icon {
  width: clamp(16px, 1.2vw, 18px);
  height: clamp(16px, 1.2vw, 18px);
  filter: brightness(0) saturate(100%) invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
  margin-right: -2px;
}

.dropdown-icon {
  color: rgba(255, 255, 255, 0.5);
  font-size: clamp(10px, 0.8vw, 12px);
  display: flex;
  align-items: center;
  margin-left: 2px;
}

.dropdown-icon svg {
  width: clamp(12px, 1vw, 14px);
  height: clamp(12px, 1vw, 14px);
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

/* 添加一个小三角形 */
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

/* 右侧卡片通用样式 */
.right-on1,
.right-on2,
.right-on3 {
  width: 100%;
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
  margin-bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cardTitle {
  width: calc(100% - 10px);
  height: 41px;
  display: flex;
  justify-content: start;
  align-items: center;
  padding-left: 10px;
  background-image: url('@/assets/source_data/bg_data/card_title.png');
  background-size: 100% 100%;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  flex-shrink: 0;
}

.cardTitle img {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.right-on1,
.right-on2 {
  height: calc((100vh - 124px) * 0.333 - 20px);
}

.right-on3 {
  flex: 1;
  min-height: 0;
  /* 保持卡片风格一致 */
  width: 100%;
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
  margin-bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  width: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-chart {
  width: calc(100% - 40px);
  height: calc(100% - 20px);
  margin-top: clamp(-18px, -2vw, -25px);
}

/* 航线任务样式 */
.task-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  gap: 10px;
}

.task-header {
  width: calc(100% - 20px);
  height: 50px;
  margin: 10px 10px 0 10px;
  background: linear-gradient(#1f87cc33, #1f87cc00);
  border: 1px solid #164159;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.task-name {
  color: #59bfff;
  font-size: 14px;
  line-height: 25px;
  margin: 0;
  padding: 0;
  text-align: left;
}

.task-time {
  display: flex;
  flex-direction: column;
  width: calc(70% - 10px);
  justify-content: flex-start;
  align-items: flex-start;
}

.time-item {
  display: flex;
  align-items: center;
  height: 25px;
  line-height: 25px;
  gap: 20px;
  padding: 0;
}

.time-item .label {
  color: #59bfff;
  font-size: 12px;
  white-space: nowrap; /* 防止文字换行 */
}

.task-status {
  padding-right: 10px;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
}

.status-btn.waiting {
  width: 60px;
  height: 20px;
  text-align: center;
  color: #c4cdc9;
  background: linear-gradient(#0bed9654, #0bed9600);
  box-shadow: inset 0 0 6px #0bed96;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid #0BED96;
  line-height: 20px;
  padding: 0;
}

/* 任务进度图表样式调整 */
.task-progress {
  width: 100%;
  height: calc(100% - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px 10px;
  margin: 0;
  gap: 30px;
}

.chart-box {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 15px;
  padding-bottom: 20px;
}

/* 新的圆环进度条样式 */
.progress-circle-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.progress-circle {
  position: relative;
  width: 100%;
  height: 100%;
}

.progress-circle-left,
.progress-circle-right {
  position: absolute;
  width: 40px;
  height: 80px;
  top: 0;
  overflow: hidden;
}

.progress-circle-left {
  left: 0;
}

.progress-circle-right {
  right: 0;
}

.progress-circle-bar {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 4px solid transparent;
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}

.progress-circle-left .progress-circle-bar {
  left: 0;
  border-top: 4px solid;
  border-left: 4px solid;
  border-bottom: 4px solid;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform-origin: right center;
  transform: rotate(0deg);
}

.progress-circle-right .progress-circle-bar {
  right: 0;
  border-top: 4px solid;
  border-right: 4px solid;
  border-bottom: 4px solid;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  transform-origin: left center;
  transform: rotate(0deg);
}

.progress-circle-bar.blue {
  border-color: #00e1ff;
  box-shadow: 0 0 15px rgba(0, 225, 255, 0.9), inset 0 0 8px rgba(0, 225, 255, 0.7);
  transform: rotate(180deg);
}

.progress-circle-bar.orange {
  border-color: #ff8000;
  box-shadow: 0 0 15px rgba(255, 128, 0, 0.9), inset 0 0 8px rgba(255, 128, 0, 0.7);
  transform: rotate(180deg);
}

.progress-circle-bar.green {
  border-color: #00ff7f;
  box-shadow: 0 0 10px rgba(0, 255, 127, 0.7), inset 0 0 5px rgba(0, 255, 127, 0.5);
  transform: rotate(180deg);
}

.progress-circle-bar.red {
  border-color: #ff4d4f;
  box-shadow: 0 0 10px rgba(255, 77, 79, 0.7), inset 0 0 5px rgba(255, 77, 79, 0.5);
  transform: rotate(0deg);
}

.progress-circle-center {
  position: absolute;
  width: 64px;
  height: 64px;
  top: 8px;
  left: 8px;
  border-radius: 50%;
  background-color: rgba(0, 12, 23, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.8);
}

/* 修改为环形进度线 */
.progress-circle-center::before {
  content: '';
  position: absolute;
  width: 52px;
  height: 52px;
  top: 6px;
  left: 6px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top: 2px solid #00e1ff;
  border-left: 2px solid #00e1ff;
  border-bottom: 2px solid #ff8000;
  border-right: 2px solid #ff8000;
  box-sizing: border-box;
  transform: rotate(45deg);
  box-shadow: 0 0 10px rgba(0, 225, 255, 0.5);
}

.progress-circle-center::after {
  content: '';
  position: absolute;
  width: 72px;
  height: 72px;
  top: -4px;
  left: -4px;
  border-radius: 50%;
  background: rgba(0, 12, 23, 0.9);
  clip-path: inset(35px 4px 35px 4px);
  z-index: -1;
}

.progress-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.progress-text span {
  color: #00e1ff;
  font-size: 14px;
  line-height: 1.2;
  text-shadow: 0 0 8px rgba(0, 225, 255, 0.9);
}

.progress-text .percentage {
  font-size: 24px;
  font-weight: bold;
  margin-top: 2px;
  color: #00e1ff;
  text-shadow: 0 0 10px rgba(0, 225, 255, 1);
}

.chart-box:nth-child(2) .progress-text span {
  color: #00ff7f;
  text-shadow: 0 0 5px rgba(0, 255, 127, 0.7);
}

/* 图例样式 */
.chart-legend {
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-top: 15px;
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
}

.blue-gradient {
  background: linear-gradient(90deg, #00e1ff, #0088a3);
}

.orange-gradient {
  background: linear-gradient(90deg, #ff8000, #B25000);
}

.green-gradient {
  background: linear-gradient(90deg, #00ff7f, #00b359);
}

.red-gradient {
  background: linear-gradient(90deg, #ff4d4f, #B22426);
}

.legend-item span:last-child {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.chart-box:first-child .legend-item:first-child span:last-child {
  color: #00e1ff;
  text-shadow: 0 0 3px rgba(0, 225, 255, 0.5);
}

.chart-box:first-child .legend-item:last-child span:last-child {
  color: #ff8000;
  text-shadow: 0 0 3px rgba(255, 128, 0, 0.5);
}

.chart-box:last-child .legend-item:first-child span:last-child {
  color: #00ff7f;
  text-shadow: 0 0 3px rgba(0, 255, 127, 0.5);
}

.chart-box:last-child .legend-item:last-child span:last-child {
  color: #ff4d4f;
  text-shadow: 0 0 3px rgba(255, 77, 79, 0.5);
}

/* 响应式调整 */
@media (max-width: 1400px) {
  .progress-circle-container {
    width: 75px;
    height: 75px;
  }
  
  .progress-circle-left,
  .progress-circle-right {
    width: 37.5px;
    height: 75px;
  }
  
  .progress-circle-bar {
    width: 75px;
    height: 75px;
  }
  
  .progress-circle-center {
    width: 59px;
    height: 59px;
    top: 8px;
    left: 8px;
  }
  
  .progress-text span {
    font-size: 13px;
  }
  
  .progress-text .percentage {
    font-size: 22px;
  }
  
  .status-circle {
    width: 75px;
    height: 75px;
  }
  
  .progress-circle-outer-ring {
    width: 85px;
    height: 85px;
  }
}

@media (max-width: 1200px) {
  .progress-circle-container {
    width: 70px;
    height: 70px;
  }
  
  .progress-circle-left,
  .progress-circle-right {
    width: 35px;
    height: 70px;
  }
  
  .progress-circle-bar {
    width: 70px;
    height: 70px;
    border-width: 3px;
  }
  
  .progress-circle-left .progress-circle-bar {
    border-width: 3px;
  }
  
  .progress-circle-right .progress-circle-bar {
    border-width: 3px;
  }
  
  .progress-circle-center {
    width: 56px;
    height: 56px;
    top: 7px;
    left: 7px;
  }
  
  .progress-text span {
    font-size: 13px;
  }
  
  .progress-text .percentage {
    font-size: 20px;
  }
  
  .status-circle {
    width: 70px;
    height: 70px;
    border-width: 3px;
  }
  
  .progress-circle-outer-ring {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 992px) {
  .progress-circle-container {
    width: 65px;
    height: 65px;
  }
  
  .progress-circle-left,
  .progress-circle-right {
    width: 32.5px;
    height: 65px;
  }
  
  .progress-circle-bar {
    width: 65px;
    height: 65px;
    border-width: 3px;
  }
  
  .progress-circle-center {
    width: 51px;
    height: 51px;
    top: 7px;
    left: 7px;
  }
  
  .status-circle {
    width: 65px;
    height: 65px;
    border-width: 3px;
  }
  
  .progress-circle-outer-ring {
    width: 75px;
    height: 75px;
  }
}

@media (max-width: 768px) {
  .progress-circle-container {
    width: 60px;
    height: 60px;
  }
  
  .progress-circle-left,
  .progress-circle-right {
    width: 30px;
    height: 60px;
  }
  
  .progress-circle-bar {
    width: 60px;
    height: 60px;
    border-width: 3px;
  }
  
  .progress-circle-left .progress-circle-bar {
    border-width: 3px;
  }
  
  .progress-circle-right .progress-circle-bar {
    border-width: 3px;
  }
  
  .progress-circle-center {
    width: 48px;
    height: 48px;
    top: 6px;
    left: 6px;
  }
  
  .progress-text span {
    font-size: 11px;
  }
  
  .progress-text .percentage {
    font-size: 16px;
  }
  
  .status-circle {
    width: 60px;
    height: 60px;
    border-width: 3px;
  }
  
  .progress-circle-outer-ring {
    width: 70px;
    height: 70px;
  }
}

/* 地图容器样式 */
.map-container {
  height: calc(100% - 41px - 10px); /* 41px为标题高度，10px为上下5px间距 */
  margin: 5px;
  overflow: hidden;
  position: relative;
  border-radius: 4px;
  background: #0a1929;
}

:deep(.amap-copyright) {
  display: none !important;
}

/* 航线任务卡片响应式样式 */
@media (max-width: 1400px) {
  .task-header {
    padding: 0 clamp(10px, 1.5vw, 15px);
  }

  .task-name {
    font-size: clamp(12px, 1vw, 14px);
  }

  .time-item {
    gap: clamp(10px, 1.5vw, 20px);
  }

  .time-item .label {
    font-size: clamp(11px, 0.9vw, 12px);
  }

  .task-progress {
    gap: clamp(15px, 1.5vw, 20px);
  }
  
  .progress-circle-left .progress-circle-bar {
    border-top-left-radius: 55px;
    border-bottom-left-radius: 55px;
  }
  
  .progress-circle-right .progress-circle-bar {
    border-top-right-radius: 55px;
    border-bottom-right-radius: 55px;
  }
}

@media (max-width: 1200px) {
  .task-time {
    width: 65%;
  }

  .task-status {
    width: 35%;
  }

  .status-btn.waiting {
    width: clamp(50px, 5vw, 60px);
    font-size: clamp(11px, 0.9vw, 12px);
  }

  .legend-item span:last-child {
    font-size: clamp(11px, 0.9vw, 12px);
  }
}

@media (max-width: 992px) {
  .task-header {
    height: auto;
    min-height: 50px;
    padding: clamp(8px, 1vw, 10px) clamp(8px, 1.2vw, 12px);
  }

  .task-time {
    width: 60%;
  }

  .task-status {
    width: 40%;
  }

  .time-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    height: auto;
  }
  
  .progress-circle-left .progress-circle-bar {
    border-top-left-radius: 45px;
    border-bottom-left-radius: 45px;
  }
  
  .progress-circle-right .progress-circle-bar {
    border-top-right-radius: 45px;
    border-bottom-right-radius: 45px;
  }
}

@media (max-width: 768px) {
  .task-content {
    gap: 15px;
  }

  .task-header {
    margin: 5px;
  }

  .task-time {
    width: 100%;
  }

  .task-status {
    display: none;
  }

  .task-progress {
    flex-direction: column;
    height: auto;
    gap: 10px;
  }
  
  .chart-box {
    height: 120px;
  }
  
  .progress-circle-left .progress-circle-bar {
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
  }
  
  .progress-circle-right .progress-circle-bar {
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
  }
  
  .progress-circle-value span:first-child {
    font-size: 12px;
  }
  
  .progress-circle-value span:last-child {
    font-size: 16px;
  }
}

.progress-circle-right.status {
  width: 100%;
  height: 100%;
  right: 0;
  overflow: visible;
}

.progress-circle-right.status .progress-circle-bar {
  width: 120px;
  height: 120px;
  border: 4px solid transparent;
  border-radius: 50%;
  border-left: 0;
  transform: rotate(0);
  right: 0;
  border-color: #ff4d4f;
  box-shadow: 0 0 10px rgba(255, 77, 79, 0.7), inset 0 0 5px rgba(255, 77, 79, 0.5);
  clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
}

.progress-circle-status {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.progress-circle-bar.green-circle {
  position: absolute;
  width: 120px;
  height: 120px;
  border: 4px solid #00ff7f;
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: 0 0 10px rgba(0, 255, 127, 0.7), inset 0 0 5px rgba(0, 255, 127, 0.5);
}

/* 新增状态圆环样式 */
.circle-status {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.status-circle {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 4px solid #00ff7f;
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: 0 0 10px rgba(0, 255, 127, 0.7), inset 0 0 5px rgba(0, 255, 127, 0.5);
  transition: all 0.3s ease;
}

.status-circle.error {
  border-color: #ff4d4f;
  box-shadow: 0 0 10px rgba(255, 77, 79, 0.7), inset 0 0 5px rgba(255, 77, 79, 0.5);
}

@media (max-width: 1400px) {
  .status-circle {
    width: 110px;
    height: 110px;
  }
}

@media (max-width: 1200px) {
  .status-circle {
    width: 100px;
    height: 100px;
    border-width: 3px;
  }
}

@media (max-width: 992px) {
  .status-circle {
    width: 90px;
    height: 90px;
    border-width: 3px;
  }
}

@media (max-width: 768px) {
  .status-circle {
    width: 80px;
    height: 80px;
    border-width: 3px;
  }
}

.progress-circle-outer-ring {
  position: absolute;
  width: 90px;
  height: 90px;
  top: -5px;
  left: -5px;
  border-radius: 50%;
  border: 2px solid rgba(0, 225, 255, 0.5);
  box-sizing: border-box;
  box-shadow: 0 0 20px rgba(0, 225, 255, 0.5), inset 0 0 10px rgba(0, 225, 255, 0.3);
  pointer-events: none;
  z-index: 1;
  animation: pulse 2s infinite alternate;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 15px rgba(0, 225, 255, 0.4), inset 0 0 8px rgba(0, 225, 255, 0.2);
  }
  100% {
    box-shadow: 0 0 25px rgba(0, 225, 255, 0.6), inset 0 0 12px rgba(0, 225, 255, 0.4);
  }
}

@media (max-width: 1400px) {
  .progress-circle-outer-ring {
    width: 120px;
    height: 120px;
    top: -5px;
    left: -5px;
  }
}

@media (max-width: 1200px) {
  .progress-circle-outer-ring {
    width: 110px;
    height: 110px;
    top: -5px;
    left: -5px;
  }
}

@media (max-width: 992px) {
  .progress-circle-outer-ring {
    width: 100px;
    height: 100px;
    top: -5px;
    left: -5px;
  }
}

@media (max-width: 768px) {
  .progress-circle-outer-ring {
    width: 90px;
    height: 90px;
    top: -5px;
    left: -5px;
  }
}

/* 响应式调整内部进度线 */
@media (max-width: 1400px) {
  .progress-circle-center::before,
  .progress-circle-center::after {
    width: 67px;
    height: 67px;
    top: -4px;
    left: -4px;
  }
  
  .progress-circle-center::before {
    clip-path: inset(31px 0 31px 0);
  }
  
  .progress-circle-center::after {
    clip-path: inset(32px 4px 32px 4px);
  }
}

@media (max-width: 1200px) {
  .progress-circle-center::before,
  .progress-circle-center::after {
    width: 64px;
    height: 64px;
    top: -4px;
    left: -4px;
  }
  
  .progress-circle-center::before {
    clip-path: inset(29px 0 29px 0);
  }
  
  .progress-circle-center::after {
    clip-path: inset(30px 4px 30px 4px);
  }
}

@media (max-width: 992px) {
  .progress-circle-center::before,
  .progress-circle-center::after {
    width: 59px;
    height: 59px;
    top: -4px;
    left: -4px;
  }
  
  .progress-circle-center::before {
    clip-path: inset(27px 0 27px 0);
  }
  
  .progress-circle-center::after {
    clip-path: inset(28px 4px 28px 4px);
  }
}

@media (max-width: 768px) {
  .progress-circle-center::before,
  .progress-circle-center::after {
    width: 56px;
    height: 56px;
    top: -4px;
    left: -4px;
  }
  
  .progress-circle-center::before {
    clip-path: inset(25px 0 25px 0);
  }
  
  .progress-circle-center::after {
    clip-path: inset(26px 4px 26px 4px);
  }
}

/* 修改为环形进度线 - 只应用于左边的环形图 */
.chart-box:first-child .progress-circle-center::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  top: 2px;
  left: 2px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top: 2px solid #00e1ff;
  border-left: 2px solid #00e1ff;
  border-bottom: 2px solid #ff8000;
  border-right: 2px solid #ff8000;
  box-sizing: border-box;
  transform: rotate(45deg);
  box-shadow: 0 0 10px rgba(0, 225, 255, 0.5);
}

/* 去掉第二个环形图内的颜色环线 */
.chart-box:last-child .progress-circle-center::before {
  display: none;
}

.chart-box:last-child .progress-circle-center::after {
  display: none;
}

/* 响应式调整内部进度线 - 只应用于左边的环形图 */
@media (max-width: 1400px) {
  .chart-box:first-child .progress-circle-center::before {
    width: 56px;
    height: 56px;
    top: 1.5px;
    left: 1.5px;
  }
}

@media (max-width: 1200px) {
  .chart-box:first-child .progress-circle-center::before {
    width: 52px;
    height: 52px;
    top: 2px;
    left: 2px;
  }
}

@media (max-width: 992px) {
  .chart-box:first-child .progress-circle-center::before {
    width: 48px;
    height: 48px;
    top: 1.5px;
    left: 1.5px;
  }
}

@media (max-width: 768px) {
  .chart-box:first-child .progress-circle-center::before {
    width: 44px;
    height: 44px;
    top: 2px;
    left: 2px;
  }
}

/* 第一个环形图的字体缩小 */
.chart-box:first-child .progress-text span {
  font-size: 12px;
}

.chart-box:first-child .progress-text .percentage {
  font-size: 20px;
}

.map-search-input {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 220px;
  height: 36px;
  border-radius: 18px;
  border: none;
  padding: 0 16px;
  font-size: 15px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  z-index: 20;
  outline: none;
}
.map-search-list {
  position: absolute;
  top: 56px;
  right: 16px;
  width: 220px;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 21;
  margin: 0;
  padding: 0;
  list-style: none;
}
.map-search-list li {
  padding: 8px 16px;
  cursor: pointer;
}
.map-search-list li:hover {
  background: #f0f0f0;
}

.map-search-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(0,0,0,0.7);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  cursor: pointer;
  transition: background 0.2s;
}
.map-search-btn:hover {
  background: #00a8ff;
}
.map-search-modal {
  position: absolute;
  top: 16px;
  right: 64px;
  background: rgba(0,0,0,0.92);
  border-radius: 10px;
  padding: 18px 48px 18px 18px;
  z-index: 40;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 16px rgba(0,0,0,0.18);
}
.map-search-modal-input {
  width: 220px;
  height: 36px;
  border-radius: 18px;
  border: none;
  padding: 0 16px;
  font-size: 15px;
  background: #fff;
  color: #333;
  outline: none;
}
.map-search-modal-close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  color: #888;
  font-size: 22px;
  cursor: pointer;
  z-index: 41;
}

.video-time {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.8);
}

.time-display,
.time-separator,
.time-display {
  font-size: 14px;
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
  padding: 0;
}

.play-btn svg {
  width: 24px;
  height: 24px;
  fill: #59C0FC;
}

.paused {
  fill: #FF4D4F;
}

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

.time-separator {
  color: rgba(255, 255, 255, 0.5);
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
  /* 移除绝对定位，因为现在center-controls为空 */
}

.fullscreen-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #59C0FC; /* 设置默认颜色 */
}

.fullscreen-btn:hover {
  background: rgba(89, 192, 252, 0.1);
  color: #16bbf2; /* 悬停时改变颜色 */
}

.fullscreen-btn svg {
  width: 24px;
  height: 24px;
  transition: color 0.3s ease;
  fill: currentColor; /* 使用当前文字颜色 */
}
</style>