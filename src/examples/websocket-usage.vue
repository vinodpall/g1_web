<!-- WebSocket 数据使用示例 -->
<template>
  <div class="websocket-example">
    <h2>WebSocket 实时数据示例</h2>
    
    <!-- 连接状态 -->
    <div class="connection-status">
      <h3>连接状态</h3>
      <div :class="['status', { connected: isConnected, connecting: isConnecting }]">
        <span v-if="isConnecting">连接中...</span>
        <span v-else-if="isConnected">已连接</span>
        <span v-else>未连接</span>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      
      <div class="controls">
        <button @click="connectWebSocket" :disabled="isConnecting">连接</button>
        <button @click="disconnectWebSocket" :disabled="!isConnected">断开</button>
        <button @click="resetAllData">重置数据</button>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="data-stats">
      <h3>数据统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <label>消息数量:</label>
          <span>{{ dataStats.messageCount }}</span>
        </div>
        <div class="stat-item">
          <label>机器人数量:</label>
          <span>{{ dataStats.robotCount }}</span>
        </div>
        <div class="stat-item">
          <label>在线机器人:</label>
          <span>{{ dataStats.onlineRobotCount }}</span>
        </div>
        <div class="stat-item">
          <label>活跃任务:</label>
          <span>{{ dataStats.activeTourCount }}</span>
        </div>
        <div class="stat-item">
          <label>最后更新:</label>
          <span>{{ formatTime(dataStats.lastMessageTime) }}</span>
        </div>
      </div>
    </div>

    <!-- 机器人列表 -->
    <div class="robots-section">
      <h3>机器人列表</h3>
      <div v-if="robotSNs.length === 0" class="no-data">暂无机器人数据</div>
      <div v-else class="robots-grid">
        <div 
          v-for="sn in robotSNs" 
          :key="sn" 
          class="robot-card"
          :class="{ offline: !isRobotOnline(sn) }"
        >
          <h4>{{ sn }}</h4>
          
          <!-- 位姿信息 -->
          <div v-if="getRobotPose(sn)" class="robot-data">
            <h5>位姿</h5>
            <div class="data-row">
              <span>X: {{ formatPosition(getRobotPose(sn)!.x) }}m</span>
              <span>Y: {{ formatPosition(getRobotPose(sn)!.y) }}m</span>
              <span>角度: {{ formatAngle(getRobotPose(sn)!.theta) }}°</span>
            </div>
            <div class="timestamp">
              {{ formatTimestamp(getRobotPose(sn)!.ts) }}
            </div>
          </div>

          <!-- 建图状态 -->
          <div v-if="getRobotCmdStatus(sn)" class="robot-data">
            <h5>建图状态</h5>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${getRobotSlamProgress(sn) || 0}%` }"
              ></div>
              <span class="progress-text">
                {{ getSlamProgressText(getRobotSlamProgress(sn) || 0) }}
              </span>
            </div>
            
            <!-- 自动收尾状态 -->
            <div v-if="getRobotSlamAutoStatus(sn)" class="slam-auto">
              <div class="auto-stage">
                {{ getSlamAutoStageText(getRobotSlamAutoStatus(sn)!.stage) }}
                <span 
                  v-if="getRobotSlamAutoStatus(sn)!.ok !== null" 
                  :class="['status-indicator', { success: getRobotSlamAutoStatus(sn)!.ok, failed: getRobotSlamAutoStatus(sn)!.ok === false }]"
                >
                  {{ getRobotSlamAutoStatus(sn)!.ok ? '✓' : '✗' }}
                </span>
              </div>
            </div>
          </div>

          <!-- 当前地图 -->
          <div v-if="getRobotCurrentMap(sn)" class="robot-data">
            <h5>当前地图</h5>
            <div>{{ getRobotCurrentMap(sn)!.map_name }}</div>
          </div>

          <!-- 在线状态 -->
          <div class="online-status">
            <span :class="['indicator', { online: isRobotOnline(sn) }]"></span>
            {{ isRobotOnline(sn) ? '在线' : '离线' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 任务运行状态 -->
    <div class="tours-section">
      <h3>任务运行</h3>
      <div v-if="activeTourRuns.length === 0" class="no-data">暂无活跃任务</div>
      <div v-else>
        <div v-for="runId in activeTourRuns.slice(0, 5)" :key="runId" class="tour-card">
          <h4>任务 #{{ runId }}</h4>
          <div class="tour-events">
            <div 
              v-for="(event, index) in getTourRunEvents(parseInt(runId)).slice(-5)" 
              :key="index"
              class="event-item"
              :class="[`event-${event.event}`, `status-${(event as any).status || ''}`]"
            >
              <div class="event-type">{{ getEventTypeText(event.event) }}</div>
              <div v-if="event.event === 'point'" class="event-details">
                点位 {{ event.point_id }} (区域 {{ event.zone_id }}) - {{ getPointStatusText(event.status) }}
              </div>
              <div v-else-if="event.event === 'finished'" class="event-details">
                {{ getFinishedStatusText(event.status) }}
                <span v-if="event.error"> - {{ event.error }}</span>
              </div>
              <div v-else-if="event.event === 'started'" class="event-details">
                机器人: {{ event.robot_sn }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 配置区域 -->
    <div class="config-section">
      <h3>配置</h3>
      <div class="config-form">
        <div class="form-row">
          <label>机器人 SN:</label>
          <input v-model="configSN" placeholder="broadcast">
        </div>
        <div class="form-row">
          <label>订阅类型:</label>
          <div class="checkbox-group">
            <label><input type="checkbox" v-model="configKinds" value="pose"> 位姿</label>
            <label><input type="checkbox" v-model="configKinds" value="cmd_status"> 状态</label>
            <label><input type="checkbox" v-model="configKinds" value="current_map"> 地图</label>
          </div>
        </div>
        <button @click="updateConfig">更新配置</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWebSocketData } from '@/composables/useWebSocketData'
import { 
  formatPosition, 
  formatTimestamp, 
  radiansToDegrees,
  getSlamProgressText,
  getSlamAutoStageText,
  getPointStatusText,
  getFinishedStatusText
} from '@/utils/websocketParser'

// 使用 WebSocket 数据
const {
  // 连接状态
  isConnected,
  isConnecting,
  error,
  
  // 数据统计
  dataStats,
  
  // 机器人数据
  robotSNs,
  getRobotPose,
  getRobotCmdStatus,
  getRobotCurrentMap,
  getRobotSlamProgress,
  getRobotSlamAutoStatus,
  isRobotOnline,
  
  // 任务数据
  activeTourRuns,
  getTourRunEvents,
  
  // 方法
  connectWebSocket,
  disconnectWebSocket,
  resetAllData,
  updateWebSocketConfig
} = useWebSocketData()

// 配置表单
const configSN = ref('broadcast')
const configKinds = ref(['pose', 'cmd_status', 'current_map'])

// 格式化方法
function formatTime(date: Date | null): string {
  return date ? date.toLocaleTimeString('zh-CN') : '无'
}

function formatAngle(radians: number): string {
  return radiansToDegrees(radians).toFixed(1)
}

function getEventTypeText(event: string): string {
  switch (event) {
    case 'started': return '开始'
    case 'point': return '点位'
    case 'finished': return '完成'
    default: return event
  }
}

// 更新配置
async function updateConfig() {
  await updateWebSocketConfig({
    sn: configSN.value || 'broadcast',
    kinds: configKinds.value
  })
}
</script>

<style scoped>
.websocket-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.connection-status {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.status {
  font-weight: bold;
  margin-bottom: 10px;
}

.status.connected {
  color: #28a745;
}

.status.connecting {
  color: #ffc107;
}

.error {
  color: #dc3545;
  margin-bottom: 10px;
}

.controls button {
  margin-right: 10px;
  padding: 8px 16px;
  border: 1px solid #007bff;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.data-stats, .robots-section, .tours-section, .config-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.robots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.robot-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
}

.robot-card.offline {
  opacity: 0.6;
  border-color: #dc3545;
}

.robot-data {
  margin-bottom: 10px;
}

.robot-data h5 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #666;
}

.data-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.data-row span {
  font-size: 12px;
  background: white;
  padding: 2px 6px;
  border-radius: 3px;
}

.timestamp {
  font-size: 11px;
  color: #999;
  margin-top: 5px;
}

.progress-bar {
  position: relative;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #28a745;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: #333;
}

.slam-auto {
  margin-top: 5px;
}

.auto-stage {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
}

.status-indicator {
  font-weight: bold;
}

.status-indicator.success {
  color: #28a745;
}

.status-indicator.failed {
  color: #dc3545;
}

.online-status {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  font-size: 12px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dc3545;
}

.indicator.online {
  background: #28a745;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 20px;
}

.tour-card {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
}

.tour-events {
  margin-top: 10px;
}

.event-item {
  padding: 8px;
  margin-bottom: 5px;
  border-left: 3px solid #ddd;
  background: white;
  border-radius: 0 4px 4px 0;
  font-size: 12px;
}

.event-item.event-started {
  border-left-color: #007bff;
}

.event-item.event-point {
  border-left-color: #ffc107;
}

.event-item.event-finished {
  border-left-color: #28a745;
}

.event-type {
  font-weight: bold;
  margin-bottom: 2px;
}

.event-details {
  color: #666;
}

.config-form {
  max-width: 400px;
}

.form-row {
  margin-bottom: 15px;
}

.form-row label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-row input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkbox-group {
  display: flex;
  gap: 15px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
}

.config-form button {
  padding: 8px 16px;
  border: 1px solid #007bff;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>