<template>
  <div v-if="show" class="error-message-overlay">
    <div class="error-message-dialog">
      <div class="error-message-header">
        <span class="error-icon">⚠️</span>
        <span class="error-title">操作失败</span>
      </div>
      <div class="error-message-content">
        {{ message }}
      </div>
      <div class="error-message-actions">
        <button class="error-btn error-btn-primary" @click="close">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  message: string
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}
</script>

<style scoped>
.error-message-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.error-message-dialog {
  background: #1a2332;
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  padding: 24px;
  min-width: 300px;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
}

.error-message-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.error-icon {
  font-size: 20px;
}

.error-title {
  color: #ff6b6b;
  font-size: 18px;
  font-weight: 600;
}

.error-message-content {
  color: #b6b6b6;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.error-message-actions {
  display: flex;
  justify-content: center;
}

.error-btn {
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.error-btn-primary {
  background: #ff6b6b;
  color: #fff;
}

.error-btn-primary:hover {
  background: #ff5252;
  transform: translateY(-1px);
}
</style>
