<template>
  <div class="home-container">
    <!-- 平板新布局：顶部/底部 7:3，顶部左右 1:3 -->
    <div class="tablet-dashboard">
      <div class="top-area">
        <!-- 左侧列容器：上下排列机器人信息和任务动态 -->
        <div class="left-column-wrapper">
          <!-- 机器人信息 -->
          <div class="top-left-card">
            <div class="cardTitle cardTitle--tablet" style="width: 100%; margin: 0;">
              <img src="@/assets/source_data/bg_data/card_logo.png" alt="" />
              机器人信息
            </div>
            <div class="robot-info-container">
              <!-- 左右结构：机器人图片和详细信息 -->
              <div class="robot-info-layout">
                <div class="robot-image-section">
                  <img src="@/assets/source_data/robot_source/g1_comp_stand.png" alt="机器人" class="robot-image" />
                </div>
                <div class="robot-details-section">
                  <div class="robot-detail-item">
                    <span class="detail-label">名称：</span>
                    <span class="detail-value">{{ robotDisplayInfo.name }}</span>
                  </div>
                  <div class="robot-detail-item">
                    <span class="detail-label">型号：</span>
                    <span class="detail-value">{{ robotDisplayInfo.model }}</span>
                  </div>
                  <div class="robot-detail-item">
                    <span class="detail-label">状态：</span>
                    <span class="status-indicator">
                      <span class="status-dot" :class="{ 'online': robotDisplayInfo.isOnline, 'offline': !robotDisplayInfo.isOnline }"></span>
                      <span class="status-text">{{ robotDisplayInfo.statusText }}</span>
                    </span>
                  </div>
                  <div class="robot-detail-item">
                    <span class="detail-label">编号：</span>
                    <span class="detail-value">{{ robotDisplayInfo.sn }}</span>
                  </div>
                  <!-- 电量和信号强度移到右侧 -->
                  <div class="status-indicators-row">
                    <div class="status-indicator-item">
                      <div class="status-icon battery-icon">
                        <div class="battery-level" :style="{ width: uiBatteryPercent + '%' }"></div>
                      </div>
                      <span class="status-percentage">{{ uiBatteryPercent }}%</span>
                    </div>
                    <div class="status-indicator-item">
                      <div class="status-icon wifi-icon">
                        <div class="wifi-bars">
                          <div class="bar bar1" :class="{ 'active': robotDisplayInfo.signalStrength !== 'none' }"></div>
                          <div class="bar bar2" :class="{ 'active': ['medium', 'strong'].includes(robotDisplayInfo.signalStrength) }"></div>
                          <div class="bar bar3" :class="{ 'active': robotDisplayInfo.signalStrength === 'strong' }"></div>
                        </div>
                      </div>
                      <span class="status-text">{{ robotDisplayInfo.signalStrength === 'weak' ? '弱' : robotDisplayInfo.signalStrength === 'medium' ? '中' : robotDisplayInfo.signalStrength === 'strong' ? '强' : '无' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 任务动态 -->
          <div class="top-left-card-2">
            <div class="cardTitle cardTitle--tablet" style="width: 100%; margin: 0;">
              <img src="@/assets/source_data/bg_data/card_logo.png" alt="" />
              任务动态
            </div>
            <div class="task-dynamic-container">
              <!-- 任务点列表 -->
              <div class="task-points-list">
                <div class="task-point-item" v-for="(point, index) in displayTaskPoints" :key="index">
                  <div class="task-point-info">
                    <div class="task-point-details">
                      <span class="task-detail-item">
                        <span class="detail-label">展区：</span>
                        <span class="detail-value">{{ point.zone_name || '--' }}</span>
                      </span>
                      <span class="task-detail-item">
                        <span class="detail-label">点位：</span>
                        <span class="detail-value">{{ point.custom_name || point.name || '--' }}</span>
                      </span>
                      <span class="task-detail-item">
                        <span class="detail-label">类型：</span>
                        <span class="detail-value">{{ getPointTypeText(point.type) }}</span>
                      </span>
                    </div>
                  </div>
                  <div class="task-point-location" v-if="isCurrentTaskPoint(index)">
                    <img src="@/assets/source_data/robot_source/current_task.svg" alt="执行中任务" class="location-icon" />
                  </div>
                </div>
              </div>
              
              <!-- 任务执行进度 -->
              <div class="task-progress-section">
                <div class="progress-info">
                  <span class="progress-label">任务执行进度: {{ taskProgress }}%</span>
                  <button 
                    class="pause-resume-btn" 
                    :class="{ 'disabled': !navEnabled || !isTaskExecuting }" 
                    :disabled="!navEnabled || !isTaskExecuting"
                    @click="toggleTaskExecution"
                  >
                    {{ isTaskPaused ? '恢复' : '暂停' }}
                  </button>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: taskProgress + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右 3：栅格图显示 -->
        <div class="top-right-card">
          <div class="gridmap-wrapper">
            <canvas ref="gridCanvas" class="grid-canvas"></canvas>
          </div>
        </div>
      </div>

      <div class="bottom-area">
        <div class="bottom-card">
          <div class="bottom-panel-title">
            <span class="bottom-title-text">机器人控制</span>
            <span class="remote-switch-wrap" style="font-size:13px;font-weight:400;">
              导航开关
              <span class="switch-container" :class="{ active: navEnabled }" @click="handleNavigationToggle">
                <span class="switch-toggle"></span>
              </span>
            </span>
          </div>
          <div class="bottom-card-row">
            <div class="mini-card">
              <img class="mini-card-icon" src="@/assets/source_data/robot_source/position.svg" alt="pos" />
              <div class="mini-card-content">
                <div class="mini-card-title" :class="{ 'status-normal': localizationStatus, 'status-error': !localizationStatus }">{{ localizationStatusText }}</div>
                <div class="mini-card-sub">机器人定位状态</div>
              </div>
            </div>
            <div class="mini-card">
              <img class="mini-card-icon" src="@/assets/source_data/robot_source/location.svg" alt="speed" />
              <div class="mini-card-content">
                <div class="mini-card-title">
                  <template v-if="robotSpeed">
                    W: {{ (robotSpeed.w !== undefined ? robotSpeed.w : robotSpeed.angular_z || 0).toFixed(2) }} rad/s · V: {{ (robotSpeed.v !== undefined ? robotSpeed.v : Math.sqrt((robotSpeed.linear_x||0)**2 + (robotSpeed.linear_y||0)**2)).toFixed(2) }} m/s
                  </template>
                  <template v-else>
                    W: 0.0 rad/s · V: 0.0 m/s
                  </template>
                </div>
                <div class="mini-card-sub">
                  <template v-if="robotPose">
                    X: {{ robotPose.x.toFixed(3) }} · Y: {{ robotPose.y.toFixed(3) }} · 角度: {{ robotPose.theta.toFixed(3) }}
                  </template>
                  <template v-else>
                    X: -- · Y: -- · 角度: --
                  </template>
                </div>
              </div>
            </div>
            <div class="mini-card clickable-hall" :class="{ 'hall-disabled': navEnabled }" @click="handleHallClick">
              <img class="mini-card-icon" src="@/assets/source_data/robot_source/hall.svg" alt="hall" />
              <div class="mini-card-content">
                <div class="mini-card-title">{{ currentHallName }}</div>
                <div class="mini-card-sub">当前展厅</div>
              </div>
            </div>
            <div class="mini-card">
              <img class="mini-card-icon" src="@/assets/source_data/robot_source/area.svg" alt="area" />
              <div class="mini-card-content">
                <div class="mini-card-title">{{ currentTaskZone }}</div>
                <div class="mini-card-sub">当前任务展区</div>
              </div>
            </div>
            <button class="start-task-btn" @click="handleTaskControlClick" :class="{ 'stop-task': isTaskExecuting }" :disabled="!isTaskExecuting && !navEnabled">
              {{ isTaskExecuting ? '停止执行任务' : '开始执行任务' }}
            </button>
          </div>
          
        </div>
      </div>
    </div>
    <!-- 左侧状态栏 -->
    <div class="left-box" v-if="false">
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
                  <img 
                    :src="!!(droneStatus as any)?.chargeState ? droneBatteryChargeIcon : droneBatteryIcon" 
                    alt="电量" 
                  />
                  <span class="label">电量</span>
                </div>
                <span class="value">{{ formatBattery(droneStatus?.batteryPercent) }}</span>
              </div>
              <div class="status-item">
                <div class="top-row">
                  <img src="@/assets/source_data/svg_data/stars.svg" alt="搜星" />
                  <span class="label">搜星</span>
                </div>
                <span class="value">{{ gpsStatus?.rtkNumber || 0 }}</span>
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
          <!-- WebSocket连接状态指示器 -->
          <div class="ws-status-indicators">
          </div>
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
                <span class="span" v-permission-click-dialog="'home.task.issue'" @click="handleDispatchTask">下发任务</span>
                <span 
                  class="span1" 
                  v-permission-click-dialog="'home.task.cancel'"
                  @click="handleCancelTask"
                >
                  取消任务
                </span>
              </div>
            </div>
            <!-- 修改第二行的结构 -->
            <div class="control-row second-row">
              <span 
                class="span" 
                v-permission-click-dialog="'home.wayline.pause'"
                @click="handlePauseRoute"
              >
                航线暂停
              </span>
              <span 
                class="span" 
                v-permission-click-dialog="'home.wayline.resume'"
                @click="handleResumeRoute"
              >
                航线恢复
              </span>
              <span 
                class="span" 
                v-permission-click-dialog="'home.drone.return'"
                @click="handleReturnHome"
              >
                一键返航
              </span>
              <span 
                class="span1" 
                v-permission-click-dialog="'home.drone.cancel_return'"
                @click="handleCancelReturnHome"
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
    <div class="center-column" v-if="false">
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
                <!-- 清晰度设置按钮 -->
                <div class="quality-btn-wrapper" style="display: inline-block;">
                  <button class="quality-btn" @click.stop="toggleQualityMenu" title="设置清晰度">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </button>
                </div>
                <!-- 清晰度菜单 -->
                <div v-if="showQualityMenu" class="quality-menu" :style="qualityMenuStyle">
                  <div class="quality-menu-item" @click="handleQualityChange(0)">自适应</div>
                  <div class="quality-menu-item" @click="handleQualityChange(1)">流畅</div>
                  <div class="quality-menu-item" @click="handleQualityChange(2)">标清</div>
                  <div class="quality-menu-item" @click="handleQualityChange(3)">高清</div>
                  <div class="quality-menu-item" @click="handleQualityChange(4)">超清</div>
                </div>
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
                      无人机辅助相机
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="center-controls">
            </div>
            <div class="right-controls" @click="toggleScreenMenu">
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
          <span :class="{ active: currentTab === 'inspection' }" @click="switchTab('inspection')">任务告警</span>
        </div>
        <div class="on2-bottom">
          <table class="tableOne">
            <thead>
              <tr>
                <th v-if="currentTab === 'device'" title="设备名称">设备名称</th>
                <th v-if="currentTab === 'device'" title="报警内容">报警内容</th>
                <th v-if="currentTab === 'device'" title="报警类型">报警类型</th>
                <th v-if="currentTab === 'device'" title="告警等级">告警等级</th>
                <th v-if="currentTab === 'device'" title="告警时间">告警时间</th>
                
                <!-- 巡检告警列标题 -->
                <th v-if="currentTab === 'inspection'" title="航线名称">航线名称</th>
                <th v-if="currentTab === 'inspection'" title="目标图片">目标图片</th>
                <th v-if="currentTab === 'inspection'" title="目标数量">目标数量</th>
                <th v-if="currentTab === 'inspection'" title="算法名称">算法名称</th>
                <th v-if="currentTab === 'inspection'" title="告警时间">告警时间</th>
              </tr>
            </thead>
            <tbody>
              <!-- 设备告警行 -->
              <tr v-if="currentTab === 'device'" v-for="(item, index) in currentAlarmData" :key="`device-${index}`">
                <td :title="item.deviceName || '--'">{{ item.deviceName }}</td>
                <td :title="item.content || '--'">{{ item.content }}</td>
                <td :title="item.type || '--'">{{ item.type }}</td>
                <td :title="item.level || '--'">
                  <span :style="{ color: item.level === '严重' ? '#FF8000' : '' }">
                    {{ item.level }}
                  </span>
                </td>
                <td :title="item.time || '--'">{{ item.time }}</td>
              </tr>
              
              <!-- 巡检告警行 -->
              <tr v-if="currentTab === 'inspection'" v-for="(item, index) in currentAlarmData" :key="`inspection-${index}`">
                <td :title="item.wayline_name || '--'">{{ item.wayline_name || '--' }}</td>
                <td :title="item.thumbnail_image_url ? '点击查看大图' : '暂无图片'">
                  <template v-if="item.thumbnail_image_url">
                    <img 
                      v-if="thumbCache[item.thumbnail_image_url] && !thumbError[item.thumbnail_image_url]"
                      :src="thumbCache[item.thumbnail_image_url]"
                      alt="目标图片"
                      class="target-image-small"
                      @click="handleInspectionImageClick(item.marked_image_url)"
                      style="cursor:pointer;"
                    />
                    <div v-else-if="thumbLoading[item.thumbnail_image_url]" class="loading-image-small">
                      <span>加载中...</span>
                    </div>
                    <div v-else-if="thumbError[item.thumbnail_image_url]" class="loading-image-small">
                      <span style='color:#f66;'>加载失败</span>
                    </div>
                  </template>
                  <div v-else-if="item.marked_image_url" class="loading-image-small">
                    <span>加载中...</span>
                  </div>
                  <span v-else class="no-image">--</span>
                </td>
                <td :title="`目标数量: ${item.target_count || 0}`" style="text-align: center;">{{ item.target_count || 0 }}</td>
                <td :title="getAlgorithmName(item.target_type)">{{ getAlgorithmName(item.target_type) }}</td>
                <td :title="formatTimestamp(item.detection_time)">{{ formatTimestamp(item.detection_time) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


    <!-- 右侧区域 -->
    <div class="right-column" v-if="false">
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
  <!-- 展厅选择弹窗 -->
  <div v-if="showHallSelectDialog" class="custom-dialog-mask">
    <div class="custom-dialog">
      <div class="custom-dialog-title">选择展厅</div>
      <div class="custom-dialog-content">
        <div class="hall-list">
          <div 
            v-for="hall in hallOptions" 
            :key="hall.id" 
            class="hall-item"
            :class="{ 'selected': hall.id === selectedHallId }"
            @click="handleHallSelect(hall.id)"
          >
            <img class="hall-icon" src="@/assets/source_data/robot_source/hall.svg" alt="hall" />
            <span class="hall-name">{{ hall.name }}</span>
            <span v-if="hall.id === selectedHallId" class="selected-indicator">✓</span>
          </div>
        </div>
      </div>
      <div class="custom-dialog-actions">
        <button class="mission-btn mission-btn-cancel" @click="handleCancelHallSelect">取消</button>
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
              </select>
              <span class="custom-select-arrow">
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <polygon points="2,4 6,8 10,4" fill="#fff"/>
                </svg>
              </span>
            </div>
          </div>
          <div v-if="dispatchTaskDialog.form.task_type === 1" class="dispatch-task-row">
            <label>开始时间：</label>
            <input 
              v-model="dispatchTaskDialog.form.begin_time" 
              type="datetime-local" 
              class="dispatch-task-input"
              :min="getMinLocalDateTime()"
            />
            <div v-if="dispatchTaskDialog.form.task_type === 1" class="time-tip">提示：定时任务的开始时间必须在当前时间4分钟及以后</div>
          </div>
          <!-- 周期任务开关（仅定时任务可用） -->
          <div v-if="dispatchTaskDialog.form.task_type === 1" class="dispatch-task-row">
            <label>周期任务：</label>
            <div class="dispatch-switch-wrapper">
              <div
                class="switch-container"
                :class="{ active: dispatchTaskDialog.form.enable_recurrence }"
                @click="dispatchTaskDialog.form.enable_recurrence = !dispatchTaskDialog.form.enable_recurrence"
              >
                <div class="switch-toggle"></div>
              </div>
              <span class="dispatch-switch-label">{{ dispatchTaskDialog.form.enable_recurrence ? '开启' : '关闭' }}</span>
            </div>
          </div>
          <div v-if="dispatchTaskDialog.form.task_type === 1 && dispatchTaskDialog.form.enable_recurrence" class="dispatch-task-row">
            <label>日期范围：</label>
            <input 
              v-model="dispatchTaskDialog.form.recurrence_start_date" 
              type="date" 
              class="dispatch-task-input"
              :min="getTodayDate()"
            />
            <span style="margin: 0 8px; color: #67d5fd;">至</span>
            <input 
              v-model="dispatchTaskDialog.form.recurrence_end_date" 
              type="date" 
              class="dispatch-task-input"
              :min="getTodayDate()"
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
    
    <!-- 任务选择弹窗 -->
    <div v-if="showTaskSelectionDialog" class="custom-dialog-mask">
      <div class="custom-dialog" data-dialog="task-selection">
        <div class="custom-dialog-title">开始执行任务</div>
        <div class="custom-dialog-content">
          <div class="add-user-form">
            <div class="add-user-form-row">
              <label>展厅任务：</label>
              <div class="custom-select-wrapper">
                <select v-model="selectedTaskPresetId" class="user-select">
                  <option 
                    v-for="preset in currentHallTourPresets" 
                    :key="preset.id" 
                    :value="preset.id.toString()"
                  >
                    {{ preset.name }}
                  </option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#67d5fd"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="add-user-form-row">
              <label>讲解对象：</label>
              <div class="custom-select-wrapper">
                <select v-model="selectedAudienceId" class="user-select">
                  <option 
                    v-for="audience in availableAudiences" 
                    :key="audience.id" 
                    :value="audience.id.toString()"
                  >
                    {{ audience.name }}
                  </option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#67d5fd"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-cancel" @click="handleCancelTaskSelection">取消</button>
          <button class="mission-btn mission-btn-pause" @click="handleConfirmStartTask">开始任务</button>
        </div>
      </div>
    </div>
    
    <!-- 大图显示模态框 -->
    <div v-if="showBigImage" class="big-image-mask" @click="closeBigImage">
      <img :src="bigImageUrl" class="big-image" @click.stop />
    </div>
    
    <!-- 导航开关loading遮罩 -->
    <div v-if="navSwitchLoading" class="nav-loading-overlay">
      <div class="nav-loading-content">
        <div class="nav-loading-spinner"></div>
        <div class="nav-loading-text">{{ navLoadingText }}</div>
      </div>
    </div>
    
    <!-- 成功消息提示 -->
    <SuccessMessage 
      :show="showSuccessMessage" 
      :message="successMessageText" 
      @close="closeSuccessMessage" 
    />
    
    <!-- 错误消息提示 -->
    <ErrorMessage 
      :show="showErrorMessage" 
      :message="errorMessageText" 
      @close="closeErrorMessage" 
    />
    
    <!-- 确认弹窗 -->
    <ConfirmDialog
      :show="confirmDialogState.show"
      :title="confirmDialogState.title"
      :message="confirmDialogState.message"
      @confirm="closeConfirmDialog(true)"
      @cancel="closeConfirmDialog(false)"
    />
    
  </template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, onActivated, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
// import { useHmsAlerts, useDevices, useWaylineJobs } from '../composables/useApi' // API已移除，等待重新对接
// import { controlApi, waylineApi, livestreamApi } from '../api/services' // API已移除
import { navigationApi } from '../api/services'
// 兼容性占位，避免构建错误，后续将替换为新接口
const waylineApi: any = { getFlightStatistics: async (_workspaceId: any, _days: number) => ({ code: 0, data: {} }) }
const livestreamApi: any = { setQuality: async (_dockSn: string, _payload: any) => ({}) }
const controlApi: any = { returnHome: async (_sn: string) => ({}) }
import { config } from '../config/environment'
import { useSimpleWebSocket } from '../utils/simpleWebSocket'
import { getVideoStreams, getVideoStream, getDefaultVideoType } from '../utils/videoCache'
import * as echarts from 'echarts'
import AMapLoader from '@amap/amap-jsapi-loader'
import flvjs from 'flv.js'
import mapDockIcon from '@/assets/source_data/svg_data/map_dock3.svg'
// 首页底部卡片：导航开关状态
const navSwitchLoading = ref(false)
const navLoadingText = ref('')

// 消息提示状态
const showSuccessMessage = ref(false)
const successMessageText = ref('')
const showErrorMessage = ref(false)
const errorMessageText = ref('')

// 确认弹窗状态
const confirmDialogState = ref({
  show: false,
  title: '',
  message: '',
  resolve: null as ((value: boolean) => void) | null
})

// 导航开关状态从WebSocket数据同步
const navEnabled = computed(() => {
  const cmdStatus = robotCmdStatus.value
  if (cmdStatus?.nav !== undefined) {
    return Boolean(cmdStatus.nav)
  }
  return false
})

// 建图状态从WebSocket数据同步
const slamEnabled = computed(() => {
  const cmdStatus = robotCmdStatus.value
  if (cmdStatus?.slam !== undefined) {
    return Boolean(cmdStatus.slam)
  }
  return false
})

// 录包状态从WebSocket数据同步
const dataRecordEnabled = computed(() => {
  const cmdStatus = robotCmdStatus.value
  if (cmdStatus?.data_record !== undefined) {
    return Boolean(cmdStatus.data_record)
  }
  return false
})

// 定位状态（将在 robotCmdStatus 定义后初始化）
import mapDroneIcon from '@/assets/source_data/svg_data/map_drone.svg'
import droneArrowIcon from '@/assets/source_data/svg_data/drone_control_svg/drone_arrow.svg'
import droneBatteryIcon from '@/assets/source_data/svg_data/drone_battery.svg'
import droneBatteryChargeIcon from '@/assets/source_data/svg_data/drone_battery_charge.svg'


const router = useRouter()

// 使用HMS报警API和设备管理API
// const { hmsAlerts, loading, error, fetchDeviceHms, setAllAlerts } = useHmsAlerts() // API已移除
const hmsAlerts = ref([])
const loading = ref(false)
const error = ref(null)
const fetchDeviceHms = async (_sn?: string): Promise<any[]> => {
  return []
}
const setAllAlerts = (_alerts: any[]) => {}
// const { getCachedDeviceSns, getCachedWorkspaceId } = useDevices() // API已移除
const getCachedDeviceSns = (): { dockSns: string[]; droneSns: string[] } => ({ dockSns: [], droneSns: [] })
const getCachedWorkspaceId = () => localStorage.getItem('workspace_id')

// WebSocket数据获取（需要等userStore初始化后）
const deviceSn = ref('default') // 默认设备SN，可以根据实际情况修改
// WebSocket实例将在userStore初始化后创建


// 从WebSocket获取的实时数据（保留以避免模板错误）
const realtimeDeviceData = computed(() => {
  return {
    position: { longitude: 0, latitude: 0, height: 0 },
    attitude: { pitch: 0, roll: 0, yaw: 0 },
    gimbal: { pitch: 0, roll: 0, yaw: 0 },
    battery: 0,
    velocity: { x: 0, y: 0, z: 0 }
  }
})

// 算法检测结果（保留以避免模板错误）
const visionDetections = computed(() => {
  return {}
})

const activeDetections = computed(() => {
  return Object.entries(visionDetections.value)
    .filter(([_, result]) => (result as any).active)
    .map(([id, result]) => ({ id, ...result as any }))
})

const totalDetectionCount = computed(() => {
  return Object.values(visionDetections.value)
    .reduce((total, result: any) => total + (result.detections?.length || 0), 0)
})

// 简化的告警数据（从单一WebSocket获取）
const visionAlerts = ref<any[]>([])
const latestAlert = ref<any>(null)


// 数据格式化方法
const formatPosition = (pos: any) => {
  if (!pos || (pos.longitude === 0 && pos.latitude === 0 && pos.height === 0)) {
    return '无数据'
  }
  return `${pos.longitude.toFixed(6)}, ${pos.latitude.toFixed(6)}, ${pos.height.toFixed(1)}m`
}

const formatAttitude = (att: any) => {
  if (!att || (att.pitch === 0 && att.roll === 0 && att.yaw === 0)) {
    return '无数据'
  }
  return `P:${att.pitch.toFixed(1)}° R:${att.roll.toFixed(1)}° Y:${att.yaw.toFixed(1)}°`
}

const formatVelocity = (vel: any) => {
  if (!vel || (vel.x === 0 && vel.y === 0 && vel.z === 0)) {
    return '无数据'
  }
  return `X:${vel.x.toFixed(2)} Y:${vel.y.toFixed(2)} Z:${vel.z.toFixed(2)} m/s`
}

const formatFrameTime = (frameTime: number) => {
  if (!frameTime) return '无数据'
  return new Date(frameTime * 1000).toLocaleString()
}

const formatLastUpdate = (updateTime: Date | null) => {
  if (!updateTime) return '无数据'
  return updateTime.toLocaleString()
}


// WebSocket监听器将在visionWs和controlWs初始化后定义

// 使用航线任务API
// const { waylineFiles, fetchWaylineFiles, createJob, fetchWaylineDetail, cancelReturnHome, stopJob, pauseJob, resumeJob, executeJob } = useWaylineJobs() // API已移除
const waylineFiles = ref<{ wayline_id: string; name: string }[]>([])
const fetchWaylineFiles = async (_workspaceId?: any, _params?: { page?: number; page_size?: number }) => {}
const createJob = async (_workspaceId?: any, _taskData?: any) => { return undefined as unknown as { job_id: string } }
const fetchWaylineDetail = async (_workspaceId?: any, _fileId?: string) => { return { waylines: [] } as any }
const cancelReturnHome = async (_workspaceId?: any, _dockSn?: string) => {}
const stopJob = async (_workspaceId?: any, _jobId?: any) => {}
const pauseJob = async (_workspaceId?: any, _jobId?: any) => {}
const resumeJob = async (_workspaceId?: any, _jobId?: any) => {}
const executeJob = async (_workspaceId?: any, _jobId?: any, _payload?: any) => {}

// 使用设备状态API - 已移除，临时模拟
// const { 
//   fetchDeviceStatus, 
//   fetchMainDeviceStatus,
//   fetchDroneStatus,
//   position, 
//   environment, 
//   dockStatus, 
//   droneStatus, 
//   gpsStatus,
//   formatCoordinate,
//   formatHeight,
//   formatSpeed,
//   formatTemperature,
//   formatHumidity,
//   formatWindSpeed,
//   formatRainfall,
//   formatBattery,
//   formatNetworkRate,
//   formatAccTime,
//   formatFlightDistance
// } = useDeviceStatus()

// 临时模拟数据和函数
const fetchDeviceStatus = () => {}
const fetchMainDeviceStatus = () => {}
const fetchDroneStatus = () => {}
const position = ref({ longitude: 0, latitude: 0, height: 0 })
const environment = ref({ environmentTemperature: 0, humidity: 0, windSpeed: 0, rainfall: 0 })
const dockStatus = ref({ isOnline: false, coverState: 0, chargeState: 0, batteryPercent: 0, networkRate: 0, jobNumber: 0, accTime: 0, coverText: '' })
const droneStatus = ref<{ isOnline: boolean; inDock: boolean | number; batteryPercent: number; horizontalSpeed: number; totalFlightTime: number; totalFlightDistance: number; rtkNumber: number; gimbalYaw: number; attitude: { pitch: number; roll: number; yaw: number; head?: number }; longitude?: number; latitude?: number; height?: number }>({ isOnline: false, inDock: false, batteryPercent: 0, horizontalSpeed: 0, totalFlightTime: 0, totalFlightDistance: 0, rtkNumber: 0, gimbalYaw: 0, attitude: { pitch: 0, roll: 0, yaw: 0 } })
const gpsStatus = ref<{ signal: number; rtkNumber?: number }>({ signal: 0 })
const formatCoordinate = (val: any, precision?: any) => val || '--'
const formatHeight = (val: any, unit?: any) => val || '--'
const formatSpeed = (val: any, unit?: any) => val || '--'
const formatTemperature = (val: any, unit?: any) => val || '--'
const formatHumidity = (val: any, unit?: any) => val || '--'
const formatWindSpeed = (val: any, unit?: any) => val || '--'
const formatRainfall = (val: any, unit?: any) => val || '--'
const formatBattery = (val: any, showIcon?: any) => val || '--'
const formatNetworkRate = (val: any, unit?: any) => val || '--'
const formatAccTime = (val: any, unit?: any) => val || '--'
const formatFlightDistance = (val: any, unit?: any) => val || '--'

// 使用全局任务进度store
import { useTaskProgressStore } from '../stores/taskProgress'
import { parseErrorMessage } from '../utils/errorCodes'
const taskProgressStore = useTaskProgressStore()

// 导入消息提示组件
import SuccessMessage from '../components/SuccessMessage.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

// 使用机器人store
import { useRobotStore } from '../stores/robot'
const robotStore = useRobotStore()

// 使用展厅store
import { useHallStore } from '../stores/hall'
const hallStore = useHallStore()

// 使用展厅任务store
import { useTourStore } from '../stores/tour'
const tourStore = useTourStore()

// 使用讲解对象store
import { useGuideStore } from '../stores/guide'
const guideStore = useGuideStore()

// 使用用户store
import { useUserStore } from '../stores/user'
const userStore = useUserStore()

// 使用WebSocket数据store
import { useWebSocketDataStore } from '../stores/websocketData'
const websocketDataStore = useWebSocketDataStore()

// 先从缓存恢复机器人数据，确保WebSocket连接使用正确的SN
robotStore.hydrateFromCache()
robotStore.initSelectedRobot()

// 动态获取WebSocket使用的sn
const getWebSocketSn = () => {
  const selectedRobot = robotStore.selectedRobot
  if (selectedRobot && selectedRobot.sn && selectedRobot.sn.trim()) {
    // console.log('使用选中机器人的SN:', selectedRobot.sn)
    return selectedRobot.sn
  }
  console.log('使用broadcast SN')
  return 'broadcast'
}

// 使用新的WebSocket数据管理
import { useWebSocketData } from '@/composables/useWebSocketData'

// 导入地图缓存工具
import { downloadAndCacheMap, mapCache, getMapOriginInfo, worldToPixel, type MapOriginInfo } from '@/utils/mapCache'
const {
  // 连接状态
  isConnected: wsConnected,
  isConnecting: wsConnecting,
  error: wsError,
  
  // 机器人数据
  getRobotPose,
  getRobotCmdStatus,
  getRobotCurrentMap,
  getRobotSpeed,
  isRobotOnline,
  robotSNs,
  
  // 方法
  connectWebSocket,
  disconnectWebSocket,
  resetAllData,
  updateWebSocketConfig
} = useWebSocketData(
  {
    sn: getWebSocketSn(), // 现在会使用正确的SN
    kinds: ['pose', 'cmd_status', 'current_map', 'tour'],
    channels: [`robot:${getWebSocketSn()}:speed`]
  },
  true, // 自动连接
  userStore.token || ''
)



// 电量百分比：优先 cmd_status.battery_soc，回退 droneStatus.batteryPercent
// 使用本地存储保存电量值，默认为0
const BATTERY_STORAGE_KEY = 'robot_battery_percent'

// 从本地存储读取初始电量值，默认为0
const getStoredBattery = () => {
  const stored = localStorage.getItem(BATTERY_STORAGE_KEY)
  return stored ? parseInt(stored, 10) : 0
}
const uiBatteryPercent = ref<number>(getStoredBattery())

// 监听 WebSocket 电量数据变化并更新
watch(() => {
  const currentSn = getWebSocketSn()
  const cmdStatus = getRobotCmdStatus(currentSn)
  const soc = (cmdStatus as any)?.battery_soc
  
  // 检查是否为有效的电量值（大于0的数字）
  const isValidBattery = (n: any) => {
    const v = typeof n === 'number' ? n : Number(n)
    return Number.isFinite(v) && v > 0
  }
  
  const clamp = (n: any) => {
    const v = typeof n === 'number' ? n : Number(n)
    return Math.min(100, Math.max(0, Math.round(v)))
  }
  
  // 优先使用 cmd_status 的电量
  if (isValidBattery(soc)) {
    return clamp(soc)
  }
  
  // 回退：使用飞行器/设备状态中的电量百分比
  const droneBattery = (droneStatus as any)?.value?.batteryPercent
  if (isValidBattery(droneBattery)) {
    return clamp(droneBattery)
  }
  
  return null // 没有有效数据
}, (newBattery) => {
  // 只有当新值有效且与当前值不同时才更新
  if (newBattery !== null && newBattery !== uiBatteryPercent.value) {
    uiBatteryPercent.value = newBattery
    localStorage.setItem(BATTERY_STORAGE_KEY, newBattery.toString())
    console.log(`电量已更新: ${newBattery}%`)
  }
})


// 当前选中的机器人信息
const currentRobot = computed(() => {
  return robotStore.selectedRobot
})

// 从WebSocket获取的实时位姿数据
const robotPose = computed(() => {
  const currentSn = getWebSocketSn()
  let result = getRobotPose(currentSn)
  
  // 如果当前sn没有数据且不是broadcast，尝试使用broadcast
  if (!result && currentSn !== 'broadcast') {
    result = getRobotPose('broadcast')
  }
  
  return result
})

// 从WebSocket获取的实时命令状态
const robotCmdStatus = computed(() => {
  const currentSn = getWebSocketSn()
  let result = getRobotCmdStatus(currentSn)
  
  // 如果当前sn没有数据且不是broadcast，尝试使用broadcast
  if (!result && currentSn !== 'broadcast') {
    result = getRobotCmdStatus('broadcast')
  }
  
  // 如果还是没有数据，尝试使用其他可用的SN
  const availableSNs = robotSNs || []
  if (!result && availableSNs.length > 0) {
    for (const sn of availableSNs) {
      const altResult = getRobotCmdStatus(sn)
      if (altResult) {
        result = altResult
        break
      }
    }
  }
  
  return result
})

// 从WebSocket获取的当前地图信息
const robotCurrentMap = computed(() => {
  const currentSn = getWebSocketSn()
  let result = getRobotCurrentMap(currentSn)
  
  // 如果当前sn没有数据且不是broadcast，尝试使用broadcast
  if (!result && currentSn !== 'broadcast') {
    result = getRobotCurrentMap('broadcast')
  }
  
  return result
})

// 定位状态 - 使用 ref 保存状态，只有在有新值时才更新
const localizationStatus = ref(false)

// 监听 robotCmdStatus 的变化，更新定位状态
watch(() => robotCmdStatus.value, (cmdStatus) => {
  // 如果导航未开启，设置为异常
  if (!cmdStatus || cmdStatus.nav !== 1) {
    localizationStatus.value = false
    return
  }
  
  // 导航开启时，如果有 loc_ok 字段，才更新状态
  if (cmdStatus.loc_ok !== undefined) {
    localizationStatus.value = Boolean(cmdStatus.loc_ok)
  }
  // 如果没有 loc_ok 字段，不更新，保持原状态
}, { immediate: true })

// 定位状态文本显示
const localizationStatusText = computed(() => {
  return localizationStatus.value ? '定位正常' : '定位异常'
})

// 从WebSocket获取的机器人速度信息，过滤微小误差值
const robotSpeed = computed(() => {
  const currentSn = getWebSocketSn()
  let result = getRobotSpeed(currentSn)
  
  // 如果当前sn没有数据且不是broadcast，尝试使用broadcast
  if (!result && currentSn !== 'broadcast') {
    result = getRobotSpeed('broadcast')
  }
  
  if (!result) return null
  
  // 定义阈值：线速度小于0.05 m/s，角速度小于0.05 rad/s 视为静止
  const LINEAR_THRESHOLD = 0.05  // m/s (扩大阈值，过滤微小波动)
  const ANGULAR_THRESHOLD = 0.05 // rad/s (扩大阈值，过滤微小波动)
  
  // 过滤后的速度数据
  const filteredSpeed = { ...result }
  
  // 过滤线速度
  if (filteredSpeed.v !== undefined) {
    filteredSpeed.v = Math.abs(filteredSpeed.v) < LINEAR_THRESHOLD ? 0 : filteredSpeed.v
  }
  
  // 过滤角速度
  if (filteredSpeed.w !== undefined) {
    filteredSpeed.w = Math.abs(filteredSpeed.w) < ANGULAR_THRESHOLD ? 0 : filteredSpeed.w
  }
  
  // 为了向后兼容，也处理旧格式的速度字段
  if (filteredSpeed.linear_x !== undefined) {
    filteredSpeed.linear_x = Math.abs(filteredSpeed.linear_x) < LINEAR_THRESHOLD ? 0 : filteredSpeed.linear_x
  }
  if (filteredSpeed.linear_y !== undefined) {
    filteredSpeed.linear_y = Math.abs(filteredSpeed.linear_y) < LINEAR_THRESHOLD ? 0 : filteredSpeed.linear_y
  }
  if (filteredSpeed.angular_z !== undefined) {
    filteredSpeed.angular_z = Math.abs(filteredSpeed.angular_z) < ANGULAR_THRESHOLD ? 0 : filteredSpeed.angular_z
  }
  
  return filteredSpeed
})

// 机器人在线状态
const robotOnlineStatus = computed(() => {
  const currentSn = getWebSocketSn()
  let result = isRobotOnline(currentSn)
  
  // 如果当前sn没有数据且不是broadcast，尝试使用broadcast
  if (!result && currentSn !== 'broadcast') {
    result = isRobotOnline('broadcast')
  }
  
  return result
})

// 机器人显示信息的计算属性
const robotDisplayInfo = computed(() => {
  const robot = currentRobot.value
  if (!robot) {
    return {
      name: 'a区导览机器人',
      model: 'G1',
      status: 'offline',
      statusText: '离线',
      sn: 'SN-20231108',
      batteryLevel: uiBatteryPercent.value,
      signalStrength: 'strong',
      isOnline: false
    }
  }
  
  return {
    name: robot.name,
    model: robot.model,
    status: robot.online ? 'online' : 'offline',
    statusText: robot.online ? '在线' : '离线',
    sn: robot.sn,
    batteryLevel: uiBatteryPercent.value,
    signalStrength: 'strong', // 默认为强，暂无实时数据
    isOnline: robot.online
  }
})

// 当前标签页
const currentTab = ref('device')

// 展厅选择相关状态
const showHallSelectDialog = ref(false)

// 使用全局展厅选择状态
const selectedHallId = computed({
  get: () => hallStore.selectedHallId,
  set: (value) => hallStore.setSelectedHall(value)
})

// 获取展厅列表
const hallOptions = computed(() => 
  hallStore.halls.map(hall => ({
    id: hall.id.toString(),
    name: hall.nav_name
  }))
)

// 当前选中的展厅名称
const currentHallName = computed(() => {
  const hall = hallStore.halls.find(h => h.id.toString() === selectedHallId.value)
  return hall ? hall.nav_name : 'a展厅'
})

// 展厅选择相关方法
const handleHallClick = async () => {
  // 检查导航状态，导航开启时不允许切换展厅
  if (navEnabled.value) {
    errorMessageText.value = '导航开启时不能切换展厅，请先关闭导航'
    showErrorMessage.value = true
    return
  }
  
  // 确保展厅数据已加载
  if (!hallStore.isLoaded || hallStore.halls.length === 0) {
    try {
      await hallStore.fetchHalls()
    } catch (error) {
      console.error('获取展厅列表失败:', error)
      alert('获取展厅列表失败，请稍后重试')
      return
    }
  }
  
  // 打开展厅选择弹窗
  showHallSelectDialog.value = true
}

const handleHallSelect = (hallId: string) => {
  hallStore.setSelectedHall(hallId)
  showHallSelectDialog.value = false
  console.log('展厅已切换到:', currentHallName.value)
  
  // 下载并更新栅格地图
  downloadAndUpdateHomeGridMap()
}

const handleCancelHallSelect = () => {
  showHallSelectDialog.value = false
}

// 获取首页当前地图名称（用于下载地图）
const getCurrentHomeMapName = () => {
  const hall = hallStore.halls.find(h => h.id.toString() === selectedHallId.value)
  return hall ? hall.nav_name : ''
}

// 下载并更新首页栅格地图
const downloadAndUpdateHomeGridMap = async () => {
  const mapName = getCurrentHomeMapName()
  if (!mapName) {
    console.warn('首页未找到当前展厅地图名称')
    return
  }

  try {
    console.log(`首页展厅切换，准备更新地图: ${mapName}`)
    
    // 检查缓存
    if (mapCache.isMapCached(mapName)) {
      console.log(`首页地图 ${mapName} 已在缓存中，直接渲染`)
    } else {
      console.log(`首页地图 ${mapName} 不在缓存中，将下载`)
    }
    
    // 重新渲染栅格图（会自动处理下载和缓存）
    await loadAndRenderPGM()
  } catch (error) {
    console.error('首页更新栅格地图失败:', error)
  }
}

// 处理任务控制按钮点击（开始/停止）
const handleTaskControlClick = async () => {
  if (isTaskExecuting.value) {
    // 如果正在执行任务，则停止任务
    try {
      const token = userStore.token || localStorage.getItem('token') || ''
      await websocketDataStore.stopCurrentTourRun(token)
      console.log('✅ 任务已停止')
      
      // 任务停止成功后，刷新任务运行列表状态
      try {
        await websocketDataStore.fetchTourRuns(token)
        console.log('✅ 任务停止后刷新任务列表成功')
      } catch (error) {
        console.warn('❌ 刷新任务列表失败:', error)
      }
    } catch (error) {
      console.error('❌ 停止任务失败:', error)
      alert('停止任务失败，请重试')
    }
  } else {
    // 如果没有执行任务，则开始任务
    await handleStartTaskClick()
  }
}
// 处理开始执行任务按钮点击
const handleStartTaskClick = async () => {
  console.log('=== 开始执行任务按钮被点击 ===')
  
  // 检查导航是否开启
  if (!navEnabled.value) {
    errorMessageText.value = '请先开启导航后再执行任务'
    showErrorMessage.value = true
    setTimeout(() => {
      showErrorMessage.value = false
    }, 3000)
    return
  }
  
  try {
    // 先确保数据已加载
    if (!tourStore.tourPresets.length) {
      await tourStore.fetchTourPresets()
    }
    if (!guideStore.audiences.length) {
      await guideStore.fetchAudiences()
    }
    
    // 检查是否有任务预设
    const presets = currentHallTourPresets.value
    if (!presets.length) {
      alert('当前展厅暂无可用的任务预设')
      return
    }
    
    // 检查是否有讲解对象
    if (!availableAudiences.value.length) {
      alert('暂无可用的讲解对象')
      return
    }
    
    // 默认选择第一个任务预设和讲解对象
    selectedTaskPresetId.value = presets[0].id.toString()
    selectedAudienceId.value = availableAudiences.value[0].id.toString()
    
    // 显示弹窗
    showTaskSelectionDialog.value = true
  } catch (error) {
    console.error('加载任务数据失败:', error)
    alert('加载任务数据失败，请重试')
  }
}
// 确认开始任务
const handleConfirmStartTask = async () => {
  if (!selectedTaskPresetId.value) {
    alert('请选择任务预设')
    return
  }
  
  if (!selectedAudienceId.value) {
    alert('请选择讲解对象')
    return
  }
  
  try {
    const presetId = parseInt(selectedTaskPresetId.value)
    const audienceId = parseInt(selectedAudienceId.value)
    
    // 获取当前机器人的SN
    const currentSn = getWebSocketSn()
    
    // 调用开始任务接口
    await tourStore.startTourPreset(presetId, {
      audience_id: audienceId,
      robot_sn: currentSn,
      prefer_current_pose: true
    })
    
    // 任务开始成功后，刷新任务运行列表状态
    const token = userStore.token || localStorage.getItem('token') || ''
    if (token) {
      try {
        await websocketDataStore.fetchTourRuns(token)
        console.log('✅ 任务开始后刷新任务列表成功')
      } catch (error) {
        console.warn('❌ 刷新任务列表失败:', error)
      }
    }
    
    alert('任务已成功开始')
    showTaskSelectionDialog.value = false
  } catch (error) {
    console.error('开始任务失败:', error)
    alert('开始任务失败，请重试')
  }
}

// 取消任务选择
const handleCancelTaskSelection = () => {
  showTaskSelectionDialog.value = false
}

// 处理导航开关切换
const handleNavigationToggle = async () => {
  // 如果正在加载中，阻止重复点击
  if (navSwitchLoading.value) {
    return
  }
  
  try {
    // 获取当前展厅名称
    const currentHall = hallStore.halls.find(h => h.id.toString() === selectedHallId.value)
    if (!currentHall) {
      errorMessageText.value = '请先选择展厅'
      showErrorMessage.value = true
      return
    }
    
    // 切换导航状态
    const newNavState = !navEnabled.value
    const action = newNavState ? 1 : 0
    
    // 设置加载状态和对应的文本
    navLoadingText.value = newNavState ? '导航启动中...' : '导航关闭中...'
    navSwitchLoading.value = true
    
    console.log('导航开关切换:', { 
      action, 
      mapName: currentHall.nav_name,
      currentState: navEnabled.value,
      newState: newNavState 
    })
    
    // 获取当前选中的机器人sn或使用默认值
    const currentSn = getWebSocketSn()
    
    // 调用导航开关API，添加timeout参数（默认15秒）
    await navigationApi.navigationSwitch(userStore.token, {
      sn: currentSn,
      map_name: currentHall.nav_name,
      action: action,
      data_name: "default",
      timeout: 15
    })
    
    // API调用成功，显示成功消息并自动消失
    const statusText = newNavState ? '开启成功' : '关闭成功'
    successMessageText.value = `导航${statusText}`
    showSuccessMessage.value = true
    
    // 2秒后自动关闭成功消息
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 2000)
    
  } catch (error) {
    console.error('导航开关切换失败:', error)
    errorMessageText.value = '导航开关切换失败，请重试'
    showErrorMessage.value = true
  } finally {
    // 确保加载状态被清除
    navSwitchLoading.value = false
  }
}

// 关闭错误消息
const closeErrorMessage = () => {
  showErrorMessage.value = false
}

// 关闭成功消息
const closeSuccessMessage = () => {
  showSuccessMessage.value = false
}

// 显示确认对话框
const showConfirmDialog = (title: string, message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    confirmDialogState.value = {
      show: true,
      title,
      message,
      resolve
    }
  })
}

// 关闭确认弹窗
const closeConfirmDialog = (confirmed: boolean) => {
  if (confirmDialogState.value.resolve) {
    confirmDialogState.value.resolve(confirmed)
  }
  confirmDialogState.value = {
    show: false,
    title: '',
    message: '',
    resolve: null
  }
}

// 监听展厅选择变化，更新地图
watch(() => hallStore.selectedHallId, (newHallId) => {
  if (newHallId) {
    console.log('首页展厅选择已同步:', currentHallName.value)
    // 立即重新渲染栅格图
    setTimeout(() => {
      loadAndRenderPGM()
    }, 50)
  }
}, { immediate: false })

// 监听导航状态和当前地图，自动同步展厅选择
watch([navEnabled, () => robotCurrentMap.value?.map_name, hallOptions], ([isNavEnabled, mapName, halls]) => {
  console.log(`首页导航状态变化: navEnabled=${isNavEnabled}, currentMapName=${mapName}`)
  
  if (isNavEnabled && mapName) {
    // 当导航启用且有当前地图时，查找对应的展厅
    const matchingHall = halls.find(hall => hall.name === mapName)
    if (matchingHall && selectedHallId.value !== matchingHall.id) {
      console.log(`首页自动选择展厅: ${matchingHall.name} (${matchingHall.id})`)
      hallStore.setSelectedHall(matchingHall.id)
    }
  }
}, { immediate: true })

// 监听机器人位置变化，实时更新显示
watch(() => getRobotPose(getWebSocketSn()), (newPose) => {
  if (newPose && gridImageData && currentMapOriginInfo) {
    // 当机器人位置更新时，重新绘制
    drawRobotPosition().catch(err => console.warn('绘制机器人位置失败:', err))
  }
}, { immediate: false, deep: true })

// 定期更新机器人位置显示
let robotPositionUpdateTimer: number | null = null

const startRobotPositionUpdate = () => {
  if (robotPositionUpdateTimer) {
    clearInterval(robotPositionUpdateTimer)
  }
  
  robotPositionUpdateTimer = setInterval(() => {
    if (gridImageData && currentMapOriginInfo) {
      drawRobotPosition().catch(err => console.warn('绘制机器人位置失败:', err))
    }
  }, 500) // 每500ms更新一次
}

const stopRobotPositionUpdate = () => {
  if (robotPositionUpdateTimer) {
    clearInterval(robotPositionUpdateTimer)
    robotPositionUpdateTimer = null
  }
}

// 检查任务执行状态并加载任务数据
const checkAndLoadTaskData = async () => {
  try {
    console.log('🔍 检查任务执行状态...')
    
    // 检查按钮是否显示"停止执行任务"（即任务正在执行中）
    if (isTaskExecuting.value) {
      console.log('✅ 检测到任务正在执行，开始加载任务点位数据...')
      
      // 获取当前的token
      const token = userStore.token || localStorage.getItem('token') || ''
      if (!token) {
        console.warn('⚠️ 缺少认证token，无法加载任务数据')
        return
      }

      // 获取当前预设ID（如果有的话）
      const currentPresetId = websocketDataStore.currentTourPresetId
      if (currentPresetId) {
        console.log(`🚀 开始获取任务预设数据 [presetId: ${currentPresetId}]`)
        
        // 调用fetchTourPresetItems获取任务点位数据
        await websocketDataStore.fetchTourPresetItems(currentPresetId, token)
        
        console.log('✅ 任务点位数据加载完成，栅格图将显示任务点位')
        
        // 强制重新渲染栅格图以显示任务点位
        nextTick(() => {
          setTimeout(() => {
            loadAndRenderPGM()
          }, 100)
        })
      } else {
        console.log('ℹ️ 任务正在执行但未找到当前预设ID')
      }
    } else {
      console.log('ℹ️ 当前没有执行中的任务')
    }
  } catch (error) {
    console.error('❌ 检查任务状态失败:', error)
  }
}

// 监听选中机器人的变化，动态更新WebSocket配置
watch(() => robotStore.selectedRobot, async (newRobot, oldRobot) => {
  const oldSn = oldRobot?.sn && oldRobot.sn.trim() ? oldRobot.sn : 'broadcast'
  const newSn = newRobot?.sn && newRobot.sn.trim() ? newRobot.sn : 'broadcast'
  
  // 如果sn发生了变化，更新WebSocket配置
  if (oldSn !== newSn) {
    console.log(`机器人选择变化，WebSocket SN从 ${oldSn} 更新为 ${newSn}`)
    
    try {
      await updateWebSocketConfig({
        sn: newSn,
        kinds: ['pose', 'cmd_status', 'current_map', 'tour'],
        channels: [`robot:${newSn}:speed`]
      })
    } catch (error) {
      console.error('更新WebSocket配置失败:', error)
    }
  }
}, { immediate: false })

// 任务选择弹窗相关状态
const showTaskSelectionDialog = ref(false)
const selectedTaskPresetId = ref<string>('')
const selectedAudienceId = ref<string>('')

// 获取当前展厅的任务预设列表
const currentHallTourPresets = computed(() => {
  if (!selectedHallId.value) return []
  const hallId = parseInt(selectedHallId.value)
  return tourStore.getTourPresetsByHallId(hallId)
})

// 获取讲解对象列表
const availableAudiences = computed(() => 
  guideStore.audiences.map(audience => ({
    id: audience.id,
    name: audience.name
  }))
)

// 设备告警数据
const deviceAlarmData = ref<any[]>([])

// 巡检告警数据
const inspectionAlarmData = ref<any[]>([])

// 获取最新的三条巡检告警数据
const loadLatestInspectionAlerts = async () => {
  try {
    const workspaceId = getCachedWorkspaceId()
    if (!workspaceId) {
      return
    }
    
    // 调用vision API获取巡检告警数据 - API已移除
    // const { visionApi } = await import('../api/services')
    // const response = await visionApi.getAlerts(workspaceId, {
    //   limit: 3,
    //   offset: 0
    // })
    const response: any = null // 临时模拟
    const alerts = response?.alerts as any[] | undefined
    if (alerts && alerts.length) {
      inspectionAlarmData.value = alerts.slice(0, 3)
      // 批量下载缩略图
      downloadThumbnails(alerts.slice(0, 3))
    }
  } catch (err) {
    // 静默处理错误
  }
}

// 获取算法名称
const getAlgorithmName = (targetType: string | number) => {
  // 如果target_type是unknown，显示"无"
  if (targetType === 'unknown' || targetType === 'Unknown') {
    return '无'
  }
  
  const algorithmMap: { [key: string]: string } = {
    '49': '常熟1号线路灯',
    '50': '常熟2号线路灯',
    '51': '常熟3号线路灯',
    '52': '常熟楼宇亮化',
    '9': '人车检测'
  }
  return algorithmMap[targetType?.toString()] || `算法${targetType}`
}

// 图片缓存相关
const thumbCache = ref<Record<string, string>>({})
const thumbLoading = ref<Record<string, string>>({})
const thumbError = ref<Record<string, boolean>>({})

// 获取缩略图URL
const getThumbnailUrl = async (thumbPath: string) => {
  if (!thumbPath) return ''
  if (thumbCache.value[thumbPath]) return thumbCache.value[thumbPath]
  if (thumbLoading.value[thumbPath]) return ''
  
  thumbLoading.value[thumbPath] = 'loading'
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${thumbPath}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'image/*'
      }
    })
    if (!response.ok) throw new Error('缩略图下载失败')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    thumbCache.value[thumbPath] = url
    thumbError.value[thumbPath] = false
    return url
  } catch {
    thumbError.value[thumbPath] = true
    return ''
  } finally {
    thumbLoading.value[thumbPath] = ''
  }
}

// 批量下载缩略图
const downloadThumbnails = async (alerts: any[]) => {
  alerts.forEach((alert: any) => {
    if (alert.thumbnail_image_url) {
      getThumbnailUrl(alert.thumbnail_image_url)
    }
  })
}

// 大图显示相关状态
const bigImageUrl = ref('')
const showBigImage = ref(false)

// 处理巡检告警图片点击
const handleInspectionImageClick = async (markedUrl: string) => {
  if (!markedUrl) return
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${markedUrl}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'image/*'
      }
    })
    if (!response.ok) throw new Error('图片下载失败')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    bigImageUrl.value = url
    showBigImage.value = true
  } catch (e) {
    bigImageUrl.value = ''
    showBigImage.value = false
  }
}

const closeBigImage = () => {
  if (bigImageUrl.value) URL.revokeObjectURL(bigImageUrl.value)
  showBigImage.value = false
  bigImageUrl.value = ''
}

// 使用全局任务进度数据
const waylineProgress = computed(() => taskProgressStore.waylineProgress)
const waylineJobDetail = computed(() => taskProgressStore.waylineJobDetail)

// 监听任务状态变化，确保UI同步更新
watch(() => websocketDataStore.currentTourRun, async (newTourRun, oldTourRun) => {
  console.log('🔄 任务状态变化:', {
    newTourRun,
    oldTourRun,
    status: newTourRun?.status,
    isTaskExecuting: isTaskExecuting.value,
    presetItemsCount: websocketDataStore.tourPresetItems.length
  })
  
  // 检测任务从非运行状态变为运行状态（任务启动）
  const isTaskStarting = (
    newTourRun?.status === 'running' && 
    oldTourRun?.status !== 'running' &&
    websocketDataStore.tourPresetItems.length === 0 // 还没有点位数据
  )
  
  // 检测任务ID变化（说明是新任务）
  const isNewTask = (
    newTourRun?.status === 'running' &&
    newTourRun?.run_id !== oldTourRun?.run_id
  )
  
  // 当检测到任务启动或新任务时，自动加载点位数据
  if (isTaskStarting || isNewTask) {
    console.log('🚀 检测到任务启动，自动加载点位数据...')
    await checkAndLoadTaskData()
  }
}, { deep: true })

// 监听预设ID变化，当任务开始执行时自动加载点位数据
watch(() => websocketDataStore.currentTourPresetId, async (newPresetId, oldPresetId) => {
  console.log('🔄 预设ID变化:', {
    newPresetId,
    oldPresetId,
    currentTourRunStatus: websocketDataStore.currentTourRun?.status,
    presetItemsCount: websocketDataStore.tourPresetItems.length,
    isTaskExecuting: isTaskExecuting.value
  })
  
  // 当预设ID变化，且当前任务正在运行时，自动加载点位数据
  // 放宽条件：即使已有数据也重新加载，因为可能是新任务
  if (newPresetId && newPresetId !== oldPresetId && isTaskExecuting.value) {
    console.log('🚀 检测到新的预设ID且任务正在执行，自动加载点位数据...')
    const token = userStore.token || localStorage.getItem('token') || ''
    if (token) {
      try {
        await websocketDataStore.fetchTourPresetItems(newPresetId, token)
        console.log('✅ 点位数据加载成功，点位数量:', websocketDataStore.tourPresetItems.length)
        // 强制重新渲染栅格图
        nextTick(() => {
          setTimeout(() => {
            loadAndRenderPGM()
          }, 100)
        })
      } catch (error) {
        console.error('❌ 加载点位数据失败:', error)
      }
    } else {
      console.warn('⚠️ 缺少token，无法加载点位数据')
    }
  }
})

// 监听tourPresetItems变化，输出调试信息
watch(() => websocketDataStore.tourPresetItems, (newItems) => {
  console.log('📊 tourPresetItems 数据变化，新的点位数量:', newItems.length)
  if (newItems.length > 0) {
    console.log('📋 点位详情（前3个）:', newItems.slice(0, 3))
  }
}, { deep: true })


// 飞行统计数据
const flightStatistics = ref<any>(null)
const loadingFlightStats = ref(false)
const flightStatsError = ref('')

// 任务完成回调函数
let handleTaskCompletion: (() => void) | null = null

// 设备状态刷新定时器
// 轮询定时器已移除

// 任务动态相关数据 - 从 websocketData store 获取
const taskPoints = computed(() => {
  // 只有当前任务存在且状态为running时，才显示任务点数据
  if (websocketDataStore.currentTourRun && websocketDataStore.currentTourRun.status === 'running') {
    // 优先使用 tourPresetItems（从preset获取的任务点）
    const presetItems = websocketDataStore.tourPresetItems
    if (presetItems && presetItems.length > 0) {
      // 数据已经在 fetchTourPresetItems 中转换为UI需要的格式
      return presetItems
    }
    
    // 向后兼容：如果没有preset数据，尝试使用 tourRunPoints
    const runPoints = websocketDataStore.tourRunPoints
    if (runPoints && runPoints.length > 0) {
      return runPoints
    }
  }
  
  // 如果没有执行中的任务，显示默认提示
  return [{ name: '暂无执行任务', custom_name: '暂无执行任务', zone_name: '--', type: '', status: 'pending' }]
})

// 显示所有任务点（带滚动条）
const displayTaskPoints = computed(() => {
  const points = taskPoints.value
  return points  // 显示所有任务点，不再限制只显示3个
})

// 将类型转换为中文显示
const getPointTypeText = (type: string): string => {
  switch (type) {
    case 'explain':
      return '讲解点'
    case 'action':
      return '辅助点'
    default:
      return type || '未知类型'
  }
}

// 任务进度计算
const taskProgress = computed(() => {
  // 优先使用 WebSocket 实时进度
  if (websocketDataStore.currentTaskProgress) {
    const { current, total } = websocketDataStore.currentTaskProgress
    return Math.round((current / total) * 100)
  }
  
  // 回退到从 API 获取的任务点计算进度
  const points = websocketDataStore.tourRunPoints
  if (!points || points.length === 0) return 0
  
  const completedPoints = points.filter(p => p.status === 'done').length
  return Math.round((completedPoints / points.length) * 100)
})

// 判断是否为当前执行的任务点
const isCurrentTaskPoint = (displayIndex: number): boolean => {
  // 如果有实时任务进度数据，根据当前进度判断高亮哪个点位
  if (websocketDataStore.currentTaskProgress) {
    const { current } = websocketDataStore.currentTaskProgress
    // current 表示当前正在执行的点位序号（从1开始），转换为数组索引（从0开始）
    const actualIndex = current - 1
    // 检查当前执行的点位是否在显示的前3个中
    return displayIndex === actualIndex && actualIndex < 3
  }
  
  // 如果没有实时进度数据，回退到根据status判断
  const points = websocketDataStore.tourRunPoints
  if (!points || points.length === 0) return false
  
  // 找到第一个状态为'arriving'的点位
  const arrivingIndex = points.findIndex(p => p.status === 'arriving')
  // 检查arriving点位是否在显示的前3个中
  return displayIndex === arrivingIndex && arrivingIndex < 3
}

// 获取当前执行任务点的展区名称
const currentTaskZone = computed(() => {
  // 如果有实时任务进度数据
  if (websocketDataStore.currentTaskProgress) {
    const { current } = websocketDataStore.currentTaskProgress
    // current 表示当前正在执行的点位序号（从1开始），转换为数组索引（从0开始）
    const actualIndex = current - 1
    const points = taskPoints.value
    if (points && points.length > actualIndex && actualIndex >= 0) {
      return points[actualIndex].zone_name || '--'
    }
  }
  
  // 如果没有实时进度数据，回退到根据status判断
  const points = websocketDataStore.tourRunPoints
  if (points && points.length > 0) {
    // 找到第一个状态为'arriving'的点位
    const arrivingPoint = points.find(p => p.status === 'arriving')
    if (arrivingPoint) {
      return arrivingPoint.zone_name || '--'
    }
  }
  
  // 如果没有执行中的任务，返回默认值
  return '--'
})

// 任务执行状态 - 基于第一条数据的状态
const isTaskExecuting = computed(() => {
  // 直接基于当前任务的状态，只有running才算执行中
  return websocketDataStore.currentTourRun?.status === 'running'
})

// 监听任务执行状态变化，确保点位数据及时加载
watch(isTaskExecuting, async (executing, wasExecuting) => {
  console.log('🎯 任务执行状态变化:', {
    executing,
    wasExecuting,
    currentPresetId: websocketDataStore.currentTourPresetId,
    presetItemsCount: websocketDataStore.tourPresetItems.length
  })
  
  // 当任务从未执行变为执行中时
  if (executing && !wasExecuting) {
    console.log('🚀 任务开始执行，检查并加载点位数据...')
    // 等待一小段时间，确保presetId已经更新
    await nextTick()
    setTimeout(async () => {
      await checkAndLoadTaskData()
    }, 200)
  }
})

// 导航暂停状态 - 从cmd_status中获取nav_paused字段
const isTaskPaused = computed(() => {
  const currentSn = getWebSocketSn()
  const cmdStatus = getRobotCmdStatus(currentSn)
  
  // 如果没有nav_paused字段，返回false（不更新按钮状态）
  if (cmdStatus && typeof cmdStatus.nav_paused === 'number') {
    return cmdStatus.nav_paused === 1
  }
  
  return false
})

// 暂停/恢复任务执行
const toggleTaskExecution = async () => {
  // 检查导航是否启动
  if (!navEnabled.value) {
    console.warn('⚠️ 导航未启动，无法操作任务')
    return
  }
  
  // 检查是否有正在执行的任务
  if (!isTaskExecuting.value) {
    console.log('ℹ️ 当前没有正在执行的任务')
    return
  }
  
  try {
    const token = userStore.token || localStorage.getItem('token') || ''
    if (!token) {
      console.error('❌ 未登录或token已过期')
      return
    }
    
    const currentSn = getWebSocketSn()
    if (!currentSn || currentSn === 'broadcast') {
      console.error('❌ 无法获取有效的设备SN')
      return
    }
    
    // 根据当前暂停状态决定操作：当前暂停则恢复(0)，当前未暂停则暂停(1)
    const action = isTaskPaused.value ? 0 : 1 // 1=暂停导航，0=恢复导航
    
    console.log(`${action === 1 ? '⏸️ 发送暂停' : '▶️ 发送恢复'}导航指令`)
    
    await navigationApi.pauseResumeNav(token, {
      sn: currentSn,
      action: action,
      timeout: 10
    })
    
    console.log(`✅ ${action === 1 ? '暂停' : '恢复'}导航指令已发送，等待WebSocket状态更新`)
    
    // 不需要手动更新状态，等待WebSocket的cmd_status.nav_paused字段更新
    
  } catch (error) {
    console.error('❌ 暂停/恢复导航失败:', error)
    alert('操作失败，请重试')
  }
}

// 启动任务并设置预设ID的方法
const startTourWithPreset = async (presetId: number) => {
  try {
    console.log(`🎯 启动任务并设置预设ID: ${presetId}`)
    await websocketDataStore.startTourWithPreset(presetId)
    console.log('✅ 预设点位数据加载完成')
  } catch (error) {
    console.error('❌ 启动任务预设失败:', error)
  }
}

// 暴露方法供外部调用
defineExpose({
  startTourWithPreset
})


// 舱盖状态警报声相关
// const previousCoverState = ref<number | undefined>(undefined)
const isAlarmPlaying = ref(false)

// 生成警报声的函数
const createAlarmSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // 设置音频参数
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime) // 800Hz 频率
    oscillator.type = 'sine'
    
    // 设置音量包络
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1)
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
    
    return audioContext
  } catch (error) {
    return null
  }
}

// 播放警报声的函数
const playAlarmSound = () => {
  if (isAlarmPlaying.value) return
  
  isAlarmPlaying.value = true
  let audioContext: AudioContext | null = null
  
  const playBeep = () => {
    if (!isAlarmPlaying.value) return
    
    audioContext = createAlarmSound()
    
    // 1.5秒后播放下一个"滴"
    setTimeout(() => {
      if (isAlarmPlaying.value) {
        playBeep()
      }
    }, 1500)
  }
  
  playBeep()
  
  return () => {
    isAlarmPlaying.value = false
    if (audioContext) {
      audioContext.close()
    }
  }
}

let stopAlarmSound: (() => void) | null | undefined = null



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
  const isInDock = !!droneStatus.value?.inDock
  
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
        const alertsList = response as any[]
        if (alertsList && alertsList.length > 0) {
          allAlerts.push(...alertsList)
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
    const targetStream = getVideoStream(videoType)
    if (!targetStream) {
      alert(`没有找到${getVideoTypeName(videoType)}视频流`)
      return
    }
    
    // 更新当前视频流地址和类型
    videoStreamUrl.value = targetStream.url
    currentVideoType.value = videoType
    
    // 视频流切换完成
    
    // 选择视频后关闭菜单
    gimbalMenuVisible.value = false
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

// 获取航线任务进度数据（现在由全局store管理）
const loadWaylineProgress = async () => {
  try {
    // 检查全局store中是否有任务数据
    if (waylineProgress.value?.job_id) {
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
  return taskProgressStore.taskStatus
})

const waylineProgressPercent = computed(() => {
  return taskProgressStore.taskProgressPercent
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
  const isInDock = !!droneStatus.value?.inDock
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

// 全局点击事件处理函数
const handleGlobalClick = (event: Event) => {
  const target = event.target as HTMLElement
  // 如果点击的不是云台按钮或其菜单内的元素，则关闭菜单
  if (!target.closest('.gimbal-control')) {
    gimbalMenuVisible.value = false
  }
  // 如果点击的不是分屏按钮或其菜单内的元素，则关闭分屏菜单
  if (!target.closest('.right-controls')) {
    showScreenMenu.value = false
  }
  // 点击非清晰度菜单区域时关闭清晰度菜单
  if (!target.closest('.quality-btn') && !target.closest('.quality-menu')) {
    showQualityMenu.value = false
  }
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
// 图表动画定时器
let chartAnimationTimer: number | null = null

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

// 视频播放器相关
const videoStreamUrl = ref<string>('')
const videoPlayer = ref<any>(null)
const videoElement = ref<HTMLVideoElement | null>(null)

// 云台切换相关
const currentVideoType = ref<'dock' | 'drone_visible' | 'drone_infrared'>('dock')
const videoLoading = ref(false)
const gimbalMenuVisible = ref(false)

// 清晰度设置相关状态
const showQualityMenu = ref(false)
const currentQuality = ref<number>(0)
const qualityChanging = ref(false)

// 清晰度菜单样式计算属性
const qualityMenuStyle = computed(() => {
  if (!showQualityMenu.value) return {}
  const button = document.querySelector('.quality-btn') as HTMLElement
  if (!button) return {}
  const rect = button.getBoundingClientRect()
  return {
    top: `${rect.bottom + 4}px`,
    right: `${window.innerWidth - rect.right}px`
  }
})

// 切换清晰度菜单
const toggleQualityMenu = () => {
  showQualityMenu.value = !showQualityMenu.value
}

// 处理清晰度切换
const handleQualityChange = async (quality: number) => {
  if (qualityChanging.value) return
  try {
    const { dockSns } = getCachedDeviceSns()
    if (!dockSns || dockSns.length === 0) {
      alert('未找到可用的机场设备')
      return
    }

    // 从缓存的视频流中推断当前流的 device_sn/camera_index/video_index
    const streams = getVideoStreams()
    const active = streams.find(s => s.type === currentVideoType.value)
    if (!active) {
      alert('未找到当前视频流信息，无法设置清晰度')
      return
    }

    const videoId = `${active.device_sn}/${active.camera_index}/${active.video_index}`

    qualityChanging.value = true
    showQualityMenu.value = false
    const dockSn = dockSns[0]
    const result = await livestreamApi.setQuality(dockSn, { video_id: videoId, video_quality: quality })
    if ((result as any)?.message && (result as any).message.includes('Set livestream quality command sent')) {
      currentQuality.value = quality
    } else {
      const msg = (result as any)?.detail || (result as any)?.message || '清晰度设置失败'
      alert(msg)
    }
  } catch (err: any) {
    alert(err?.message || '清晰度设置失败')
  } finally {
    qualityChanging.value = false
  }
}

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

// 无人机朝向扇形覆盖物集合（此处只使用一个）
const droneHeadingSectors = ref<any[]>([])

// 计算扇形顶点（返回经纬度数组）
const computeSectorPath = (center: [number, number], headingDeg: number, radiusMeters = 60, halfAngleDeg = 25) => {
  if (!amapApiRef) return []
  const AMap = amapApiRef
  const path: [number, number][] = []
  const steps = 16
  const start = headingDeg - halfAngleDeg
  const end = headingDeg + halfAngleDeg
  // 中心点
  path.push(center)
  for (let i = 0; i <= steps; i++) {
    const ang = start + (i * (end - start)) / steps
    const rad = (ang * Math.PI) / 180
    // 粗略将半径从米转近似经纬度偏移（按纬度方向近似）
    const dLat = (radiusMeters / 111320) * Math.cos(rad)
    const dLng = (radiusMeters / (111320 * Math.cos((center[1] * Math.PI) / 180))) * Math.sin(rad)
    path.push([center[0] + dLng, center[1] + dLat])
  }
  return path
}

// 创建无人机朝向扇形
const createHeadingSector = (center: [number, number], headingDeg: number) => {
  if (!amapApiRef) return null
  const AMap = amapApiRef
  const path = computeSectorPath(center, headingDeg)
  if (!path.length) return null
  return new AMap.Polygon({
    path,
    strokeColor: '#ff9900',
    strokeWeight: 2,
    fillColor: 'rgba(255,153,0,0.25)',
    fillOpacity: 0.35,
    zIndex: 120
  })
}

// 获取当前云台偏航角（优先设备状态，其次回退机体航向）
const getCurrentGimbalYaw = (): number => {
  const a = (droneStatus.value?.gimbalYaw ?? null) as number | null
  if (typeof a === 'number' && Number.isFinite(a)) return a
  return (droneStatus.value?.attitude?.head ?? 0) as number
}

// 更新现有扇形（若不存在返回null）
const updateHeadingSector = (center: [number, number], headingDeg: number) => {
  const sector = droneHeadingSectors.value?.[0]
  if (!sector || !amapApiRef) return null
  const path = computeSectorPath(center, headingDeg)
  sector.setPath(path)
  return sector
}

// 添加无人机标记到地图
const addDroneMarker = (longitude: number, latitude: number, droneInfo: any) => {
  if (!amapInstance || !amapApiRef) {
    return
  }

  const AMap = amapApiRef
  
  // 创建无人机标记点（箭头图标，后续通过 rotateAngle 实时旋转）
  const marker = new AMap.Marker({
    position: [longitude, latitude],
    title: `无人机: ${droneInfo?.deviceSn || '未知设备'}`,
    icon: new AMap.Icon({
      image: droneArrowIcon,
      imageSize: new AMap.Size(32, 32),
      size: new AMap.Size(32, 32)
    }),
    // 使用 autoRotation/angle 需要配合 setAngle
    autoRotation: false,
    angle: (droneStatus.value?.attitude?.head ?? 0) as number,
    anchor: 'center',
    offset: new AMap.Pixel(0, 0)
  })

  // 添加点击事件
  marker.on('click', () => {
    // 可以在这里添加更多交互功能，比如显示详细信息
  })

  // 添加到地图
  amapInstance.add(marker)
  droneMarkers.value.push(marker)

  // 添加朝向扇形（仅无人机在线时显示）
  if (droneStatus.value?.isOnline) {
    const heading = getCurrentGimbalYaw()
    const sector = createHeadingSector([longitude, latitude], heading)
    if (sector) {
      amapInstance.add(sector)
      droneHeadingSectors.value = [sector]
    }
  }
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
  // 清除无人机朝向扇形
  if (droneHeadingSectors.value?.length > 0) {
    droneHeadingSectors.value.forEach((poly: any) => {
      if (amapInstance) {
        amapInstance.remove(poly)
      }
    })
    droneHeadingSectors.value = []
  }
}

// 更新地图标记（机场和无人机）
const updateMapMarkers = (shouldCenter = false) => {
  // 清除现有标记
  clearDockMarkers()
  
  // 检查是否有位置数据
  if (position.value && position.value.longitude && position.value.latitude) {
    // 定位数据可用
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
      // 无论位置是否变化，都根据机体航向更新箭头角度
      try {
        const heading = (droneStatus.value?.attitude?.head ?? 0) as number
        const marker = droneMarkers.value[0]
        if (marker) {
          if (typeof (marker as any).setAngle === 'function') {
            ;(marker as any).setAngle(heading)
          } else if (typeof (marker as any).setRotation === 'function') {
            ;(marker as any).setRotation(heading)
          }
        }
      } catch {}
      // 同步更新朝向扇形（仅在线时显示）
      try {
        if (droneStatus.value?.isOnline) {
          const heading = getCurrentGimbalYaw()
          const sector = updateHeadingSector([droneLongitude, droneLatitude], heading)
          if (!sector) {
            const newSector = createHeadingSector([droneLongitude, droneLatitude], heading)
            if (newSector) {
              amapInstance?.add(newSector)
              droneHeadingSectors.value = [newSector]
            }
          }
        } else {
          // 离线则清理扇形
          if (droneHeadingSectors.value?.length > 0) {
            droneHeadingSectors.value.forEach((poly: any) => amapInstance?.remove(poly))
            droneHeadingSectors.value = []
          }
        }
      } catch {}
    }
    
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
  // 从video_streams缓存中获取默认视频流
  const defaultVideoType = getDefaultVideoType()
  
  if (defaultVideoType) {
    const defaultStream = getVideoStream(defaultVideoType)
    
    if (defaultStream) {
      videoStreamUrl.value = defaultStream.url
      currentVideoType.value = defaultVideoType
        // 使用默认视频流
    }
  }
  
  // 由watch(videoStreamUrl)统一触发播放，避免重复拉流
}
// 栅格图渲染：读取 assets/source_data/pgm_data/gridMap.pgm 并绘制到 canvas
const gridCanvas = ref<HTMLCanvasElement | null>(null)
let currentMapOriginInfo: MapOriginInfo | null = null
let gridImageData: ImageData | null = null
// 重试与清理控制，避免断开后无限重试
let homePgmRetryTimer: number | null = null
let homePgmRetryCount = 0
const HOME_PGM_MAX_RETRIES = 100
let isHomeUnmountedFlag = false

const loadAndRenderPGM = async () => {
  try {
    // 等待 DOM 更新完成
    await nextTick()
    
    const canvas = gridCanvas.value
    if (!canvas) {
      console.warn('首页Canvas element not found, retrying...')
      if (isHomeUnmountedFlag) return
      if (homePgmRetryCount >= HOME_PGM_MAX_RETRIES) {
        console.warn('首页Canvas 重试次数达到上限，停止重试')
        return
      }
      if (homePgmRetryTimer != null) return
      homePgmRetryTimer = window.setTimeout(() => {
        homePgmRetryTimer = null
        homePgmRetryCount++
        loadAndRenderPGM()
      }, 100)
      return
    }
    
    // 检查 canvas 是否在 DOM 中且可见
    if (!canvas.isConnected || !canvas.offsetParent) {
      console.warn('首页Canvas not visible, retrying...')
      if (isHomeUnmountedFlag) return
      if (homePgmRetryCount >= HOME_PGM_MAX_RETRIES) {
        console.warn('首页Canvas 可见性重试达到上限，停止重试')
        return
      }
      if (homePgmRetryTimer != null) return
      homePgmRetryTimer = window.setTimeout(() => {
        homePgmRetryTimer = null
        homePgmRetryCount++
        loadAndRenderPGM()
      }, 100)
      return
    }

    // 一旦可见，重置计数器
    homePgmRetryCount = 0

    // 获取当前选中展厅的地图名称
    const currentMapName = getCurrentHomeMapName()
    let buffer: ArrayBuffer

    if (currentMapName) {
      // 尝试从缓存获取或下载地图
      try {
        const currentSn = getWebSocketSn()
        buffer = await downloadAndCacheMap(currentSn, currentMapName, 'gridMap.pgm')
        console.log(`首页使用展厅地图: ${currentMapName}`)
      } catch (error) {
        console.warn(`首页下载展厅地图失败，使用默认地图:`, error)
        // 回退到默认地图
        const url = new URL('../assets/source_data/pgm_data/gridMap.pgm', import.meta.url).href
        const response = await fetch(url)
        buffer = await response.arrayBuffer()
      }
    } else {
      console.warn('首页未找到当前展厅地图名称，使用默认地图')
      // 使用默认地图
      const url = new URL('../assets/source_data/pgm_data/gridMap.pgm', import.meta.url).href
      const response = await fetch(url)
      buffer = await response.arrayBuffer()
    }

    const bytes = new Uint8Array(buffer)
    // 解析 PGM，支持 P2/P5：我们读取头部文本到第三个换行后，再按 maxVal 判断每像素1或2字节
    let header = ''
    let i = 0
    let newlines = 0
    while (i < bytes.length && newlines < 3) {
      const ch = String.fromCharCode(bytes[i++])
      header += ch
      if (ch === '\n') newlines++
    }
    const headerClean = header
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .join('\n')
    const parts = headerClean.split(/\s+/).filter(Boolean)
    const magic = parts[0]
    const width = parseInt(parts[1])
    const height = parseInt(parts[2])
    const maxVal = parseInt(parts[3]) || 255
    const pixelStart = i
    if (!canvas || !width || !height) return
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const imageData = ctx.createImageData(width, height)

    // 同时下载YAML文件获取原点信息
    if (currentMapName) {
      try {
        currentMapOriginInfo = await getMapOriginInfo(getWebSocketSn(), currentMapName)
        console.log('首页地图原点信息:', currentMapOriginInfo)
      } catch (error) {
        console.warn('获取地图原点信息失败:', error)
        currentMapOriginInfo = null
      }
    }
    if (magic === 'P5') {
      const bytesPerSample = maxVal > 255 ? 2 : 1
      let p = pixelStart
      for (let idx = 0; idx < width * height; idx++) {
        let v = 0
        if (bytesPerSample === 1) v = bytes[p++]
        else { v = (bytes[p] << 8) | bytes[p + 1]; p += 2 }
        const c = Math.max(0, Math.min(255, Math.round((v / maxVal) * 255)))
        imageData.data[idx * 4 + 0] = c
        imageData.data[idx * 4 + 1] = c
        imageData.data[idx * 4 + 2] = c
        imageData.data[idx * 4 + 3] = 255
      }
    } else {
      // P2 ASCII
      const text = new TextDecoder().decode(bytes)
      const tokens = text
        .replace(/#.*\n/g, '')
        .trim()
        .split(/\s+/)
      // tokens: magic width height max followed by pixels
      const pixelTokens = tokens.slice(4)
      for (let idx = 0; idx < width * height; idx++) {
        const v = parseInt(pixelTokens[idx] || `${maxVal}`)
        const c = Math.max(0, Math.min(255, Math.round((v / maxVal) * 255)))
        imageData.data[idx * 4 + 0] = c
        imageData.data[idx * 4 + 1] = c
        imageData.data[idx * 4 + 2] = c
        imageData.data[idx * 4 + 3] = 255
      }
    }
    // 将白底黑线的样式映射为附件风格：黑色线条更突出
    for (let k = 0; k < imageData.data.length; k += 4) {
      const g = imageData.data[k]
      if (g < 128) {
        imageData.data[k] = 0
        imageData.data[k + 1] = 0
        imageData.data[k + 2] = 0
      } else {
        imageData.data[k] = 255
        imageData.data[k + 1] = 255
        imageData.data[k + 2] = 255
      }
    }
    ctx.putImageData(imageData, 0, 0)
    // 栅格图交互状态
    let scale = 1
    let offsetX = 0
    let offsetY = 0
    let isDragging = false
    let lastX = 0
    let lastY = 0

    // 初始适配容器：缩放铺满，保持比例，限制在白色背景区域内
    const resize = () => {
      const parent = canvas.parentElement as HTMLElement
      if (!parent) return
      const sw = parent.clientWidth
      const sh = parent.clientHeight
      scale = Math.min(sw / width, sh / height) * 0.8 // 初始缩放为80%，留更多边距
      canvas.style.width = `${Math.floor(width * scale)}px`
      canvas.style.height = `${Math.floor(height * scale)}px`
      // 居中显示
      offsetX = (sw - width * scale) / 2
      offsetY = (sh - height * scale) / 2
      canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`
    }

    // 鼠标滚轮缩放
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      scale = Math.max(0.1, Math.min(10, scale * delta)) // 移除容器限制，范围0.1-10倍
      canvas.style.width = `${Math.floor(width * scale)}px`
      canvas.style.height = `${Math.floor(height * scale)}px`
      canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`
    })

    // 鼠标拖拽移动
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true
      lastX = e.clientX
      lastY = e.clientY
    })

    canvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      const deltaX = e.clientX - lastX
      const deltaY = e.clientY - lastY
      offsetX += deltaX
      offsetY += deltaY
      canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`
      lastX = e.clientX
      lastY = e.clientY
    })

    canvas.addEventListener('mouseup', () => {
      isDragging = false
    })

    canvas.addEventListener('mouseleave', () => {
      isDragging = false
    })

    resize()
    window.addEventListener('resize', resize)

    // 保存栅格图数据以便后续绘制机器人位置
    gridImageData = ctx.getImageData(0, 0, width, height)
    
    // 绘制机器人位置
    drawRobotPosition().catch(err => console.warn('绘制机器人位置失败:', err))
  } catch (e) {
    // 读取失败忽略
  }
}


// 绘制高清机器人图标 - 实心圆 + 外环小白点设计
const drawRobotSVGIcon = async (ctx: CanvasRenderingContext2D, x: number, y: number, theta: number, canvas: HTMLCanvasElement) => {
  // 获取当前缩放比例
  const currentScale = canvas.clientWidth / canvas.width
  
  // 固定视觉大小（像素）
  const visualSize = 20
  const iconSize = visualSize / currentScale // 根据缩放调整实际绘制大小
  
  ctx.save()
  
  // 移动到机器人位置
  ctx.translate(x, y)
  
  // 启用抗锯齿以获得更平滑的渲染
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  
  // 绘制主体实心圆（带阴影效果，无边框）
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
  ctx.shadowBlur = 3 / currentScale
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 1 / currentScale
  
  ctx.fillStyle = '#FF4444'
  
  ctx.beginPath()
  ctx.arc(0, 0, iconSize * 0.4, 0, Math.PI * 2)
  ctx.fill()
  
  // 清除阴影设置
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  
  // 计算小白点位置（在圆内，表示机器人朝向）
  const dotRadius = iconSize * 0.25 // 小白点距离中心的距离（在圆内）
  const dotSize = iconSize * 0.12 // 小白点大小固定为主圆的12%
  const dotX = Math.cos(-theta || 0) * dotRadius // 注意角度方向
  const dotY = Math.sin(-theta || 0) * dotRadius
  
  // 绘制方向指示小白点
  ctx.fillStyle = '#FFFFFF'
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)' // 更淡的边框
  ctx.lineWidth = Math.max(0.2, 0.3 / currentScale)
  
  ctx.beginPath()
  ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  
  ctx.restore()
}

// 绘制任务点位
const drawTaskPoints = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  // 只有当前任务存在且状态为running时，才绘制任务点
  if (!websocketDataStore.currentTourRun || websocketDataStore.currentTourRun.status !== 'running') {
    return
  }
  
  // 获取任务点数据
  const taskPoints = websocketDataStore.tourRunPoints
  if (!taskPoints || taskPoints.length === 0 || !currentMapOriginInfo) {
    return
  }

  // 获取当前缩放比例
  const currentScale = canvas.clientWidth / canvas.width
  
  // 固定视觉大小（像素）
  const visualSize = 8 // 任务点比机器人图标小一些
  const pointSize = visualSize / currentScale // 根据缩放调整实际绘制大小

  ctx.save()
  
  // 启用抗锯齿
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  taskPoints.forEach((point, index) => {
    // 检查点位是否有有效的坐标
    if (typeof point.x !== 'number' || typeof point.y !== 'number') {
      return
    }

    // 转换世界坐标到像素坐标
    const pixelPos = worldToPixel(
      point.x,
      point.y,
      currentMapOriginInfo!,
      canvas.width,
      canvas.height
    )

    // 检查是否在画布范围内
    if (pixelPos.x < 0 || pixelPos.x >= canvas.width || pixelPos.y < 0 || pixelPos.y >= canvas.height) {
      return
    }

    // 根据任务点状态选择颜色
    let fillColor = '#4CAF50' // 绿色 - 待执行
    let strokeColor = '#FFFFFF'
    
    if (point.status === 'done') {
      fillColor = '#2196F3' // 蓝色 - 已完成
    } else if (point.status === 'arriving' || isCurrentTaskPoint(index)) {
      fillColor = '#FF9800' // 橙色 - 正在执行
    }

    // 绘制任务点（带阴影效果）
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 2 / currentScale
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 1 / currentScale

    ctx.fillStyle = fillColor
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = Math.max(0.5, 1 / currentScale)

    ctx.beginPath()
    ctx.arc(pixelPos.x, pixelPos.y, pointSize * 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // 清除阴影设置
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
  })

  ctx.restore()
}

// 绘制机器人位置
const drawRobotPosition = async () => {
  const canvas = gridCanvas.value
  if (!canvas || !gridImageData || !currentMapOriginInfo) {
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 恢复原始栅格图
  ctx.putImageData(gridImageData, 0, 0)

  // 获取当前机器人位置
  const robotPose = getRobotPose(getWebSocketSn())
  if (!robotPose || typeof robotPose.x !== 'number' || typeof robotPose.y !== 'number') {
    return
  }

  // console.log('首页绘制机器人位置:', robotPose)

  // 转换世界坐标到像素坐标
  const pixelPos = worldToPixel(
    robotPose.x,
    robotPose.y,
    currentMapOriginInfo,
    canvas.width,
    canvas.height
  )

  // 检查是否在画布范围内
  if (pixelPos.x < 0 || pixelPos.x >= canvas.width || pixelPos.y < 0 || pixelPos.y >= canvas.height) {
    console.warn('机器人位置超出栅格图范围:', pixelPos)
    return
  }

  // 绘制机器人位置 - 使用高清SVG图标
  await drawRobotSVGIcon(ctx, pixelPos.x, pixelPos.y, robotPose.theta, canvas)
  
  // 绘制任务点位
  await drawTaskPoints(ctx, canvas)
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
      
      // 确保视频加载后也应用样式（元素可能在回调触发时已不存在，需判空）
      videoElement.value.addEventListener('loadeddata', () => {
        const el = videoElement.value
        if (!el) return
        el.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: fill !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;'
      })
    }

    // 检查是否是webrtc地址
    if (videoStreamUrl.value.startsWith('webrtc://')) {
      startWebRTCPlayback()
    } else if (videoStreamUrl.value.startsWith('rtmp://')) {
      
      if (flvjs.isSupported()) {
        
        // 将rtmp地址转换为http-flv地址
        const flvUrl = videoStreamUrl.value.replace(/^rtmp:\/\/[^\/]+/, config.api.domain)
        
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
    vision_threshold: 0.5,
    // 周期任务相关
    enable_recurrence: false,
    recurrence_start_date: '' as string,
    recurrence_end_date: '' as string
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
const handleDispatchTask = async () => {
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

  // 低电量提示（小于30%时给予二次确认）
  const currentBatteryPercent = typeof droneStatus.value?.batteryPercent === 'number' 
    ? Math.round(droneStatus.value.batteryPercent as number) 
    : null
  if (currentBatteryPercent !== null && currentBatteryPercent < 30) {
    const confirmContinue = await showConfirmDialog('电量警告', `当前电量为${currentBatteryPercent}%，低于30%，不建议飞行。是否继续下发任务？`)
    if (!confirmContinue) {
      return
    }
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
    vision_threshold: 0.5,
    enable_recurrence: false,
    recurrence_start_date: '',
    recurrence_end_date: ''
  }
  
  dispatchTaskDialog.value.visible = true
}

// 返回当前本地时间+4分钟（到分钟）的最小值，供 datetime-local 作为最小值
const getMinLocalDateTime = () => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 4)
  const pad = (n: number) => String(n).padStart(2, '0')
  const y = now.getFullYear()
  const m = pad(now.getMonth() + 1)
  const d = pad(now.getDate())
  const hh = pad(now.getHours())
  const mm = pad(now.getMinutes())
  return `${y}-${m}-${d}T${hh}:${mm}`
}

// 返回今天的本地日期 YYYY-MM-DD
const getTodayDate = () => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

// 将Date按本地时间格式化为 YYYY-MM-DDTHH:mm:ss（不带时区）
const formatLocalDateTime = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}`
}
// 下发任务确认
const onDispatchTaskConfirm = async () => {
  const form = dispatchTaskDialog.value.form
  
  // 验证必填字段
  if (!form.name.trim()) {
    alert('请输入任务名称')
    return
  }
  
  if ((form.task_type === 1) && !form.begin_time) {
    alert('定时任务需要设置开始时间')
    return
  }

  // 周期任务校验（仅定时任务）
  if (form.task_type === 1 && form.enable_recurrence) {
    if (!form.recurrence_start_date || !form.recurrence_end_date) {
      alert('请选择周期任务的开始和结束日期')
      return
    }
    const sd = new Date(form.recurrence_start_date)
    const ed = new Date(form.recurrence_end_date)
    const today = new Date(getTodayDate())
    if (sd < today || ed < today) {
      alert('周期任务日期不能早于今天')
      return
    }
    if (sd > ed) {
      alert('周期任务的开始日期不能晚于结束日期')
      return
    }
  }
  
  // 验证定时任务的时间（必须在当前时间4分钟及以后）
  if (form.task_type === 1 && form.begin_time) {
    const selectedTime = new Date(form.begin_time)
    const currentTime = new Date()
    const minTime = new Date(currentTime.getTime() + 4 * 60 * 1000)
    if (selectedTime < minTime) {
      alert('定时任务的开始时间必须在当前时间4分钟及以后')
      return
    }
  }
  
  try {
    const workspaceId = getCachedWorkspaceId()
    if (!workspaceId) {
      alert('未找到workspace_id')
      return
    }
    
    // 构建任务数据
    const taskData: any = {
      ...form,
      // 保留隐藏的字段（使用默认值）
      rth_mode: form.rth_mode || 1,
      out_of_control_action: form.out_of_control_action || 0,
      exit_wayline_when_rc_lost: form.exit_wayline_when_rc_lost || 0,
      wayline_precision_type: form.wayline_precision_type || 1
    }
    
    // 根据任务类型设置execute_time
    if (form.task_type === 0) {
      // 立即任务：使用本地时间字符串（不带时区）
      taskData.execute_time = formatLocalDateTime(new Date())
    } else if (form.task_type === 1 && form.begin_time) {
      // 定时任务：使用选择的本地时间字符串（不带时区）
      taskData.execute_time = form.begin_time.length === 16 ? `${form.begin_time}:00` : form.begin_time
    }
    
    // 创建任务
    // 附加周期任务配置，并将提交的 task_type 改为 3
    if (form.task_type === 1 && form.enable_recurrence) {
      taskData.task_type = 3
      taskData.recurrence_config = {
        recurrence_type: 'date_range',
        start_date: form.recurrence_start_date,
        end_date: form.recurrence_end_date
      }
    }

    const response = await createJob(workspaceId, taskData)
      // 任务创建成功
    
    if (response && response.job_id) {
      // 立即任务需要调用execute接口
      if (form.task_type === 0) {
        try {
          await executeJob(workspaceId, response.job_id, {
            enable_vision: form.enable_vision,
            vision_algorithms: form.vision_algorithms,
            vision_threshold: form.vision_threshold
          })
          alert('立即任务创建并执行成功')
        } catch (executeErr) {
          // 任务执行失败
          alert('立即任务创建成功，但执行失败')
        }
      } else {
        // 定时任务不调用execute接口
        alert('定时任务创建成功')
      }
    } else {
      alert('任务创建成功，但未获取到任务ID')
    }
    
    dispatchTaskDialog.value.visible = false
  } catch (err) {
    // 任务下发失败
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
    
  const confirmed = await showConfirmDialog('取消确认', '确定要取消当前任务吗？')
  if (!confirmed) {
    return
  }
    
    await stopJob(workspaceId, waylineProgress.value.job_id)
    alert('任务取消指令已发送')
    
    // 任务进度由全局store自动更新
  } catch (err) {
    // 取消任务失败
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
    
    // 任务进度由全局store自动更新
  } catch (err) {
    // 航线暂停失败
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
    
    // 任务进度由全局store自动更新
  } catch (err) {
    // 航线恢复失败
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
    
  const confirmed = await showConfirmDialog('取消确认', '确定要取消返航吗？')
  if (!confirmed) {
    return
  }
    
    await cancelReturnHome(workspaceId, dockSns[0])
    alert('取消返航指令已发送')
    
    // 任务进度由全局store自动更新
  } catch (err) {
    // 取消返航失败
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
  const confirmed = await showConfirmDialog('确认操作', '确定要执行一键返航吗？')
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
    // 一键返航失败
    const errorMsg = parseErrorMessage(error)
    alert(`一键返航失败: ${errorMsg}`)
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
  
  // 每隔一段时间刷新动画效果（记录并可在卸载时清理）
  if (chartAnimationTimer) {
    clearInterval(chartAnimationTimer)
    chartAnimationTimer = null
  }
  chartAnimationTimer = setInterval(() => {
    animateCharts();
  }, 10000) as unknown as number;
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
  // 初始化首页
  
  // 设置 WebSocket 数据存储的 token
  const token = userStore.token || localStorage.getItem('token') || ''
  if (token) {
    websocketDataStore.setAuthToken(token)
    console.log('📝 已设置 WebSocket 数据存储的 token')
    
    // 获取任务运行列表，检查是否有正在运行的任务
    try {
      await websocketDataStore.fetchTourRuns(token)
      console.log('✅ 首页任务运行状态检查完成')
    } catch (error) {
      console.warn('❌ 获取任务运行状态失败:', error)
    }
  }
  
  // 注册任务完成回调，用于清空栅格图上的任务点
  handleTaskCompletion = () => {
    console.log('🎯 任务完成回调被触发，重新渲染栅格图清空任务点')
    setTimeout(() => {
      loadAndRenderPGM()
    }, 100) // 稍微延迟以确保数据已清空
  }
  websocketDataStore.onTaskCompletion(handleTaskCompletion)
  
  // 初始化展厅数据
  try {
    await hallStore.fetchHalls()
    console.log('展厅数据初始化完成，当前选中:', currentHallName.value)
  } catch (error) {
    console.warn('获取展厅数据失败:', error)
  }
  
  
  // 初始化警报声（使用Web Audio API生成）
  
  // 获取最新报警数据
  await loadLatestAlarmData()
  
  // 获取最新巡检告警数据
  await loadLatestInspectionAlerts()
  
  // 加载机场状态数据
  await loadDockStatus()
  // 机场状态加载完成
  
  // 加载无人机状态数据
  await loadDroneStatus()
  // 无人机状态加载完成
  
  // 加载航线文件列表
  await loadWaylineFiles()
  
  // 航线任务进度数据现在由全局store管理，无需本地加载
  
  // 加载飞行统计数据
  await loadFlightStatistics(7)
  
  // 初始化展厅选择状态
  hallStore.initSelectedHall()
  console.log('首页加载，当前选中展厅:', hallStore.selectedHallId)

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

  // 渲染栅格图（延迟确保展厅状态已初始化）
  nextTick(() => {
    setTimeout(() => {
      loadAndRenderPGM()
    }, 200)
  })

  // 启动机器人位置更新
  startRobotPositionUpdate()

  // 检查任务执行状态，如果正在执行任务则显示点位和栅格图
  await checkAndLoadTaskData()

  // 添加全局点击事件监听器，用于点击空白处关闭菜单
  document.addEventListener('click', handleGlobalClick)

  window.addEventListener('resize', () => {
    alarmTrendChart?.resize()
    taskPieChart1?.resize()
    taskPieChart2?.resize()
    lineChart?.resize()
  })

  // 开始初始化地图
  
  // 初始化地图
  if (mapContainer.value) {
    // 读取凭据：优先使用通过 vite.define 注入的常量，其次使用 VITE_ 环境变量
    // @ts-ignore
    const definedAmapKey = (typeof __AMAP_KEY__ !== 'undefined' ? __AMAP_KEY__ : '') as string
    // @ts-ignore
    const definedAmapSec = (typeof __AMAP_SECURITY__ !== 'undefined' ? __AMAP_SECURITY__ : '') as string
    const envAmapKey = (import.meta as any).env?.VITE_AMAP_KEY || ''
    const envAmapSec = (import.meta as any).env?.VITE_AMAP_SECURITY || ''
    const amapKey = definedAmapKey || envAmapKey || '6f9eaf51960441fa4f813ea2d7e7cfff'
    const amapSec = definedAmapSec || envAmapSec || ''
    
    if (amapSec) {
      ;(window as any)._AMapSecurityConfig = { securityJsCode: amapSec }
    }
    
    AMapLoader.load({
      key: amapKey,
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
        // 地图加载完成，开始定位
        
        // 地图加载完成后立即尝试定位
        updateMapMarkers(isInitialLoad.value)
        // 标记初始加载完成
        isInitialLoad.value = false
        
        // 如果第一次定位失败，延迟后再次尝试
        setTimeout(() => {
          // 延迟后再次尝试定位
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
  
  // 轮询功能已移除，使用手动刷新或事件驱动更新
})

// 组件卸载时清理
onUnmounted(() => {
  isHomeUnmountedFlag = true
  if (homePgmRetryTimer) {
    clearTimeout(homePgmRetryTimer)
    homePgmRetryTimer = null
  }
  // 移除全局点击事件监听器
  document.removeEventListener('click', handleGlobalClick)
  
  // 移除任务完成回调
  if (handleTaskCompletion) {
    websocketDataStore.offTaskCompletion(handleTaskCompletion)
  }
  
  // 轮询定时器已移除，无需清理
  // 清理图表动画定时器
  if (chartAnimationTimer) {
    clearInterval(chartAnimationTimer)
    chartAnimationTimer = null
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
  
  // 停止并清理警报声
  if (stopAlarmSound) {
    stopAlarmSound()
    stopAlarmSound = null
  }
  isAlarmPlaying.value = false
  
  // 停止机器人位置更新
  stopRobotPositionUpdate()

  // 清理工作完成
})

// 页面激活时重新渲染栅格图（用于处理页面切换后的空白问题）
onActivated(async () => {
  console.log('Home page activated, reloading grid...')
  
  // 页面激活时刷新任务状态
  const token = userStore.token || localStorage.getItem('token') || ''
  if (token) {
    try {
      await websocketDataStore.fetchTourRuns(token)
      console.log('✅ 页面激活时刷新任务状态成功')
    } catch (error) {
      console.warn('❌ 页面激活时刷新任务状态失败:', error)
    }
  }
  
  // 延迟一点时间确保 DOM 完全渲染
  setTimeout(() => {
    loadAndRenderPGM()
  }, 50)
})

// 舱盖状态监听
watch(() => dockStatus.value?.coverState, (newCoverState) => {
  // 只要舱盖不是关闭状态（值不为0）就播放警报声
  if (newCoverState !== 0 && !isAlarmPlaying.value) {
    // 舱盖不是关闭状态，播放警报声
    stopAlarmSound = playAlarmSound()
  }
  // 舱盖状态变为关闭（值为0）时停止警报声
  else if (newCoverState === 0 && isAlarmPlaying.value) {
    // 舱盖关闭，停止警报声
    if (stopAlarmSound) {
      stopAlarmSound()
      stopAlarmSound = null
    }
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

    // 记录上次渲染的任务信息，避免为函数动态挂属性
    const lastWaylineJobId = ref<any>(undefined)
    const lastWaylineTaskStatus = ref<any>(undefined)

    // 显示航点和航线（仅在需要时重绘，避免每次都清空重画）
    const displayWayline = async () => {
  // 检查必要条件
  if (!amapInstance || !amapApiRef || !waylineJobDetail.value) {
    return
  }
  
      // 判断是否需要重绘：
      // 若已存在航线或航点且任务未发生变化，不重复清空与重绘
      const hasWaylineDisplay = waylineMarkers.value.length > 0 || waylinePolyline.value
      const currentJobId = waylineProgress.value?.job_id
      const currentTaskStatus = waylineProgress.value?.status
      // 在 Home 页简化：当没有任何显示或任务ID/状态变化时才重绘
      const shouldRedraw = !hasWaylineDisplay || lastWaylineJobId.value !== currentJobId || lastWaylineTaskStatus.value !== currentTaskStatus
      if (!shouldRedraw) {
        // 仅更新当前航点高亮
        updateCurrentWaypoint()
        return
      }
      // 需要重绘时清理旧图层
      clearWaylineDisplay()
  
  try {
    // 检查waylineJobDetail数据
    
    // 检查是否有waylines数据
    let waylines = waylineJobDetail.value.waylines
    // 获取waylines数据
    
    // 如果没有waylines数据，尝试通过file_id获取航线文件详情
    if (!waylines || waylines.length === 0) {
      // 尝试通过file_id获取航线文件详情
      const workspaceId = getCachedWorkspaceId()
      const fileId = waylineJobDetail.value.file_id
      
      if (workspaceId && fileId) {
        // 获取航线文件详情
        try {
          const waylineDetail = await fetchWaylineDetail(workspaceId, fileId)
          // 航线文件详情获取成功
          waylines = waylineDetail.waylines
          // 从文件详情获取waylines
        } catch (error) {
          // 获取航线文件详情失败
          return
        }
      } else {
        // 缺少workspaceId或fileId
        return
      }
    }
    
    if (!waylines || waylines.length === 0) {
      // 没有找到waylines数据
      return
    }
    
    const wayline = waylines[0] // 取第一个航线
    const waypoints = wayline.waypoints || []
    // 获取waypoints数据
    
    if (waypoints.length === 0) {
      // 没有找到waypoints数据
      return
    }
    
    // 创建航点标记
    const markers: any[] = []
    const path: [number, number][] = []
    
    // 开始创建航点标记
    
    waypoints.forEach((waypoint: any, index: number) => {
      const [wgsLng, wgsLat] = waypoint.coordinates || [0, 0]
      // 处理航点坐标
      
      if (wgsLng && wgsLat) {
        // 将WGS84坐标转换为GCJ-02坐标
        const gcjCoords = transformWGS84ToGCJ02(wgsLng, wgsLat)
        // 坐标转换完成
        
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
        // 航点添加到地图
      } else {
        // 航点坐标无效
      }
    })
    
    waylineMarkers.value = markers
    // 航点标记创建完成
    
    // 创建航线
    // 准备创建航线
    if (path.length > 1) {
      waylinePolyline.value = new amapApiRef.Polyline({
        path: path,
        strokeColor: '#67d5fd',
        strokeWeight: 3,
        strokeOpacity: 0.8,
        strokeStyle: 'solid'
      })
      amapInstance.add(waylinePolyline.value)
      // 航线已添加到地图
      } else {
        // 路径点数不足
      }
      // 记录本次渲染对应的任务ID与状态
      lastWaylineJobId.value = currentJobId
      lastWaylineTaskStatus.value = currentTaskStatus
    
    // 显示当前航点
    updateCurrentWaypoint()
    
  } catch (error) {
    // 显示航线失败
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
        // 当前航点已添加到地图
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
/* 容器样式 - iOS 安全区域适配 */
.home-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 新布局样式：适配 2200x1440，顶部:底部 = 8:2，顶部左:右 = 1:3 */
.tablet-dashboard {
  height: calc(100vh - 84px);
  height: calc(100dvh - 84px); /* 使用动态视口高度，适配移动端 */
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 12px; /* 上下20px，左右12px */
  padding-bottom: max(20px, env(safe-area-inset-bottom)); /* iOS 安全区域适配 */
  gap: 24px;
  box-sizing: border-box;
}

.top-area {
  flex: 8;
  display: flex;
  gap: 16px;
  min-height: 0;
}

/* 左侧列容器：上下排列机器人信息和任务动态 */
.left-column-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
}

.bottom-area {
  flex: 2;
  min-height: 0;
}

.top-left-card,
.top-left-card-2,
.top-right-card,
.bottom-card {
  background: rgba(10, 16, 28, 0.9);
  border: 1px solid rgba(0, 188, 212, 0.18);
  border-radius: 12px;
  padding: 10px;
  height: 100%;
  overflow: hidden;
}

.top-left-card { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
  background-color: transparent;
  border: 0;
  border-radius: 0;
  padding: 0; /* 确保背景与外框左上角对齐 */
  min-height: 0;
}

.top-left-card-2 { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  background-image: url('@/assets/source_data/bg_data/card_first_body.png');
  background-size: 100% 100%;
  background-color: transparent;
  border: 0;
  border-radius: 0;
  padding: 0; /* 确保背景与外框左上角对齐 */
  min-height: 0;
}

/* 机器人信息容器样式 */
.robot-info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px; /* 收窄内边距，给图片更多空间 */
  height: 100%;
}

/* 任务动态容器样式 */
.task-dynamic-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 100%;
  justify-content: space-between; /* 让进度条靠底部显示 */
}

/* 实时任务状态样式 */
.real-time-status {
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
}

.real-time-status .status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.real-time-status .status-title {
  font-weight: 600;
  color: #0096ff;
  font-size: 14px;
}

.real-time-status .task-counter {
  background: rgba(0, 150, 255, 0.2);
  color: #0096ff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.real-time-status .current-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.real-time-status .status-label,
.real-time-status .note-label {
  font-size: 12px;
  color: #666;
  min-width: 60px;
}

.real-time-status .status-value {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.real-time-status .status-value.done {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.real-time-status .status-value.arriving {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.real-time-status .status-value.pending {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
}

.real-time-status .status-value.failed {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.real-time-status .current-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.real-time-status .note-value {
  font-size: 12px;
  color: #888;
  line-height: 1.4;
  flex: 1;
}

/* 左右结构布局 */
.robot-info-layout {
  flex: 1;
  display: flex;
  height: 100%;
  align-items: stretch;
  gap: 12px;
}

.robot-image-section {
  flex: 1.4; /* 略缩小图片区，给右侧更多空间 */
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
}

.robot-image {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
}
.robot-details-section {
  flex: 1 1 0;
  min-width: 0; /* 允许换行，避免被图片挤压 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  word-break: break-word;
}

.robot-detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-label {
  color: #00bcd4;
  font-size: 14px;
  font-weight: 500;
  min-width: 50px;
}

.detail-value {
  color: #fff;
  font-size: 14px;
  font-weight: 400;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #4caf50;
}

.status-dot.online {
  background-color: #2ed573;
  box-shadow: 0 0 4px rgba(46, 213, 115, 0.6);
}

.status-dot.offline {
  background-color: #ff4757;
  box-shadow: 0 0 4px rgba(255, 71, 87, 0.6);
}

.status-text {
  color: #fff;
  font-size: 14px;
  font-weight: 400;
}

/* 状态指示器行：电量和信号强度 */
.status-indicators-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 188, 212, 0.3);
}

.status-indicator-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.status-icon {
  width: 40px;
  height: 20px;
  position: relative;
}

.battery-icon {
  border: 2px solid #00bcd4;
  border-radius: 4px;
  background: transparent;
}

.battery-icon::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 8px;
  background: #00bcd4;
  border-radius: 0 2px 2px 0;
}

.battery-level {
  height: 100%;
  background: linear-gradient(90deg, #4caf50 0%, #8bc34a 50%, #ff9800 80%, #f44336 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.wifi-icon {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
}

.wifi-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
}

.bar {
  background: rgba(0, 188, 212, 0.3);
  border-radius: 1px;
  transition: background-color 0.3s ease;
}

.bar.active {
  background: #00bcd4;
}

.bar1 {
  width: 4px;
  height: 6px;
}

.bar2 {
  width: 4px;
  height: 10px;
}

.bar3 {
  width: 4px;
  height: 14px;
}

.status-percentage {
  color: #00bcd4;
  font-size: 12px;
  font-weight: 500;
}
.top-right-card { 
  flex: 3; 
  display: flex; 
  flex-direction: column; 
  position: relative; 
  background: transparent; 
  border: 0; 
  border-radius: 0; 
  padding: 20px; /* 与旧视频卡片一致的内边距 */
}

/* 使用原视频背景图，在内部添加白色底色区域 */
.top-right-card::before {
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

/* 在背景图内添加白色底色区域 */
.top-right-card::after {
  content: '';
  position: absolute;
  top: 30px;
  left: 30px;
  right: 30px;
  bottom: 30px;
  background: #fff;
  z-index: 2;
  pointer-events: none;
}

.video-wrapper { position: relative; flex: 1; display: flex; flex-direction: column; padding: 0; z-index: 2; }
.gridmap-wrapper { 
  position: absolute; 
  top: 30px; 
  left: 30px; 
  right: 30px; 
  bottom: 30px; 
  display: flex; 
  align-items: flex-start; 
  justify-content: flex-start; 
  z-index: 3; 
  overflow: hidden; 
}
.grid-canvas { display: block; background: #fff; cursor: grab; user-select: none; transform-origin: 0 0; will-change: transform; }
.grid-canvas:active { cursor: grabbing; }
.player_container { flex: 1; position: relative; min-height: 0; }
.player_item { height: 100%; }
.player_box { position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 0; }
.compact-controls { padding: 8px 10px 10px 10px; background: transparent; }

.summary-grid {
  margin-top: 6px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.summary-item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; }
.summary-item .label { color: #8aa0b5; font-size: 13px; margin-bottom: 6px; }
.summary-item .value { color: #fff; font-size: 16px; font-weight: 600; }

.bottom-card { 
  display: flex; 
  flex-direction: column; 
  align-items: stretch;
  position: relative;
  background: transparent;
  border: 1px solid rgba(0, 188, 212, 0.25);
  border-radius: 10px;
  padding: 18px 18px 18px 18px;
  padding-bottom: max(18px, calc(18px + env(safe-area-inset-bottom))); /* iOS 安全区域适配 */
  overflow: hidden;
}
.bottom-card .bottom-panel-title,
.bottom-card .bottom-card-row {
  position: relative;
  z-index: 2;
}

.bottom-panel-title {
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  text-align: center;
  border-radius: 10px 10px 0 0;
  background: #004161;
  height: 32px;
  line-height: 32px;
  width: calc(100% + 2px);
  margin-left: -1px;
  margin-right: -1px;
  margin-top: -1px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0 12px;
}
.bottom-title-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.remote-switch-wrap {
  display: flex;
  align-items: center;
  height: 32px;
  position: relative;
  z-index: 2;
  margin-left: auto;
  margin-right: 8px;
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
  margin-right: 0;
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
.bottom-card-row {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding-top: 16px;
  align-items: center;
}
.mini-card {
  display: flex;
  align-items: center;
  background: rgba(1, 135, 191, 0.30);
  border-radius: 6px;
  padding: 14px 18px;
  min-height: 68px;
  gap: 12px;
  flex: 1;
}
.mini-card-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  filter: brightness(0) invert(1);
}
.mini-card-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.mini-card-title { color: #FFF; font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-card-title.status-normal { color: #4caf50; } /* 定位正常显示绿色 */
.mini-card-title.status-error { color: #f44336; } /* 定位异常显示红色 */
.mini-card-sub { color: #FFF; font-size: 13px; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: .92; }
.start-task-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-radius: 10px;
  background: #16bbf2;
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 600;
  min-width: 160px;
  height: 68px; /* 与 mini-card 视觉高度一致 */
  cursor: pointer;
  transition: all 0.3s ease;
}
.start-task-btn:hover { filter: brightness(1.05); }

/* 停止任务按钮样式 */
.start-task-btn.stop-task {
  background: #f44336;
}
.start-task-btn.stop-task:hover {
  background: #d32f2f;
  filter: brightness(1.05);
}

/* 按钮禁用状态样式 */
.start-task-btn:disabled {
  background: #666;
  cursor: not-allowed;
  opacity: 0.5;
}
.start-task-btn:disabled:hover {
  filter: none;
  background: #666;
}
.bottom-card::before,
.bottom-card::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  height: 2px;
  background: linear-gradient(90deg, rgba(0, 188, 212, 0) 0%, rgba(0, 188, 212, 0.7) 50%, rgba(0, 188, 212, 0) 100%);
  pointer-events: none;
}
.bottom-card::before { top: 0; }
.bottom-card::after { bottom: 0; }

/* 任务点列表样式 */
.task-points-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  max-height: 168px; /* 限制高度，最多显示3个任务点 (3个任务点56px + 2个gap 8px) */
  overflow-y: auto; /* 添加垂直滚动条 */
  padding-right: 4px; /* 为滚动条留出空间 */
}

/* 滚动条样式 */
.task-points-list::-webkit-scrollbar {
  width: 4px;
}

.task-points-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.task-points-list::-webkit-scrollbar-thumb {
  background: rgba(0, 188, 212, 0.6);
  border-radius: 2px;
}

.task-points-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 188, 212, 0.8);
}

.task-point-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(0, 188, 212, 0.2);
  border-radius: 4px;
  padding: 8px 12px;
  transition: all 0.3s ease;
  min-height: 40px;
}

.task-point-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 188, 212, 0.4);
}

.task-point-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.task-point-name {
  color: #00e5ff;
  font-size: 12px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-point-details {
  display: flex;
  flex-direction: row;
  gap: 16px;
  color: #cfe9f3;
  font-size: 14px;
  align-items: center;
  flex-wrap: nowrap;
}

.task-detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

.detail-item {
  display: flex;
  color: #cfe9f3;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.point-type {
  color: #ffd54f;
  font-weight: 500;
}

.task-point-coords span {
  color: #8aa0b5;
}
.task-point-coords span + span::before {
  content: '·';
  margin: 0 6px 0 4px;
  color: #4fa6bf;
}

/* 任务点状态样式 */
.task-point-item.completed {
  background: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.3);
}

.task-point-item.current {
  background: rgba(255, 193, 7, 0.1);
  border-color: rgba(255, 193, 7, 0.4);
}

.task-point-coords .status {
  font-weight: 500;
}

.task-point-item.completed .status {
  color: #4caf50;
}

.task-point-item.current .status {
  color: #ffc107;
}

.task-point-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.done-icon {
  color: #4caf50;
  font-size: 14px;
  font-weight: bold;
}

.task-point-refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  cursor: pointer;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.task-point-refresh:hover {
  background: rgba(0, 188, 212, 0.2);
}

.current-icon {
  width: 12px;
  height: 12px;
  filter: brightness(0) saturate(100%) invert(69%) sepia(100%) saturate(1000%) hue-rotate(180deg) brightness(1) contrast(1);
}

/* 定位图标样式 */
.task-point-location {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.location-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) saturate(100%) invert(43%) sepia(96%) saturate(1000%) hue-rotate(180deg) brightness(1) contrast(1);
  animation: pulse-location 1.5s ease-in-out infinite;
}

@keyframes pulse-location {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* 任务进度部分样式 */
.task-progress-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 188, 212, 0.3);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  color: #00bcd4;
  font-size: 14px;
  font-weight: 500;
}

.pause-resume-btn {
  background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 188, 212, 0.3);
}

.pause-resume-btn:hover {
  background: linear-gradient(135deg, #0097a7 0%, #006064 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 188, 212, 0.4);
}

.pause-resume-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 188, 212, 0.3);
}

.pause-resume-btn.disabled,
.pause-resume-btn:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.pause-resume-btn.disabled:hover,
.pause-resume-btn:disabled:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: none;
  box-shadow: none;
}

.progress-bar-container {
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 16px;
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(0, 188, 212, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50 0%, #8bc34a 50%, #ff9800 80%, #f44336 100%);
  border-radius: 10px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.compact-tabs { margin-top: 6px; }
.compact-table { overflow: auto; flex: 1; }

/* 隐藏旧三列布局的容器（防止干扰空间） */
.left-box, .center-column, .right-column { display: none !important; }
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
  margin: 2vh auto;
  position: relative;
  border: 1px solid #18344a;
  max-height: 85vh;
}

.dispatch-task-modal-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  background: #172233;
  overflow-y: auto;
}

.dispatch-task-title {
  font-size: 24px;
  font-weight: 600;
  color: #67d5fd;
  margin-bottom: 20px;
  text-align: center;
}

.dispatch-task-form {
  margin-bottom: 16px;
}

.dispatch-task-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
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

/* 巡检告警图片样式 */
.target-image-small {
  max-width: 40px;
  max-height: 30px;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 1px solid #164159;
  display: block;
  margin: 0 auto;
}

.target-image-small:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(103, 213, 253, 0.3);
}

.loading-image-small {
  width: 40px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a2a3a;
  border: 1px solid #164159;
  border-radius: 4px;
  font-size: 8px;
  color: #67d5fd;
  text-align: center;
  line-height: 1.2;
}

.no-image {
  color: #666;
  font-size: 12px;
}

/* 调整巡检告警表格列宽 */
/* 巡检告警列宽 - 使用百分比布局 */
.tableOne th:nth-child(1),
.tableOne td:nth-child(1) {
  width: 20%;
}

.tableOne th:nth-child(2),
.tableOne td:nth-child(2) {
  width: 15%;
}

.tableOne th:nth-child(3),
.tableOne td:nth-child(3) {
  width: 10%;
  text-align: center;
}

.tableOne th:nth-child(4),
.tableOne td:nth-child(4) {
  width: 20%;
}

.tableOne th:nth-child(5),
.tableOne td:nth-child(5) {
  width: 35%;
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
  display: block;
  padding: 0;
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

/* 平板新布局中的标题样式保持一致的标题背景 */
.cardTitle--tablet {
  background-image: url('@/assets/source_data/bg_data/card_title.png');
  background-size: 100% 100%;
}

.cardTitle img {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  vertical-align: middle;
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

/* 清晰度设置按钮样式（与无人机控制页一致） */
.quality-btn {
  padding: 4px;
  background: transparent;
  border: none;
  color: #67d5fd;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quality-btn:hover {
  color: #59c0fc;
}

.quality-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 清晰度菜单样式（与无人机控制页一致） */
.quality-menu {
  position: fixed;
  background: rgba(20, 30, 40, 0.95);
  border: 1px solid rgba(89, 192, 252, 0.3);
  border-radius: 6px;
  padding: 4px 0;
  z-index: 99999;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 60px;
}

.quality-menu-item {
  padding: 4px 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.quality-menu-item:hover {
  background: rgba(89, 192, 252, 0.1);
  color: #59C0FC;
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
  padding: 0 10px;
  background-image: url('@/assets/source_data/bg_data/card_second_body_title.png');
  background-size: 100% 100%;
}

.on2-top span {
  padding: 0 12px;
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
  vertical-align: middle;
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

.status-btn.paused {
  width: 60px;
  height: 20px;
  text-align: center;
  color: #faad14;
  background: linear-gradient(#faad1454, #faad1400);
  box-shadow: inset 0 0 6px #faad14;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid #faad14;
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

  .status-btn.waiting,
  .status-btn.paused {
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

/* 导航开关loading遮罩样式 */
.nav-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.nav-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: rgba(22, 34, 51, 0.95);
  border-radius: 12px;
  border: 1px solid #164159;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nav-loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid transparent;
  border-top: 3px solid #67D5FD;
  border-radius: 50%;
  animation: nav-spin 1s linear infinite;
  margin-bottom: 16px;
}

.nav-loading-text {
  color: #67D5FD;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

@keyframes nav-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* WebSocket状态指示器样式 */
.ws-status-indicators {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.ws-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #666;
  font-size: 10px;
  font-weight: bold;
  border: 1px solid #444;
  transition: all 0.3s ease;
  cursor: help;
}

.ws-indicator.connected {
  background: rgba(103, 213, 253, 0.2);
  color: #67D5FD;
  border-color: #67D5FD;
  box-shadow: 0 0 4px rgba(103, 213, 253, 0.4);
}

.ws-indicator:hover {
  transform: scale(1.1);
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

/* 时间提示样式 */
.time-tip {
  font-size: 12px;
  color: #ffa500;
  margin-top: 4px;
  padding: 4px 8px;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 4px;
  line-height: 1.4;
}

/* 大图显示模态框样式 */
.big-image-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.big-image {
  max-width: 80vw;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 4px 24px #000a;
  background: #fff;
}

/* 表格tooltip样式优化 */
.tableOne th[title]:hover::after,
.tableOne td[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  margin-bottom: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.tableOne th[title]:hover::before,
.tableOne td[title]:hover::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
  margin-bottom: -5px;
  z-index: 1000;
  pointer-events: none;
}

/* 确保表格单元格有相对定位，以便tooltip正确定位 */
.tableOne th,
.tableOne td {
  position: relative;
}

/* 可点击展厅样式 */
.clickable-hall {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-hall:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 213, 253, 0.2);
  border-color: rgba(103, 213, 253, 0.3);
}

/* 展厅禁用状态（导航开启时） */
.clickable-hall.hall-disabled {
  cursor: not-allowed;
  opacity: 0.6;
  filter: grayscale(0.3);
}

.clickable-hall.hall-disabled:hover {
  transform: none;
  box-shadow: none;
  border-color: rgba(255, 255, 255, 0.1);
}

/* 展厅选择弹窗样式 */
.custom-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-dialog {
  background: #162333;
  border: 1px solid #2a3b52;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.custom-dialog-title {
  color: #67d5fd;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.custom-dialog-content {
  margin-bottom: 20px;
}

.hall-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

/* 自定义滚动条样式 - 参考点位名称管理弹窗 */
.hall-list::-webkit-scrollbar {
  width: 6px;
}

.hall-list::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.hall-list::-webkit-scrollbar-thumb {
  background: rgba(103, 213, 253, 0.6);
  border-radius: 3px;
}

.hall-list::-webkit-scrollbar-thumb:hover {
  background: rgba(103, 213, 253, 0.8);
}

.hall-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #0c3c56;
  border: 1px solid rgba(38, 131, 182, 0.6);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.hall-item:hover {
  background: #164159;
  border-color: #67d5fd;
}

.hall-item.selected {
  background: rgba(103, 213, 253, 0.1);
  border-color: #67d5fd;
}

.hall-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  filter: brightness(0) saturate(100%) invert(84%) sepia(42%) saturate(729%) hue-rotate(164deg) brightness(95%) contrast(96%);
}

.hall-name {
  color: #fff;
  font-size: 14px;
  flex: 1;
}

.selected-indicator {
  color: #67d5fd;
  font-size: 16px;
  font-weight: bold;
}

.custom-dialog-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.mission-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mission-btn-cancel {
  background: #4a5568;
  color: #fff;
}

.mission-btn-cancel:hover {
  background: #5a6578;
}

/* 首页任务选择弹窗使用标准的add-user-form样式 */
.add-user-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}

.add-user-form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 36px;
}

.add-user-form label {
  min-width: 90px;
  color: #67d5fd;
  font-size: 14px;
  text-align: right;
  flex-shrink: 0;
}

.add-user-form .user-select {
  flex: 1;
  background: #0c3c56;
  border: 1px solid rgba(38, 131, 182, 0.6);
  border-radius: 4px;
  color: #fff;
  padding: 8px 12px;
  font-size: 14px;
  min-height: 36px;
  box-sizing: border-box;
}

.add-user-form .user-select:focus {
  outline: none;
  border-color: #67d5fd;
  box-shadow: 0 0 0 2px rgba(103, 213, 253, 0.15);
}

.add-user-form .custom-select-wrapper {
  position: relative;
  flex: 1;
  width: 100%;
}

.add-user-form .custom-select-wrapper .user-select {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: none;
  padding-right: 32px;
}

.add-user-form .custom-select-arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #67d5fd;
}

.add-user-form .custom-select-arrow svg {
  width: 12px;
  height: 12px;
}

.add-user-form .custom-select-arrow svg polygon {
  fill: #67d5fd;
}

/* 任务选择弹窗按钮样式 */
.custom-dialog[data-dialog="task-selection"] .custom-dialog-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.custom-dialog[data-dialog="task-selection"] .mission-btn {
  min-width: 100px;
  height: 36px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.custom-dialog[data-dialog="task-selection"] .mission-btn-cancel {
  background: rgba(103, 213, 253, 0.1);
  color: #b8c7d9;
  border: 1px solid rgba(103, 213, 253, 0.2);
}

.custom-dialog[data-dialog="task-selection"] .mission-btn-cancel:hover {
  background: rgba(103, 213, 253, 0.2);
  color: #67d5fd;
}

.custom-dialog[data-dialog="task-selection"] .mission-btn-pause {
  background: #67d5fd;
  color: #fff;
}

.custom-dialog[data-dialog="task-selection"] .mission-btn-pause:hover {
  background: #50c7f7;
  box-shadow: 0 2px 8px rgba(103, 213, 253, 0.3);
}

</style>