<template>
  <div class="home-container">
    <!-- 左侧状态栏 -->
    <div class="left-column">
      <!-- 无人机状态 -->
      <div class="status-card drone-status">
        <div class="card-header">
          <div class="title-wrapper">
            <img src="@/assets/source_data/bg_data/card_logo.png" alt="card logo" class="card-logo" />
            <span class="title">无人机状态</span>
          </div>
        </div>
        <div class="card-content">
          <div class="b-top">
            <div class="b-top-left">
              <div class="status-tag">离线</div>
              <div class="drone-image-wrapper">
                <img src="@/assets/source_data/plane_2.png" alt="drone" class="drone-image" />
              </div>
            </div>
            <div class="b-top-right">
              <div class="b-top-rightCard">
                <div class="b-top-rightDiv">
                  <svg class="icon icon-back" aria-hidden="true">
                    <use xlink:href="#icon-speed"></use>
                  </svg>
                  <div>
                    <p>0.00m/s</p>
                    <p>当前飞行速度</p>
                  </div>
                </div>
                <div class="b-top-rightDiv">
                  <svg class="icon icon-back" aria-hidden="true">
                    <use xlink:href="#icon-time"></use>
                  </svg>
                  <div>
                    <p>3天</p>
                    <p>累计飞行时间</p>
                  </div>
                </div>
                <div class="b-top-rightDiv">
                  <svg class="icon icon-back" aria-hidden="true">
                    <use xlink:href="#icon-total_miles"></use>
                  </svg>
                  <div>
                    <p>1000米</p>
                    <p>累计飞行里程</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="b-bottom">
            <div class="b-bottom-top">
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-electricity-full"></use></svg>电量</p>
                <p>90%</p>
              </div>
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-dianya"></use></svg>电压</p>
                <p>56V</p>
              </div>
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-xudianchidianya"></use></svg>电池状态</p>
                <p>0</p>
              </div>
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-icon-115"></use></svg>电机电流</p>
                <p>0A</p>
              </div>
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-sifudianji"></use></svg>电机状态</p>
                <p>0</p>
              </div>
            </div>
            <div class="b-bottom-bottom">
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-a-xiangdianliudianliu"></use></svg>电流</p>
                <p>0.02A</p>
              </div>
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-chongdiantou"></use></svg>充电</p>
                <p>未充电</p>
              </div>
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-wendu"></use></svg>温度反馈</p>
                <p>未知</p>
              </div>
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-jiare"></use></svg>加热系统</p>
                <p>关闭</p>
              </div>
              <div>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 机场状态 -->
      <div class="status-card dock-status">
        <div class="card-header">
          <div class="title-wrapper">
            <img src="@/assets/source_data/bg_data/card_logo.png" alt="card logo" class="card-logo" />
            <span class="title">机场状态</span>
          </div>
        </div>
        <div class="card-content">
          <div class="b-top">
            <div class="b-top-left">
              <div class="status-tag">离线</div>
              <div class="drone-image-wrapper">
                <img src="@/assets/source_data/dock3.png" alt="dock" class="drone-image" />
              </div>
            </div>
            <div class="b-top-right">
              <div class="status-item">
                <svg class="icon icon-back" aria-hidden="true">
                  <use xlink:href="#icon-network"></use>
                </svg>
                <div>
                  <p class="value">95KB/s</p>
                  <p class="label">机场网络速率</p>
                </div>
              </div>
              <div class="status-item">
                <svg class="icon icon-back" aria-hidden="true">
                  <use xlink:href="#icon-task"></use>
                </svg>
                <div>
                  <p class="value">8次</p>
                  <p class="label">累计任务次数</p>
                </div>
              </div>
              <div class="status-item">
                <svg class="icon icon-back" aria-hidden="true">
                  <use xlink:href="#icon-time"></use>
                </svg>
                <div>
                  <p class="value">85H</p>
                  <p class="label">累计任务时长</p>
                </div>
              </div>
            </div>
          </div>
          <div class="b-bottom">
            <div class="b-bottom-top">
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-longitude"></use></svg>经度</p>
                <p>116.38°E</p>
              </div>
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-latitude"></use></svg>纬度</p>
                <p>39.90°N</p>
              </div>
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-electricity-full"></use></svg>电量</p>
                <p>空闲</p>
              </div>
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-temperature"></use></svg>温度</p>
                <p>35°C</p>
              </div>
              <div>
                <p><svg class="icon icon-back" aria-hidden="true"><use xlink:href="#icon-humidity"></use></svg>湿度</p>
                <p>65%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 任务下发 -->
      <div class="status-card task-control">
        <div class="card-header">
          <span class="title">任务下发</span>
        </div>
        <div class="card-content">
          <div class="task-form">
            <div class="form-item">
              <label>航线名称：</label>
              <div class="select-box">
                <span>请选择</span>
                <span class="arrow"></span>
              </div>
            </div>
            <div class="button-group">
              <button class="btn">航线管理</button>
              <button class="btn">航线设置</button>
              <button class="btn">一键定航</button>
              <button class="btn">取消返航</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 环境状态 -->
      <div class="status-card environment-status">
        <div class="card-header">
          <span class="title">环境状态</span>
        </div>
        <div class="card-content">
          <div class="env-grid">
            <div class="env-item">
              <div class="env-icon wind"></div>
              <div class="env-info">
                <span class="label">环境温度</span>
                <span class="value">35°C</span>
              </div>
            </div>
            <div class="env-item">
              <div class="env-icon temp"></div>
              <div class="env-info">
                <span class="label">环境湿度</span>
                <span class="value">58%</span>
              </div>
            </div>
            <div class="env-item">
              <div class="env-icon rain"></div>
              <div class="env-info">
                <span class="label">降水量</span>
                <span class="value">10mm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间区域 -->
    <div class="center-column">
      <!-- 这里将放置无人机3D模型展示 -->
    </div>

    <!-- 右侧区域 -->
    <div class="right-column">
      <!-- 这里将放置告警趋势和设备状态等信息 -->
    </div>
  </div>
</template>

<script setup lang="ts">
// 首页组件逻辑
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
.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 124px); /* 64px导航栏 + 20px间距 + 40px内边距 */
  overflow-y: auto;
  padding-right: 8px;
  width: 480px;
}

/* 自定义滚动条样式 */
.left-column::-webkit-scrollbar {
  width: 4px;
}

.left-column::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.left-column::-webkit-scrollbar-thumb {
  background: rgba(0, 168, 255, 0.3);
  border-radius: 2px;
}

.left-column::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 168, 255, 0.5);
}

/* 状态卡片通用样式 */
.status-card {
  border-radius: 4px;
  overflow: hidden;
  width: 480px;
}

.drone-status {
  height: 212px;
  background: url('@/assets/source_data/bg_data/bg_title.png') no-repeat center;
  background-size: cover;
  position: relative;
}

.dock-status {
  height: 212px;
  background: url('@/assets/source_data/bg_data/bg_title.png') no-repeat center;
  background-size: cover;
}

.task-control {
  height: 158px;
  background: url('@/assets/source_data/bg_data/bg_title.png') no-repeat center;
  background-size: cover;
}

.card-header {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  background: url('@/assets/source_data/bg_data/card_title.png') no-repeat center;
  background-size: 100% 100%;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-logo {
  width: 18px;
  height: 18px;
}

.title {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.card-content {
  padding: 12px 16px;
  height: calc(100% - 44px);
}

/* 顶部区域 */
.b-top {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  height: 100px;
}

.b-top-left {
  position: relative;
  width: 160px;
}

.status-tag {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.drone-image-wrapper {
  width: 160px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.drone-image {
  width: 120px;
  height: auto;
}

.b-top-right {
  flex: 1;
}

.b-top-rightCard {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.b-top-rightDiv {
  display: flex;
  align-items: center;
  gap: 8px;
}

.b-top-rightDiv img {
  width: 24px;
  height: 24px;
}

.b-top-rightDiv p:first-child {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.b-top-rightDiv p:last-child {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.b-top-rightDiv .icon-back {
  width: 24px;
  height: 24px;
  color: #00a8ff;
}

/* 底部区域 */
.b-bottom {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.b-bottom-top,
.b-bottom-bottom {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.b-bottom-top > div,
.b-bottom-bottom > div {
  padding: 0 4px;
}

.b-bottom-top p:first-child,
.b-bottom-bottom p:first-child {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.b-bottom-top p:last-child,
.b-bottom-bottom p:last-child {
  color: #fff;
  font-size: 12px;
  font-weight: 500;
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

/* 任务下发样式 */
.task-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-item label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.select-box {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #333;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  height: 32px;
}

.arrow {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #999;
}

.button-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.btn {
  background: rgba(0, 168, 255, 0.1);
  border: 1px solid #00a8ff;
  color: #00a8ff;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  height: 32px;
  font-size: 14px;
}

.btn:hover {
  background: rgba(0, 168, 255, 0.2);
}

/* 环境状态样式 */
.env-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.env-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.env-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 168, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.env-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.env-info .label {
  color: #999;
  font-size: 12px;
}

.env-info .value {
  color: #fff;
  font-size: 14px;
}

/* 中间列样式 */
.center-column {
  background: rgba(0, 12, 23, .5);
  border: 1px solid #1d1d1d;
  border-radius: 4px;
  height: calc(100vh - 124px);
  overflow: hidden;
  flex: 1;
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

.card-header .icon-back {
  width: 18px;
  height: 18px;
  color: #00a8ff;
}

.status-item .icon-back {
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

/* Remove unused icon classes */
[class^="icon-electricity"],
[class^="icon-voltage"],
[class^="icon-battery"],
[class^="icon-motor"],
[class^="icon-current"],
[class^="icon-charging"],
[class^="icon-temperature"],
[class^="icon-heating"] {
  display: none;
}
</style>