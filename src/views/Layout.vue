<template>
  <div class="layout-container">
    <div class="header">
      <div class="header-left">
        <img src="/src/assets/source_data/robot_source/logo1.png" alt="logo" class="logo" />
        <span class="title">机器人管控平台</span>
      </div>
      
      <nav class="nav-menu">
        <router-link to="/dashboard/home" class="nav-item" :class="{ active: $route.path === '/dashboard/home' }">
          首页
        </router-link>
        <router-link to="/dashboard/mission" class="nav-item" :class="{ active: $route.path.includes('mission') }">
          展厅管理
        </router-link>
        <router-link to="/dashboard/device-manage" class="nav-item" :class="{ active: $route.path === '/dashboard/device-manage' }">
          机器人管理
        </router-link>
        <router-link to="/dashboard/users" class="nav-item" :class="{ active: $route.path.includes('users') || $route.path.includes('introduce') }">
          系统管理
        </router-link>
      </nav>
      
      <div class="header-right">

        <!-- 机器人选择器 -->
        <div class="el-select robot-selector">
          <div class="el-select__wrapper" 
               :class="{ 'is-active': isRobotSelectActive }" 
               @click.stop="toggleRobotSelect">
            <div class="el-select__selection">
              <div class="el-select__selected-item el-select__placeholder">
                <span>{{ selectedRobot?.name || '选择机器人' }}</span>
              </div>
            </div>
            <div class="el-select__suffix">
              <i class="el-icon el-select__caret">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                  <path fill="currentColor" d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"></path>
                </svg>
              </i>
            </div>
          </div>
          
          <!-- 机器人下拉选项 -->
          <div class="el-select__dropdown" v-show="isRobotSelectActive" @click.stop>
            <div class="el-select__dropdown-list">
              <div 
                v-for="robot in robotOptions" 
                :key="robot.value"
                class="el-select__dropdown-item"
                :class="{ 'is-selected': selectedRobotId === robot.value }"
                @click="selectRobot(robot.value)">
                <div class="robot-item">
                  <span class="status-indicator" :class="{ 'online': robot.online, 'offline': !robot.online }"></span>
                  <span class="robot-name">{{ robot.label }}</span>
                </div>
              </div>
              <div v-if="robotOptions.length === 0" class="el-select__dropdown-item is-disabled">
                暂无机器人
              </div>
            </div>
        </div>
      </div>

      <!-- 用户信息 -->
        <div class="user-info" @click="toggleUserMenu">
          <img src="/src/assets/source_data/avatar.jpg" alt="avatar" class="avatar" />
          <div class="right-sel">
            <span class="name">{{ user?.username || 'admin' }}</span>
            <span class="triangle" :class="{ 'is-active': isUserMenuVisible }"></span>
          </div>
          <!-- 下拉菜单 -->
          <div class="user-menu" v-show="isUserMenuVisible">
            <div class="menu-item" @click="handleChangePassword">
              <span>修改密码</span>
            </div>
            <div class="menu-item" @click="handleLogout">
              <span>退出</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>

    <!-- 修改密码弹窗 -->
    <div v-if="showChangePasswordDialog" class="password-dialog-mask">
      <div class="password-dialog">
        <div class="password-dialog-title">修改密码</div>
        <div class="password-dialog-content">
          <div v-if="!passwordSuccess" class="password-form">
            <div class="password-form-row">
              <label>新密码：</label>
              <input 
                v-model="changePasswordForm.newPassword" 
                type="password" 
                class="password-input" 
                placeholder="请输入新密码（至少6位）"
                @input="passwordError = ''"
              />
            </div>
            <div class="password-form-row">
              <label>确认密码：</label>
              <input 
                v-model="changePasswordForm.confirmPassword" 
                type="password" 
                class="password-input" 
                placeholder="请再次输入新密码"
                @input="passwordError = ''"
                @keyup.enter="confirmChangePassword"
              />
            </div>
            <div v-if="passwordError" class="password-error">{{ passwordError }}</div>
          </div>
          <div v-else class="password-success">
            <div class="success-icon">✓</div>
            <div class="success-text">密码修改成功！</div>
          </div>
        </div>
        <div v-if="!passwordSuccess" class="password-dialog-actions">
          <button class="password-btn password-btn-confirm" @click="confirmChangePassword">确认</button>
          <button class="password-btn password-btn-cancel" @click="showChangePasswordDialog = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useRobotStore } from '../stores/robot'
import { useUserManagementStore } from '../stores/userManagement'
// import { useDevices } from '../composables/useApi' // API已移除，等待重新对接
// import { dockApi } from '../api/services' // API已移除
// import { useDeviceStatus } from '../composables/useDeviceStatus' // API已移除
// 导入背景图片
import titleBg from '/src/assets/source_data/bg_data/title.png'

const router = useRouter()
const userStore = useUserStore()
const robotStore = useRobotStore()
const userManagementStore = useUserManagementStore()


const user = computed(() => userStore.user)

// 机器人相关状态
const robotOptions = computed(() => robotStore.robotOptions)
const selectedRobotId = computed(() => robotStore.selectedRobotId)
const selectedRobot = computed(() => robotStore.selectedRobot)

const isRobotSelectActive = ref(false)

// 机器人选择相关方法
const toggleRobotSelect = () => {
  isRobotSelectActive.value = !isRobotSelectActive.value
}

const selectRobot = (robotId: number) => {
  robotStore.selectRobot(robotId)
  isRobotSelectActive.value = false
}

// 点击外部关闭下拉列表
const closeSelect = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.el-select')) {
    isRobotSelectActive.value = false
  }
}

// 监听点击事件
document.addEventListener('click', closeSelect)

const isUserMenuVisible = ref(false)

const toggleUserMenu = (e: Event) => {
  e.stopPropagation()
  isUserMenuVisible.value = !isUserMenuVisible.value
}

// 修改密码相关状态
const showChangePasswordDialog = ref(false)
const changePasswordForm = ref({
  newPassword: '',
  confirmPassword: ''
})
const passwordError = ref('')
const passwordSuccess = ref(false)

const handleChangePassword = () => {
  // 打开修改密码弹窗
  changePasswordForm.value = {
    newPassword: '',
    confirmPassword: ''
  }
  passwordError.value = ''
  showChangePasswordDialog.value = true
  isUserMenuVisible.value = false
}

// 确认修改密码
const confirmChangePassword = async () => {
  // 验证密码
  if (!changePasswordForm.value.newPassword) {
    passwordError.value = '请输入新密码'
    return
  }
  
  if (changePasswordForm.value.newPassword.length < 6) {
    passwordError.value = '密码长度至少为6位'
    return
  }
  
  if (changePasswordForm.value.newPassword !== changePasswordForm.value.confirmPassword) {
    passwordError.value = '两次输入的密码不一致'
    return
  }
  
  try {
    // 获取当前用户ID
    const userId = userStore.user?.id
    if (!userId) {
      passwordError.value = '未找到用户信息'
      return
    }
    
    // 调用API更新密码
    await userManagementStore.updateUser(
      userStore.token,
      userId,
      { password: changePasswordForm.value.newPassword }
    )
    
    // 显示成功提示
    passwordSuccess.value = true
    
    // 2秒后关闭弹窗
    setTimeout(() => {
      showChangePasswordDialog.value = false
      passwordSuccess.value = false
      changePasswordForm.value = {
        newPassword: '',
        confirmPassword: ''
      }
    }, 2000)
  } catch (error) {
    console.error('修改密码失败:', error)
    passwordError.value = '修改密码失败，请重试'
  }
}

const handleLogout = () => {
  // 处理退出登录逻辑
  console.log('退出登录')
  userStore.logout()
  router.push('/login')
  isUserMenuVisible.value = false
}

// 点击其他地方关闭用户菜单
const closeUserMenu = () => {
  isUserMenuVisible.value = false
}

// 监听点击事件
document.addEventListener('click', closeUserMenu)


// 页面加载时初始化
onMounted(async () => {
  // 如果有token，刷新当前用户信息
  if (userStore.token) {
    try {
      console.log('Layout初始化 - 开始刷新当前用户信息...')
      await userStore.fetchCurrentUser()
      console.log('Layout初始化 - 用户信息已刷新:', userStore.user?.username)
    } catch (error) {
      console.error('Layout初始化 - 刷新用户信息失败:', error)
    }
  }
  
  // 从缓存恢复机器人数据和选中状态
  robotStore.hydrateFromCache()
  robotStore.initSelectedRobot()
  
  console.log('Layout初始化 - 缓存中的机器人数据:', robotStore.robotOptions.length, '个')
  console.log('Layout初始化 - 缓存中选中的机器人ID:', robotStore.selectedRobotId)
  
  // 如果缓存中没有机器人数据，且用户已登录，则主动获取
  if (robotStore.robotOptions.length === 0 && userStore.token) {
    console.log('缓存中无机器人数据，主动获取机器人列表...')
    try {
      await robotStore.fetchRobots(userStore.token)
      console.log('机器人列表获取成功，共', robotStore.robotOptions.length, '个')
      
      // 获取成功后，如果有机器人且没有选中任何机器人，自动选中第一个
      if (robotStore.robotOptions.length > 0 && !robotStore.selectedRobotId) {
        const firstRobotId = robotStore.robotOptions[0].value
        robotStore.selectRobot(firstRobotId)
        console.log('自动选中第一个机器人:', robotStore.robotOptions[0].label)
      }
    } catch (error) {
      console.error('获取机器人列表失败:', error)
    }
  }
  
  // 如果有缓存数据但没有选中机器人，自动选中第一个
  if (robotStore.robotOptions.length > 0 && !robotStore.selectedRobotId) {
    const firstRobotId = robotStore.robotOptions[0].value
    robotStore.selectRobot(firstRobotId)
    console.log('自动选中第一个机器人:', robotStore.robotOptions[0].label)
  }
  
  console.log('Layout初始化完成 - 最终机器人数据:', robotStore.robotOptions.length, '个')
  console.log('Layout初始化完成 - 最终选中的机器人ID:', robotStore.selectedRobotId)
})
</script>

<style scoped>
@font-face {
  font-family: 'YouSheBiaoTiHei';
  src: url('/fonts/YouSheBiaoTiHei-2.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

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
  width: 100%;
  height: 90px;
  background: url('/title.png') no-repeat;
  background-size: 100% 98%;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 3vw, 40px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
  gap: clamp(10px, 2vw, 20px);
}

/* 左侧Logo和标题 */
.header-left {
  display: flex;
  align-items: center;
  /* gap: clamp(8px, 1vw, 12px); */
  position: relative;
  z-index: 1;
  min-width: 0;
  margin-left: -35px;
  margin-top: 5px;
  flex-shrink: 0;
  flex: 0 0 auto;
  width: clamp(320px, 35vw, 450px);
}

.logo {
  height: clamp(35px, 4vw, 48px);
  width: auto;
  flex-shrink: 0;
  /* 为黑色文字添加白色发光效果，让其在深色背景中清晰可见 */
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.9))
          drop-shadow(0 0 25px rgba(255, 255, 255, 0.6))
          brightness(1.05);
}

.title {
  font-family: 'YouSheBiaoTiHei', 'Microsoft YaHei', '黑体', 'SimHei', sans-serif;
  font-size: clamp(20px, 2.5vw, 34px); /* 使用clamp自动缩放 */
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
  max-width: clamp(200px, 25vw, 400px); /* 使用clamp自动缩放最大宽度 */
}

/* 中间导航菜单 */
.nav-menu {
  display: flex;
  align-items: flex-start;
  gap: 0;
  position: relative;
  z-index: 1;
  flex: 1;
  justify-content: center;
  margin-left: 0;
  list-style: none;
  height: 54px;
  margin-top: 26px;
  border-radius: 0;
  padding-left: clamp(8vw, 12vw, 18vw); /* 增加内边距范围 */
  padding-right: clamp(8vw, 12vw, 18vw);
  min-width: 0;
}

.nav-item {
  width: clamp(80px, 8vw, 120px); /* 使用clamp自动缩放宽度 */
  height: 54px;
  background: url('/src/assets/source_data/bg_data/title_dark.png') no-repeat;
  background-position: bottom center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: clamp(14px, 1.2vw, 18px); /* 使用clamp自动缩放字体大小 */
  color: #9f9f9f;
  font-style: normal;
  text-transform: none;
  cursor: pointer;
  margin-right: clamp(40px, 4vw, 70px); /* 使用clamp自动缩放间距 */
  text-decoration: none;
  flex-shrink: 0;
}

.nav-item:hover {
  color: #ffffff;
}

.nav-item.active {
  color: #ffffff;
  background: url('/src/assets/source_data/bg_data/title_light.png') no-repeat;
  background-position: bottom center;
}

.nav-item:last-child {
  margin-right: 0;
}

.nav-item.active::after {
  display: none;
}

/* 右侧功能区 */
.header-right {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.2vw, 12px); /* 减少元素间距 */
  position: relative;
  z-index: 1;
  margin-right: clamp(10px, 1.5vw, 15px);
  flex-shrink: 0;
  min-width: 0;
  flex: 0 0 auto;
  width: clamp(280px, 32vw, 380px); /* 增加整体宽度给机器人选择器更多空间 */
  justify-content: flex-end; /* 右对齐，避免挤压 */
}

/* 机场选择器样式 */
.el-select {
  --el-transition-duration: 0.3s;
  --el-border-radius-base: 4px;
  --el-border-color: rgba(255, 255, 255, 0.2);
  --el-fill-color-blank: rgba(255, 255, 255, 0.1);
  
  width: clamp(140px, 15vw, 180px); /* 增加宽度范围 */
  margin-right: clamp(10px, 1.5vw, 15px);
  display: inline-block;
  position: relative;
  vertical-align: middle;
}

/* 机器人选择器宽度覆盖 - 放在基础样式后面 */
.robot-selector.el-select {
  width: clamp(150px, 22vw, 260px) !important;
  min-width: 150px !important;
}

.el-select__wrapper {
  align-items: center;
  background-color: var(--el-fill-color-blank);
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  gap: 6px;
  line-height: 24px;
  min-height: 32px;
  padding: 4px 12px;
  position: relative;
  text-align: left;
  transform: translateZ(0);
  transition: var(--el-transition-duration);
}

.el-select__wrapper:hover {
  --el-border-color: rgba(255, 255, 255, 0.4);
  --el-fill-color-blank: rgba(255, 255, 255, 0.15);
}

.el-select__selection {
  display: flex;
  align-items: center;
  flex: 1;
  color: #fff;
  font-size: 14px;
  line-height: 24px;
  white-space: nowrap; /* 防止文字换行 */
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-select__placeholder {
  color: #fff;
  margin-right: 20px;
  white-space: nowrap; /* 防止文字换行 */
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-select__suffix {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  transition: transform var(--el-transition-duration);
  display: flex;
  align-items: center;
}

.el-select__caret {
  height: 16px;
  width: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.el-select__caret svg {
  width: 12px;
  height: 12px;
  transition: transform var(--el-transition-duration);
}

.el-select__wrapper:hover .el-select__suffix {
  color: #fff;
}

.el-select__wrapper:active .el-select__suffix svg {
  transform: rotate(180deg);
}

/* 添加一个激活状态的类 */
.el-select__wrapper.is-active {
  --el-border-color: rgba(255, 255, 255, 0.6);
  --el-fill-color-blank: rgba(255, 255, 255, 0.2);
}

.el-select__wrapper.is-active .el-select__suffix svg {
  transform: rotate(180deg);
}

/* 下拉选项样式 */
.el-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: rgba(15, 25, 45, 0.95);
  border: 1px solid rgba(0, 188, 212, 0.3);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.el-select__dropdown-list {
  padding: 4px 0;
  margin: 0;
  list-style: none;
}

.el-select__dropdown-item {
  padding: 10px 16px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.el-select__dropdown-item:hover {
  background: rgba(0, 188, 212, 0.2);
  color: #00bcd4;
}

.el-select__dropdown-item.is-selected {
  background: rgba(0, 188, 212, 0.3);
  color: #00bcd4;
  font-weight: bold;
}

/* 机器人选择器特定样式 */
.robot-selector {
  margin-right: 10px;
  margin-left: -10px; /* 往左移动 */
}

.robot-selector .el-select__dropdown-item {
  padding: 10px 16px;
}

.robot-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.online {
  background-color: #2ed573;
  box-shadow: 0 0 4px rgba(46, 213, 115, 0.6);
}

.status-indicator.offline {
  background-color: #ff4757;
  box-shadow: 0 0 4px rgba(255, 71, 87, 0.6);
}

.robot-name {
  color: inherit;
  font-size: 14px;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 2px;
  position: relative;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.right-sel {
  display: flex;
  align-items: center;
  gap: 6px; /* 减少间距 */
  min-width: clamp(60px, 8vw, 80px); /* 调整最小宽度 */
}

.name {
  color: #fff;
  font-size: clamp(14px, 1.2vw, 16px); /* 调整字体大小 */
  font-weight: bold;
  font-family: Source Han Sans CN;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #999;
  margin-left: 4px;
  transition: transform 0.3s;
}

.triangle.is-active {
  transform: rotate(180deg);
}

/* 用户菜单样式 */
.user-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 10;
}

.menu-item {
  padding: 10px 16px;
  color: #333;
  font-size: 14px;
  transition: all 0.3s;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #1890ff;
}

.menu-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

/* 主内容区 */
.main-content {
  height: calc(100vh - 88px);
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
    gap: clamp(10px, 1.5vw, 15px);
  }
  
  .el-select {
    min-width: 100px;
  }
  
  .robot-selector.el-select {
    min-width: 150px !important;
    width: 150px !important;
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

/* 新增：高分辨率屏幕优化 */
@media (min-width: 1920px) {
  .nav-menu {
    padding-left: 12vw;
    padding-right: 12vw;
  }
  
  .nav-item {
    margin-right: 55px;
  }
  
  .nav-item:last-child {
    margin-right: 0;
  }
  
  .header-left {
    width: 420px;
  }
  
  .header-right {
    width: 320px;
  }
  
  .el-select {
    width: 160px;
  }
  
  .robot-selector.el-select {
    width: 200px !important;
  }
  
  .stop-btn {
    width: 45px;
    height: 45px;
  }
}

/* 新增：超高分辨率屏幕优化 */
@media (min-width: 2560px) {
  .nav-menu {
    padding-left: 20vw;
    padding-right: 20vw;
  }
  
  .nav-item {
    margin-right: 40px;
    width: 100px;
  }
  
  .header-left {
    width: 360px;
  }
  
  .header-right {
    width: 300px;
  }
  
  .el-select {
    width: 170px;
  }
  
  .robot-selector.el-select {
    width: 220px !important;
  }
}

/* 修改密码弹窗样式 */
.password-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.password-dialog {
  background: linear-gradient(135deg, #1a2332 0%, #2d3e50 100%);
  border: 1px solid rgba(103, 213, 253, 0.3);
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: dialogSlideIn 0.3s ease-out;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.password-dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #67d5fd;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(103, 213, 253, 0.2);
}

.password-dialog-content {
  padding: 24px;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.password-form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.password-form-row label {
  color: #cfe9f3;
  font-size: 14px;
  font-weight: 500;
}

.password-input {
  width: 100%;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(103, 213, 253, 0.3);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.password-input::placeholder {
  color: #8aa0b5;
}

.password-input:focus {
  outline: none;
  border-color: #67d5fd;
  background: rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 0 3px rgba(103, 213, 253, 0.1);
}

.password-error {
  color: #ff4444;
  font-size: 13px;
  margin-top: -8px;
  padding-left: 4px;
}

.password-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid rgba(103, 213, 253, 0.2);
}

.password-btn {
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.password-btn-confirm {
  background: linear-gradient(135deg, #67d5fd 0%, #4facfe 100%);
  color: #1a2332;
}

.password-btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 213, 253, 0.4);
}

.password-btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: #cfe9f3;
  border: 1px solid rgba(103, 213, 253, 0.3);
}

.password-btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #67d5fd;
}

.password-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  gap: 16px;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  font-weight: bold;
  animation: successBounce 0.6s ease-out;
}

@keyframes successBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-text {
  font-size: 16px;
  color: #4ade80;
  font-weight: 500;
}
</style>