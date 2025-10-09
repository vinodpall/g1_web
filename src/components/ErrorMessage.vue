<template>
  <div v-if="show" class="error-message-overlay">
    <div class="error-message-dialog">
      <div class="error-message-content">{{ message }}</div>
      <button class="error-btn" @click="close">确定</button>
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
  z-index: 10000;
}

.error-message-dialog {
  background: rgba(255, 59, 48, 0.95);
  padding: 20px 32px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: slideInScale 0.3s ease-out;
  min-width: 280px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

@keyframes slideInScale {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.error-message-content {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  line-height: 1.5;
}

.error-btn {
  padding: 8px 24px;
  border: 1px solid #fff;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.error-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.error-btn:active {
  transform: translateY(0);
}
</style>
