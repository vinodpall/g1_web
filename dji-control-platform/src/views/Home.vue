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
                    <p>当前行走速度</p>
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
                    <p>18.389公里</p>
                    <p>累计行走里程</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="b-bottom">
            <div class="status-row">
              <div class="status-item">
                <img src="@/assets/source_data/svg_data/longitude.svg" alt="经度" />
                <span class="label">经度</span>
                <span class="value">116.38°E</span>
              </div>
              <div class="status-item">
                <img src="@/assets/source_data/svg_data/latitude.svg" alt="纬度" />
                <span class="label">纬度</span>
                <span class="value">39.90°N</span>
              </div>
              <div class="status-item">
                <img src="@/assets/source_data/svg_data/altitude.svg" alt="高度" />
                <span class="label">高度</span>
                <span class="value">43m</span>
              </div>
              <div class="status-item">
                <img src="@/assets/source_data/svg_data/speed.svg" alt="速度" />
                <span class="label">速度</span>
                <span class="value">0.0m/s</span>
              </div>
              <div class="status-item">
                <img src="@/assets/source_data/svg_data/stars.svg" alt="搜星" />
                <span class="label">提醒</span>
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
          <div class="on2-bottom-center">
            <div class="fabu">
              <div class="div">循迹点：</div>
              <div class="select-box">
                <span>请选择</span>
                <span class="arrow"></span>
              </div>
              <span class="span">循迹</span>
              <span class="span1">停止</span>
            </div>
            <div class="fabu">
              <div class="div">发布点：</div>
              <div class="select-box">
                <span>请选择</span>
                <span class="arrow"></span>
              </div>
              <span class="span">发布</span>
              <span class="span1">停止</span>
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
            <div class="div">多任务：</div>
            <div class="select-box">
              <span>请选择</span>
              <span class="arrow"></span>
            </div>
            <span class="span">执行</span>
            <span class="span1">停止</span>
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
          <div class="on4-bottom-t">
            <div class="on4-bottom-tl">
              <p>当前无待执行任务</p>
              <p>
                <span>预计巡检时间：</span>
                <span>预计剩余时间：</span>
              </p>
            </div>
            <div class="on4-bottom-tr">
              <span>未知</span>
            </div>
          </div>
          <div class="on4-bottom-b">
            <div class="divon4">
              <div id="myChart2" style="width: 100%; height: 100%;"></div>
            </div>
            <div class="divon4">
              <div id="myChart3" style="width: 100%; height: 100%;"></div>
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
  height: calc(33.3% - 20px);
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
}

.left-on2 {
  width: 100%;
  height: calc(33.3% - 20px);
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
}

.left-on3 {
  width: 100%;
  height: calc(13.3% - 20px);
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
}

.left-on4 {
  width: 100%;
  height: calc(21% - 20px);
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
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
}

/* 顶部区域 */
.b-top {
  width: 100%;
  height: 60%;
  display: flex;
}

.b-top-left {
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  background: url(data:image/png;base64,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) no-repeat;
  background-size: 100% 100%;
}

.img {
  width: 55%;
  height: 85%;
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
  align-items: center;
}

.b-top-rightDiv {
  width: 85%;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(270deg, #0187bf4d, #0187bf00);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #d4edfd;
}

.b-top-rightDiv img {
  width: 22px;
  height: 22px;
  margin-right: 10px;
}

.b-top-rightDiv div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.b-top-rightDiv p:first-child {
  color: #d4edfd;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 3px;
  line-height: 1;
}

.b-top-rightDiv p:last-child {
  color: rgba(212, 237, 253, 0.7);
  font-size: 11px;
  line-height: 1;
}

.b-top-rightDiv .icon-back {
  width: 24px;
  height: 24px;
  color: #00a8ff;
}

/* 底部区域 */
.b-bottom {
  width: 100%;
  height: 40%;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.status-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(1, 135, 191, 0.1);
  border-radius: 20px;
  padding: 14px 16px;
  height: 55px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
  justify-content: center;
}

.status-item img {
  width: 24px;
  height: 24px;
  filter: brightness(0) saturate(100%) invert(69%) sepia(28%) saturate(469%) hue-rotate(169deg) brightness(91%) contrast(87%);
  margin-bottom: 3px;
}

.status-item .label {
  color: rgba(212, 237, 253, 0.8);
  font-size: 11px;
  margin-bottom: 2px;
  font-weight: 500;
}

.status-item .value {
  color: #d4edfd;
  font-size: 13px;
  font-weight: 600;
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

/* 通用选择框样式 */
.select-box {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  height: 32px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.arrow {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #999;
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
  align-items: center;
  gap: 10px;
  height: 100%;
}

.on3-bottom-center .div {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  min-width: 60px;
}

.on3-bottom-center .span {
  background: rgba(0, 168, 255, 0.1);
  border: 1px solid #00a8ff;
  color: #00a8ff;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
}

.on3-bottom-center .span:hover {
  background: rgba(0, 168, 255, 0.2);
}

.on3-bottom-center .span1 {
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
}

.on3-bottom-center .span1:hover {
  background: rgba(255, 77, 79, 0.2);
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
  background: rgba(0, 12, 23, .5);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
</style>