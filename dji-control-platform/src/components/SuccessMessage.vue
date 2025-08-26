<template>
  <div v-if="show" class="success-message-overlay" @click.self="close">
    <div class="success-message-dialog">
      <div class="success-message-content">{{ message }}</div>
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
.success-message-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.success-message-dialog {
  background: rgba(0, 0, 0, 0.72);
  border-radius: 6px;
  padding: 12px 18px;
  min-width: 140px;
  max-width: 240px;
}

.success-message-content {
  color: #ffffff;
  font-size: 14px;
  text-align: center;
}
</style>