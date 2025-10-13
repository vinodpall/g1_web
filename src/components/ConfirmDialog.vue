<template>
  <div v-if="show" class="custom-dialog-mask" @click.self="onCancel">
    <div class="custom-dialog confirm-dialog">
      <div class="custom-dialog-title">{{ title }}</div>
      <div class="custom-dialog-content">
        <div class="confirm-message">
          <div class="confirm-icon">⚠️</div>
          <div class="confirm-text">{{ message }}</div>
        </div>
      </div>
      <div class="custom-dialog-actions">
        <button class="mission-btn mission-btn-stop" @click="onConfirm">{{ confirmText }}</button>
        <button class="mission-btn mission-btn-cancel" @click="onCancel">{{ cancelText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认操作',
  confirmText: '确认',
  cancelText: '取消',
  type: 'warning'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.custom-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  backdrop-filter: blur(2px);
}

.custom-dialog {
  background: linear-gradient(135deg, #1a233a 80%, #16213a 100%);
  border-radius: 18px;
  min-width: 420px;
  max-width: 480px;
  padding: 36px 44px 28px 44px;
  box-shadow: 0 8px 40px #000a, 0 2px 16px #59c0fc33;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideInScale 0.3s ease-out;
}

@keyframes slideInScale {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.custom-dialog-title {
  font-size: 22px;
  color: #67d5fd;
  font-weight: 700;
  margin-bottom: 22px;
  text-align: center;
  letter-spacing: 1px;
}

.custom-dialog-content {
  width: 100%;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.confirm-dialog {
  min-width: 420px;
  max-width: 520px;
}

.confirm-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  width: 100%;
}

.confirm-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.confirm-text {
  color: #b6b6b6;
  font-size: 15px;
  line-height: 1.6;
  flex: 1;
  white-space: pre-wrap;
  word-break: break-word;
}

.custom-dialog-actions {
  display: flex;
  gap: 32px;
  justify-content: center;
  width: 100%;
  margin-top: 8px;
}

.mission-btn {
  padding: 9px 24px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  min-width: 100px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mission-btn-stop {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
  color: #fff;
  border-color: #d32f2f;
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3);
}

.mission-btn-stop:hover {
  background: linear-gradient(135deg, #e53935 0%, #d32f2f 100%);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.5);
  transform: translateY(-1px);
}

.mission-btn-stop:active {
  transform: translateY(0);
}

.mission-btn-cancel {
  background: transparent;
  color: #b6b6b6;
  border: 1px solid #164159;
  box-shadow: 0 0 0 1px #164159 inset;
}

.mission-btn-cancel:hover {
  background: rgba(22, 65, 89, 0.3);
  color: #fff;
  border-color: #16bbf2;
  box-shadow: 0 0 0 1px #16bbf2 inset;
}

.mission-btn-cancel:active {
  transform: scale(0.98);
}
</style>
