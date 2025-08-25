<template>
  <div v-if="showTaskCompletionDialog" class="task-completion-dialog-mask">
    <div class="task-completion-dialog">
      <div class="task-completion-header">
        <div class="task-completion-icon" :class="statusIconClass">
          <svg v-if="taskCompletionData?.status === 'completed'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <svg v-else-if="taskCompletionData?.status === 'failed'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </div>
        <div class="task-completion-title">
          {{ taskCompletionData?.status === 'completed' ? '任务执行成功' : '任务执行失败' }}
        </div>
        <button class="task-completion-close" @click="closeDialog">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      
      <div class="task-completion-content">
        <div class="task-info">
          <div class="task-info-row">
            <span class="task-info-label">任务名称：</span>
            <span class="task-info-value">{{ taskCompletionData?.taskName || '--' }}</span>
          </div>
          <div class="task-info-row">
            <span class="task-info-label">执行结果：</span>
            <span class="task-info-value" :class="statusTextClass">
              {{ taskCompletionData?.status === 'completed' ? '执行成功' : '执行失败' }}
            </span>
          </div>
          <div class="task-info-row">
            <span class="task-info-label">异常数量：</span>
            <span class="task-info-value alert-count">
              {{ taskCompletionData?.alertCount || 0 }} 个
            </span>
          </div>
        </div>
        
        <div class="task-completion-actions">
          <button 
            class="task-completion-btn task-completion-btn-primary" 
            :class="{ 'disabled': !canHandle }"
            :disabled="!canHandle"
            @click="goToMissionLogs"
          >
            处理
          </button>
          <button class="task-completion-btn task-completion-btn-secondary" @click="closeDialog">
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTaskProgressStore } from '../stores/taskProgress'
import { useUserStore } from '../stores/user'

const taskProgressStore = useTaskProgressStore()
const userStore = useUserStore()

// 计算属性
const showTaskCompletionDialog = computed(() => {
  return taskProgressStore.showTaskCompletionDialog
})
const taskCompletionData = computed(() => taskProgressStore.taskCompletionData)

const statusIconClass = computed(() => {
  return taskCompletionData.value?.status === 'completed' ? 'success' : 'error'
})

const statusTextClass = computed(() => {
  return taskCompletionData.value?.status === 'completed' ? 'success-text' : 'error-text'
})

// 判断是否可以处理（异常数量大于0）
const canHandle = computed(() => {
  return (taskCompletionData.value?.alertCount || 0) > 0
})

// 方法
const closeDialog = () => {
  taskProgressStore.closeTaskCompletionDialog()
}

const goToMissionLogs = () => {
  taskProgressStore.goToMissionLogs()
}
</script>

<style scoped>
.task-completion-dialog-mask {
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

.task-completion-dialog {
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

.task-completion-header {
  display: flex;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #18344a;
  position: relative;
}

.task-completion-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.task-completion-icon.success {
  background: linear-gradient(135deg, #52c41a, #389e0d);
  color: #fff;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

.task-completion-icon.error {
  background: linear-gradient(135deg, #ff4d4f, #cf1322);
  color: #fff;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.task-completion-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  flex: 1;
}

.task-completion-close {
  background: none;
  border: none;
  color: #8c8c8c;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  width: 32px;
  height: 32px;
}

.task-completion-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.task-completion-content {
  padding: 24px;
}

.task-info {
  margin-bottom: 24px;
}

.task-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid #18344a;
}

.task-info-row:last-child {
  margin-bottom: 0;
}

.task-info-label {
  color: #b8c7d9;
  font-size: 14px;
  min-width: 80px;
  margin-right: 12px;
}

.task-info-value {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.success-text {
  color: #52c41a;
  text-shadow: 0 0 8px rgba(82, 196, 26, 0.3);
}

.error-text {
  color: #ff4d4f;
  text-shadow: 0 0 8px rgba(255, 77, 79, 0.3);
}

.alert-count {
  color: #faad14;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(250, 173, 20, 0.3);
}

.task-completion-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.task-completion-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
}

.task-completion-btn-primary {
  background: linear-gradient(135deg, #67d5fd, #1890ff);
  color: #fff;
  box-shadow: 0 2px 8px rgba(103, 213, 253, 0.3);
}

.task-completion-btn-primary:hover:not(.disabled) {
  background: linear-gradient(135deg, #50c7f7, #096dd9);
  box-shadow: 0 4px 12px rgba(103, 213, 253, 0.4);
  transform: translateY(-1px);
}

.task-completion-btn-primary.disabled {
  background: rgba(103, 213, 253, 0.1);
  color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

.task-completion-btn-primary.disabled:hover {
  background: rgba(103, 213, 253, 0.1);
  box-shadow: none;
  transform: none;
}

.task-completion-btn-secondary {
  background: rgba(103, 213, 253, 0.1);
  color: #b8c7d9;
  border: 1px solid rgba(103, 213, 253, 0.2);
}

.task-completion-btn-secondary:hover {
  background: rgba(103, 213, 253, 0.2);
  color: #67d5fd;
  border-color: rgba(103, 213, 253, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-completion-dialog {
    width: 95%;
    margin: 20px;
  }
  
  .task-completion-header {
    padding: 16px 20px 12px;
  }
  
  .task-completion-content {
    padding: 20px;
  }
  
  .task-completion-title {
    font-size: 18px;
  }
  
  .task-info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .task-info-label {
    min-width: auto;
    margin-right: 0;
  }
  
  .task-completion-actions {
    flex-direction: column;
  }
  
  .task-completion-btn {
    width: 100%;
  }
}
</style>
