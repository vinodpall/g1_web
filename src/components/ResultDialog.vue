<template>
  <div v-if="show" class="result-overlay" @click.self="onClose">
    <div class="result-dialog">
      <button class="result-close" @click="onClose">×</button>
      <div class="result-header" :class="type">
        <div class="result-icon" :class="type">
          <span v-if="type === 'success'">✔</span>
          <span v-else-if="type === 'error'">✖</span>
          <span v-else>ℹ</span>
        </div>
        <div class="result-title">
          <span class="title-text">{{ titleText }}</span>
        </div>
      </div>
      <div class="result-content">
        <div v-if="message" class="result-message">{{ message }}</div>
        <div v-if="details" class="result-details">
          <pre>{{ details }}</pre>
        </div>
      </div>
      <div class="result-actions">
        <button class="result-btn" @click="onClose">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  show: boolean
  type?: 'success' | 'error' | 'info'
  title?: string
  message: string
  details?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: ''
})

const emit = defineEmits<{ close: [] }>()

const titleText = computed(() => {
  if (props.title) return props.title
  if (props.type === 'success') return '操作成功'
  if (props.type === 'error') return '操作失败'
  return '提示'
})

const onClose = () => emit('close')
</script>

<style scoped>
.result-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.result-dialog {
  position: relative;
  width: 380px;
  max-width: 86vw;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(23,30,49,0.98), rgba(16,22,38,0.98));
  border: 1px solid rgba(99, 216, 255, 0.18);
  box-shadow: 0 12px 32px rgba(0,0,0,0.35);
}

.result-close {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  color: #e6e6e6;
  cursor: pointer;
}
.result-close:hover { background: rgba(255,255,255,0.16); }

.result-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 24px 10px 24px;
}

.result-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
}
.result-icon.success { background: #2f9e44; }
.result-icon.error { background: #c92a2a; }
.result-icon.info { background: #2b77ff; }

.result-title {
  font-size: 18px;
  color: #e9f3ff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-text { font-weight: 600; letter-spacing: 0.2px; }
.inline-message { color: #cfe7ff; opacity: 0.95; }

.result-content {
  padding: 8px 24px 14px 24px;
}
.result-message {
  font-size: 15px;
  color: #e9f3ff;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 4px;
}
.result-details {
  margin-top: 10px;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  padding: 10px 12px;
  color: #cbd5e1;
  max-height: 180px;
  overflow: auto;
}
.result-details pre { 
  margin: 0; 
  white-space: pre-wrap; 
  word-break: break-all; 
}

.result-actions {
  display: flex;
  justify-content: center;
  padding: 6px 24px 18px 24px;
}
.result-btn {
  min-width: 112px;
  height: 34px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.08);
  color: #e6e6e6;
  cursor: pointer;
}
.result-btn:hover { background: rgba(255,255,255,0.16); }
</style>
