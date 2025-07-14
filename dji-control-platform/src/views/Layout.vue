<template>
  <div class="layout-container">
    <div class="header">
      <div class="header-left">
        <img src="/src/assets/source_data/plane_2.png" alt="logo" class="logo" />
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
        <!-- 机场名称下拉框 -->
        <div class="airport-selector">
          <select v-model="selectedDockId" @change="handleDockChange" class="dock-selector">
            <option v-for="dock in availableDocks" :key="dock.id" :value="dock.id">
              {{ dock.name }}
            </option>
          </select>
          <i class="arrow-down"></i>
        </div>
        
        <!-- 通知图标 -->
        <div class="notification-icon">
          <div class="notification-badge">
            <span>警</span>
          </div>
        </div>
        
        <!-- 用户信息 -->
        <div class="user-info">
          <img src="/src/assets/source_data/plane_2.png" alt="avatar" class="avatar" />
          <span class="username">{{ user?.name || 'admin' }}</span>
          <i class="arrow-down"></i>
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
// 导入背景图片
import titleBg from '/src/assets/source_data/bg_data/title.png'

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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.layout-container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: #0a0f1c;
}

/* 顶部导航栏 */
.header {
  height: 60px;
  background-image: url('/title.png');
  background-repeat: repeat-x;
  background-position: left center;
  background-size: auto 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 3vw, 40px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* 左侧Logo和标题 */
.header-left {
  display: flex;
  align-items: center;
  gap: clamp(2px, 0.5vw, 4px);
  position: relative;
  z-index: 1;
  min-width: 0;
  margin-left: -30px;
}

.logo {
  width: clamp(24px, 3vw, 36px);
  height: clamp(24px, 3vw, 36px);
  filter: brightness(0) saturate(100%) invert(100%);
  flex-shrink: 0;
}

.title {
  font-family: 'YouSheBiaoTiHei', 'Microsoft YaHei', '黑体', 'SimHei', sans-serif;
  font-size: 34px;
  font-weight: normal;
  letter-spacing: 1px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-left: 0px;
  background: linear-gradient(to bottom, #fff, #63d8ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  display: inline-block;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, .25));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 中间导航菜单 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: clamp(20px, 4vw, 50px);
  position: relative;
  z-index: 1;
  flex: 1;
  justify-content: center;
  max-width: 600px;
  margin: 0 20px;
}

.nav-item {
  padding: 8px clamp(8px, 1.5vw, 20px);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  position: relative;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: clamp(12px, 1.4vw, 16px);
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
}

.nav-item:hover {
  color: #ffffff;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(20px, 3vw, 40px);
  height: 2px;
  background: #4FC3F7;
  border-radius: 1px;
}

/* 右侧功能区 */
.header-right {
  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 24px);
  position: relative;
  z-index: 1;
  min-width: 0;
}

/* 机场名称下拉框 */
.airport-selector {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
}

.dock-selector {
  padding: 6px clamp(20px, 3vw, 30px) 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-size: clamp(12px, 1.4vw, 16px);
  cursor: pointer;
  transition: background 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  max-width: clamp(80px, 15vw, 150px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dock-selector:hover {
  background: rgba(255, 255, 255, 0.15);
}

.dock-selector:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.arrow-down {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #ffffff;
  pointer-events: none;
}

/* 通知图标 */
.notification-icon {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.notification-badge {
  width: clamp(24px, 3vw, 36px);
  height: clamp(24px, 3vw, 36px);
  background: #ff4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.notification-badge:hover {
  transform: scale(1.1);
}

.notification-badge span {
  color: #ffffff;
  font-size: clamp(10px, 1.2vw, 14px);
  font-weight: bold;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: clamp(4px, 1vw, 12px);
  padding: 4px clamp(8px, 1.5vw, 16px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
  position: relative;
  min-width: 0;
  max-width: clamp(100px, 20vw, 200px);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.15);
}

.avatar {
  width: clamp(20px, 2.5vw, 28px);
  height: clamp(20px, 2.5vw, 28px);
  border-radius: 50%;
  background: #ffffff;
  padding: 2px;
  flex-shrink: 0;
}

.username {
  color: #ffffff;
  font-size: clamp(12px, 1.4vw, 16px);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 主内容区 */
.main-content {
  height: calc(100vh - 60px);
  overflow-y: auto;
  background: #f5f5f5;
}

/* 响应式断点 */
@media (max-width: 1400px) {
  .nav-menu {
    gap: clamp(15px, 3vw, 35px);
    margin: 0 15px;
  }
}

@media (max-width: 1200px) {
  .header {
    padding: 0 clamp(15px, 2.5vw, 30px);
  }
  
  .nav-menu {
    gap: clamp(10px, 2.5vw, 25px);
    margin: 0 10px;
  }
  
  .header-right {
    gap: clamp(8px, 1.5vw, 18px);
  }
}

@media (max-width: 992px) {
  .header {
    padding: 0 clamp(10px, 2vw, 20px);
  }
  
  .nav-menu {
    gap: clamp(8px, 2vw, 20px);
    margin: 0 8px;
  }
  
  .title {
    font-size: clamp(16px, 2.5vw, 28px);
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 10px;
    flex-wrap: nowrap;
  }
  
  .header-left {
    min-width: auto;
  }
  
  .title {
    display: none;
  }
  
  .nav-menu {
    gap: clamp(6px, 1.5vw, 15px);
    margin: 0 5px;
    flex: none;
  }
  
  .nav-item {
    padding: 6px clamp(4px, 1vw, 12px);
    font-size: clamp(10px, 1.2vw, 14px);
  }
  
  .header-right {
    gap: clamp(6px, 1vw, 12px);
    min-width: auto;
  }
  
  .dock-selector {
    max-width: clamp(60px, 12vw, 100px);
    font-size: clamp(10px, 1.2vw, 14px);
  }
  
  .username {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    gap: clamp(4px, 1vw, 8px);
  }
  
  .nav-item {
    padding: 4px clamp(2px, 0.8vw, 8px);
    font-size: clamp(9px, 1vw, 12px);
  }
  
  .dock-selector {
    max-width: clamp(50px, 10vw, 80px);
    padding: 4px clamp(15px, 2.5vw, 20px) 4px 8px;
  }
}
</style>