<template>
  <div class="drone-control-main">
    <!-- 侧边栏菜单 -->
    <aside class="sidebar-menu">
      <div class="sidebar-tabs">
        <div
          v-for="(item, idx) in sidebarTabs"
          :key="item.key"
          :class="['sidebar-tab', { active: currentTab === item.key }]"
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
                        <div>电压：50V</div>
                        <div>电流：-3A</div>
                        <div>状态：暂无</div>
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
                      <span class="span">暂停</span>
                      <span class="span1">停止</span>
                    </div>
                  </div>
                  <div class="task-stats-panel">
                    <div class="task-stat-card stat-purple">
                      <div class="stat-title">今日任务总数</div>
                      <div class="stat-value">8</div>
                    </div>
                    <div class="task-stat-card stat-blue">
                      <div class="stat-title">未执行/已执行</div>
                      <div class="stat-value">3/8</div>
                    </div>
                    <div class="task-stat-card stat-green">
                      <div class="stat-title">正常/异常</div>
                      <div class="stat-value">6/2</div>
                    </div>
                  </div>
                </div>
                <!-- 横线 -->
                <div class="on1-lt-border-horizontal"></div>
              </div>
              <div class="robot-status-footer">
                <span>飞行速度：线速度：0.00m/s ，角速度：0.00m/s</span>
                <span>，风向：东南风</span>
                <span>，降水：0mm</span>
                <span>，温度：35℃</span>
                <span>，湿度：52%</span>
              </div>
            </div>
            <div class="on1-r">
              <div class="remote-control-section">
                <div class="remote-control-header">
                  <span class="remote-control-text">远程控制</span>
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
            <div id="amap-container" class="amap-container"></div>
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
                        <!-- 视频播放器将在这里初始化 -->
                      </div>
                    </div>
                  </div>
                </div>
                <div class="boxGrid-box-bottom">
                  <div class="left-controls">
                    <svg class="icon svg-icon" aria-hidden="true">
                      <use xlink:href="#icon-jiugongge"></use>
                    </svg>
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
                <div class="panel-title">无人机控制</div>
                <div class="drone-direction-grid">
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_left_round.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">左旋</span>
                  </button>
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_forward.svg" class="drone-btn-icon big-drone-btn-icon" /></span>
                    <span class="drone-btn-label">前进</span>
                  </button>
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_right_round.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">右旋</span>
                  </button>
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_left.svg" class="drone-btn-icon big-drone-btn-icon" /></span>
                    <span class="drone-btn-label">左移</span>
                  </button>
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_back.svg" class="drone-btn-icon big-drone-btn-icon" /></span>
                    <span class="drone-btn-label">后退</span>
                  </button>
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_right.svg" class="drone-btn-icon big-drone-btn-icon" /></span>
                    <span class="drone-btn-label">右移</span>
                  </button>
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_up.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">上升</span>
                  </button>
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_light.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">补光灯</span>
                  </button>
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_down.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">下降</span>
                  </button>
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_stop.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">急停</span>
                  </button>
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_visible.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">隐蔽模式</span>
                  </button>
                  <button>
                    <span class="drone-btn-iconbox"><img src="@/assets/source_data/svg_data/drone_control_svg/drone_fly.svg" class="drone-btn-icon" /></span>
                    <span class="drone-btn-label">一键起飞</span>
                  </button>
                </div>
              </div>
              <div class="gimbal-control-panel">
                <div class="panel-title">云台控制</div>
                <div class="gimbal-group">
                  <div class="gimbal-group-title">重置云台</div>
                  <div class="gimbal-btn-row">
                    <button>云台回中</button>
                    <button>云台向下</button>
                    <button>偏航回中</button>
                    <button>俯仰向下</button>
                  </div>
                </div>
                <div class="gimbal-group">
                  <div class="gimbal-group-title">功能按键</div>
                  <div class="gimbal-btn-row">
                    <button>开启分屏</button>
                    <button>放大</button>
                    <button>开始录像</button>
                    <button>拍照</button>
                  </div>
                  <div class="gimbal-btn-row">
                    <button>关闭分屏</button>
                    <button>缩小</button>
                    <button>停止录像</button>
                    <button>夜景模式</button>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import planeIcon from '@/assets/source_data/svg_data/plane.svg'
import stockIcon from '@/assets/source_data/svg_data/stock3.svg'
import sheetIcon from '@/assets/source_data/svg_data/sheet.svg'
import batteryIcon from '@/assets/source_data/svg_data/battery.svg'
import systemIcon from '@/assets/source_data/svg_data/system.svg'
import cameraIcon from '@/assets/source_data/svg_data/camera.svg'
import plane2Img from '@/assets/source_data/plane_2.png'
import batteryImg from '@/assets/source_data/Battery.png'
import AMapLoader from '@amap/amap-jsapi-loader'
import droneCloseIcon from '@/assets/source_data/svg_data/drone_close.svg'
import droneBatteryIcon from '@/assets/source_data/svg_data/drone_battery.svg'
import drone4gIcon from '@/assets/source_data/svg_data/drone_4g.svg'

const router = useRouter()
const sidebarTabs = [
  {
    key: 'plane',
    label: '无人机',
    icon: planeIcon
  },
  {
    key: 'stock',
    label: '机巢',
    icon: stockIcon
  }
]
const currentTab = ref('stock')
const progressPercent = ref(40)
const currentRouteName = ref('测试航线B')
const amapInstance = ref<any>(null)
const amapApiRef = ref<any>(null)
const remoteEnabled = ref(false)
const toggleRemote = () => {
  remoteEnabled.value = !remoteEnabled.value
}
const isSatellite = ref(false)
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
    router.push('/dashboard/control')
  } else if (key === 'stock') {
    router.push('/dashboard/dock-control')
  }
}
onMounted(() => {
  AMapLoader.load({
    key: '6f9eaf51960441fa4f813ea2d7e7cfff',
    version: '2.0',
    plugins: ['AMap.ToolBar', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.MapType']
  }).then((AMap) => {
    amapApiRef.value = AMap
    amapInstance.value = new AMap.Map('amap-container', {
      zoom: 12,
      center: [116.397428, 39.90923],
      logoEnable: false,
      copyrightEnable: false
    })
    amapInstance.value.addControl(new AMap.ToolBar({ liteStyle: true, position: 'LT' }))
    amapInstance.value.addControl(new AMap.MapType({ position: 'RB' }))
  })
})
onBeforeUnmount(() => {
  if (amapInstance.value) {
    amapInstance.value.destroy()
    amapInstance.value = null
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
  height: calc(100% - 20px);
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: auto;
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
  height: calc(100% - 20px);
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
  /* 去掉背景色和阴影 */
  background: none !important;
  border: 1.5px solid #164159;
  border-radius: 8px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-height: 320px;
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
}
.sidebar-menu-bottom {
  position: absolute;
  bottom: 24px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
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
/* ... 省略部分样式 ... */
</style> 