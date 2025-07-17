<template>
  <div class="drone-control-main">
    <!-- 侧边栏菜单 -->
    <aside class="sidebar-menu">
      <div class="sidebar-tabs">
        <div
          v-for="(item, idx) in sidebarTabs"
          :key="item.key"
          :class="['sidebar-tab', { active: currentTab === item.key }]"
          @click="currentTab = item.key"
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
                    <div class="task-progress-title">
                      <span>任务进度</span>
                      <span>0%</span>
                    </div>
                    <div class="task-progress-bar">
                      <div class="task-progress-inner" style="width: 0%"></div>
                    </div>
                    <div class="task-progress-actions-btns">
                      <button class="btn-pause">暂停</button>
                      <button class="btn-stop">停止</button>
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
                <span>行走速度：线速度：0.00m/s ，角速度：0.00m/s</span>
                <span>，前后超声：0</span>
                <span>，左右超声：0</span>
                <span>，温度1：未知℃</span>
                <span>，温度2：未知℃</span>
              </div>
            </div>
            <div class="on1-r">
              <div class="drone-io-mini">
                <div class="io-switch-item"><span>IO项1</span><span class="switch-placeholder"></span></div>
                <div class="io-switch-item"><span>IO项2</span><span class="switch-placeholder"></span></div>
                <div class="io-input-item"><span>前后超声</span><input type="number" placeholder="0~255" /></div>
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
              <div class="video-player-placeholder">视频播放器占位</div>
              <div class="video-controls-placeholder">播放器控制条占位</div>
            </div>
            <div class="control-bottom">
              <div class="robot-move-panel">
                <div class="panel-title">机器人移动</div>
                <div class="move-btns">
                  <div class="move-row">
                    <span class="icon-placeholder"></span>
                    <span>↑</span>
                    <span class="icon-placeholder"></span>
                  </div>
                  <div class="move-row">
                    <span>←</span>
                    <span>↓</span>
                    <span>→</span>
                  </div>
                  <div class="move-speed">
                    <span>-</span><span>1</span><span>+</span>
                  </div>
                  <div class="move-stop"><span>停止</span></div>
                </div>
              </div>
              <div class="gimbal-panel">
                <div class="panel-title">云台控制</div>
                <div class="gimbal-joystick">
                  <span class="icon-placeholder"></span>
                  <!-- 八向云台按钮占位 -->
                </div>
                <ul class="gimbal-func-list">
                  <li><span>调焦:</span><span class="icon-placeholder"></span><span class="icon-placeholder"></span></li>
                  <li><span>聚焦:</span><span class="icon-placeholder"></span><span class="icon-placeholder"></span></li>
                  <li><span>雨刷:</span><span class="icon-placeholder"></span><span class="icon-placeholder"></span></li>
                  <li><span>补光灯:</span><span class="icon-placeholder"></span><span class="icon-placeholder"></span></li>
                  <li><span>红外测温:</span><span class="icon-placeholder"></span><span class="icon-placeholder"></span></li>
                </ul>
                <ul class="gimbal-func-list">
                  <li><span>宽动态:</span><span class="icon-placeholder"></span><span class="icon-placeholder"></span></li>
                  <li><span>一键聚焦:</span><span class="icon-placeholder"></span></li>
                  <li><span>追踪屏蔽:</span><span class="icon-placeholder"></span><span class="icon-placeholder"></span></li>
                  <li class="move-speed"><span>-</span><span>4</span><span>+</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import planeIcon from '@/assets/source_data/svg_data/plane.svg'
import stockIcon from '@/assets/source_data/svg_data/stock3.svg'
import sheetIcon from '@/assets/source_data/svg_data/sheet.svg'
import plane2Img from '@/assets/source_data/plane_2.png'
import batteryImg from '@/assets/source_data/Battery.png'

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
const currentTab = ref('plane')
// 仅结构占位，后续资源和交互等你补充
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
  gap: 1.5vw;
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
}
.amap-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  min-height: 200px;
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
  font-size: 12px;
  color: #d4edfd;
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
  color: #d4edfd;
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
  background: linear-gradient(135deg, #16213a 80%, #0a0f1c 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px #0003;
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
  flex: 1;
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
.robot-move-panel, .gimbal-panel {
  flex: 1;
  background: linear-gradient(135deg, #16213a 80%, #0a0f1c 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px #0003;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.panel-title {
  font-size: 15px;
  color: #59c0fc;
  font-weight: 600;
  margin-bottom: 8px;
}
.move-btns {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}
.move-row {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
}
.move-speed {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #d4edfd;
}
.move-stop {
  margin-top: 4px;
  color: #fd6767;
  font-weight: 600;
  cursor: pointer;
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
  padding: 16px 0 16px 16px;
  box-sizing: border-box;
  margin: 0;
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
  line-height: 150%; /* 18px */
  letter-spacing: 1px;
  text-align: center;
  margin-left: 0;
}
.task-info-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 480px;
  min-width: 480px;
  margin-left: 10px;
  max-width: 100%;
}
.task-progress-actions,
.task-stats-panel {
  width: 100%;
}
.task-progress-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 8px;
}
.task-progress-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #b6b6b6;
  margin-bottom: 4px;
}
.task-progress-bar {
  width: 100%;
  height: 6px;
  background: #222;
  border-radius: 3px;
  margin-bottom: 8px;
  overflow: hidden;
}
.task-progress-inner {
  height: 100%;
  background: linear-gradient(90deg, #67d5fd, #59c0fc);
  border-radius: 3px;
}
.task-progress-actions-btns {
  display: flex;
  gap: 8px;
}
.btn-pause {
  background: #223a5e;
  color: #67d5fd;
  border: none;
  border-radius: 6px;
  padding: 4px 18px;
  font-size: 15px;
  cursor: pointer;
}
.btn-stop {
  background: #2d1a1a;
  color: #fd6767;
  border: none;
  border-radius: 6px;
  padding: 4px 18px;
  font-size: 15px;
  cursor: pointer;
}
.task-stats-panel {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
.task-stat-card {
  display: flex;
  width: 146px;
  height: 44px;
  padding: 0 34px;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  background: linear-gradient(0deg, rgba(170, 128, 255, 0.20) 0%, rgba(170, 128, 255, 0.00) 100%);
  border-bottom: 3px solid #7E44F2;
}
.stat-title {
  font-size: 13px;
  color: #b6b6b6;
}
.stat-value {
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  margin-top: 2px;
}
.stat-blue {
  background: linear-gradient(0deg, rgba(0, 212, 255, 0.20) 0%, rgba(0, 212, 255, 0.00) 100%);
  border-bottom: 3px solid #00CFFF;
}
.stat-green {
  background: linear-gradient(0deg, rgba(0, 255, 170, 0.20) 0%, rgba(0, 255, 170, 0.00) 100%);
  border-bottom: 3px solid #00FFAA;
}
</style> 