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
                <div>离线</div>
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
                    <p>0.00m/s</p>
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
                <span class="value">116.38°E</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/latitude.svg" alt="纬度" />
                  <span class="label">纬度</span>
                </div>
                <span class="value">39.90°N</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/altitude.svg" alt="高度" />
                  <span class="label">高度</span>
                </div>
                <span class="value">43m</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/speed.svg" alt="速度" />
                  <span class="label">速度</span>
                </div>
                <span class="value">0.0m/s</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/stars.svg" alt="搜星" />
                  <span class="label">搜星</span>
                </div>
                <span class="value">4</span>
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
                <div>离线</div>
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
                    <p>8次</p>
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
                <span class="value">116.38°E</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/latitude.svg" alt="纬度" />
                  <span class="label">纬度</span>
                </div>
                <span class="value">39.90°N</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/stock.svg" alt="舱盖" />
                  <span class="label">舱盖</span>
                </div>
                <span class="value">关闭</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/temperature.svg" alt="温度" />
                  <span class="label">温度</span>
                </div>
                <span class="value">25°C</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/humidity.svg" alt="湿度" />
                  <span class="label">湿度</span>
                </div>
                <span class="value">65%</span>
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
                <span class="span">下发任务</span>
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
                <div class="env-value">35°C</div>
              </div>
            </div>
            <div class="env-item">
              <img src="@/assets/source_data/svg_data/env_wind.svg" alt="湿度" />
              <div class="env-info">
                <div class="env-label">风速</div>
                <div class="env-value">1.2m/s</div>
              </div>
            </div>
            <div class="env-item">
              <img src="@/assets/source_data/svg_data/env_rain.svg" alt="降水量" />
              <div class="env-info">
                <div class="env-label">降水量</div>
                <div class="env-value">10mm</div>
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
                <th>识别时间</th>
                <th>报警类型</th>
                <th>告警等级</th>
                <th>报警内容</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in currentAlarmData" :key="index">
                <td>{{ item.deviceName }}</td>
                <td>{{ item.time }}</td>
                <td>{{ item.type }}</td>
                <td>
                  <span :style="{ color: item.level === '严重' ? '#FF8000' : '' }">
                    {{ item.level }}
                  </span>
                </td>
                <td>{{ item.content }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="right-column">
      <!-- 这里将放置告警趋势和设备状态等信息 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 当前选中的标签
const currentTab = ref('device')

// 设备告警数据
const deviceAlarmData = ref([
  {
    deviceName: 'M4TD',
    time: '2025-07-01 12:56:24',
    type: '常规告警',
    level: '严重',
    content: '风速过大'
  },
  {
    deviceName: 'M4TD',
    time: '2025-07-01 12:56:24',
    type: '常规告警',
    level: '严重',
    content: '雷雨天气'
  },
  {
    deviceName: 'M4TD',
    time: '2025-07-01 12:56:24',
    type: '常规告警',
    level: '严重',
    content: '电池电量低'
  }
])

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
</script>

<style scoped>
.home-container {
  display: grid;
  grid-template-columns: 480px 1fr 480px;
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
  padding-right: 8px;
  width: 480px;
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
  margin-bottom: 20px;
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
  background: rgba(0, 12, 23, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

/* 中间列样式 */
.center-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  width: 25%;
}

.tableOne th:nth-child(3),
.tableOne td:nth-child(3) {
  width: 20%;
}

.tableOne th:nth-child(4),
.tableOne td:nth-child(4) {
  width: 15%;
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
  gap: 20px;
  height: calc(100vh - 124px);
  overflow-y: auto;
  padding-right: 8px;
  width: 480px;
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
</style>