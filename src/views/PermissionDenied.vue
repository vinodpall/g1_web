<template>
  <div class="permission-denied-page">
    <div class="permission-denied-container">
      <div class="permission-denied-icon">🔒</div>
      <h1 class="permission-denied-title">权限不足</h1>
      <p class="permission-denied-message">
        您没有访问此页面的权限<br>
        请联系管理员开通相应权限
      </p>
      
      <!-- 显示具体权限信息 -->
      <div v-if="requiredPermissionName" class="permission-details">
        <p class="permission-details-title">所需权限：</p>
        <div class="permission-details-list">
          <span class="permission-detail-item">{{ requiredPermissionName }}</span>
        </div>
      </div>
      
      <div class="permission-denied-actions">
        <button class="permission-denied-btn" @click="goHome">返回首页</button>
        <button class="permission-denied-btn secondary" @click="goBack">返回上页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePermissionStore } from '../stores/permission'

const router = useRouter()
const route = useRoute()
const permissionStore = usePermissionStore()

// 从路由参数获取权限信息
const requiredPermission = computed(() => route.query.requiredPermission as string)
const targetPath = computed(() => route.query.targetPath as string)

// 获取权限的中文名称
const requiredPermissionName = computed(() => {
  if (!requiredPermission.value) return ''
  
  const allPermissions = permissionStore.getAllPermissions
  const permission = allPermissions.find(p => p.permission_code === requiredPermission.value)
  
  return permission ? permission.permission_name : requiredPermission.value
})

const goHome = () => {
  router.push('/dashboard/home')
}

const goBack = () => {
  if (targetPath.value) {
    // 如果有目标路径，尝试返回
    router.go(-1)
  } else {
    // 否则返回首页
    router.push('/dashboard/home')
  }
}
</script>

<style scoped>
.permission-denied-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2332 0%, #2a3a4a 100%);
  color: #fff;
}

.permission-denied-container {
  text-align: center;
  padding: 40px;
  max-width: 500px;
}

.permission-denied-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: pulse 2s infinite;
}

.permission-denied-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ff6b6b;
}

.permission-denied-message {
  font-size: 16px;
  line-height: 1.6;
  color: #b6b6b6;
  margin-bottom: 32px;
}

.permission-details {
  margin: 20px 0;
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid rgba(255, 77, 79, 0.2);
  border-radius: 8px;
  padding: 16px;
}

.permission-details-title {
  color: #ff7875;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.permission-details-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.permission-detail-item {
  display: inline-block;
  background: rgba(255, 77, 79, 0.2);
  color: #ff7875;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  white-space: nowrap;
  font-family: 'Courier New', monospace;
}

.permission-denied-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.permission-denied-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #16bbf2;
  color: #fff;
}

.permission-denied-btn:hover {
  background: #0d8bb8;
  transform: translateY(-2px);
}

.permission-denied-btn.secondary {
  background: transparent;
  border: 1px solid #4a5a6a;
  color: #b6b6b6;
}

.permission-denied-btn.secondary:hover {
  background: #2a3a4a;
  border-color: #5a6a7a;
  color: #fff;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
