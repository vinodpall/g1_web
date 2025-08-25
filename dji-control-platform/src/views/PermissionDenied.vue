<template>
  <div class="permission-denied-page">
    <div class="permission-denied-container">
      <div class="permission-denied-icon">🔒</div>
      <h1 class="permission-denied-title">权限不足</h1>
      <p class="permission-denied-message">
        您没有访问此页面的权限<br>
        请联系管理员开通相应权限
      </p>
      <div class="permission-denied-actions">
        <button class="permission-denied-btn" @click="goHome">返回首页</button>
        <button class="permission-denied-btn secondary" @click="goBack">返回上页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard/home')
}

const goBack = () => {
  router.go(-1)
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
