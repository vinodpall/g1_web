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
                        <div>电压：50V</div>
                        <div>电流：-3A</div>
                        <div>状态：暂无</div>
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
                <span>风向：东南风</span>
                <span>，风速：1.2m/s</span>
                <span>，降水：0mm</span>
                <span>，温度：35℃</span>
                <span>，湿度：52%</span>
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
import dockStars from '@/assets/source_data/svg_data/dock_control_svg/dock_stars.svg'
import dockWifi from '@/assets/source_data/svg_data/dock_control_svg/dock_wifi.svg'
import DockInfoRow from '@/components/DockInfoRow.vue'

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
    router.push('/dashboard/drone-control')
  } else if (key === 'stock') {
    router.push('/dashboard/dock-control')
  }
}
const dockInfoItems = [
  { value: 'DJI Dock3', label: '机场名称' },
  { value: '18 小时', label: '运行时长' },
  { value: '12 架次', label: '作业架次' },
  { value: 30, label: '机场搜星', icon: dockStars },
  { value: '已标定', label: '标定状态' },
  { value: '200KB/s', label: '网络状态', icon: dockWifi },
  { value: '已配置', label: '备降点' },
  { value: '空闲中', label: '空调状态' },
  { value: '38.2℃', label: '舱内温度' },
  { value: '44%', label: '舱内湿度' },
  { value: '44.9℃', label: '舱外温度' },
  { value: '无降水', label: '降水量' },
  { value: '2.2m/s', label: '风速' },
  { value: '2.12°', label: '倾斜角度' },
  { value: '未连接', label: 'PoE接口' },
  { value: '暂无', label: 'PoE功率' },
]
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
  margin-top: 8px;
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
  flex: 1; /* 新增：让标签区域占据剩余空间 */
  justify-content: flex-start; /* 新增：从顶部开始排列 */
  padding-top: 20px; /* 新增：顶部留出一些空间 */
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
  width: 90px;
  height: 140px;
  padding: 10px 12px;
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