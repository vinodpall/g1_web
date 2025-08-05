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
          <!-- 无人机信息+IO卡片 -->
          <div class="card drone-info-card in-box-top-left">
            <div class="on1-l">
              <div class="on1-lt">
                <!-- 左栏：图片+电池 -->
                <div class="on1-ltl on1-ltl-main">
                  <div class="on1-ltlt drone-img-battery-block">
                    <img class="plane-img" :src="plane2Img" alt="无人机" />
                    <div class="battery-info-block">
                      <img class="battery-img" :src="batteryImg" alt="电池" />
                      <div class="battery-detail-list">
                        <div>电量：{{ formatBattery(droneStatus?.batteryPercent) }}</div>
                        <div>充电中：{{ droneStatus?.chargeState === 1 ? '是' : '否' }}</div>
                        <div>状态：{{ droneStatus?.isOnline ? '在线' : '离线' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="on1-lt-border-vertical"></div>
                <!-- 任务信息面板移到竖线右侧10px -->
                <div class="task-info-panel">
                  <div class="task-progress-actions">
                    <div class="task-progress-left">
                      <div class="task-progress-title">
                        <span>任务进度</span>
                        <span>{{ progressPercent }}%</span>
                      </div>
                      <div class="task-progress-bar">
                        <div class="el-slider__runway">
                          <div class="el-slider__bar" :style="{ width: progressPercent + '%', left: '0%' }"></div>
                          <div class="el-slider__button-wrapper" :style="{ left: progressPercent + '%' }">
                            <div class="el-slider__button"></div>
                          </div>
                        </div>
                      </div>
                      <div class="task-name">正在执行：<span class="route-name">{{ currentRouteName }}</span></div>
                    </div>
                    <div class="task-progress-divider"></div>
                    <div class="task-progress-actions-btns">
                      <span 
                        class="span" 
                        :class="{ disabled: !canPauseRoute }"
                        @click="canPauseRoute ? handlePauseRoute() : null"
                      >
                        暂停
                      </span>
                      <span 
                        class="span1" 
                        :class="{ disabled: !canCancelTask }"
                        @click="canCancelTask ? handleCancelTask() : null"
                      >
                        停止
                      </span>
                      <span 
                        class="span-resume" 
                        :class="{ disabled: !canResumeRoute }"
                        @click="canResumeRoute ? handleResumeRoute() : null"
                        v-if="waylineTaskStatus === 'paused'"
                      >
                        恢复
                      </span>
                    </div>
                  </div>
                  <div class="task-stats-panel">
                    <div class="task-stat-card stat-purple">
                      <div class="stat-title">今日任务总数</div>
                      <div class="stat-value">{{ todayTotalTasks }}</div>
                    </div>
                    <div class="task-stat-card stat-blue">
                      <div class="stat-title">未执行/已执行</div>
                      <div class="stat-value">{{ todayUnexecutedTasks }}/{{ todayCompletedTasks }}</div>
                    </div>
                    <div class="task-stat-card stat-green">
                      <div class="stat-title">正常/异常</div>
                      <div class="stat-value">{{ todayNormalTasks }}/{{ todayAbnormalTasks }}</div>
                    </div>
                  </div>
                </div>
                <!-- 横线 -->
                <div class="on1-lt-border-horizontal"></div>
              </div>
              <div class="robot-status-footer">
                <span>飞行速度：{{ formatSpeed(gpsStatus?.totalSpeed) }}</span>
                <span>，风向：东南风</span>
                <span>，降水：{{ formatRainfall(environment?.rainfall) }}</span>
                <span>，温度：{{ formatTemperature(environment?.environmentTemperature) }}</span>
                <span>，湿度：{{ formatHumidity(environment?.humidity) }}</span>
              </div>
            </div>
            <div class="on1-r">
              <div class="remote-control-section">
                <div class="remote-control-header">
                  <span class="remote-control-text">远程调试</span>
                  <div
                    class="switch-container"
                    :class="{ active: remoteEnabled }"
                    @click="toggleRemote"
                  >
                    <div class="switch-toggle"></div>
                  </div>
                </div>
                <div class="remote-card-list">
                  <div class="remote-card-item">
                    <img :src="droneCloseIcon" class="remote-card-icon" alt="电源" />
                    <div class="remote-card-texts">
                      <div class="remote-card-title">关机</div>
                      <div class="remote-card-sub">飞行器电源</div>
                    </div>
                    <button class="remote-card-btn" :disabled="!remoteEnabled">开机</button>
                  </div>
                  <div class="remote-card-item">
                    <img :src="droneBatteryIcon" class="remote-card-icon" alt="电池" />
                    <div class="remote-card-texts">
                      <div class="remote-card-title">未充电</div>
                      <div class="remote-card-sub">飞行器充电</div>
                    </div>
                    <button class="remote-card-btn" :disabled="!remoteEnabled">充电</button>
                  </div>
                  <div class="remote-card-item">
                    <img :src="drone4gIcon" class="remote-card-icon" alt="4G" />
                    <div class="remote-card-texts">
                      <div class="remote-card-title">已开启</div>
                      <div class="remote-card-sub">增强图传</div>
                    </div>
                    <button class="remote-card-btn" :disabled="!remoteEnabled">关闭</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 地图卡片 -->
          <div class="card map-card">
            <div id="amap-container" class="amap-container">
              <!-- <div class="map-layer-switch" @click="toggleMapLayer">
                {{ isSatellite ? '默认图' : '卫星图' }}
              </div> -->
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
                      <!-- 刷新按钮放在全屏按钮右侧 -->
                      <button class="refresh-btn" @click="reloadVideo" :disabled="refreshingVideo" title="刷新视频">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotating': refreshingVideo }">
                          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="center-controls">
                  </div>
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
            <div class="control-bottom">
              <div class="drone-control-panel">
                <div class="panel-title">
                  <div class="drc-status-indicator" :class="{ 'ready': drcStatus.ready, 'not-ready': !drcStatus.ready }"></div>
                  <div class="panel-title-text">无人机控制</div>
                  <button 
                    class="drc-mode-btn" 
                    :class="{ 'active': isDrcModeActive, 'disabled': !drcStatus.ready }"
                    :disabled="!drcStatus.ready"
                    @click="handleToggleDrcMode"
                  >
                    {{ isDrcModeActive ? '退出' : 'DRC' }}
                  </button>
                </div>
                <div class="drone-direction-grid">
                  <button 
                    @mousedown="() => startControl('turn_left')" 
                    @mouseup="stopControl" 
                    @mouseleave="stopControl"
                    :disabled="!isDrcModeActive"
                    :class="{ disabled: !isDrcModeActive }"
                  >
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_left_round.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">左旋</span>
                  </button>
                  <button 
                    @mousedown="() => startControl('forward')" 
                    @mouseup="stopControl" 
                    @mouseleave="stopControl"
                    :disabled="!isDrcModeActive"
                    :class="{ disabled: !isDrcModeActive }"
                  >
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_forward.svg" class="drone-btn-icon big-drone-btn-icon" /></span>
                    <span class="drone-btn-label">前进</span>
                  </button>
                  <button 
                    @mousedown="() => startControl('turn_right')" 
                    @mouseup="stopControl" 
                    @mouseleave="stopControl"
                    :disabled="!isDrcModeActive"
                    :class="{ disabled: !isDrcModeActive }"
                  >
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_right_round.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">右旋</span>
                  </button>
                  <button 
                    @mousedown="() => startControl('left')" 
                    @mouseup="stopControl" 
                    @mouseleave="stopControl"
                    :disabled="!isDrcModeActive"
                    :class="{ disabled: !isDrcModeActive }"
                  >
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_left.svg" class="drone-btn-icon big-drone-btn-icon" /></span>
                    <span class="drone-btn-label">左移</span>
                  </button>
                  <button 
                    @mousedown="() => startControl('backward')" 
                    @mouseup="stopControl" 
                    @mouseleave="stopControl"
                    :disabled="!isDrcModeActive"
                    :class="{ disabled: !isDrcModeActive }"
                  >
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_back.svg" class="drone-btn-icon big-drone-btn-icon" /></span>
                    <span class="drone-btn-label">后退</span>
                  </button>
                  <button 
                    @mousedown="() => startControl('right')" 
                    @mouseup="stopControl" 
                    @mouseleave="stopControl"
                    :disabled="!isDrcModeActive"
                    :class="{ disabled: !isDrcModeActive }"
                  >
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_right.svg" class="drone-btn-icon big-drone-btn-icon" /></span>
                    <span class="drone-btn-label">右移</span>
                  </button>
                  <button 
                    @mousedown="() => startControl('up')" 
                    @mouseup="stopControl" 
                    @mouseleave="stopControl"
                    :disabled="!isDrcModeActive"
                    :class="{ disabled: !isDrcModeActive }"
                  >
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_up.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">上升</span>
                  </button>
                  <div class="drone-btn-placeholder"></div>
                  <button 
                    @mousedown="() => startControl('down')" 
                    @mouseup="stopControl" 
                    @mouseleave="stopControl"
                    :disabled="!isDrcModeActive"
                    :class="{ disabled: !isDrcModeActive }"
                  >
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_down.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">下降</span>
                  </button>
                  <div class="authority-btn-wrapper">
                    <button 
                      @click="handleToggleControlAuthority"
                      :disabled="controlAuthorityStatus.isLoading"
                      :class="{ 'authority-granted': hasControlAuthority }"
                    >
                      <span class="drone-btn-iconbox" :class="{ 'authority-granted': hasControlAuthority }">
                        <img 
                          src="@/assets/source_data/svg_data/drone_control_svg/drone_control.svg" 
                          class="drone-btn-icon" 
                          :class="{ 'authority-granted': hasControlAuthority }"
                        />
                      </span>
                      <span class="drone-btn-label" :class="{ 'authority-granted': hasControlAuthority }">
                        {{ controlAuthorityStatus.isLoading ? '处理中...' : (hasControlAuthority ? '释放控制权' : '获取控制权') }}
                      </span>
                    </button>
                    
                    <!-- 抢夺控制权气泡弹窗 -->
                    <div v-if="authorityTooltip.visible" class="authority-tooltip">
                      <div class="authority-tooltip-content">
                        <div class="authority-tooltip-message">{{ authorityTooltip.message }}</div>
                        <div class="authority-tooltip-actions">
                          <button class="authority-tooltip-btn authority-confirm-btn" @click="confirmSeizeAuthority">
                            抢夺控制权
                          </button>
                          <button class="authority-tooltip-btn authority-cancel-btn" @click="cancelSeizeAuthority">
                            取消
                          </button>
                        </div>
                      </div>
                      <div class="authority-tooltip-arrow"></div>
                    </div>
                  </div>
                  <button @click="handleTakeoff" :disabled="takeoffLoading">
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_fly.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">{{ takeoffLoading ? '起飞中...' : '一键起飞' }}</span>
                  </button>
                  <button @click="handleReturnHome">
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_land.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">一键返航</span>
                  </button>
                </div>
              </div>
              <div class="gimbal-control-panel">
                <div class="panel-title">
                  <div class="panel-title-text">云台控制</div>
                </div>
                <div class="gimbal-btns-area">
                  <div class="gimbal-dir-row">
                    <button class="gimbal-dir-btn" :disabled="!isGimbalControlEnabled" @click="handleGimbalControl('down')"><img src="@/assets/source_data/svg_data/camera_up.svg" /></button>
                  </div>
                  <div class="gimbal-dir-row">
                    <button class="gimbal-dir-btn" :disabled="!isGimbalControlEnabled" @click="handleGimbalControl('left')"><img src="@/assets/source_data/svg_data/camera_left.svg" /></button>
                    <button class="gimbal-dir-btn" :disabled="!isGimbalControlEnabled" @click="handleGimbalControl('up')"><img src="@/assets/source_data/svg_data/camera_down.svg" /></button>
                    <button class="gimbal-dir-btn" :disabled="!isGimbalControlEnabled" @click="handleGimbalControl('right')"><img src="@/assets/source_data/svg_data/camera_right.svg" /></button>
                  </div>
                  <div class="gimbal-separator"></div>
                  <div class="gimbal-func-row">
                    <button :disabled="!isGimbalControlEnabled">云台回中</button>
                    <button :disabled="!isGimbalControlEnabled">云台向下</button>
                    <button :disabled="!isGimbalControlEnabled">偏航回中</button>
                    <button :disabled="!isGimbalControlEnabled">俯仰向下</button>
                  </div>
                  <div class="gimbal-func-row">
                    <button :disabled="!isGimbalControlEnabled">开启分屏</button>
                    <button :disabled="!isGimbalControlEnabled" @click="handleZoom('in')">放大</button>
                    <button :disabled="!isGimbalControlEnabled">开始录像</button>
                    <button :disabled="!isGimbalControlEnabled">拍照</button>
                  </div>
                  <div class="gimbal-func-row">
                    <button :disabled="!isGimbalControlEnabled">关闭分屏</button>
                    <button :disabled="!isGimbalControlEnabled" @click="handleZoom('out')">缩小</button>
                    <button :disabled="!isGimbalControlEnabled">停止录像</button>
                    <button :disabled="!isGimbalControlEnabled">夜景模式</button>
                  </div>
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
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { controlApi, drcApi, livestreamApi, waylineApi } from '../api/services'
import { useDeviceStatus } from '../composables/useDeviceStatus'
import { useWaylineJobs, useDevices } from '../composables/useApi'
import planeIcon from '@/assets/source_data/svg_data/plane.svg'
import stockIcon from '@/assets/source_data/svg_data/stock3.svg'
import sheetIcon from '@/assets/source_data/svg_data/sheet.svg'
import batteryIcon from '@/assets/source_data/svg_data/battery.svg'
import systemIcon from '@/assets/source_data/svg_data/system.svg'
import cameraIcon from '@/assets/source_data/svg_data/camera.svg'
import mapDockIcon from '@/assets/source_data/svg_data/map_dock3.svg'
import mapDroneIcon from '@/assets/source_data/svg_data/map_drone.svg'
import plane2Img from '@/assets/source_data/plane_2.png'
import batteryImg from '@/assets/source_data/Battery.png'
import AMapLoader from '@amap/amap-jsapi-loader'
import flvjs from 'flv.js'
// 新增 drone_ 系列图标
import droneCloseIcon from '@/assets/source_data/svg_data/drone_close.svg'
import droneBatteryIcon from '@/assets/source_data/svg_data/drone_battery.svg'
import drone4gIcon from '@/assets/source_data/svg_data/drone_4g.svg'
import droneUpIcon from '@/assets/source_data/svg_data/drone_control_svg/drone_up.svg'
import droneDownIcon from '@/assets/source_data/svg_data/drone_control_svg/drone_down.svg'
import droneLeftIcon from '@/assets/source_data/svg_data/drone_control_svg/drone_left.svg'
import droneRightIcon from '@/assets/source_data/svg_data/drone_control_svg/drone_right.svg'
import cameraUpIcon from '@/assets/source_data/svg_data/camera_up.svg'
import cameraDownIcon from '@/assets/source_data/svg_data/camera_down.svg'
import cameraLeftIcon from '@/assets/source_data/svg_data/camera_left.svg'
import cameraRightIcon from '@/assets/source_data/svg_data/camera_right.svg'

const router = useRouter()

// 使用设备状态API
const { 
  fetchDeviceStatus, 
  fetchMainDeviceStatus,
  fetchDroneStatus,
  deviceStatus,
  position,
  dockStatus,
  droneStatus, 
  gpsStatus,
  environment,
  formatBattery,
  formatSpeed,
  formatTemperature,
  formatHumidity,
  formatWindSpeed,
  formatRainfall
} = useDeviceStatus()

// 使用航线任务API
const { fetchWaylineProgress, fetchWaylineJobDetail, stopJob, pauseJob, resumeJob } = useWaylineJobs()
const { getCachedWorkspaceId, getCachedDeviceSns } = useDevices()

// 航线任务相关数据
const waylineProgress = ref<any>(null)
const waylineJobDetail = ref<any>(null)

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
const currentTab = ref('plane')

// 航线任务相关计算属性
const progressPercent = computed(() => {
  const progress = waylineProgress.value?.progress
  console.log('progressPercent - waylineProgress:', waylineProgress.value)
  console.log('progressPercent - progress:', progress)
  
  if (!progress) {
    console.log('progressPercent - 没有progress数据，返回0')
    return 0
  }
  
  // 使用current_waypoint_index和total_waypoints计算进度
  const currentWaypoint = progress.current_waypoint_index || 0
  const totalWaypoints = progress.total_waypoints || 1
  
  console.log('progressPercent - currentWaypoint:', currentWaypoint, 'totalWaypoints:', totalWaypoints)
  
  // 计算百分比并取整数
  const percent = Math.round((currentWaypoint / totalWaypoints) * 100)
  
  // 确保百分比在0-100范围内
  const result = Math.max(0, Math.min(100, percent))
  console.log('progressPercent - 计算结果:', result)
  return result
})

const currentRouteName = computed(() => {
  console.log('currentRouteName - waylineJobDetail:', waylineJobDetail.value)
  const result = waylineJobDetail.value?.name || '暂无任务'
  console.log('currentRouteName - 结果:', result)
  return result
})

const waylineTaskStatus = computed(() => {
  const status = waylineProgress.value?.status
  if (!status) return 'waiting'
  
  const statusMap: Record<string, string> = {
    'canceled': 'failed',
    'failed': 'failed',
    'in_progress': 'running',
    'ok': 'completed',
    'partially_done': 'completed',
    'paused': 'paused',
    'rejected': 'failed',
    'sent': 'waiting',
    'timeout': 'failed'
  }
  
  return statusMap[status] || 'waiting'
})

const waylineTaskStatusText = computed(() => {
  const status = waylineProgress.value?.status
  if (!status) return '未知'
  
  const statusTextMap: Record<string, string> = {
    'canceled': '取消或终止',
    'failed': '失败',
    'in_progress': '执行中',
    'ok': '执行成功',
    'partially_done': '部分完成',
    'paused': '暂停',
    'rejected': '拒绝',
    'sent': '已下发',
    'timeout': '超时'
  }
  
  return statusTextMap[status] || '未知'
})

// 按钮状态控制
const canCancelTask = computed(() => {
  const status = waylineProgress.value?.status
  return status === 'in_progress' || status === 'paused'
})

const canResumeRoute = computed(() => {
  const status = waylineProgress.value?.status
  return status === 'paused'
})

const canPauseRoute = computed(() => {
  const status = waylineProgress.value?.status
  return status === 'in_progress'
})

// 任务控制处理函数
const handleCancelTask = async () => {
  try {
    const workspaceId = getCachedWorkspaceId()
    if (!workspaceId) {
      alert('未找到workspace_id')
      return
    }
    
    if (!waylineProgress.value?.job_id) {
      alert('没有正在执行的任务')
      return
    }
    
    if (!confirm('确定要取消当前任务吗？')) {
      return
    }
    
    await stopJob(workspaceId, waylineProgress.value.job_id)
    alert('任务取消指令已发送')
    
    // 刷新任务进度
    setTimeout(() => {
      loadWaylineProgress()
    }, 1000)
  } catch (err) {
    console.error('取消任务失败:', err)
    alert('取消任务失败')
  }
}

const handlePauseRoute = async () => {
  try {
    const workspaceId = getCachedWorkspaceId()
    if (!workspaceId) {
      alert('未找到workspace_id')
      return
    }
    
    if (!waylineProgress.value?.job_id) {
      alert('没有正在执行的任务')
      return
    }
    
    await pauseJob(workspaceId, waylineProgress.value.job_id)
    alert('航线暂停指令已发送')
    
    // 刷新任务进度
    setTimeout(() => {
      loadWaylineProgress()
    }, 1000)
  } catch (err) {
    console.error('航线暂停失败:', err)
    alert('航线暂停失败')
  }
}

const handleResumeRoute = async () => {
  try {
    const workspaceId = getCachedWorkspaceId()
    if (!workspaceId) {
      alert('未找到workspace_id')
      return
    }
    
    if (!waylineProgress.value?.job_id) {
      alert('没有正在执行的任务')
      return
    }
    
    await resumeJob(workspaceId, waylineProgress.value.job_id)
    alert('航线恢复指令已发送')
    
    // 刷新任务进度
    setTimeout(() => {
      loadWaylineProgress()
    }, 1000)
  } catch (err) {
    console.error('航线恢复失败:', err)
    alert('航线恢复失败')
  }
}
const amapInstance = ref<any>(null)
const amapApiRef = ref<any>(null); // 新增
const remoteEnabled = ref(false);

// 地图标记点
const dockMarkers = ref<any[]>([])
const droneMarkers = ref<any[]>([])

// DRC状态管理
const drcStatus = ref({
  ready: false,
  reason: '',
  drc_mode: 'inactive' as 'active' | 'inactive',
  session: null as string | null
})
const drcStatusInterval = ref<number | null>(null)

// DRC模式状态管理
const isDrcModeActive = ref(false)

// 云台控制权限状态
const isGimbalControlEnabled = ref(false)

// 控制权抢夺提示弹窗状态
const authorityTooltip = ref({
  visible: false,
  message: ''
})

// 控制权状态管理
const controlAuthorityStatus = ref({
  hasFlightAuthority: false,
  hasPayloadAuthority: false,
  isLoading: false,
  flightAuthorityOwner: null as { username: string; user_id: number } | null,
  payloadAuthorityOwner: null as { username: string; user_id: number } | null
})

// 控制相关的状态
const controlInterval = ref<number | null>(null)
const currentControlType = ref<string | null>(null)
const CONTROL_INTERVAL_MS = 100 // 每100ms发送一次控制指令
const CONTROL_SPEED = 0.5 // 默认控制速度

// DRC状态相关
const DRC_STATUS_CHECK_INTERVAL = 5000 // 每5秒检查一次DRC状态

// 设备状态刷新定时器
const statusRefreshTimer = ref<number | null>(null)

// 视频流相关状态管理
const videoStreamUrl = ref<string>('')
const videoPlayer = ref<any>(null)
const videoElement = ref<HTMLVideoElement | null>(null)
const videoLoading = ref(false)
const videoStatus = ref('正在检查视频流状态...')
const videoBid = ref<string | null>(null)
const refreshingVideo = ref(false)

// 起飞相关状态
const takeoffLoading = ref(false)

// 视频播放控制相关
const isVideoPlaying = ref(false)
const currentTime = ref('00:00')
const totalTime = ref('00:00')

const toggleRemote = () => {
  remoteEnabled.value = !remoteEnabled.value;
};
const isSatellite = ref(true); // 默认为卫星图模式，确保显示卫星图
const isInitialLoad = ref(true); // 标记是否为初始加载
const toggleMapLayer = () => {
  if (!amapInstance.value || !amapApiRef.value) return;
  isSatellite.value = !isSatellite.value;
  const AMap = amapApiRef.value;
  if (isSatellite.value) {
    amapInstance.value.setLayers([
      new AMap.TileLayer.Satellite(),
      new AMap.TileLayer.RoadNet()
    ]);
  } else {
    amapInstance.value.setLayers([
      new AMap.TileLayer()
    ]);
  }
};

const showScreenMenu = ref(false)
const currentScreenMode = ref('一分屏')
const toggleScreenMenu = () => {
  showScreenMenu.value = !showScreenMenu.value
}
const selectScreenMode = (mode: string) => {
  currentScreenMode.value = mode
  showScreenMenu.value = false
}

// WGS84坐标转GCJ-02坐标系
const transformWGS84ToGCJ02 = (wgsLng: number, wgsLat: number) => {
  const PI = Math.PI
  const ee = 0.00669342162296594323
  const a = 6378245.0
  
  if (outOfChina(wgsLng, wgsLat)) {
    return { longitude: wgsLng, latitude: wgsLat }
  }
  
  let dLat = transformLat(wgsLng - 105.0, wgsLat - 35.0)
  let dLng = transformLng(wgsLng - 105.0, wgsLat - 35.0)
  
  const radLat = wgsLat / 180.0 * PI
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
  
  const mgLat = wgsLat + dLat
  const mgLng = wgsLng + dLng
  
  return { longitude: mgLng, latitude: mgLat }
}

// 辅助函数：判断是否在中国境内
const outOfChina = (lng: number, lat: number) => {
  return (lng < 72.004 || lng > 137.8347) || (lat < 0.8293 || lat > 55.8271)
}

// 辅助函数：纬度转换
const transformLat = (lng: number, lat: number) => {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin(lat / 3.0 * Math.PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lat / 12.0 * Math.PI) + 320 * Math.sin(lat * Math.PI / 30.0)) * 2.0 / 3.0
  return ret
}

// 辅助函数：经度转换
const transformLng = (lng: number, lat: number) => {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0 / 3.0
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
          filter: brightness(0) saturate(100%) invert(35%) sepia(92%) saturate(1945%) hue-rotate(200deg) brightness(97%) contrast(103%);
        "
        alt="机场"
      />
    `,
    anchor: 'center',
    offset: new AMap.Pixel(0, 0)
  })

  // 添加点击事件
  marker.on('click', () => {
    // 可以在这里添加更多交互功能，比如显示详细信息
  })

  // 添加到地图
  amapInstance.value.add(marker)
  dockMarkers.value.push(marker)
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
          filter: brightness(0) saturate(100%) invert(35%) sepia(92%) saturate(1945%) hue-rotate(200deg) brightness(97%) contrast(103%);
        "
        alt="无人机"
      />
    `,
    anchor: 'center',
    offset: new AMap.Pixel(0, 0)
  })

  // 添加点击事件
  marker.on('click', () => {
    // 可以在这里添加更多交互功能，比如显示详细信息
  })

  // 添加到地图
  amapInstance.value.add(marker)
  droneMarkers.value.push(marker)
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
  clearDroneMarkers()
  
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
    
    // 添加无人机标记
    addDroneMarker(droneLongitude, droneLatitude, droneInfo)
    
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

// 全屏功能
const toggleFullscreen = () => {
  const playerElement = document.getElementById('player_box1')
  
  if (!playerElement) {
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
  } catch (error: any) {
    alert('全屏功能暂时不可用，请检查浏览器设置')
  }
}

// 视频缓存管理
const videoCache = ref({
  dock: null as any,
  droneVisible: null as any,
  droneInfrared: null as any,
  lastUpdated: null as string | null
})

// 分析设备视频类型
const analyzeDeviceVideos = (device: any) => {
  const result = {
    dock: null as any,
    droneVisible: null as any,
    droneInfrared: null as any
  }
  
  if (!device.camera_list || device.camera_list.length === 0) {
    return result
  }
  
  for (const camera of device.camera_list) {
    if (!camera.video_list || camera.video_list.length === 0) continue
    
    for (const video of camera.video_list) {
      const switchableTypes = video.switchable_video_types || []
      const typesCount = switchableTypes.length
      
      // 根据switchable_video_types数量判断视频类型
      if (typesCount >= 4) {
        // 可见光（通常有normal, wide, zoom, ir等多种类型）
        if (!result.droneVisible || switchableTypes.length > result.droneVisible.switchable_video_types.length) {
          result.droneVisible = {
            device_sn: device.sn,
            camera_index: camera.camera_index,
            video_index: video.video_index,
            video_type: video.video_type,
            switchable_video_types: switchableTypes,
            video_id: `${device.sn}/${camera.camera_index}/${video.video_index}`
          }
        }
      } else if (typesCount === 1) {
        // 红外（通常只有normal类型）
        if (!result.droneInfrared) {
          result.droneInfrared = {
            device_sn: device.sn,
            camera_index: camera.camera_index,
            video_index: video.video_index,
            video_type: video.video_type,
            switchable_video_types: switchableTypes,
            video_id: `${device.sn}/${camera.camera_index}/${video.video_index}`
          }
        }
      } else {
        // 机场或其他设备
        if (!result.dock) {
          result.dock = {
            device_sn: device.sn,
            camera_index: camera.camera_index,
            video_index: video.video_index,
            video_type: video.video_type,
            switchable_video_types: switchableTypes,
            video_id: `${device.sn}/${camera.camera_index}/${video.video_index}`
          }
        }
      }
    }
  }
  
  return result
}

// 更新视频缓存
const updateVideoCache = async () => {
  try {
    
    // 获取最新的capacity信息
    const capacityResponse = await livestreamApi.getCapacity()
    
    // 获取缓存的设备SN
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    const cachedDroneSns = JSON.parse(localStorage.getItem('cached_drone_sns') || '[]')
    
    const newCache = {
      dock: null as any,
      droneVisible: null as any,
      droneInfrared: null as any,
      lastUpdated: new Date().toISOString()
    }
    
    // 分析所有可用设备
    for (const device of capacityResponse.available_devices || []) {
      const analysis = analyzeDeviceVideos(device)
      
      // 根据设备类型归类
      if (cachedDockSns.includes(device.sn)) {
        // 机场设备
        if (analysis.dock && !newCache.dock) {
          newCache.dock = analysis.dock
        }
      } else if (cachedDroneSns.includes(device.sn)) {
        // 无人机设备
        if (analysis.droneVisible && !newCache.droneVisible) {
          newCache.droneVisible = analysis.droneVisible
        }
        if (analysis.droneInfrared && !newCache.droneInfrared) {
          newCache.droneInfrared = analysis.droneInfrared
        }
      }
    }
    
    // 检查是否有变化
    const currentCache = JSON.stringify(videoCache.value)
    const newCacheStr = JSON.stringify(newCache)
    
    if (currentCache !== newCacheStr) {
      
      videoCache.value = newCache
      
      // 保存到localStorage
      localStorage.setItem('video_cache', JSON.stringify(newCache))
      localStorage.setItem('livestream_capacity', JSON.stringify(capacityResponse))
      
      return true
    } else {
      return false
    }
  } catch (error: any) {
    return false
  }
}

// 从缓存加载视频信息
const loadVideoCache = () => {
  const cached = localStorage.getItem('video_cache')
  if (cached) {
    try {
      videoCache.value = JSON.parse(cached)
    } catch (error: any) {
    }
  }
}

// 获取当前使用的视频信息（优先无人机视频）
const getCurrentVideoInfo = () => {
  // 从缓存中获取视频流地址
  const videoStreamsStr = localStorage.getItem('video_streams')
  if (videoStreamsStr) {
    try {
      const videoStreams = JSON.parse(videoStreamsStr)
      
      // 优先返回无人机可见光视频
      const droneVisibleStream = videoStreams.find((stream: any) => stream.type === 'drone_visible')
      const droneInfraredStream = videoStreams.find((stream: any) => stream.type === 'drone_infrared')
      const dockStream = videoStreams.find((stream: any) => stream.type === 'dock')
      
      if (droneVisibleStream && videoCache.value.droneVisible) {
        return videoCache.value.droneVisible
      } else if (droneInfraredStream && videoCache.value.droneInfrared) {
        return videoCache.value.droneInfrared
      } else if (dockStream && videoCache.value.dock) {
        return videoCache.value.dock
      }
    } catch (error: any) {
    }
  }
  
  // 后备方案：从视频缓存中获取
  if (videoCache.value.droneVisible) {
    return videoCache.value.droneVisible
  } else if (videoCache.value.droneInfrared) {
    return videoCache.value.droneInfrared
  } else if (videoCache.value.dock) {
    return videoCache.value.dock
  }
  
  return null
}

// 从缓存获取无人机视频地址
const getDroneVideoFromCache = () => {
  // 首先检查视频流缓存
  const videoStreamsStr = localStorage.getItem('video_streams')
  if (videoStreamsStr) {
    try {
      const videoStreams = JSON.parse(videoStreamsStr)
      
      // 优先返回无人机可见光视频
      const droneVisibleStream = videoStreams.find((stream: any) => stream.type === 'drone_visible')
      const droneInfraredStream = videoStreams.find((stream: any) => stream.type === 'drone_infrared')
      
      if (droneVisibleStream) {
        return droneVisibleStream.url
      } else if (droneInfraredStream) {
        return droneInfraredStream.url
      }
    } catch (error: any) {
    }
  }
  
  // 检查专用的无人机视频地址
  const droneVideoUrl = localStorage.getItem('drone_video_stream_url')
  if (droneVideoUrl) {
    return droneVideoUrl
  }
  
  return null
}

// 初始化视频播放器（针对无人机控制页面）
const initVideoPlayer = async () => {
  // 先加载视频缓存
  loadVideoCache()
  
  // 尝试从缓存获取无人机视频地址
  const droneVideoUrl = getDroneVideoFromCache()
  if (droneVideoUrl) {
    // 使用缓存的视频地址
    videoStreamUrl.value = droneVideoUrl
    // 延迟初始化播放器，确保DOM已经渲染
    await nextTick()
    startVideoPlayback()
  } else {
    // 如果缓存中没有无人机视频，立即获取
    // 使用nextTick确保DOM已渲染
    await nextTick()
    await reloadVideo()
  }
}

// 开始视频播放
const startVideoPlayback = () => {
  if (!videoElement.value || !videoStreamUrl.value) {
    // 视频元素或URL不存在，无法播放
    videoStatus.value = '视频未就绪'
    return
  }

  // 开始播放视频
  videoLoading.value = true
  videoStatus.value = '正在连接视频流...'

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
      
      // 清除之前的事件监听器
      videoElement.value.onplay = null
      videoElement.value.onpause = null
      videoElement.value.ontimeupdate = null
      videoElement.value.onloadedmetadata = null
      videoElement.value.onloadeddata = null
      videoElement.value.onerror = null
      videoElement.value.oncanplay = null
      
      // 视频可以播放时
      videoElement.value.oncanplay = () => {
        // 自动播放视频
        if (videoElement.value && videoElement.value.paused) {
          videoElement.value.play().catch((error) => {
            videoStatus.value = '请点击播放按钮'
          })
        }
        videoLoading.value = false
        videoStatus.value = '视频已就绪'
      }
      
      // 视频开始播放
      videoElement.value.onplay = () => {
        isVideoPlaying.value = true
        videoStatus.value = '正在播放'
      }
      
      // 视频暂停
      videoElement.value.onpause = () => {
        isVideoPlaying.value = false
        videoStatus.value = '已暂停'
      }
      
      // 时间更新
      videoElement.value.ontimeupdate = updateVideoTime
      
      // 元数据加载完成
      videoElement.value.onloadedmetadata = () => {
        updateVideoTime()
      }
      
      // 视频数据加载完成
      videoElement.value.onloadeddata = () => {
        videoElement.value!.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
        // 数据加载完成后尝试自动播放
        if (videoElement.value && videoElement.value.paused) {
          videoElement.value.play().catch((error) => {
            // 静默处理自动播放失败
          })
        }
      }
      
      // 视频加载错误
      videoElement.value.onerror = (error) => {
        videoLoading.value = false
        videoStatus.value = '视频加载失败'
      }
    }

    // 检查是否是webrtc地址
    if (videoStreamUrl.value.startsWith('webrtc://')) {
      startWebRTCPlayback()
    } else if (videoStreamUrl.value.startsWith('rtmp://')) {
      
      if (flvjs.isSupported()) {
        
        // 将rtmp地址转换为http-flv地址
        const flvUrl = videoStreamUrl.value.replace(/^rtmp:\/\/[^\/]+/, 'http://10.10.1.3:8000')
        
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

      } else {
      }
    } else {
      videoElement.value.src = videoStreamUrl.value
      videoElement.value.load()
      
      // 强制设置原生视频播放器样式
      videoElement.value.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
      
      // 尝试立即播放，失败则等待canplay事件
      videoElement.value.play().catch((error) => {
        videoStatus.value = '等待视频就绪...'
      })
    }
  } catch (error: any) {
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
  } catch (error: any) {
    // 后备方案
    return webrtcUrl.replace('webrtc://', 'http://').replace(':8000', ':1985').split('/')[0]
  }
}

// 开始WebRTC播放（增强版，解决SDP协商问题）
const startWebRTCPlayback = async () => {
  if (isPlaying) {
    stopWebRTCPlayback()
  }

  const serverUrl = videoStreamUrl.value
  if (!serverUrl) {
    return
  }

  try {
    
    // 确保之前的连接已清理
    if (pc) {
      pc.close()
      pc = null
    }
    
    // 创建新的RTCPeerConnection，使用优化配置
    pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ],
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    })

    // 添加一个虚拟的媒体轨道来确保SDP格式正确
    const dummyStream = new MediaStream()
    
    // 创建一个虚拟的video track
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const canvasStream = canvas.captureStream(1)
    const videoTrack = canvasStream.getVideoTracks()[0]
    
    if (videoTrack) {
      dummyStream.addTrack(videoTrack)
      pc.addTrack(videoTrack, dummyStream)
    }

    // 处理远程流
    pc.ontrack = (e) => {
      if (videoElement.value) {
        videoElement.value.srcObject = e.streams[0]
        
        // 强制设置WebRTC视频播放器样式
        videoElement.value.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
        
      }
    }

    // ICE连接状态监听
    pc.oniceconnectionstatechange = () => {
      if (pc?.iceConnectionState === 'connected') {
        isPlaying = true
      } else if (pc?.iceConnectionState === 'failed') {
        stopWebRTCPlayback()
      }
    }

    // 创建offer，使用标准配置
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    
    
    await pc.setLocalDescription(offer)

    // 构建SRS API地址
    const apiUrl = buildApiUrl(serverUrl)

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

    // 检查返回的SDP格式
    if (!data.sdp) {
      throw new Error('服务器返回的SDP为空')
    }


    // 设置远程描述前，先检查SDP格式
    try {
      await pc.setRemoteDescription({
        type: 'answer',
        sdp: data.sdp
      })
    } catch (sdpError: any) {
      throw new Error(`SDP协商失败: ${sdpError.message}`)
    }

  } catch (error: any) {
    stopWebRTCPlayback()
  }
}

// 停止WebRTC播放（与首页完全相同的逻辑）
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

// 停止视频播放（与首页完全相同的逻辑）
const stopVideoPlayback = () => {
  // 停止WebRTC播放
  stopWebRTCPlayback()
  
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.unload()
    videoPlayer.value.detachMediaElement()
    videoPlayer.value.destroy()
    videoPlayer.value = null
  }
  
  if (videoElement.value) {
    videoElement.value.pause()
    videoElement.value.src = ''
    videoElement.value.load()
  }
}

// 重新获取capacity并更新所有视频流缓存
const refreshVideoCapacityAndCache = async () => {
  try {
    
    // 获取最新的capacity信息
    const capacityResponse = await livestreamApi.getCapacity()
    
    // 获取缓存的设备SN
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    const cachedDroneSns = JSON.parse(localStorage.getItem('cached_drone_sns') || '[]')
    
    
    if (cachedDockSns.length === 0) {
      throw new Error('没有找到缓存的机场SN')
    }
    const dockSn = cachedDockSns[0] // 使用第一个机场SN
    
    const newCache = {
      dock: null as any,
      droneVisible: null as any,
      droneInfrared: null as any,
      lastUpdated: new Date().toISOString()
    }
    
    // 存储所有视频流地址
    const videoStreams = []
    
    // 分析所有可用设备并获取视频流
    for (const device of capacityResponse.available_devices || []) {
      
      const analysis = analyzeDeviceVideos(device)
      
      // 根据设备类型归类并启动视频流
      if (cachedDockSns.includes(device.sn)) {
        // 机场设备
        if (analysis.dock && !newCache.dock) {
          newCache.dock = analysis.dock
          
          // 启动机场视频流
          try {
            const livestreamResponse = await livestreamApi.startLivestream(dockSn, {
              video_id: analysis.dock.video_id
            })
            const webrtcUrl = livestreamResponse.push_url.replace(/^rtmp:\/\/[^\/]+/, 'webrtc://10.10.1.3:8000')
            videoStreams.push({
              type: 'dock',
              url: webrtcUrl
            })
          } catch (error: any) {
            // 获取机场视频流失败
          }
        }
      } else if (cachedDroneSns.includes(device.sn)) {
        // 无人机设备
        if (analysis.droneVisible && !newCache.droneVisible) {
          newCache.droneVisible = analysis.droneVisible
          
          // 启动无人机可见光视频流
          try {
            const livestreamResponse = await livestreamApi.startLivestream(dockSn, {
              video_id: analysis.droneVisible.video_id
            })
            const webrtcUrl = livestreamResponse.push_url.replace(/^rtmp:\/\/[^\/]+/, 'webrtc://10.10.1.3:8000')
            videoStreams.push({
              type: 'drone_visible',
              url: webrtcUrl
            })
          } catch (error: any) {
            // 获取无人机可见光视频流失败
          }
        }
        
        if (analysis.droneInfrared && !newCache.droneInfrared) {
          newCache.droneInfrared = analysis.droneInfrared
          
          // 启动无人机红外视频流
          try {
            const livestreamResponse = await livestreamApi.startLivestream(dockSn, {
              video_id: analysis.droneInfrared.video_id
            })
            const webrtcUrl = livestreamResponse.push_url.replace(/^rtmp:\/\/[^\/]+/, 'webrtc://10.10.1.3:8000')
            videoStreams.push({
              type: 'drone_infrared',
              url: webrtcUrl
            })
          } catch (error: any) {
            // 获取无人机红外视频流失败
          }
        }
      }
    }
    
    // 更新缓存
    videoCache.value = newCache
    localStorage.setItem('video_cache', JSON.stringify(newCache))
    localStorage.setItem('livestream_capacity', JSON.stringify(capacityResponse))
    
    // 更新视频流地址缓存
    localStorage.setItem('video_streams', JSON.stringify(videoStreams))
    
    // 优先返回无人机可见光视频地址
    const droneVisibleStream = videoStreams.find(stream => stream.type === 'drone_visible')
    const droneInfraredStream = videoStreams.find(stream => stream.type === 'drone_infrared')
    const dockStream = videoStreams.find(stream => stream.type === 'dock')
    
    if (droneVisibleStream) {
      return droneVisibleStream.url
    } else if (droneInfraredStream) {
      return droneInfraredStream.url
    } else if (dockStream) {
      return dockStream.url
    } else {
      throw new Error('没有找到可用的视频流')
    }
    
  } catch (error: any) {
    throw error
  }
}

// 重新加载视频（专门针对无人机控制页面）
const reloadVideo = async () => {
  // 停止当前视频播放
  stopVideoPlayback()
  
  // 重新获取capacity并更新缓存，返回无人机视频地址
  const droneVideoUrl = await refreshVideoCapacityAndCache()
  
  if (!droneVideoUrl) {
    throw new Error('无法获取视频流地址')
  }
  
  // 设置无人机视频地址
  videoStreamUrl.value = droneVideoUrl
  localStorage.setItem('drone_video_stream_url', droneVideoUrl)
  localStorage.setItem('current_video_type', 'drone_visible')
  
  // 确保DOM更新后再开始播放
  await nextTick()
  startVideoPlayback()
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

onMounted(async () => {
  AMapLoader.load({
    key: '6f9eaf51960441fa4f813ea2d7e7cfff', 
    version: '2.0',
    plugins: ['AMap.ToolBar', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.MapType']
  }).then((AMap) => {
    amapApiRef.value = AMap; // 缓存 AMap
    amapInstance.value = new AMap.Map('amap-container', {
      zoom: 18,
      center: [116.397428, 39.90923],
      logoEnable: false,
      copyrightEnable: false,
      mapStyle: 'amap://styles/satellite', // 强制设置卫星图样式
      layers: [
        new AMap.TileLayer.Satellite(),
        new AMap.TileLayer.RoadNet()
      ]
    })
    
    // 地图加载完成后更新机场标记
    amapInstance.value.on('complete', () => {
              // 延迟一下确保设备状态数据已加载
        setTimeout(() => {
          // 初始加载时需要定位到无人机位置
          updateMapMarkers(isInitialLoad.value)
          // 标记初始加载完成
          isInitialLoad.value = false
        }, 1000)
    })
  })
  
  // 启动DRC状态轮询
  startDrcStatusPolling()
  
  // 检查控制权限状态
  checkAuthorityStatus()
  
  // 启动权限状态轮询，每10秒检查一次
  const authorityInterval = setInterval(checkAuthorityStatus, 10000)
  
  // 在组件销毁时清理定时器
  onBeforeUnmount(() => {
    if (authorityInterval) {
      clearInterval(authorityInterval)
    }
  })
  
  // 初始化无人机视频播放器（优先从缓存读取，没有则刷新获取）
  await initVideoPlayer()
  
  // 获取机场状态数据
  await fetchMainDeviceStatus()
  
  // 获取无人机状态数据
  await fetchDroneStatus()
  
  // 获取机场状态数据（包含无人机充电状态）
  await fetchMainDeviceStatus()
  
  // 获取航线任务进度数据
  await loadWaylineProgress()
  
  // 首次获取设备状态后，更新地图标记
  if (amapInstance.value) {
    updateMapMarkers()
  }
  
  // 设置机场状态自动刷新（每3秒，包含无人机充电状态）
  statusRefreshTimer.value = setInterval(async () => {
    await fetchMainDeviceStatus()
    // 获取无人机状态数据
    await fetchDroneStatus()
    // 获取航线任务进度数据
    await loadWaylineProgress()
    // 设备状态更新后，更新地图标记
    if (amapInstance.value) {
      updateMapMarkers()
    }
  }, 3000)
  
  loadTodayFlightStatistics()
})

// 获取航线任务进度数据
const loadWaylineProgress = async () => {
  try {
    const workspaceId = getCachedWorkspaceId()
    const { dockSns } = getCachedDeviceSns()
    
    // console.log('loadWaylineProgress - workspaceId:', workspaceId)
    // console.log('loadWaylineProgress - dockSns:', dockSns)
    
    if (!workspaceId || dockSns.length === 0) {
      // console.log('loadWaylineProgress - 缺少workspaceId或dockSns')
      return
    }
    
    // 获取第一个机场的航线任务进度
    const dockSn = dockSns[0]
    // console.log('loadWaylineProgress - 使用dockSn:', dockSn)
    
    const progressData = await fetchWaylineProgress(workspaceId, dockSn)
    // console.log('loadWaylineProgress - progressData:', progressData)
    waylineProgress.value = progressData
    
    // 如果有job_id，获取详细信息
    if (progressData?.job_id) {
      // console.log('loadWaylineProgress - 获取任务详情，job_id:', progressData.job_id)
      const jobDetail = await fetchWaylineJobDetail(workspaceId, progressData.job_id)
      // console.log('loadWaylineProgress - jobDetail:', jobDetail)
      waylineJobDetail.value = jobDetail
    } else {
      // console.log('loadWaylineProgress - 没有job_id，清空任务详情')
      waylineJobDetail.value = null
    }
  } catch (err) {
    console.error('loadWaylineProgress - 错误:', err)
  }
}

// 测试方法：动态改变进度（已移除，现在使用真实数据）
const updateProgress = (percent: number) => {
  // 现在进度由真实数据计算，不再需要手动设置
  console.log('进度已改为使用真实数据计算')
}

const handleTabClick = (key: string) => {
  currentTab.value = key
  if (key === 'plane') {
    router.push('/dashboard/drone-control')
  } else if (key === 'stock') {
    router.push('/dashboard/dock-control')
  }
}

// 检查DRC状态
const checkDrcStatus = async () => {
  try {
    // 获取缓存的机场SN
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    if (cachedDockSns.length === 0) {
      return
    }
    
    const dockSn = cachedDockSns[0]
    
    // 检查DRC是否就绪
    const readyResponse = await drcApi.checkDrcReady(dockSn)
    if (readyResponse.code === 0 && readyResponse.data) {
      drcStatus.value.ready = readyResponse.data.ready
      drcStatus.value.reason = readyResponse.data.reason || ''
    }

    // 获取DRC当前状态
    const statusResponse = await drcApi.getDrcStatus(dockSn)
    
    if (statusResponse.code === 0 && statusResponse.data) {
      drcStatus.value.drc_mode = statusResponse.data.drc_mode
      drcStatus.value.session = statusResponse.data.session
      // 更新前端DRC模式状态
      isDrcModeActive.value = statusResponse.data.drc_mode === 'active'
    }
  } catch (error: any) {
    // 网络错误时保持当前状态不变，避免频繁切换
  }
}

// 启动DRC状态轮询
const startDrcStatusPolling = () => {
  // 立即检查一次
  checkDrcStatus()
  
  // 设置定时轮询
  drcStatusInterval.value = setInterval(() => {
    checkDrcStatus()
  }, DRC_STATUS_CHECK_INTERVAL)
  
}

// 停止DRC状态轮询
const stopDrcStatusPolling = () => {
  if (drcStatusInterval.value) {
    clearInterval(drcStatusInterval.value)
    drcStatusInterval.value = null
  }
}
const getCachedCapacity = () => {
  const cachedData = localStorage.getItem('livestream_capacity')
  if (cachedData) {
    try {
      return JSON.parse(cachedData)
    } catch (error: any) {
      return null
    }
  }
  return null
}

// 根据设备SN获取camera_index (payload_index)
const getCameraIndexByDeviceSn = (deviceSn: string) => {
  const capacity = getCachedCapacity()
  if (!capacity || !capacity.available_devices) {
    return null
  }
  
  const device = capacity.available_devices.find((d: any) => d.sn === deviceSn)
  if (!device || !device.camera_list || device.camera_list.length === 0) {
    return null
  }
  
  // 返回第一个摄像头的camera_index作为payload_index
  return device.camera_list[0].camera_index
}

// 获取可用的payload索引列表（从最近的权限检查中获取）
const getAvailablePayloadIndexes = async () => {
  try {
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    if (cachedDockSns.length === 0) {
      return ["99-0-0"] // 默认值
    }
    
    const dockSn = cachedDockSns[0]
    const result = await controlApi.getAuthorityStatus(dockSn)
    
    if (result.code === 0 && result.data.payload_authorities) {
      const availableIndexes = Object.keys(result.data.payload_authorities)
      if (availableIndexes.length > 0) {
        return availableIndexes
      }
    }
  } catch (error) {
    // 静默处理错误
  }
  
  return ["99-0-0"] // 默认值
}

// 获取最佳的payload_index（对于控制权操作）
const getBestPayloadIndex = () => {
  // 直接返回标准格式，这个格式在你提供的API响应中存在
  const payloadIndex = "99-0-0"
      return payloadIndex
}

// 获取设备的payload_index（用于视频相关操作）
const getDevicePayloadIndex = () => {
  const capacity = getCachedCapacity()
  if (!capacity || !capacity.available_devices || capacity.available_devices.length === 0) {
    return null
  }
  
  const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
  const cachedDroneSns = JSON.parse(localStorage.getItem('cached_drone_sns') || '[]')
  
  // 优先查找无人机设备，然后查找机场设备
  const deviceSns = [...cachedDroneSns, ...cachedDockSns]
  
  for (const deviceSn of deviceSns) {
    const device = capacity.available_devices.find((d: any) => d.sn === deviceSn)
    if (device && device.camera_list && device.camera_list.length > 0) {
      // 找到switchable_video_types最多的摄像头
      let bestCamera = null
      let maxSwitchableTypes = 0
      
      for (const camera of device.camera_list) {
        if (camera.video_list && camera.video_list.length > 0) {
          const firstVideo = camera.video_list[0]
          if (firstVideo.switchable_video_types) {
            const typesCount = firstVideo.switchable_video_types.length
            if (typesCount > maxSwitchableTypes) {
              maxSwitchableTypes = typesCount
              bestCamera = camera
            }
          }
        }
      }
      
      if (bestCamera) {
        return bestCamera.camera_index
      }
    }
  }
  
  return null
}

// 变焦倍率缓存管理
const ZOOM_FACTOR_KEY = 'camera_zoom_factor'
const MIN_ZOOM = 1
const MAX_ZOOM = 200

// 获取当前变焦倍率
const getCurrentZoomFactor = (): number => {
  const cached = localStorage.getItem(ZOOM_FACTOR_KEY)
  if (cached) {
    try {
      const factor = parseInt(cached, 10)
      return isNaN(factor) ? MIN_ZOOM : Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, factor))
    } catch (error: any) {
      // 解析变焦倍率缓存失败
    }
  }
  return MIN_ZOOM
}

// 设置变焦倍率到缓存
const setZoomFactor = (factor: number): number => {
  const clampedFactor = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, factor))
  localStorage.setItem(ZOOM_FACTOR_KEY, clampedFactor.toString())
  return clampedFactor
}

// 计算属性：是否拥有控制权
const hasControlAuthority = computed(() => {
  return controlAuthorityStatus.value.hasFlightAuthority && controlAuthorityStatus.value.hasPayloadAuthority
})

// 计算属性：是否被其他用户控制
const isControlledByOthers = computed(() => {
  const hasFlightOwner = controlAuthorityStatus.value.flightAuthorityOwner !== null
  const hasPayloadOwner = controlAuthorityStatus.value.payloadAuthorityOwner !== null
  const isCurrentUserOwner = hasControlAuthority.value
  
  return (hasFlightOwner || hasPayloadOwner) && !isCurrentUserOwner
})

// 计算属性：获取控制权拥有者名称
const controllerName = computed(() => {
  if (controlAuthorityStatus.value.flightAuthorityOwner) {
    return controlAuthorityStatus.value.flightAuthorityOwner.username
  }
  if (controlAuthorityStatus.value.payloadAuthorityOwner) {
    return controlAuthorityStatus.value.payloadAuthorityOwner.username
  }
  return ''
})

// 切换控制权按钮点击处理
const handleToggleControlAuthority = async () => {
  if (controlAuthorityStatus.value.isLoading) {
    return
  }

  try {
    if (hasControlAuthority.value) {
      // 当前有控制权，执行释放操作
      await releaseControlAuthority()
    } else {
      // 当前无控制权，检查是否被其他用户控制
      if (isControlledByOthers.value) {
        // 显示抢夺控制权确认提示
        showAuthorityTooltip()
      } else {
        // 没有被其他用户控制，直接获取控制权
        await acquireControlAuthority()
      }
    }
  } catch (error: any) {
    alert(`控制权操作失败: ${error.message || error}`)
  }
}

// 显示抢夺控制权提示弹窗
const showAuthorityTooltip = () => {
  authorityTooltip.value.message = `设备正在被 ${controllerName.value} 控制，是否抢夺控制权？`
  authorityTooltip.value.visible = true
  
  // 3秒后自动隐藏
  setTimeout(() => {
    authorityTooltip.value.visible = false
  }, 5000)
}

// 确认抢夺控制权
const confirmSeizeAuthority = async () => {
  authorityTooltip.value.visible = false
  try {
    await acquireControlAuthority()
  } catch (error: any) {
    alert(`抢夺控制权失败: ${error.message || error}`)
  }
}

// 取消抢夺控制权
const cancelSeizeAuthority = () => {
  authorityTooltip.value.visible = false
}

// 获取控制权
const acquireControlAuthority = async () => {
  controlAuthorityStatus.value.isLoading = true
  
  try {
    
    // 获取缓存的设备列表
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    
    
    if (cachedDockSns.length === 0) {
      alert('没有找到可用的机场设备')
      return
    }
    
    // 使用第一个机场SN作为API调用的设备SN
    const dockSn = cachedDockSns[0]
    
    // 从capacity缓存数据中获取payload_index
    const capacity = getCachedCapacity()
    if (!capacity || !capacity.available_devices || capacity.available_devices.length === 0) {
      alert('没有找到可用的设备，请重新登录')
      return
    }
    
    // 获取最佳的payload_index
    const payloadIndex = getBestPayloadIndex()
    
    if (!payloadIndex) {
      alert('没有找到可用的载荷信息')
      return
    }
    
    
    // 同时调用两个API，都使用机场SN
    const flightPromise = controlApi.getFlightAuthority(dockSn)
    
    const payloadPromise = controlApi.getPayloadAuthority(dockSn, payloadIndex)
    
    // 等待两个API都完成
    const [flightResult, payloadResult] = await Promise.all([flightPromise, payloadPromise])
    
    
    // 更新状态
    controlAuthorityStatus.value.hasFlightAuthority = flightResult.code === 0
    controlAuthorityStatus.value.hasPayloadAuthority = payloadResult.code === 0
    
    // 检查结果并提示用户
    if (flightResult.code === 0 && payloadResult.code === 0) {
      // 控制权获取成功，启用云台控制
      isGimbalControlEnabled.value = true
    } else {
      const errorMsg = `控制权获取失败:\n飞行控制: ${flightResult.message}\n载荷控制: ${payloadResult.message}`
      alert(errorMsg)
    }
    
  } catch (error: any) {
    alert(`获取控制权失败: ${error.message || error}`)
  } finally {
    controlAuthorityStatus.value.isLoading = false
  }
}

// 释放控制权
const releaseControlAuthority = async () => {
  controlAuthorityStatus.value.isLoading = true
  
  try {
    
    // 获取缓存的设备列表
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    
    if (cachedDockSns.length === 0) {
      alert('没有找到可用的机场设备')
      return
    }
    
    const dockSn = cachedDockSns[0]
    
    // 获取最佳的payload_index
    const payloadIndex = getBestPayloadIndex()
    
    if (!payloadIndex) {
      alert('没有找到可用的载荷信息')
      return
    }
    
    
    // 同时调用两个释放API
    const flightPromise = controlApi.releaseFlightAuthority(dockSn)
    
    const payloadPromise = controlApi.releasePayloadAuthority(dockSn, payloadIndex)
    
    // 等待两个API都完成
    const [flightResult, payloadResult] = await Promise.all([flightPromise, payloadPromise])
    
    
    // 更新状态
    controlAuthorityStatus.value.hasFlightAuthority = false
    controlAuthorityStatus.value.hasPayloadAuthority = false
    
    // 检查结果并提示用户
    if (flightResult.code === 0 && payloadResult.code === 0) {
      // 控制权释放成功，禁用云台控制
      isGimbalControlEnabled.value = false
    } else {
      const errorMsg = `控制权释放失败:\n飞行控制: ${flightResult.message}\n载荷控制: ${payloadResult.message}`
      alert(errorMsg)
    }
    
  } catch (error: any) {
    alert(`释放控制权失败: ${error.message || error}`)
  } finally {
    controlAuthorityStatus.value.isLoading = false
  }
}

// 检查权限状态
const checkAuthorityStatus = async () => {
  try {
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    if (cachedDockSns.length === 0) {
      return
    }
    
    // 获取当前用户信息
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      return
    }
    
    const currentUser = JSON.parse(userStr)
    const currentUserId = currentUser.id
    
    const dockSn = cachedDockSns[0]
    const result = await controlApi.getAuthorityStatus(dockSn)
    
    if (result.code === 0) {
      const data = result.data
      
      // 检查飞行控制权：是否存在且属于当前用户
      const hasFlightAuthority = !!(data.flight_authority && data.flight_authority.user_id === currentUserId)
      
      // 检查载荷控制权：是否有载荷权限且至少一个属于当前用户
      let hasPayloadAuthority = false
      let payloadAuthorityOwner = null
      if (data.payload_authorities) {
        const authorities = Object.values(data.payload_authorities) as any[]
        hasPayloadAuthority = authorities.some((auth: any) => auth.user_id === currentUserId)
        // 获取第一个载荷权限的拥有者信息
        if (authorities.length > 0) {
          payloadAuthorityOwner = {
            username: authorities[0].username,
            user_id: authorities[0].user_id
          }
        }
      }
      
      // 更新状态
      controlAuthorityStatus.value.hasFlightAuthority = hasFlightAuthority
      controlAuthorityStatus.value.hasPayloadAuthority = hasPayloadAuthority
      controlAuthorityStatus.value.flightAuthorityOwner = data.flight_authority ? {
        username: data.flight_authority.username,
        user_id: data.flight_authority.user_id
      } : null
      controlAuthorityStatus.value.payloadAuthorityOwner = payloadAuthorityOwner
      
      // 更新云台控制状态
      isGimbalControlEnabled.value = hasControlAuthority.value
      
    }
  } catch (error: any) {
    // 静默处理错误
  }
}

// 云台控制处理函数
const handleGimbalControl = async (direction: 'up' | 'down' | 'left' | 'right') => {
  try {
    
    // 获取缓存的机场SN
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    if (cachedDockSns.length === 0) {
      alert('没有找到可用的机场设备')
      return
    }
    
    // 使用第一个机场SN
    const dockSn = cachedDockSns[0]
    
    // 获取最佳的payload_index
    const payloadIndex = getBestPayloadIndex()
    if (!payloadIndex) {
      alert('没有找到可用的载荷信息')
      return
    }
    
    
    // 调用云台控制API
    const result = await controlApi.gimbalDirectionControl(dockSn, payloadIndex, direction)
    
    // 检查结果
    if (result.code === 0) {
      // 不需要弹窗提示，云台控制是实时操作
    } else {
      alert(`云台${direction}控制失败: ${result.message}`)
    }
    
  } catch (error: any) {
    alert(`云台${direction}控制失败: ${error.message || error}`)
  }
}

// 一键返航处理函数
const handleReturnHome = async () => {
  try {
    
    // 获取缓存的机场SN
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    if (cachedDockSns.length === 0) {
      alert('没有找到可用的机场设备')
      return
    }
    
    // 使用第一个机场SN
    const dockSn = cachedDockSns[0]
    
    // 弹出确认对话框
    const confirmed = confirm('确定要执行一键返航吗？')
    if (!confirmed) {
      return
    }
    
    // 调用一键返航API
    const result = await controlApi.returnHome(dockSn)
    
    // 检查结果并提示用户
    if (result.code === 0) {
      alert('一键返航指令发送成功！')
    } else {
      alert(`一键返航失败: ${result.message}`)
    }
    
  } catch (error: any) {
    alert(`一键返航失败: ${error.message || error}`)
  }
}

// 一键起飞处理函数
const handleTakeoff = async () => {
  takeoffLoading.value = true
  
  try {
    // 获取缓存的机场SN
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    if (cachedDockSns.length === 0) {
      alert('没有找到可用的机场设备')
      return
    }
    
    const dockSn = cachedDockSns[0]
    
    // 获取当前设备坐标信息 (使用原始WGS84坐标用于起飞API)
    if (!position.value || !position.value.latitude || !position.value.longitude) {
      alert('无法获取设备坐标信息，请稍后重试')
      return
    }
    
    const dockLat = position.value.latitude  // 使用原始WGS84坐标
    const dockLng = position.value.longitude // 使用原始WGS84坐标
    const dockAlt = position.value.height || 0
    
    // 验证坐标有效性
    if (isNaN(dockLat) || isNaN(dockLng) || isNaN(dockAlt)) {
      alert('坐标数据无效，请稍后重试')
      return
    }
    
    if (dockLat < -90 || dockLat > 90) {
      alert('纬度超出有效范围 (-90 到 90)')
      return
    }
    
    if (dockLng < -180 || dockLng > 180) {
      alert('经度超出有效范围 (-180 到 180)')
      return
    }
    
    // 弹出确认对话框
    const confirmed = confirm('确定要执行一键起飞吗？无人机将起飞到30米高度。')
    if (!confirmed) {
      return
    }
    
    // 目标点设置为机场上方30米
    const targetLat = dockLat
    const targetLng = dockLng
    const targetHeight = 30  // 默认起飞到30米
    
    // 构建起飞参数
    const takeoffParams = {
      target_latitude: targetLat,
      target_longitude: targetLng,
      target_height: targetHeight,
      security_takeoff_height: Math.max(20, dockAlt + 10),  // 安全起飞高度：机场高度+10m，最小20m
      rth_mode: 0,  // 智能高度返航
      rth_altitude: Math.max(50, dockAlt + 30),  // 返航高度：机场高度+30m，最小50m
      rc_lost_action: 2,  // 遥控器失控动作: 0-悬停, 1-着陆, 2-返航
      commander_mode_lost_action: 1,  // 指点飞行失控动作: 0-继续, 1-退出
      commander_flight_mode: 0,  // 指点飞行模式: 0-智能高度, 1-设定高度
      commander_flight_height: Math.max(100, dockAlt + 50),  // 指点飞行高度
      max_speed: 12,  // 最大飞行速度
      simulate_mission: { is_enable: 0 }  // 默认不启用模拟模式
    }
    
    const result = await controlApi.takeoffToPoint(dockSn, takeoffParams)
    
    if (result.code === 0) {
      alert('一键起飞指令已发送成功！')
    } else {
      alert(`起飞失败: ${result.message}`)
    }
    
  } catch (error: any) {
    alert(`起飞失败: ${error.message || '请稍后重试'}`)
  } finally {
    takeoffLoading.value = false
  }
}

// 变焦控制处理函数
const handleZoom = async (direction: 'in' | 'out') => {
  try {
    const action = direction === 'in' ? '放大' : '缩小'
    
    // 获取缓存的机场SN
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    if (cachedDockSns.length === 0) {
      alert('没有找到可用的机场设备')
      return
    }
    
    // 使用第一个机场SN
    const dockSn = cachedDockSns[0]
    
    // 获取最佳的payload_index
    const payloadIndex = getBestPayloadIndex()
    if (!payloadIndex) {
      alert('没有找到可用的载荷信息')
      return
    }
    
    // 获取当前变焦倍率并计算新倍率
    const currentFactor = getCurrentZoomFactor()
    let newFactor: number
    
    if (direction === 'in') {
      // 放大：增加1倍
      newFactor = currentFactor + 1
    } else {
      // 缩小：减少1倍
      newFactor = currentFactor - 1
    }
    
    // 检查倍率边界
    if (newFactor < MIN_ZOOM) {
      alert(`已达到最小变焦倍率 ${MIN_ZOOM}x`)
      return
    }
    if (newFactor > MAX_ZOOM) {
      alert(`已达到最大变焦倍率 ${MAX_ZOOM}x`)
      return
    }
    
    
    // 调用变焦API
    const result = await controlApi.cameraZoom(dockSn, payloadIndex, newFactor)
    
    // 检查结果
    if (result.code === 0) {
      // 成功后更新缓存
      setZoomFactor(newFactor)
      // 可选：显示当前倍率提示
      // alert(`${action}成功，当前倍率: ${newFactor}x`)
    } else {
      alert(`${action}失败: ${result.message}`)
    }
    
  } catch (error: any) {
    const action = direction === 'in' ? '放大' : '缩小'
    alert(`${action}失败: ${error.message || error}`)
  }
}

// DRC模式切换处理函数
const handleToggleDrcMode = async () => {
  const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
  if (cachedDockSns.length === 0) {
    alert('没有找到可用的机场设备')
    return
  }
  
  const dockSn = cachedDockSns[0]

  if (isDrcModeActive.value) {
    // 退出DRC模式
    try {
      const result = await drcApi.exitDrcMode(dockSn)
      if (result.code === 0) {
        isDrcModeActive.value = false
        alert('已退出DRC模式')
        // 立即检查状态更新
        checkDrcStatus()
      } else {
        alert(`退出DRC模式失败: ${result.message}`)
      }
    } catch (error: any) {
      alert(`退出DRC模式失败: ${error.message || error}`)
    }
  } else {
    // 检查DRC是否就绪
    if (!drcStatus.value.ready) {
      alert(`DRC未就绪，无法进入DRC模式${drcStatus.value.reason ? ': ' + drcStatus.value.reason : ''}`)
      return
    }
    
    // 进入DRC模式
    try {
      const result = await drcApi.enterDrcMode(dockSn)
      
      if (result.code === 0) {
        isDrcModeActive.value = true
        alert('已进入DRC模式，现在可以使用方向控制按钮')
        // 立即检查状态更新
        checkDrcStatus()
      } else {
        alert(`进入DRC模式失败: ${result.message}`)
      }
    } catch (error: any) {
      alert(`进入DRC模式失败: ${error.message || error}`)
    }
  }
}

// DRC模式处理函数 (保持向后兼容)
const handleEnterDrcMode = async () => {
  try {
    
    // 获取缓存的机场SN
    const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
    if (cachedDockSns.length === 0) {
      alert('没有找到可用的机场设备')
      return
    }
    
    // 使用第一个机场SN
    const dockSn = cachedDockSns[0]
    
    // 调用DRC进入模式API
    const result = await drcApi.enterDrcMode(dockSn)
    
    // 检查结果并提示用户
    if (result.code === 0) {
      alert('进入DRC模式！')
    } else {
      alert(`进入DRC模式失败: ${result.message}`)
    }
    
  } catch (error: any) {
    alert(`进入DRC模式失败: ${error.message || error}`)
  }
}

// 开始控制
const startControl = (type: string) => {
  
  // 获取缓存的机场SN
  const cachedDockSns = JSON.parse(localStorage.getItem('cached_dock_sns') || '[]')
  if (cachedDockSns.length === 0) {
    alert('没有找到可用的机场设备')
    return
  }
  
  const dockSn = cachedDockSns[0]
  currentControlType.value = type
  
  // 立即发送第一次控制指令
  sendControlCommand(dockSn, type)
  
  // 设置定时器，持续发送控制指令
  controlInterval.value = setInterval(() => {
    sendControlCommand(dockSn, type)
  }, CONTROL_INTERVAL_MS)
}

// 停止控制
const stopControl = () => {
  
  // 清除定时器
  if (controlInterval.value) {
    clearInterval(controlInterval.value)
    controlInterval.value = null
  }
  
  // DRC的简单控制不需要发送停止指令
  // 只需要停止发送控制指令即可
  
  currentControlType.value = null
}

// 发送控制指令
const sendControlCommand = async (dockSn: string, type: string) => {
  const control: any = {
    forward: 0,
    right: 0,
    up: 0,
    turn_right: 0
  }
  
  // 根据控制类型设置参数
  switch (type) {
    case 'forward':
      control.forward = CONTROL_SPEED
      break
    case 'backward':
      control.forward = -CONTROL_SPEED
      break
    case 'left':
      control.right = -CONTROL_SPEED
      break
    case 'right':
      control.right = CONTROL_SPEED
      break
    case 'up':
      control.up = CONTROL_SPEED
      break
    case 'down':
      control.up = -CONTROL_SPEED
      break
    case 'turn_left':
      control.turn_right = -CONTROL_SPEED
      break
    case 'turn_right':
      control.turn_right = CONTROL_SPEED
      break
  }
  
  try {
    await drcApi.simpleControl(dockSn, control)
  } catch (error: any) {
    // 发生错误时停止控制
    stopControl()
  }
}

// 组件卸载时清理定时器
onBeforeUnmount(() => {
  stopControl()
  stopDrcStatusPolling()
  stopVideoPlayback() // 停止视频播放
  
  // 清理机场状态刷新定时器
  if (statusRefreshTimer.value) {
    clearInterval(statusRefreshTimer.value)
    statusRefreshTimer.value = null
  }
  

  
  // 清理地图标记
  clearDockMarkers()
  clearDroneMarkers()
  
  if (amapInstance.value) {
    amapInstance.value.destroy()
    amapInstance.value = null
  }
})

// 顶部统计数据
const todayTotalTasks = ref(0)
const todayCompletedTasks = ref(0)
const todayUnexecutedTasks = ref(0)
const todayNormalTasks = ref(0)
const todayAbnormalTasks = ref(0)

// 获取workspace_id
function getWorkspaceId() {
  return localStorage.getItem('workspace_id')
}

// 获取今日飞行统计
const loadTodayFlightStatistics = async () => {
  const workspaceId = getWorkspaceId()
  if (!workspaceId) return
  try {
    const res = await waylineApi.getFlightStatistics(workspaceId, 1)
    if (res.code === 0 && res.data) {
      const summary = res.data.summary || {}
      const statusStats = res.data.status_stats || []
      todayTotalTasks.value = summary.total_tasks || 0
      todayCompletedTasks.value = summary.completed_tasks || 0
      todayUnexecutedTasks.value = summary.total_tasks - summary.completed_tasks - summary.failed_tasks - summary.canceled_tasks
      // 正常/异常
      todayNormalTasks.value = statusStats.find(s => s.status_name === 'SUCCESS')?.count || 0
      todayAbnormalTasks.value = statusStats.find(s => s.status_name === 'FAILED')?.count || 0
    }
  } catch (e) {
    // 可加错误提示
  }
}
</script>

<style scoped>
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
  flex: 2;
  /* 参考机场控制页面的框线样式 */
  background: none !important;
  border: 1.5px solid #164159;
  border-radius: 8px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: stretch; /* 修改：让内容拉伸填满 */
  align-items: stretch; /* 修改：让内容拉伸填满 */
  gap: 0; /* 修改：去掉间距 */
  min-height: 320px;
  padding: 0; /* 确保没有内边距 */
  overflow: hidden; /* 确保内容不会溢出 */
}
.video-player-placeholder {
  width: 100%;
  height: 260px;
  background: #223a5e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 18px;
}
.video-controls-placeholder {
  width: 100%;
  height: 40px;
  background: #16213a;
  border-radius: 6px;
  margin-top: 8px;
  color: #59c0fc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.control-bottom {
  display: flex;
  gap: 18px;
  margin-top: 8px;
}
.drone-control-panel {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.gimbal-control-panel {
  flex: 2 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.panel-title {
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  text-align: center;
  border-radius: 4px 4px 0 0;
  background: #004161;
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  width: calc(100% + 32px);
  box-sizing: border-box;
  margin-left: -16px;
  margin-right: -16px;
  margin-top: -12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
}

.drc-status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4d4f;
  box-shadow: 0 0 4px rgba(255, 77, 79, 0.5);
  transition: all 0.3s ease;
  animation: pulse-red 2s infinite;
  flex-shrink: 0;
}

.drc-status-indicator.ready {
  background: #52c41a;
  box-shadow: 0 0 4px rgba(82, 196, 26, 0.5);
  animation: pulse-green 2s infinite;
}

.drc-status-indicator.not-ready {
  background: #ff4d4f;
  box-shadow: 0 0 4px rgba(255, 77, 79, 0.5);
  animation: pulse-red 2s infinite;
}

.drc-mode-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #0c3c56;
  border: 1px solid rgba(38, 131, 182, 0.8);
  border-radius: 4px;
  color: #67d5fd;
  font-size: 11px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  height: 24px;
  line-height: 1;
}

.drc-mode-btn:hover:not(:disabled) {
  background: #16bbf2;
  color: #fff;
  border-color: #16bbf2;
}

.drc-mode-btn.active {
  background: #52c41a;
  color: #fff;
  border-color: #52c41a;
  box-shadow: 0 0 4px rgba(82, 196, 26, 0.3);
}

.drc-mode-btn.disabled,
.drc-mode-btn:disabled {
  background: #2a2a2a;
  color: #666;
  border-color: #444;
  cursor: not-allowed;
  opacity: 0.6;
}

.drc-btn-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

@keyframes pulse-red {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes pulse-green {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.panel-title-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
}

.drc-status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff4d4f;
  box-shadow: 0 0 4px rgba(255, 77, 79, 0.5);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.drc-status-indicator.ready {
  background-color: #52c41a;
  box-shadow: 0 0 4px rgba(82, 196, 26, 0.5);
}

.drc-status-indicator.not-ready {
  background-color: #ff4d4f;
  box-shadow: 0 0 4px rgba(255, 77, 79, 0.5);
}
.drone-direction-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, auto);
  column-gap: 24px;
  row-gap: 0px;
}

.drone-btn-placeholder {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 62px;
  visibility: hidden;
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
  width: 74%;
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
.on1-lt-flex-vertical {
  display: none;
}
.on1-lt-border-horizontal {
  position: absolute;
  left: 0;
  right: -12px;
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
.in-box-top-left .img {
  width: 35%;
  height: 100%;
  background: #223a5e;
  border-radius: 8px;
}
.in-box-top-left .dian {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: 8px;
  height: 100%;
  width: calc(60% - 20px);
  padding: 0px 10px;
  background: linear-gradient(rgba(0, 65, 97, 0.5), rgba(5, 27, 38, 0.8));
}
.in-box-top-left .on1-r {
  width: 26%;
  height: 100%;
  border-left: 1px solid rgb(22, 65, 89);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 16px 0 16px 0px;
  box-sizing: border-box;
  margin: 0;
}
.remote-control-section {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.remote-control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #223a5e;
  margin-bottom: 12px;
  margin-top: -8px;
  width: calc(100%);
  box-sizing: border-box;
}
.remote-control-text {
  color: #67d5fd;
  font-size: 14px;
  font-weight: 500;
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
.remote-control-data {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
}
.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(34, 58, 94, 0.3);
}
.data-row:last-child {
  border-bottom: none;
}
.data-label {
  color: #b6b6b6;
  font-size: 12px;
}
.data-value {
  color: #67d5fd;
  font-size: 12px;
  font-weight: 500;
}
.drone-img-battery-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: auto;
  height: 100%;
  gap: 0px;
  padding-left: 0;
  box-sizing: border-box;
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
  line-height: 150%; /* 18px */
  letter-spacing: 1px;
  text-align: center;
  margin-left: 0;
}
.task-info-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  flex: 1;
  margin-left: 10px;
  max-width: 100%;
  max-height: 180px;         /* 限制最大高度 */
  padding-bottom: 5px;      /* 底部留白，避免贴死横线 */
  padding-top: 5px;
  box-sizing: border-box;
}
.task-progress-actions,
.task-stats-panel {
  width: 100%;
}
.task-progress-actions {
  width: 100%;
  display: flex;
  flex-direction: row; /* 改为水平布局 */
  align-items: center;
  justify-content: space-between; /* 左右分布 */
  margin-bottom: 8px;
  box-sizing: border-box;
  flex: 1; /* 让上半部分自动填满剩余空间 */
}
.task-progress-left {
  flex: 1; /* 左侧占据剩余空间 */
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-sizing: border-box;
  margin-top: -8px; /* 往上移动10px */
}
.task-progress-title,
.task-progress-bar,
.task-name {
  width: 100%;
  box-sizing: border-box;
}
.task-progress-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #67D5FD; /* 改为要求的颜色 */
  margin-bottom: 4px;
  position: relative;
}
.task-progress-title span:first-child {
  flex: 1;
  text-align: left;
}
.task-progress-title span:last-child {
  flex-shrink: 0;
  margin-left: 10px;
}
.task-progress-bar {
  height: 6px;
  margin-bottom: 4px;
  flex-shrink: 0;
  min-width: 80px;
  max-width: none; /* 移除最大宽度限制 */
  flex: 1;
  position: relative;
  width: 100%; /* 让进度条占满整个宽度 */
}
.el-slider__runway {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  flex: 1;
  height: 6px;
  position: relative;
  width: 100%;
  margin-right: 50px; /* 为百分比数字留出空间 */
}
.el-slider__bar {
  background-color: rgb(22, 187, 242);
  border-bottom-left-radius: 3px;
  border-top-left-radius: 3px;
  height: 6px;
  position: absolute;
  left: 0%;
  width: 0%;
  transition: width 0.3s ease, left 0.3s ease;
}
.el-slider__button-wrapper {
  background-color: transparent;
  height: 20px;
  line-height: normal;
  outline: none;
  position: absolute;
  text-align: center;
  top: -7px;
  transform: translate(-50%);
  user-select: none;
  width: 20px;
  z-index: 1;
  left: 0%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-slider__button {
  width: 10px;
  height: 10px;
  background-color: rgb(22, 187, 242);
  border: 5px solid rgba(22, 187, 242, 0.7);
  border-radius: 50%;
  box-sizing: border-box;
  display: inline-block;
  transition: 0.2s;
  user-select: none;
  vertical-align: middle;
  flex-shrink: 0;
}
.task-name {
  font-size: 13px;
  color: #b6b6b6;
  margin-top: 10px;
}
.task-progress-divider {
  width: 1.5px;
  background: linear-gradient(180deg, #59c0fc 0%, #223a5e 100%);
  margin: 0 15px; /* 竖线两侧留10px间距 */
  border-radius: 1px;
  height: 80%; /* 缩短高度为60% */
  align-self: center; /* 垂直居中 */
  opacity: 0.7;
  flex-shrink: 0;
}
.task-progress-actions-btns {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 增加按钮间距从8px到16px */
  width: auto;
  align-items: flex-end;
  justify-content: center;
  flex-shrink: 0; /* 防止按钮组被压缩 */
  margin-top: -5px; /* 往上移动，与任务进度平齐 */
  height: 100%; /* 让按钮组占满高度 */
}
.task-progress-actions-btns .span {
  width: clamp(60px, 6vw, 70px);
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #0c3c56;
  border-radius: 4px;
  border: 1px solid rgba(38, 131, 182, 0.8);
  color: #67d5fd;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  transition: all 0.3s;
  margin-top: auto; /* 暂停按钮靠上 */
}
.task-progress-actions-btns .span:hover {
  border-color: rgba(38, 131, 182, 0.8);
  background: #0c4666;
}
.task-progress-actions-btns .span1 {
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
  margin-bottom: auto; /* 停止按钮靠下 */
}
.task-progress-actions-btns .span1:hover {
  border-color: rgba(182, 38, 38, 0.8);
  background: #662626;
}

/* 禁用状态样式 */
.task-progress-actions-btns .span.disabled,
.task-progress-actions-btns .span1.disabled,
.task-progress-actions-btns .span-resume.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #2a2a2a;
  border-color: #555;
  color: #888;
}

.task-progress-actions-btns .span.disabled:hover,
.task-progress-actions-btns .span1.disabled:hover,
.task-progress-actions-btns .span-resume.disabled:hover {
  background: #2a2a2a;
  border-color: #555;
}

/* 恢复按钮样式 */
.task-progress-actions-btns .span-resume {
  width: clamp(60px, 6vw, 70px);
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #1c561c;
  border-radius: 4px;
  border: 1px solid rgba(38, 182, 38, 0.8);
  color: #67fd67;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  transition: all 0.3s;
}

.task-progress-actions-btns .span-resume:hover {
  border-color: rgba(38, 182, 38, 0.8);
  background: #266626;
}
.task-stats-panel {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  width: 100%;
}
.task-stat-card {
  display: flex;
  flex: 1; /* 均分宽度 */
  height: 60px; /* 从44px增加到60px */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(0deg, rgba(170, 128, 255, 0.20) 0%, rgba(170, 128, 255, 0.00) 100%);
  border-bottom: 3px solid #7E44F2;
  min-width: 0;
  padding: 0;
}
.stat-title {
  font-size: 13px;
  color: #b6b6b6;
}
/* 紫色卡片标题 */
.task-stat-card .stat-title {
  color: #7E44F2;
}
/* 蓝色卡片标题 */
.stat-blue .stat-title {
  color: #16BBF2;
}
/* 绿色卡片标题 */
.stat-green .stat-title {
  color: #31C2A5;
}
.stat-value {
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  margin-top: 2px;
}
/* 紫色卡片的数值颜色 */
.task-stat-card .stat-value {
  color: #7E44F2;
}
.stat-blue {
  background: linear-gradient(0deg, rgba(0, 212, 255, 0.20) 0%, rgba(0, 212, 255, 0.00) 100%);
  border-bottom: 3px solid #00CFFF;
}
.stat-blue .stat-value {
  color: #16BBF2;
}
.stat-green {
  background: linear-gradient(0deg, rgba(0, 255, 170, 0.20) 0%, rgba(0, 255, 170, 0.00) 100%);
  border-bottom: 3px solid #00FFAA;
}
.stat-green .stat-value {
  color: #31C2A5;
}
.route-name {
  color: #16BBF2;
  font-weight: bold;
  margin-left: 4px;
}
.remote-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  align-items: center;
  padding: 0;
  margin: 0;
}
.remote-card-item {
  display: flex;                /* 恢复横向排列 */
  flex-direction: row;
  align-items: center;
  width: 90%;
  height: 42px;
  margin: 0 auto;
  gap: 18px;
  border-radius: 4px;
  background: rgba(1, 135, 191, 0.30);
  padding: 0 12px 0 16px;
  box-sizing: border-box;
  position: relative;
}
.remote-card-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
  flex-shrink: 0;
}
.remote-card-texts {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-self: stretch;
  gap: 0;
  min-width: 0;
}
.remote-card-title {
  color: #FFF;
  font-family: Inter, 'Source Han Sans CN', 'Microsoft YaHei', Arial, sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 1px;
  margin-bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.remote-card-sub {
  color: #FFF;
  font-family: Inter, 'Source Han Sans CN', 'Microsoft YaHei', Arial, sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 1px;
  margin-top: -1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.remote-card-btn {
  display: flex;
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.23);
  background: rgba(255, 255, 255, 0.65);
  color: #5E5E5E;
  font-family: Inter, 'Source Han Sans CN', 'Microsoft YaHei', Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: 1px;
  outline: none;
  cursor: not-allowed;
  min-width: 56px;
  height: 28px;         /* 按钮高度适配卡片 */
  margin-left: auto;    /* 靠右对齐 */
  transition: border 0.2s, background 0.2s;
  align-self: center;   /* 垂直居中 */
}
.remote-card-btn:active,
.remote-card-btn:focus {
  border-color: #b0b3b8;
}
.remote-card-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(0, 0, 0, 0.23);
  color: #5E5E5E;
}
.remote-card-btn:not(:disabled) {
  cursor: pointer;
  opacity: 1;
  background: #fff;
  border: 1px solid #16bbf2;
  color: #222;
  box-shadow: 0 2px 8px 0 rgba(22, 187, 242, 0.08);
  transition: background 0.2s, border 0.2s, color 0.2s, box-shadow 0.2s;
}
.remote-card-btn:not(:disabled):hover {
  background: #e6f7ff;
  border: 1.5px solid #16bbf2;
  color: #16bbf2;
  box-shadow: 0 4px 12px 0 rgba(22, 187, 242, 0.15);
}
.amap-maptype {
  right: 16px !important;
  bottom: 80px !important; /* 从底部向上移动80px */
  z-index: 20 !important;
}

/* 地图类型控件样式 */
:deep(.amap-maptype) {
  color: #000 !important;
  bottom: 110px !important; /* 确保深度选择器也生效 */
  right: 16px !important;
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
  margin: 0; /* 确保没有外边距 */
  border: none; /* 确保没有边框 */
}
.boxGrid-box-content {
  flex: 1;
  position: relative;
  padding: 0;
  width: 100%;
  height: calc(100% - 52px); /* 减去底部控制条的高度和padding */
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

/* 视频元素样式，确保填满容器 - 最强制性的设置 */
#player_box1,
.player_box {
  width: 100% !important;
  height: 100% !important;
  position: relative;
  background: #000;
  border-radius: 0;
  overflow: hidden;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  box-sizing: border-box !important;
}

.player_box video,
.player_box canvas,
.player_box img {
  width: 100% !important;
  height: 100% !important;
  object-fit: fill !important;
  display: block !important;
  border: none !important;
  outline: none !important;
  margin: 0 !important;
  padding: 0 !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  box-sizing: border-box !important;
}

/* FlvJS播放器样式 - 最强制性设置 */
.player_box .flv-player,
.player_box .video-js,
.player_box .flv-player *,
.player_box .video-js * {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  box-sizing: border-box !important;
}

.player_box .video-js .vjs-tech {
  width: 100% !important;
  height: 100% !important;
  object-fit: fill !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
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
  margin-top: 0; /* 修改：去掉margin-top */
  flex-shrink: 0; /* 确保底部控制条不会被压缩 */
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
.drone-control-panel, .gimbal-control-panel {
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
.drone-control-panel {
  position: relative;
  overflow: hidden;
}
.drone-btn-icon {
  width: 22px;
  height: 22px;
  display: block;
  margin: 0 auto 2px auto;
}
.drone-direction-grid button, .drone-bottom-row button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  box-shadow: none;
  padding: 0;
  cursor: pointer;
  gap: 0px;
}
.drone-btn-iconbox {
  width: 40px;
  height: 40px;
  border: none !important;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  margin-bottom: 0;
  transition: background 0.2s, border 0.2s;
}
.drone-direction-grid button:hover .drone-btn-label,
.drone-bottom-row button:hover .drone-btn-label {
  color: #fff;
}
.drone-direction-grid button:hover .drone-btn-iconbox,
.drone-bottom-row button:hover .drone-btn-iconbox {
  background: #16bbf2;
  border-color: #16bbf2;
}
.drone-direction-grid button:hover .drone-btn-label,
.drone-bottom-row button:hover .drone-btn-label {
  color: #fff !important;
}

/* 禁用状态样式 */
.drone-direction-grid button.disabled,
.drone-direction-grid button:disabled {
  cursor: not-allowed;
  pointer-events: none;
}

.drone-direction-grid button.disabled .drone-btn-iconbox,
.drone-direction-grid button:disabled .drone-btn-iconbox {
  background: none !important;
  border: none !important;
}

.drone-direction-grid button.disabled .drone-btn-icon,
.drone-direction-grid button:disabled .drone-btn-icon {
  filter: grayscale(100%) brightness(0.6) !important;
  opacity: 0.5;
}

.drone-direction-grid button.disabled .drone-btn-label,
.drone-direction-grid button:disabled .drone-btn-label {
  color: #666 !important;
}

.drone-direction-grid button.disabled:hover .drone-btn-iconbox,
.drone-direction-grid button:disabled:hover .drone-btn-iconbox {
  background: none !important;
  border: none !important;
}

.drone-direction-grid button.disabled:hover .drone-btn-label,
.drone-direction-grid button:disabled:hover .drone-btn-label {
  color: #666 !important;
}
/* 取消按钮整体高亮，只高亮图标框 */
.drone-direction-grid button:hover,
.drone-bottom-row button:hover {
  background: none;
  color: #fff;
}
.drone-btn-icon {
  width: 22px;
  height: 22px;
  display: block;
}
.drone-btn-label {
  color: #67d5fd;
  font-size: 10px;
  margin-top: 2px;
  text-align: center;
  font-family: Inter, 'Source Han Sans CN', 'Microsoft YaHei', Arial, sans-serif;
  font-weight: 400;
  line-height: 1.2;
}
.drone-direction-grid button:hover .drone-btn-label {
  color: #fff !important;
}
.big-drone-btn-icon {
  width: 30px !important;
  height: 30px !important;
}
.drone-direction-grid button:focus,
.drone-direction-grid button:active {
  outline: none !important;
  box-shadow: none !important;
  background: none !important;
}
.gimbal-btn-row button {
  min-width: 90px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #0c3c56;
  border-radius: 4px;
  border: 1px solid rgba(38, 131, 182, 0.8);
  color: #67d5fd;
  cursor: pointer;
  font-size: 16px;
  white-space: nowrap;
  transition: all 0.3s;
  margin: 0 8px 0 0;
  font-family: Inter, 'Source Han Sans CN', 'Microsoft YaHei', Arial, sans-serif;
  font-weight: 400;
  padding: 0 18px;
  outline: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gimbal-btn-row button:hover {
  border-color: rgba(38, 131, 182, 0.8);
  background: #0c4666;
  color: #67d5fd;
}
.gimbal-btns-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 8px;
}
.gimbal-dir-row, .gimbal-func-row {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
}
.gimbal-dir-row:first-child {
  justify-content: center;
}
.gimbal-dir-row:nth-child(2) {
  justify-content: center;
  gap: 32px;
}
.gimbal-dir-btn {
  width: 32px;
  height: 32px;
  background: #0c3c56;
  border: 1px solid rgba(38, 131, 182, 0.8);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.gimbal-dir-btn img {
  width: 24px;
  height: 24px;
}
.gimbal-dir-btn:hover {
  background: #16bbf2;
}
.gimbal-func-row button {
  flex: 1;
  min-width: 0;
  height: 32px;
  font-size: 13px;
  background: #0c3c56;
  border: 1px solid rgba(38, 131, 182, 0.8);
  border-radius: 4px;
  color: #67d5fd;
  cursor: pointer;
  margin: 0;
  padding: 0;
  transition: background 0.2s, color 0.2s;
}
.gimbal-func-row button:hover {
  background: #16bbf2;
  color: #fff;
}

.gimbal-dir-btn:disabled,
.gimbal-func-row button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: rgba(255, 255, 255, 0.65) !important;
  border: 1px solid rgba(0, 0, 0, 0.23) !important;
  color: #5E5E5E !important;
}

.gimbal-dir-btn:disabled img {
  filter: grayscale(100%) brightness(0.8) !important;
  opacity: 0.6;
}

.gimbal-separator {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(89, 192, 252, 0.3) 0%, #59c0fc 50%, rgba(89, 192, 252, 0.3) 100%);
  margin: 8px 0;
  opacity: 0.7;
  border-radius: 1px;
}
@media (max-width: 900px) {
  .main-flex {
    flex-direction: column;
  }
  .left-panel,
  .right-panel {
    max-width: 100%;
    flex-basis: 100%;
    min-width: 0;
    width: 100%;
  }
  .card,
  .drone-info-card,
  .map-card {
    padding: 8px;
    gap: 8px;
  }
  .panel-title {
    font-size: clamp(12px, 2vw, 14px);
    height: 28px;
    line-height: 28px;
  }
  .remote-card-item {
    height: 36px;
    padding: 0 8px 0 8px;
    gap: 8px;
  }
  .amap-container,
  .video-card {
    min-height: 160px;
    max-height: 240px;
  }
  body, .main-content, .card, .panel-title {
    font-size: clamp(12px, 2vw, 14px);
  }
}
@media (max-width: 700px) {
  .sidebar-menu {
    width: 100vw;
    min-width: 0;
    max-width: 100vw;
    flex-direction: row;
    height: 56px;
    padding: 0 8px;
    border-radius: 0 0 10px 10px;
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }
  .sidebar-tabs {
    flex-direction: row;
    gap: 12px;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .remote-card-btn,
  .gimbal-btn-row button {
    min-width: 48px;
    height: 36px;
    font-size: 13px;
    padding: 0 10px;
  }
}

/* 控制权授权状态样式 - 仅修改图标颜色 */
.drone-direction-grid button.authority-granted .drone-btn-icon {
  filter: brightness(0) saturate(100%) invert(64%) sepia(88%) saturate(1574%) hue-rotate(87deg) brightness(103%) contrast(89%) !important;
  /* 这个filter会将图标变成亮绿色 #52c41a */
}

.drone-direction-grid button.authority-granted:hover .drone-btn-icon {
  filter: brightness(0) saturate(100%) invert(54%) sepia(98%) saturate(1385%) hue-rotate(87deg) brightness(94%) contrast(101%) !important;
  /* hover时使用稍深的绿色 */
}

/* 控制权按钮包装器 */
.authority-btn-wrapper {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
}

.authority-btn-wrapper > button {
  flex: 1;
  width: 100%;
  height: 100%;
}

/* 抢夺控制权气泡弹窗 */
.authority-tooltip {
  position: fixed;
  z-index: 1000;
  animation: fadeInUp 0.3s ease-out;
  pointer-events: none;
}

.authority-tooltip-content {
  background: rgba(0, 20, 40, 0.95);
  border: 1px solid #67D5FD;
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 200px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

.authority-tooltip-message {
  color: #fff;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 12px;
  text-align: center;
}

.authority-tooltip-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.authority-tooltip-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 70px;
}

.authority-confirm-btn {
  background: #ff4d4f;
  color: #fff;
}

.authority-confirm-btn:hover {
  background: #ff7875;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
}

.authority-cancel-btn {
  background: rgba(103, 213, 253, 0.1);
  color: #67d5fd;
  border: 1px solid rgba(103, 213, 253, 0.3);
}

.authority-cancel-btn:hover {
  background: rgba(103, 213, 253, 0.2);
  border-color: #67d5fd;
}

.authority-tooltip-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #67D5FD;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 新增：高分辨率屏幕优化 */
@media (min-width: 1920px) {
  .sidebar-menu {
    height: calc(100vh - 104px);
    overflow: hidden;
  }
  .main-content {
    height: calc(100vh - 104px);
  }
  .sidebar-tabs {
    gap: 20px; /* 在高分辨率下稍微减少间距 */
  }
}
</style> 