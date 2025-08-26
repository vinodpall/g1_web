<template>
  <div v-if="show" class="permission-denied-mask" @click="handleMaskClick">
    <div class="permission-denied-dialog" @click.stop>
      <button class="permission-close-btn" aria-label="关闭" @click="handleClose">×</button>
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
        <p class="permission-detail">所需权限：{{ requiredPermissionName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissionStore } from '../stores/permission'
import { mapFrontendToBackendPermissions } from '../utils/permissionMapper'

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

const permissionStore = usePermissionStore()

const requiredPermissionName = computed(() => {
  const allPermissions = permissionStore.getAllPermissions
  const frontend = props.requiredPermission ? [props.requiredPermission] : []
  const backendCodes = mapFrontendToBackendPermissions(frontend as string[], allPermissions as any)
  if (backendCodes.length > 0) {
    const match = (allPermissions as any).find((p: any) => p.permission_code === backendCodes[0])
    if (match) return match.permission_name
  }
  return props.requiredPermission || '未知权限'
})

const handleClose = () => {
  emit('close')
}

// 点击遮罩关闭
const handleMaskClick = () => {
  emit('close')
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
  align-items: flex-start;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.permission-denied-dialog {
  margin-top: 28vh;
}

.permission-denied-dialog {
  background: linear-gradient(135deg, #1a233a 80%, #16213a 100%);
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 8px 40px #000a, 0 2px 16px #ff4d4f33;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 360px;
  width: 86%;
  border: 1px solid #ff4d4f40;
  position: relative;
}

.permission-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: #ff4d4f;
  font-size: 22px;
  cursor: pointer;
}

.permission-denied-icon {
  margin-bottom: 12px;
}

.permission-denied-title {
  font-size: 18px;
  color: #ff4d4f;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
}

.permission-denied-content {
  text-align: center;
  margin-bottom: 12px;
  color: #fff;
}

.permission-denied-content p {
  margin: 6px 0;
  font-size: 13px;
  line-height: 1.5;
}

.permission-detail {
  color: #ff7875;
  font-size: 12px;
  background: rgba(255, 77, 79, 0.1);
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 77, 79, 0.2);
  margin: 10px 0;
}

.permission-tip { display: none; }
.permission-denied-actions { display: none; }
</style> 