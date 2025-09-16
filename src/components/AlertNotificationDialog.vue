<template>
  <div v-if="showAlertDialog" class="alert-notification-dialog-mask">
    <div class="alert-notification-dialog">
      <div class="alert-notification-header">
        <div class="alert-notification-icon warning">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L1 21h22L12 2zm0 3.17L19.83 19H4.17L12 5.17zM11 16h2v2h-2zm0-6h2v4h-2z"/>
          </svg>
        </div>
        <div class="alert-notification-title">
          <span class="warning-text">报警提醒</span>
        </div>
      </div>
      
      <div class="alert-notification-content">
        <div class="alert-notification-message">
          {{ alertData?.message_zh || '检测到新的HMS报警信息' }}
        </div>
        
        <div class="alert-notification-details" v-if="alertData">
          <div class="alert-detail-item">
            <span class="detail-label">设备类别:</span>
            <span class="detail-value">{{ alertData.deviceType || '未知设备' }}</span>
          </div>
          <div class="alert-detail-item">
            <span class="detail-label">设备SN:</span>
            <span class="detail-value">{{ alertData.device_sn }}</span>
          </div>
          <div class="alert-detail-item">
            <span class="detail-label">报警等级:</span>
            <span class="detail-value warning-text">{{ getAlertLevelText(alertData.level) }}</span>
          </div>
          <div class="alert-detail-item">
            <span class="detail-label">报警时间:</span>
            <span class="detail-value">{{ formatTime(alertData.create_time) }}</span>
          </div>
          <div class="alert-detail-item" v-if="alertData.hms_key">
            <span class="detail-label">报警代码:</span>
            <span class="detail-value">{{ alertData.hms_key }}</span>
          </div>
        </div>
      </div>
      
      <div class="alert-notification-actions">
        <button class="alert-notification-btn alert-notification-btn-secondary" @click="viewAlarmLog">
          查看详情
        </button>
        <button class="alert-notification-btn alert-notification-btn-primary" @click="confirmAlert">
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAlertNotificationStore } from '../stores/alertNotification'

const router = useRouter()
const alertNotificationStore = useAlertNotificationStore()

// 计算属性
const showAlertDialog = computed(() => alertNotificationStore.showAlertDialog)
const alertData = computed(() => alertNotificationStore.alertData)

// 获取报警等级文本
const getAlertLevelText = (level: number) => {
  const levelMap: Record<number, string> = {
    0: '通知',
    1: '提醒',
    2: '警告'
  }
  return levelMap[level] || `等级${level}`
}

// 格式化时间
const formatTime = (timestamp: number) => {
  if (!timestamp) return ''
  const date = new Date(timestamp) // HMS报警的create_time是毫秒级时间戳
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 查看报警日志
const viewAlarmLog = () => {
  alertNotificationStore.closeAlertDialog()
  router.push('/dashboard/alarm-log')
}

// 确认报警
const confirmAlert = () => {
  alertNotificationStore.closeAlertDialog()
}
</script>

<style scoped>
.alert-notification-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.alert-notification-dialog {
  background: #172233;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid #18344a;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow: hidden;
  animation: dialogSlideIn 0.3s ease-out;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.alert-notification-header {
  display: flex;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #18344a;
  position: relative;
}

.alert-notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.alert-notification-icon.warning {
  background: rgba(250, 173, 20, 0.1);
  color: #faad14;
}

.alert-notification-icon svg {
  width: 24px;
  height: 24px;
}

.alert-notification-title {
  flex: 1;
}

.alert-notification-title span {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.warning-text {
  color: #faad14 !important;
}

.alert-notification-content {
  padding: 20px 24px;
}

.alert-notification-message {
  font-size: 16px;
  line-height: 1.5;
  color: #ffffff;
  margin-bottom: 16px;
}

.alert-notification-details {
  background: rgba(24, 52, 74, 0.3);
  border-radius: 8px;
  padding: 16px;
}

.alert-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.alert-detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  min-width: 60px;
}

.detail-value {
  font-size: 14px;
  color: #ffffff;
  text-align: right;
  flex: 1;
  margin-left: 16px;
}

.alert-notification-actions {
  display: flex;
  justify-content: center;
  padding: 16px 24px 20px;
  gap: 12px;
}

.alert-notification-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.alert-notification-btn-secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid #18344a;
  box-shadow: 0 2px 8px rgba(24, 52, 74, 0.3);
}

.alert-notification-btn-secondary:hover {
  background: rgba(24, 52, 74, 0.2);
  border-color: #67d5fd;
  box-shadow: 0 4px 12px rgba(103, 213, 253, 0.2);
  transform: translateY(-1px);
}

.alert-notification-btn-secondary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(24, 52, 74, 0.3);
}

.alert-notification-btn-primary {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
  color: #000000;
  box-shadow: 0 2px 8px rgba(250, 173, 20, 0.3);
}

.alert-notification-btn-primary:hover {
  background: linear-gradient(135deg, #ffc53d 0%, #faad14 100%);
  box-shadow: 0 4px 12px rgba(250, 173, 20, 0.4);
  transform: translateY(-1px);
}

.alert-notification-btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(250, 173, 20, 0.3);
}
</style>
