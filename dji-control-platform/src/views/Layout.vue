<template>
  <div class="layout-container">
    <div class="header">
      <div class="header-left">
        <img src="/src/assets/source_data/logio-DoB1IvgI.png" alt="logo" class="logo" />
        <span class="title">无人机管控平台</span>
      </div>
      
      <nav class="nav-menu">
        <router-link to="/dashboard" class="nav-item" :class="{ active: $route.path === '/dashboard' }">
          首页
        </router-link>
        <router-link to="/dashboard/control" class="nav-item" :class="{ active: $route.path === '/dashboard/control' }">
          无人机控制
        </router-link>
        <router-link to="/dashboard/mission" class="nav-item" :class="{ active: $route.path.includes('mission') }">
          任务管理
        </router-link>
        <router-link to="/dashboard/device-manage" class="nav-item" :class="{ active: $route.path === '/dashboard/device-manage' }">
          设备管理
        </router-link>
        <router-link to="/dashboard/users" class="nav-item" :class="{ active: $route.path.includes('users') || $route.path.includes('roles') }">
          系统管理
        </router-link>
      </nav>
      
      <div class="header-right">
        <select v-model="selectedDockId" @change="handleDockChange" class="dock-selector">
          <option v-for="dock in availableDocks" :key="dock.id" :value="dock.id">
            {{ dock.name }}
          </option>
        </select>
        
        <div class="user-info">
          <img :src="user?.avatar" alt="avatar" class="avatar" />
          <span class="username">{{ user?.name }}</span>
          <button @click="handleLogout" class="logout-btn">退出</button>
        </div>
      </div>
    </div>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useDeviceStore } from '@/stores/device'

const router = useRouter()
const userStore = useUserStore()
const deviceStore = useDeviceStore()

const user = computed(() => userStore.user)
const availableDocks = computed(() => deviceStore.availableDocks)
const selectedDockId = computed({
  get: () => deviceStore.selectedDockId,
  set: (value) => deviceStore.setSelectedDock(value)
})

const handleDockChange = () => {
  // 机巢切换后可以触发一些全局更新
  console.log('机巢已切换到:', selectedDockId.value)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background: #0a0f1c;
}

.header {
  height: 60px;
  background: linear-gradient(90deg, #1a2332 0%, #0f1419 100%);
  border-bottom: 1px solid rgba(0, 188, 212, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 40px;
  height: 40px;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #00bcd4;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-item {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #00bcd4;
  background: rgba(0, 188, 212, 0.1);
}

.nav-item.active {
  color: #00bcd4;
  background: rgba(0, 188, 212, 0.2);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dock-selector {
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 188, 212, 0.3);
  border-radius: 4px;
  color: #ffffff;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.username {
  color: #ffffff;
  font-size: 0.9rem;
}

.logout-btn {
  padding: 0.25rem 0.75rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  border-color: #f44336;
  color: #f44336;
}

.main-content {
  padding: 2rem;
  min-height: calc(100vh - 60px);
}
</style>