<template>
  <div v-if="show" class="permission-denied-mask">
    <div class="permission-denied-dialog">
      <div class="permission-denied-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="24" fill="#FF4D4F" opacity="0.1"/>
          <path d="M24 12C17.373 12 12 17.373 12 24C12 30.627 17.373 36 24 36C30.627 36 36 30.627 36 24C36 17.373 30.627 12 24 12ZM24 34C18.486 34 14 29.514 14 24C14 18.486 18.486 14 24 14C29.514 14 34 18.486 34 24C34 29.514 29.514 34 24 34Z" fill="#FF4D4F"/>
          <path d="M24 16C20.686 16 18 18.686 18 22C18 25.314 20.686 28 24 28C27.314 28 30 25.314 30 22C30 18.686 27.314 16 24 16ZM24 26C21.791 26 20 24.209 20 22C20 19.791 21.791 18 24 18C26.209 18 28 19.791 28 22C28 24.209 26.209 26 24 26Z" fill="#FF4D4F"/>
          <path d="M32 16L30 18L18 30L16 32L18 34L30 22L32 20L32 16Z" fill="#FF4D4F"/>
        </svg>
      </div>
      <div class="permission-denied-title">权限不足</div>
      <div class="permission-denied-content">
        <p>您没有执行此操作的权限</p>
        <p class="permission-detail">所需权限：{{ requiredPermission }}</p>
        <p class="permission-tip">请联系管理员分配相应权限</p>
      </div>
      <div class="permission-denied-actions">
        <button class="permission-btn permission-btn-primary" @click="handleContactAdmin">联系管理员</button>
        <button class="permission-btn permission-btn-secondary" @click="handleClose">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  show: boolean
  requiredPermission?: string
}

const props = withDefaults(defineProps<Props>(), {
  requiredPermission: '未知权限'
})

const emit = defineEmits<{
  close: []
  contactAdmin: []
}>()

const handleClose = () => {
  emit('close')
}

const handleContactAdmin = () => {
  emit('contactAdmin')
}
</script>

<style scoped>
.permission-denied-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.permission-denied-dialog {
  background: linear-gradient(135deg, #1a233a 80%, #16213a 100%);
  border-radius: 16px;
  padding: 32px 40px;
  box-shadow: 0 8px 40px #000a, 0 2px 16px #ff4d4f33;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px;
  width: 90%;
  border: 1px solid #ff4d4f40;
}

.permission-denied-icon {
  margin-bottom: 16px;
}

.permission-denied-title {
  font-size: 20px;
  color: #ff4d4f;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.permission-denied-content {
  text-align: center;
  margin-bottom: 24px;
  color: #fff;
}

.permission-denied-content p {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.5;
}

.permission-detail {
  color: #ff7875;
  font-size: 13px;
  background: rgba(255, 77, 79, 0.1);
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 77, 79, 0.2);
  margin: 12px 0;
}

.permission-tip {
  color: #b6b6b6;
  font-size: 13px;
}

.permission-denied-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.permission-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  min-width: 100px;
}

.permission-btn-primary {
  background: #ff4d4f;
  color: #fff;
}

.permission-btn-primary:hover {
  background: #ff7875;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.permission-btn-secondary {
  background: transparent;
  color: #b6b6b6;
  border: 1px solid #223a5e;
}

.permission-btn-secondary:hover {
  background: rgba(34, 58, 94, 0.3);
  color: #fff;
  border-color: #59c0fc;
}
</style> 