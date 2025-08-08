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
                    <p>{{ formatSpeed(droneStatus?.horizontalSpeed) }}</p>
                    <p>当前飞行速度</p>
                  </div>
                </div>
                <div class="b-top-rightDiv">
                  <img src="@/assets/source_data/today_time.png" alt="" />
                  <div>
                    <p>{{ formatAccTime(droneStatus?.totalFlightTime) }}</p>
                    <p>累计运行时间</p>
                  </div>
                </div>
                <div class="b-top-rightDiv">
                  <img src="@/assets/source_data/total_miles.png" alt="" />
                  <div>
                    <p>{{ formatFlightDistance(droneStatus?.totalFlightDistance) }}</p>
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
                <span class="value">{{ formatCoordinate(droneDisplayPosition?.longitude, 'longitude') }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/latitude.svg" alt="纬度" />
                  <span class="label">纬度</span>
                </div>
                <span class="value">{{ formatCoordinate(droneDisplayPosition?.latitude, 'latitude') }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/altitude.svg" alt="高度" />
                  <span class="label">高度</span>
                </div>
                <span class="value">{{ formatHeight(droneDisplayPosition?.height) }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/drone_battery.svg" alt="电量" />
                  <span class="label">电量</span>
                </div>
                <span class="value">{{ formatBattery(droneStatus?.batteryPercent) }}</span>
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
                    <p>{{ formatNetworkRate(dockStatus?.networkRate) }}</p>
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
                    <p>{{ formatAccTime(dockStatus?.accTime) }}</p>
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
              <div class="wayline-select-wrapper">
                <select 
                  v-model="selectedWayline" 
                  class="wayline-select"
                >
                  <option value="">请选择</option>
                  <option 
                    v-for="wayline in waylineFiles"
                    :key="wayline.wayline_id"
                    :value="wayline.wayline_id"
                  >
                    {{ wayline.name }}
                  </option>
                </select>
                <span class="wayline-custom-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
              <div class="button-group">
                <span class="span" @click="handleDispatchTask">下发任务</span>
                <span 
                  :class="['span1', { 'disabled': !canCancelTask }]" 
                  @click="canCancelTask ? handleCancelTask() : null"
                >
                  取消任务
                </span>
              </div>
            </div>
            <!-- 修改第二行的结构 -->
            <div class="control-row second-row">
              <span 
                :class="['span', { 'disabled': !canPauseRoute }]" 
                @click="canPauseRoute ? handlePauseRoute() : null"
              >
                航线暂停
              </span>
              <span 
                :class="['span', { 'disabled': !canResumeRoute }]" 
                @click="canResumeRoute ? handleResumeRoute() : null"
              >
                航线恢复
              </span>
              <span 
                :class="['span', { 'disabled': !canReturnHome }]" 
                @click="canReturnHome ? handleReturnHome() : null"
              >
                一键返航
              </span>
              <span 
                :class="['span1', { 'disabled': !canCancelReturnHome }]" 
                @click="canCancelReturnHome ? handleCancelReturnHome() : null"
              >
                取消返航
              </span>
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
      <div class="content-on1" @click="closeMenus">
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
                <!-- 云台切换按钮放在全屏按钮右侧 -->
                <div class="gimbal-control">
                  <button 
                    class="gimbal-btn" 
                    @click.stop="toggleGimbalMenu"
                    :disabled="videoLoading"
                    :class="{ 'loading': videoLoading }"
                    title="切换视频源"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                  </button>
                  <!-- 云台切换菜单 -->
                  <div class="gimbal-menu" v-if="gimbalMenuVisible" @click.stop>
                    <div 
                      class="menu-item" 
                      @click.stop="switchGimbal('dock')"
                      :class="{ 'active': currentVideoType === 'dock' }"
                    >
                      机场视频
                    </div>
                    <div 
                      class="menu-item" 
                      @click.stop="switchGimbal('drone_visible')"
                      :class="{ 'active': currentVideoType === 'drone_visible' }"
                    >
                      无人机可见光
                    </div>
                    <div 
                      class="menu-item" 
                      @click.stop="switchGimbal('drone_infrared')"
                      :class="{ 'active': currentVideoType === 'drone_infrared' }"
                    >
                      无人机红外
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="center-controls">
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
          <div v-if="loadingFlightStats" class="loading-container">
            <div class="loading-text">加载中...</div>
          </div>
          <div v-else-if="!flightStatistics || !flightStatistics.daily_stats || flightStatistics.daily_stats.length === 0" class="empty-container">
            <div class="empty-text">暂无数据</div>
          </div>
          <div v-else :ref="el => lineChartRef = el as HTMLElement" class="trend-chart"></div>
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
                <div class="task-name">任务名称：{{ waylineTaskName }}</div>
                <div class="time-item">
                  <span class="label">任务开始时间：{{ waylineTaskStartTime }}</span>
                  <span class="label">当前航点：第{{ waylineCurrentWaypoint }}个</span>
                </div>
              </div>
              <div class="task-status">
                <div :class="['status-btn', waylineTaskStatus]">{{ waylineTaskStatusText }}</div>
              </div>
            </div>
            <div class="task-progress">
              <div class="chart-box">
                <div class="progress-circle-container">
                  <div class="progress-circle">
                    <!-- 外环：进度显示环（按实际进度渲染蓝色已巡检比例） -->
                    <!-- 独立的外部光晕层，避免被mask裁剪导致的阴影不可见问题 -->
                    <div 
                      class="progress-circle-outer-glow" 
                      :class="{ 'completed': waylineProgressPercent >= 100 }"
                      :style="{ '--glow-color': waylineProgressPercent > 0 ? '#00e1ff' : '#FF8000' }"
                    ></div>
                    <div 
                      class="progress-circle-outer-ring" 
                      :class="{ 'completed': waylineProgressPercent >= 100 }"
                      :style="{
                        background: `conic-gradient(from -90deg, #00e1ff ${waylineProgressPercent}%, #FF8000 ${waylineProgressPercent}% 100%)`
                      }"
                    >
                    </div>
                    <div class="progress-circle-center">
                      <div class="progress-text">
                        <span>进度</span>
                        <span class="percentage">{{ waylineProgressPercent }}%</span>
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
                    <!-- 外环：任务状态显示环 -->
                    <div class="task-status-outer-ring" :class="{ 'error': waylineTaskStatus === 'failed' }"></div>
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
          <!-- 无人机追踪按钮 -->
          <div class="drone-track-btn" @click="toggleDroneTracking" :class="{ 'active': isDroneTracking }" :title="isDroneTracking ? '取消追踪' : '追踪无人机'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 下发任务弹窗 -->
  <div v-if="dispatchTaskDialog.visible" class="custom-dialog-mask">
    <div class="dispatch-task-modal">
      <div class="dispatch-task-modal-content">
        <div class="dispatch-task-title">下发任务</div>
        <div class="dispatch-task-form">
          <div class="dispatch-task-row">
            <label>任务名称：</label>
            <input 
              v-model="dispatchTaskDialog.form.name" 
              class="dispatch-task-input" 
              placeholder="请输入任务名称"
            />
          </div>
          <div class="dispatch-task-row">
            <label>设备序列号：</label>
            <input 
              v-model="dispatchTaskDialog.form.dock_sn" 
              class="dispatch-task-input" 
              disabled
            />
          </div>
          <div class="dispatch-task-row">
            <label>航线文件ID：</label>
            <input 
              v-model="dispatchTaskDialog.form.file_id" 
              class="dispatch-task-input" 
              disabled
            />
          </div>
          <div class="dispatch-task-row">
            <label>任务类型：</label>
            <div class="custom-select-wrapper">
              <select v-model="dispatchTaskDialog.form.task_type" class="mission-select">
                <option :value="0">立即任务</option>
                <option :value="1">定时任务</option>
                <option :value="2">条件任务</option>
              </select>
              <span class="custom-select-arrow">
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <polygon points="2,4 6,8 10,4" fill="#fff"/>
                </svg>
              </span>
            </div>
          </div>
          <div v-if="dispatchTaskDialog.form.task_type === 1 || dispatchTaskDialog.form.task_type === 2" class="dispatch-task-row">
            <label>开始时间：</label>
            <input 
              v-model="dispatchTaskDialog.form.begin_time" 
              type="datetime-local" 
              class="dispatch-task-input"
            />
          </div>
          <div class="dispatch-task-row">
            <label>返航高度：</label>
            <input 
              v-model="dispatchTaskDialog.form.rth_altitude" 
              type="number" 
              class="dispatch-task-input" 
              placeholder="100"
            />
            <span class="unit-label">米</span>
          </div>
          <div class="dispatch-task-row">
            <label>算法开关：</label>
            <div class="dispatch-switch-wrapper">
              <div
                class="switch-container"
                :class="{ active: dispatchTaskDialog.form.enable_vision }"
                @click="dispatchTaskDialog.form.enable_vision = !dispatchTaskDialog.form.enable_vision"
              >
                <div class="switch-toggle"></div>
              </div>
              <span class="dispatch-switch-label">{{ dispatchTaskDialog.form.enable_vision ? '开启' : '关闭' }}</span>
            </div>
          </div>
          <div class="dispatch-task-row">
            <label>算法选择：</label>
            <div class="dispatch-algorithm-options">
              <label v-for="(name, id) in algorithmOptions" :key="id" class="dispatch-algorithm-option">
                <input 
                  type="checkbox" 
                  :value="id" 
                  v-model="dispatchTaskDialog.form.vision_algorithms"
                  class="dispatch-algorithm-checkbox"
                  :disabled="!dispatchTaskDialog.form.enable_vision"
                />
                <span class="dispatch-algorithm-label" :class="{ 'disabled': !dispatchTaskDialog.form.enable_vision }">{{ name }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="dispatch-task-actions">
          <button class="mission-btn mission-btn-cancel" @click="onDispatchTaskCancel">取消</button>
          <button class="mission-btn mission-btn-pause" @click="onDispatchTaskConfirm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHmsAlerts, useDevices, useWaylineJobs } from '../composables/useApi'
import { controlApi, waylineApi } from '../api/services'
import { useDeviceStatus } from '../composables/useDeviceStatus'
import * as echarts from 'echarts'
import AMapLoader from '@amap/amap-jsapi-loader'
import flvjs from 'flv.js'
import mapDockIcon from '@/assets/source_data/svg_data/map_dock3.svg'
import mapDroneIcon from '@/assets/source_data/svg_data/map_drone.svg'

const router = useRouter()

// 使用HMS报警API和设备管理API
const { hmsAlerts, loading, error, fetchDeviceHms, setAllAlerts } = useHmsAlerts()
const { getCachedDeviceSns, getCachedWorkspaceId } = useDevices()



// 使用航线任务API
const { waylineFiles, fetchWaylineFiles, createJob, fetchWaylineProgress, fetchWaylineJobDetail, fetchWaylineDetail, cancelReturnHome, stopJob, pauseJob, resumeJob } = useWaylineJobs()

// 使用设备状态API
const { 
  fetchDeviceStatus, 
  fetchMainDeviceStatus,
  fetchDroneStatus,
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
  formatBattery,
  formatNetworkRate,
  formatAccTime,
  formatFlightDistance
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

// 航线任务相关数据
const waylineProgress = ref<any>(null)
const waylineJobDetail = ref<any>(null)
const waylineProgressTimer = ref<number | null>(null)

// 飞行统计数据
const flightStatistics = ref<any>(null)
const loadingFlightStats = ref(false)
const flightStatsError = ref('')

// 设备状态刷新定时器
let statusRefreshTimer: number | null = null
// 无人机状态刷新定时器（2秒一次）
let droneStatusRefreshTimer: number | null = null

// 获取机场状态数据
const loadDockStatus = async () => {
  try {
    // 使用主要设备状态获取（自动使用第一个机场）
    await fetchMainDeviceStatus()
    
    // 设备状态更新后，更新地图标记（不定位）
    if (amapInstance) {
      updateMapMarkers()
    }
  } catch (err) {
    // 静默处理错误
  }
}

// 获取无人机状态数据
const loadDroneStatus = async () => {
  try {
    // 获取无人机状态数据
    await fetchDroneStatus()
  } catch (err) {
    // 静默处理错误
  }
}

// 获取飞行统计数据
const loadFlightStatistics = async (days = 7) => {
  loadingFlightStats.value = true
  flightStatsError.value = ''
  try {
    const workspaceId = getCachedWorkspaceId()
    if (!workspaceId) {
      // 静默处理，不显示错误
      return
    }
    const res = await waylineApi.getFlightStatistics(workspaceId, days)
    if (res.code === 0) {
      flightStatistics.value = res.data
      // 更新航线报表图表
      updateFlightStatisticsChart()
    } else {
      // 静默处理，不显示错误
      flightStatistics.value = null
    }
  } catch (e: any) {
    // 静默处理，不显示错误
    flightStatistics.value = null
  } finally {
    loadingFlightStats.value = false
  }
}

// 无人机显示位置计算属性
const droneDisplayPosition = computed(() => {
  // 检查无人机是否在仓
  const isInDock = droneStatus.value?.inDock === 1
  
  if (isInDock) {
    // 无人机在仓，显示机场坐标
    return position.value
  } else {
    // 无人机不在仓，显示无人机自己的坐标
    if (droneStatus.value && droneStatus.value.longitude && droneStatus.value.latitude) {
      return {
        longitude: droneStatus.value.longitude,
        latitude: droneStatus.value.latitude,
        height: droneStatus.value.height || 0
      }
    }
    // 如果无人机没有坐标数据，返回null
    return null
  }
})

    // 获取最新的三条报警数据
const loadLatestAlarmData = async () => {
  try {
    const { dockSns, droneSns } = getCachedDeviceSns()
    const allSns = [...dockSns, ...droneSns]
    
    if (allSns.length === 0) {
      return
    }
    
    // 获取所有设备的报警数据
    const allAlerts: any[] = []
    
    for (const sn of allSns) {
      try {
        const response = await fetchDeviceHms(sn)
        if (response && response.length > 0) {
          allAlerts.push(...response)
        }
      } catch (err) {
        // 静默处理错误
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
  } catch (err) {
    // 静默处理错误
  }
}

// 云台切换函数
const switchGimbal = async (videoType: 'dock' | 'drone_visible' | 'drone_infrared') => {
  videoLoading.value = true
  
  try {
    const videoStreamsCache = localStorage.getItem('video_streams')
    if (!videoStreamsCache) {
      alert('没有找到视频流信息，请先完成视频能力缓存')
      return
    }
    
    const videoStreams = JSON.parse(videoStreamsCache)
    const targetStream = videoStreams.find((stream: any) => stream.type === videoType)
    if (!targetStream) {
      alert(`没有找到${getVideoTypeName(videoType)}视频流`)
      return
    }
    
    // 仅更新流地址和类型，播放由watch统一触发
    videoStreamUrl.value = targetStream.url
    currentVideoType.value = videoType
    localStorage.setItem('video_stream_url', targetStream.url)
    localStorage.setItem('current_video_type', videoType)
  } finally {
    videoLoading.value = false
  }
}

// 获取视频类型名称
const getVideoTypeName = (type: 'dock' | 'drone_visible' | 'drone_infrared') => {
  const typeMap = {
    dock: '机场',
    drone_visible: '无人机可见光',
    drone_infrared: '无人机红外'
  }
  return typeMap[type]
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

// 航线任务相关计算属性
const waylineTaskName = computed(() => {
  return waylineJobDetail.value?.name || '暂无任务'
})

const waylineTaskStartTime = computed(() => {
  if (!waylineJobDetail.value?.begin_time) return '--'
  return formatTimestamp(new Date(waylineJobDetail.value.begin_time).getTime())
})

const waylineCurrentWaypoint = computed(() => {
  return waylineProgress.value?.ext?.current_waypoint_index || 0
})

const waylineTaskStatus = computed(() => {
  // 优先使用progress返回数据中的status字段
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

const waylineProgressPercent = computed(() => {
  const progress = waylineProgress.value?.progress
  if (!progress) return 0
  
  // 使用current_waypoint_index和total_waypoints计算进度
  const currentWaypoint = progress.current_waypoint_index || 0
  const totalWaypoints = progress.total_waypoints || 1
  
  // 计算百分比并取整数
  const percent = Math.round((currentWaypoint / totalWaypoints) * 100)
  
  // 确保百分比在0-100范围内
  return Math.max(0, Math.min(100, percent))
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

const canCancelReturnHome = computed(() => {
  // 当无人机正在返航时可以取消返航
  // 这里可以根据实际业务逻辑调整条件
  const status = waylineProgress.value?.status
  return status === 'in_progress' || status === 'paused'
})

const canReturnHome = computed(() => {
  // 当无人机在线且不在仓时可以执行返航
  // 这里可以根据实际业务逻辑调整条件
  const isDroneOnline = droneStatus.value?.isOnline
  const isInDock = droneStatus.value?.inDock === 1
  return isDroneOnline && !isInDock
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
  // 关闭云台菜单
  gimbalMenuVisible.value = false
}

const selectScreenMode = (mode: string) => {
  currentScreenMode.value = mode
  showScreenMenu.value = false
}

// 点击外部关闭菜单
const closeMenus = () => {
  showScreenMenu.value = false
  gimbalMenuVisible.value = false
}

// 切换云台菜单
const toggleGimbalMenu = (event: Event) => {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  
  gimbalMenuVisible.value = !gimbalMenuVisible.value
  
  if (gimbalMenuVisible.value) {
    // 设置菜单位置
    nextTick(() => {
      const menu = document.querySelector('.gimbal-menu') as HTMLElement
      if (menu) {
        menu.style.left = rect.left + 'px'
        menu.style.top = (rect.bottom + 4) + 'px'
      }
    })
  }
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
let amapApiRef: any = null
const dockMarkers = ref<any[]>([])
const droneMarkers = ref<any[]>([])
const isInitialLoad = ref(true)

// 视频播放器相关
const videoStreamUrl = ref<string>('')
const videoPlayer = ref<any>(null)
const videoElement = ref<HTMLVideoElement | null>(null)

// 云台切换相关
const currentVideoType = ref<'dock' | 'drone_visible' | 'drone_infrared'>('dock')
const videoLoading = ref(false)
const gimbalMenuVisible = ref(false)

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
  if (!amapInstance || !amapApiRef) {
    return
  }

  const AMap = amapApiRef
  
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
  amapInstance.add(marker)
  dockMarkers.value.push(marker)
  
}

// 清除所有机场标记
const clearDockMarkers = () => {
  if (dockMarkers.value.length > 0) {
    dockMarkers.value.forEach(marker => {
      if (amapInstance) {
        amapInstance.remove(marker)
      }
    })
    dockMarkers.value = []
  }
}

// 添加无人机标记到地图
const addDroneMarker = (longitude: number, latitude: number, droneInfo: any) => {
  if (!amapInstance || !amapApiRef) {
    return
  }

  const AMap = amapApiRef
  
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
  amapInstance.add(marker)
  droneMarkers.value.push(marker)
}

// 清除所有无人机标记
const clearDroneMarkers = () => {
  if (droneMarkers.value.length > 0) {
    droneMarkers.value.forEach(marker => {
      if (amapInstance) {
        amapInstance.remove(marker)
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
    // console.log('定位数据可用:', position.value)
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
    
    // 更新无人机追踪
    updateDroneTracking()
    
    // 更新当前航点显示
    updateCurrentWaypoint()
    
    // 只在初始加载或明确要求时才设置地图中心
    if (shouldCenter && amapInstance) {
      amapInstance.setCenter([longitude, latitude])
      // 确保地图样式保持为卫星图
      if (amapApiRef) {
        amapInstance.setLayers([
          new amapApiRef.TileLayer.Satellite(),
          new amapApiRef.TileLayer.RoadNet()
        ])
      }
    }
  } else {
    // 无设备坐标数据，无法添加标记
  }
}

// 视频播放控制相关
const isVideoPlaying = ref(false)
const currentTime = ref('00:00')
const totalTime = ref('00:00')

// 初始化视频播放器
const initVideoPlayer = () => {
  const savedVideoUrl = localStorage.getItem('video_stream_url')
  const savedVideoType = localStorage.getItem('current_video_type')
  
  if (savedVideoUrl) {
    videoStreamUrl.value = savedVideoUrl
  }
  
  if (savedVideoType) {
    currentVideoType.value = savedVideoType as 'dock' | 'drone_visible' | 'drone_infrared'
  }
  
  // 由watch(videoStreamUrl)统一触发播放，避免重复拉流
}

// 开始视频播放
const startVideoPlayback = () => {
  if (!videoElement.value || !videoStreamUrl.value) {
    return
  }

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
        // 浏览器不支持flv.js
      }
    } else {
      videoElement.value.src = videoStreamUrl.value
      videoElement.value.load()
      
      // 强制设置原生视频播放器样式
      videoElement.value.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
      
      videoElement.value.play().catch(error => {
        // 静默处理播放失败
      })
    }
  } catch (error) {
    // 静默处理初始化失败
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
    // 后备方案
    return webrtcUrl.replace('webrtc://', 'http://').replace(':8000', ':1985').split('/')[0]
  }
}

// 开始WebRTC播放
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
    
    // 创建新的RTCPeerConnection
    pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    })

    // 处理远程流
    pc.ontrack = (e) => {
      if (videoElement.value) {
        videoElement.value.srcObject = e.streams[0]
        
        // 强制设置WebRTC视频播放器样式
        videoElement.value.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
        
        videoElement.value.play().catch(err => {
          // 静默处理播放失败
        })
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

    // 创建offer
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

    // 设置远程描述
    await pc.setRemoteDescription({
      type: 'answer',
      sdp: data.sdp
    })

  } catch (error) {
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
  }
  
  if (videoElement.value) {
    videoElement.value.pause()
    videoElement.value.src = ''
    videoElement.value.load()
  }
}

// 重新加载视频
const reloadVideo = () => {
  stopVideoPlayback()
  // 增加延迟确保资源完全清理
  setTimeout(() => {
    startVideoPlayback()
  }, 500)
}

// 航线选择相关
const selectedWayline = ref('')
const showWaylineDropdown = ref(false)

// 算法选项
const algorithmOptions = {
  49: "常熟1号线路灯",
  50: "常熟2号线路灯", 
  51: "常熟3号线路灯",
  52: "常熟楼宇亮化",
  9: "人车检测"
}

// 下发任务弹窗
const dispatchTaskDialog = ref({
  visible: false,
  form: {
    name: '',
    dock_sn: '',
    file_id: '',
    task_type: 0,
    out_of_control_action: 0,
    rth_altitude: 100,
    rth_mode: 1,
    exit_wayline_when_rc_lost: 0,
    wayline_precision_type: 1,
    begin_time: null as string | null,
    end_time: null as string | null,
    enable_vision: false,
    vision_algorithms: [] as number[],
    vision_threshold: 0.5
  }
})

// 获取航线文件列表
const loadWaylineFiles = async () => {
  const workspaceId = getCachedWorkspaceId()
  if (!workspaceId) return
  
  try {
    await fetchWaylineFiles(workspaceId, {
      page: 1,
      page_size: 100
    })
    // 默认选择第一条数据
    if (waylineFiles.value && waylineFiles.value.length > 0) {
      selectedWayline.value = waylineFiles.value[0].wayline_id
    }
  } catch (err) {
    // 静默处理错误
  }
}

// 获取当前选中的航线名称
const getCurrentWaylineName = computed(() => {
  const currentWayline = waylineFiles.value.find(f => f.wayline_id === selectedWayline.value)
  return currentWayline ? currentWayline.name : '请选择'
})

// 下发任务处理
const handleDispatchTask = () => {
  // 获取当前选中的航线信息
  const currentWayline = waylineFiles.value.find(f => f.wayline_id === selectedWayline.value)
  if (!currentWayline) {
    alert('请先选择一个航线')
    return
  }
  
  // 获取缓存的设备序列号
  const deviceSns = getCachedDeviceSns()
  if (!deviceSns.dockSns || deviceSns.dockSns.length === 0) {
    alert('未找到可用的设备')
    return
  }
  
  // 初始化弹窗数据
  dispatchTaskDialog.value.form = {
    name: `航线任务_${Date.now()}`,
    dock_sn: deviceSns.dockSns[0], // 使用第一个机场设备
    file_id: currentWayline.wayline_id,
    task_type: 0,
    out_of_control_action: 0,
    rth_altitude: 100,
    rth_mode: 1,
    exit_wayline_when_rc_lost: 0,
    wayline_precision_type: 1,
    begin_time: null,
    end_time: null,
    enable_vision: false,
    vision_algorithms: [],
    vision_threshold: 0.5
  }
  
  dispatchTaskDialog.value.visible = true
}

// 下发任务确认
const onDispatchTaskConfirm = async () => {
  const form = dispatchTaskDialog.value.form
  
  // 验证必填字段
  if (!form.name.trim()) {
    alert('请输入任务名称')
    return
  }
  
  if ((form.task_type === 1 || form.task_type === 2) && !form.begin_time) {
    alert('定时任务和条件任务需要设置开始时间')
    return
  }
  
  try {
    const workspaceId = getCachedWorkspaceId()
    if (!workspaceId) {
      alert('未找到workspace_id')
      return
    }
    
    // 构建任务数据（包含算法相关字段，提交到 flight-tasks 接口）
    const taskData = {
      ...form,
      // 保留隐藏的字段（使用默认值）
      rth_mode: form.rth_mode || 1,
      out_of_control_action: form.out_of_control_action || 0,
      exit_wayline_when_rc_lost: form.exit_wayline_when_rc_lost || 0,
      wayline_precision_type: form.wayline_precision_type || 1,
      // 只在定时任务时传递 begin_time
      ...(form.task_type === 1 && form.begin_time ? { begin_time: form.begin_time } : {})
    }
    
    // 创建任务
    const response = await createJob(workspaceId, taskData)
    console.log('任务创建成功:', response)
    
    // flight-tasks接口已包含算法字段，创建即执行
    if (response && response.job_id) {
      alert('任务下发并执行成功')
    } else {
      alert('任务下发成功，但未获取到任务ID')
    }
    
    dispatchTaskDialog.value.visible = false
  } catch (err) {
    console.error('任务下发失败:', err)
    alert('任务下发失败')
  }
}

// 下发任务取消
const onDispatchTaskCancel = () => {
  dispatchTaskDialog.value.visible = false
}

// 取消任务处理
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

// 航线暂停处理
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

// 航线恢复处理
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

// 取消返航处理
const handleCancelReturnHome = async () => {
  try {
    const workspaceId = getCachedWorkspaceId()
    if (!workspaceId) {
      alert('未找到workspace_id')
      return
    }
    
    const { dockSns } = getCachedDeviceSns()
    if (dockSns.length === 0) {
      alert('未找到可用的机场设备')
      return
    }
    
    if (!confirm('确定要取消返航吗？')) {
      return
    }
    
    await cancelReturnHome(workspaceId, dockSns[0])
    alert('取消返航指令已发送')
    
    // 刷新任务进度
    setTimeout(() => {
      loadWaylineProgress()
    }, 1000)
  } catch (err) {
    console.error('取消返航失败:', err)
    alert('取消返航失败')
  }
}

// 一键返航处理
const handleReturnHome = async () => {
  try {
    // 获取缓存的机场SN
    const { dockSns } = getCachedDeviceSns()
    if (dockSns.length === 0) {
      alert('没有找到可用的机场设备')
      return
    }
    
    // 使用第一个机场SN
    const dockSn = dockSns[0]
    
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
    console.error('一键返航失败:', error)
    alert(`一键返航失败: ${error.message || error}`)
  }
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
  // 新增：如果有接口数据，立即用接口数据覆盖
  updateFlightStatisticsChart()
}

// 更新飞行统计图表
const updateFlightStatisticsChart = () => {
  if (!lineChart || !flightStatistics.value) return
  
  const dailyStats = flightStatistics.value.daily_stats || []
  const dates = dailyStats.map((item: any) => {
    const date = new Date(item.date)
    return `${date.getMonth() + 1}-${date.getDate().toString().padStart(2, '0')}`
  })
  const taskCounts = dailyStats.map((item: any) => item.total_tasks || 0)
  
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
      },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>任务数：${data.value}`
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
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
        data: taskCounts,
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
    nextTick(() => {
      startVideoPlayback()
    })
  }
})

// 组件挂载时初始化
onMounted(async () => {
  console.log('开始初始化首页')
  
  // 获取最新报警数据
  await loadLatestAlarmData()
  
  // 加载机场状态数据
  await loadDockStatus()
  console.log('机场状态加载完成:', dockStatus.value)
  
  // 加载无人机状态数据
  await loadDroneStatus()
  console.log('无人机状态加载完成:', droneStatus.value)
  
  // 加载航线文件列表
  await loadWaylineFiles()
  
  // 加载航线任务进度数据
  await loadWaylineProgress()
  
  // 加载飞行统计数据
  await loadFlightStatistics(7)
  
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

  console.log('数据加载完成，开始初始化地图')
  console.log('当前定位数据:', position.value)
  
  // 初始化地图
  if (mapContainer.value) {
    AMapLoader.load({
      key: '6f9eaf51960441fa4f813ea2d7e7cfff',
      version: '2.0',
      plugins: ['AMap.ToolBar', 'AMap.Geolocation', 'AMap.PlaceSearch']
    }).then((AMap) => {
      amapApiRef = AMap // 缓存 AMap
      amapInstance = new AMap.Map(mapContainer.value, {
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
      amapInstance.on('complete', () => {
        console.log('地图加载完成，开始定位')
        console.log('当前定位数据:', position.value)
        console.log('当前机场状态:', dockStatus.value)
        
        // 地图加载完成后立即尝试定位
        updateMapMarkers(isInitialLoad.value)
        // 标记初始加载完成
        isInitialLoad.value = false
        
        // 如果第一次定位失败，延迟后再次尝试
        setTimeout(() => {
          console.log('延迟后再次尝试定位')
          // console.log('当前定位数据:', position.value)
          if (isInitialLoad.value) {
            updateMapMarkers(true)
            isInitialLoad.value = false
          }
        }, 2000)
      })
    }).catch((error) => {
      // 地图加载失败
    })
  }
  
  // 设置机场状态自动刷新（每5秒）
  statusRefreshTimer = setInterval(async () => {
    await loadDockStatus()
    // 更新地图标记
    if (amapInstance) {
      updateMapMarkers()
    }
  }, 5000)
  
  // 设置无人机状态自动刷新（每2秒）
  droneStatusRefreshTimer = setInterval(async () => {
    await loadDroneStatus()
    // 更新地图标记
    if (amapInstance) {
      updateMapMarkers()
    }
  }, 2000)
  
  // 设置航线任务进度自动刷新（每3秒）
  waylineProgressTimer.value = setInterval(async () => {
    await loadWaylineProgress()
  }, 3000)
})

// 组件卸载时清理
onUnmounted(() => {
  // 清理机场状态刷新定时器
  if (statusRefreshTimer) {
    clearInterval(statusRefreshTimer)
    statusRefreshTimer = null
  }
  
  // 清理无人机状态刷新定时器
  if (droneStatusRefreshTimer) {
    clearInterval(droneStatusRefreshTimer)
    droneStatusRefreshTimer = null
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
  if (amapInstance) {
    amapInstance.destroy()
    amapInstance = null
    amapApiRef = null
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
    alert('全屏功能暂时不可用，请检查浏览器设置')
  }
}

// 追踪无人机
const isDroneTracking = ref(false)
const toggleDroneTracking = () => {
  isDroneTracking.value = !isDroneTracking.value
  if (isDroneTracking.value) {
    centerToDroneMarker();
  }
}

// 航点和轨迹相关变量
const waylineMarkers = ref<any[]>([])
const waylinePolyline = ref<any>(null)
const currentWaypointMarker = ref<any>(null)

// 更新无人机追踪位置
const updateDroneTracking = () => {
  if (isDroneTracking.value) {
    centerToDroneMarker();
  }
}

// 清除航线显示
const clearWaylineDisplay = () => {
  if (amapInstance) {
    // 清除航点标记
    waylineMarkers.value.forEach(marker => {
      amapInstance.remove(marker)
    })
    waylineMarkers.value = []
    
    // 清除航线
    if (waylinePolyline.value) {
      amapInstance.remove(waylinePolyline.value)
      waylinePolyline.value = null
    }
    
    // 清除当前航点标记
    if (currentWaypointMarker.value) {
      amapInstance.remove(currentWaypointMarker.value)
      currentWaypointMarker.value = null
    }
  }
}

// 显示航点和航线
const displayWayline = async () => {
  console.log('displayWayline 开始执行')
  console.log('amapInstance:', !!amapInstance)
  console.log('amapApiRef:', !!amapApiRef)
  console.log('waylineJobDetail:', waylineJobDetail.value)
  
  if (!amapInstance || !amapApiRef || !waylineJobDetail.value) {
    console.log('displayWayline 条件不满足，退出')
    return
  }
  
  // 先清除之前的显示
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
        const marker = new amapApiRef.Marker({
          position: [gcjCoords.longitude, gcjCoords.latitude],
          icon: new amapApiRef.Icon({
            size: new amapApiRef.Size(20, 20),
            image: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="8" fill="#67d5fd" stroke="#fff" stroke-width="2"/>
                <text x="10" y="13" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">${index + 1}</text>
              </svg>
            `),
            imageSize: new amapApiRef.Size(20, 20)
          }),
          title: `航点 ${index + 1}`
        })
        
        markers.push(marker)
        amapInstance.add(marker)
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
      waylinePolyline.value = new amapApiRef.Polyline({
        path: path,
        strokeColor: '#67d5fd',
        strokeWeight: 3,
        strokeOpacity: 0.8,
        strokeStyle: 'solid'
      })
      amapInstance.add(waylinePolyline.value)
      console.log('航线已添加到地图')
    } else {
      console.log('路径点数不足，无法创建航线')
    }
    
    // 显示当前航点
    updateCurrentWaypoint()
    
  } catch (error) {
    console.error('显示航线失败:', error)
  }
}

// 更新当前航点显示
const updateCurrentWaypoint = () => {
  if (!amapInstance || !amapApiRef || !waylineJobDetail.value || !waylineProgress.value) {
    return
  }
  
  // 清除之前的当前航点标记
  if (currentWaypointMarker.value) {
    amapInstance.remove(currentWaypointMarker.value)
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
      currentWaypointMarker.value = new amapApiRef.Marker({
        position: [gcjCoords.longitude, gcjCoords.latitude],
        icon: new amapApiRef.Icon({
          size: new amapApiRef.Size(24, 24),
          image: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#ff4d4f" stroke="#fff" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">${currentWaypointIndex + 1}</text>
            </svg>
          `),
          imageSize: new amapApiRef.Size(24, 24)
        }),
        title: `当前航点 ${currentWaypointIndex + 1}`
      })
      
      amapInstance.add(currentWaypointMarker.value)
      console.log(`当前航点 ${currentWaypointIndex + 1} 已添加到地图`)
    }
  }
}

// 地图定位到无人机标记实际位置
const centerToDroneMarker = () => {
  if (amapInstance && droneMarkers.value.length > 0) {
    const markerPos = droneMarkers.value[0].getPosition();
    amapInstance.setCenter(markerPos);
  }
}
</script>

<style scoped>
/* 航线选择器样式 */
.wayline-select-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.wayline-select {
  width: 100%;
  height: 28px;
  border-radius: 4px;
  border: 1px solid #164159;
  background: transparent;
  color: #fff;
  padding: 0 8px;
  font-size: 12px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 24px;
  cursor: pointer;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
}

.wayline-select:focus {
  outline: none;
  border: 1.5px solid #67d5fd;
  box-shadow: 0 0 0 2px rgba(103, 213, 253, 0.15);
}

.wayline-select option {
  background: #172233;
  color: #fff;
  border: none;
}

.wayline-custom-arrow {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
}

.wayline-custom-arrow svg {
  width: 100%;
  height: 100%;
}

/* 下发任务弹窗样式 */
.dispatch-task-modal {
  display: flex;
  background: #172233;
  border-radius: 12px;
  box-shadow: 0 4px 24px #0008;
  overflow: hidden;
  width: 90%;
  max-width: 500px;
  margin: 10px auto;
  position: relative;
  border: 1px solid #18344a;
}

.dispatch-task-modal-content {
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  background: #172233;
}

.dispatch-task-title {
  font-size: 24px;
  font-weight: 600;
  color: #67d5fd;
  margin-bottom: 24px;
  text-align: center;
}

.dispatch-task-form {
  margin-bottom: 20px;
}

.dispatch-task-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.dispatch-task-row label {
  font-size: 14px;
  color: #b8c7d9;
  min-width: 100px;
  text-align: right;
}

.dispatch-task-input {
  flex: 1;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #164159;
  background: transparent;
  color: #fff;
  padding: 0 12px;
  font-size: 14px;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
}

.dispatch-task-input:focus {
  outline: none;
  border: 1.5px solid #67d5fd;
  box-shadow: 0 0 0 2px rgba(103, 213, 253, 0.15);
}

.dispatch-task-input:disabled {
  background: rgba(103, 213, 253, 0.1);
  color: #67d5fd;
  border-color: rgba(103, 213, 253, 0.3);
}

.custom-select-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.mission-select {
  width: 100%;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #164159;
  background: transparent;
  color: #fff;
  padding: 0 12px;
  font-size: 14px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 30px;
  cursor: pointer;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
  /* Firefox特定样式 */
  text-indent: 0.01px;
  text-overflow: '';
  /* 完全隐藏默认箭头 */
  background-image: none;
  -webkit-background-image: none;
  -moz-background-image: none;
}

/* 下拉选项样式 - 参考mission-common.css */
.mission-select,
.mission-select option {
  background: #16213a !important;
  color: #fff !important;
  border: none !important;
}

/* 下拉选项悬停和选中状态 */
.mission-select option:hover {
  background: #223a5e !important;
  color: #67d5fd !important;
}

.mission-select option:checked {
  background: #164159 !important;
  color: #67d5fd !important;
}

/* Webkit浏览器的下拉选项样式 */
.mission-select::-webkit-listbox {
  background: #16213a !important;
}

.mission-select::-webkit-option {
  background: #16213a !important;
  color: #fff !important;
}

.mission-select::-webkit-option:hover {
  background: #223a5e !important;
  color: #67d5fd !important;
}

.mission-select::-webkit-option:checked {
  background: #164159 !important;
  color: #67d5fd !important;
}

/* Firefox浏览器的下拉选项样式 */
.mission-select:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 #fff;
}

.mission-select:-moz-listbox {
  background: #16213a !important;
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
  z-index: 1;
}

.custom-select-arrow svg {
  width: 100%;
  height: 100%;
}

.unit-label {
  margin-left: 8px;
  color: #b8c7d9;
  font-size: 14px;
}

.dispatch-task-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.dispatch-task-actions .mission-btn {
  min-width: 100px;
  height: 36px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.dispatch-task-actions .mission-btn-cancel {
  background: rgba(103, 213, 253, 0.1);
  color: #b8c7d9;
  border: 1px solid rgba(103, 213, 253, 0.2);
}

.dispatch-task-actions .mission-btn-cancel:hover {
  background: rgba(103, 213, 253, 0.2);
  color: #67d5fd;
}

.dispatch-task-actions .mission-btn-pause {
  background: #67d5fd;
  color: #fff;
}

.dispatch-task-actions .mission-btn-pause:hover {
  background: #50c7f7;
  box-shadow: 0 2px 8px rgba(103, 213, 253, 0.3);
}

.custom-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
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
  width: 100%;
  padding: 0 20px;
  height: calc(100% - 41px);
  position: relative;
  box-sizing: border-box;
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
  justify-content: space-evenly;
  align-items: center;
  border-radius: 20px;
  gap: 10px;
  height: 55px;
  padding: 0 10px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  justify-content: center;
  min-width: 70px;
  flex: 1;
}

.status-item .top-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
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
  justify-content: flex-start;
}

.control-row:first-child {
  justify-content: space-between;
  gap: 10px;
}

.control-row:first-child .wayline-select-wrapper {
  flex: 3;
  margin: 0 10px;
  min-width: 150px;
}

.control-row.second-row {
  justify-content: space-between;
  gap: 8px;
}

.control-row.second-row .span,
.control-row.second-row .span1 {
  flex: 1;
  min-width: 70px;
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

/* 禁用状态样式 */
.control-row .span.disabled,
.control-row .span1.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: rgba(255, 255, 255, 0.4);
}

.control-row .span.disabled:hover,
.control-row .span1.disabled:hover {
  border-color: rgba(38, 131, 182, 0);
  background: #0c3c56;
}

.control-row .span1.disabled:hover {
  border-color: rgba(182, 38, 38, 0);
  background: #561c1c;
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
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.button-group-second {
  display: flex;
  gap: clamp(20px, 2vw, 26px);
  width: 100%;
  justify-content: space-between;
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
  height: calc(100% - 10px);
  margin-top: 5px;
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

.status-btn.running {
  width: 60px;
  height: 20px;
  text-align: center;
  color: #1890ff;
  background: linear-gradient(#1890ff54, #1890ff00);
  box-shadow: inset 0 0 6px #1890ff;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid #1890ff;
  line-height: 20px;
  padding: 0;
}

.status-btn.completed {
  width: 60px;
  height: 20px;
  text-align: center;
  color: #52c41a;
  background: linear-gradient(#52c41a54, #52c41a00);
  box-shadow: inset 0 0 6px #52c41a;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid #52c41a;
  line-height: 20px;
  padding: 0;
}

.status-btn.failed {
  width: 60px;
  height: 20px;
  text-align: center;
  color: #ff4d4f;
  background: linear-gradient(#ff4d4f54, #ff4d4f00);
  box-shadow: inset 0 0 6px #ff4d4f;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid #ff4d4f;
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

/* 双环进度条样式 */
.progress-circle-container {
  position: relative;
  width: 80px;
  height: 80px;
  overflow: visible;
}

.progress-circle {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 外环：进度显示环 */
.progress-circle-outer-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  /* 使用遮罩形成8px厚度的圆环，颜色用背景的conic-gradient控制 */
  border: none;
  border-radius: 50%;
  box-sizing: border-box;
  transition: all 0.3s ease;
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 8px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 8px));
  z-index: 2;
}

.progress-circle-outer-ring.completed { filter: brightness(1.1); }
/* 独立的外部光晕层，避免mask裁剪阴影 */
.progress-circle-outer-glow {
  position: absolute;
  inset: -8px; /* 外扩，避免环边缘出现暗圈 */
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  mix-blend-mode: screen; /* 在深色背景上避免发暗/黑圈 */
  filter: blur(8px);
  opacity: 0.6;
  will-change: filter, transform, opacity;
  animation: glow-pulse 4s infinite alternate ease-in-out;
  background: radial-gradient(circle, var(--glow-color, #00e1ff) 40%, transparent 70%);
}

.progress-circle-outer-glow.completed {
  animation: pulse-completed 4s infinite alternate;
}

@keyframes glow-pulse {
  0% { filter: blur(6px); opacity: 0.45; transform: scale(0.98); }
  100% { filter: blur(12px); opacity: 0.9; transform: scale(1.04); }
}

@keyframes pulse-completed {
  0% { 
    filter: blur(8px); 
    opacity: 0.6; 
    transform: scale(1); 
    background: radial-gradient(circle, #00e1ff 40%, transparent 70%);
  }
  50% { 
    filter: blur(12px); 
    opacity: 0.9; 
    transform: scale(1.05); 
    background: radial-gradient(circle, #00e1ff 50%, transparent 60%);
  }
  100% { 
    filter: blur(8px); 
    opacity: 0.6; 
    transform: scale(1); 
    background: radial-gradient(circle, #00e1ff 40%, transparent 70%);
  }
}

@keyframes ring-brightness {
  0% { filter: brightness(1); }
  100% { filter: brightness(1.3); }
}

.progress-circle-center {
  position: absolute;
  width: 56px;
  height: 56px;
  top: 12px;
  left: 12px;
  border-radius: 50%;
  background-color: rgba(0, 12, 23, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.8);
  z-index: 3;
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
  color: #00e1ff;
  text-shadow: 0 0 5px rgba(0, 225, 255, 0.7);
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
  

}



/* 任务状态外环样式 */
.task-status-outer-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 8px solid #52c41a; /* 默认绿色（正常状态） */
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: 0 0 10px rgba(82, 196, 26, 0.5);
  transition: all 0.3s ease;
  animation: pulse-status 4s infinite alternate;
}

@keyframes pulse-status {
  0% {
    box-shadow: 0 0 20px rgba(82, 196, 26, 0.8), inset 0 0 10px rgba(82, 196, 26, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 35px rgba(82, 196, 26, 1), inset 0 0 15px rgba(82, 196, 26, 0.7);
    transform: scale(1.02);
  }
  100% {
    box-shadow: 0 0 25px rgba(82, 196, 26, 0.9), inset 0 0 12px rgba(82, 196, 26, 0.6);
    transform: scale(1);
  }
}

.task-status-outer-ring.error {
  border-color: #ff4d4f; /* 异常状态为红色 */
  box-shadow: 0 0 10px rgba(255, 77, 79, 0.5);
  animation: pulse-error 4s infinite alternate;
}

@keyframes pulse-error {
  0% {
    box-shadow: 0 0 20px rgba(255, 77, 79, 0.8), inset 0 0 10px rgba(255, 77, 79, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 35px rgba(255, 77, 79, 1), inset 0 0 15px rgba(255, 77, 79, 0.7);
    transform: scale(1.02);
  }
  100% {
    box-shadow: 0 0 25px rgba(255, 77, 79, 0.9), inset 0 0 12px rgba(255, 77, 79, 0.6);
    transform: scale(1);
  }
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

/* 云台切换按钮样式 */
.gimbal-control {
  position: relative;
  display: flex;
  align-items: center;
  z-index: 10000;
}

.gimbal-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #59C0FC;
  min-width: 32px;
  min-height: 32px;
}

.gimbal-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.gimbal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gimbal-btn.loading {
  opacity: 0.7;
  cursor: wait;
}

.gimbal-btn svg {
  width: clamp(16px, 1.2vw, 18px);
  height: clamp(16px, 1.2vw, 18px);
  fill: currentColor;
  transition: all 0.3s ease;
}

.gimbal-btn:hover svg {
  transform: scale(1.1);
}

.gimbal-menu {
  position: fixed;
  background: rgba(20, 30, 40, 0.95);
  border: 1px solid rgba(89, 192, 252, 0.3);
  border-radius: 6px;
  padding: 8px 0;
  z-index: 99999;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 120px;
}

.gimbal-menu .menu-item {
  padding: 8px 12px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  transition: all 0.3s ease;
}

.gimbal-menu .menu-item:hover {
  background: rgba(89, 192, 252, 0.1);
  color: #59C0FC;
}

.gimbal-menu .menu-item.active {
  background: rgba(89, 192, 252, 0.2);
  color: #59C0FC;
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
  color: #59C0FC; /* 设置默认颜色 */
}

.fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #16bbf2; /* 悬停时改变颜色 */
}

.fullscreen-btn svg {
  width: 24px;
  height: 24px;
  transition: color 0.3s ease;
  fill: currentColor; /* 使用当前文字颜色 */
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-text::before {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid rgba(89, 192, 252, 0.3);
  border-top: 2px solid #59C0FC;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
  padding: 0 20px;
}

.error-text {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 6px;
  padding: 12px 16px;
  max-width: 100%;
}

.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  text-align: center;
  padding: 0 20px;
}

.empty-text {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 12px 16px;
  max-width: 100%;
}

/* 算法开关和选择样式 */
.dispatch-switch-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
}

.dispatch-switch-label {
  color: #b8c7d9;
  font-size: 14px;
  font-weight: 500;
}

.dispatch-algorithm-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border: 1px solid rgba(103, 213, 253, 0.2);
  flex: 1;
  min-width: 200px;
}

.dispatch-algorithm-options::-webkit-scrollbar {
  width: 6px;
}

.dispatch-algorithm-options::-webkit-scrollbar-track {
  background: rgba(103, 213, 253, 0.1);
  border-radius: 3px;
}

.dispatch-algorithm-options::-webkit-scrollbar-thumb {
  background: rgba(103, 213, 253, 0.3);
  border-radius: 3px;
  transition: background 0.2s;
}

.dispatch-algorithm-options::-webkit-scrollbar-thumb:hover {
  background: rgba(103, 213, 253, 0.5);
}

.dispatch-algorithm-options {
  scrollbar-width: thin;
  scrollbar-color: rgba(103, 213, 253, 0.3) rgba(103, 213, 253, 0.1);
}

.dispatch-algorithm-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 0;
  transition: all 0.2s;
}

.dispatch-algorithm-option:hover {
  background: rgba(103, 213, 253, 0.1);
  border-radius: 4px;
  padding: 4px 8px;
  margin: 0 -8px;
}

.dispatch-algorithm-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #67D5FD;
  cursor: pointer;
}

.dispatch-algorithm-label {
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.dispatch-algorithm-label.disabled {
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}

.dispatch-algorithm-checkbox:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Switch开关样式 */
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
</style>