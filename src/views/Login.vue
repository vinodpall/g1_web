<template>
  <div class="login-container">
    <div class="login-background">
      <img src="/src/assets/source_data/bg_data/bg_1.jpg" alt="background" />
    </div>
    
    <!-- 全屏切换按钮 - 全屏后或 PWA 模式下自动隐藏 -->
    <button 
      v-show="!isFullscreen && !isPWAMode()" 
      class="fullscreen-btn-login" 
      @click="toggleFullscreen" 
      title="进入全屏">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>
    </button>
    
    <div class="login-content">
      <div class="login-left">
        <div class="logo-section">
          <img src="/src/assets/source_data/robot_source/robot_logo.png" alt="logo" class="logo" />
          <h1 class="title">机器人管控平台</h1>
        </div>
        <!-- <div class="drone-illustration">
          <img src="/src/assets/source_data/bg_data/main_pg_front.png" alt="drone" />
        </div> -->
      </div>
      
      <div class="login-right">
        <div class="login-form-container">
          <h2 class="form-title">账号登录</h2>
          
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <input
                v-model="loginForm.username"
                type="text"
                placeholder="请输入用户名"
                class="form-input"
                required
              />
            </div>
            
            <div class="form-group">
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                class="form-input"
                required
              />
            </div>
            
            <div class="form-group remember-section">
              <label class="checkbox-label">
                <input v-model="loginForm.remember" type="checkbox" />
                <span class="checkmark"></span>
                记住密码
              </label>
            </div>
            
            <button 
              type="submit" 
              class="login-button"
              :disabled="loading"
            >
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- 错误提示弹窗 -->
    <div v-if="showErrorDialog" class="error-dialog-mask">
      <div class="error-dialog">
        <div class="error-dialog-header">
          <div class="error-icon">⚠️</div>
          <div class="error-title">登录失败</div>
        </div>
        <div class="error-dialog-content">
          <div class="error-message">{{ errorMessage }}</div>
        </div>
        <div class="error-dialog-actions">
          <button class="error-dialog-btn" @click="closeErrorDialog">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useAuth } from '../composables/useApi'
import { initUserPermissions, initAllPermissions } from '../utils/initPermissions'
import { debugPermissions } from '../utils/permissionDebug'

const router = useRouter()
const userStore = useUserStore()
const { login, loading, error } = useAuth()

const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

const errorMessage = ref('')
const showErrorDialog = ref(false)

// 全屏状态
const isFullscreen = ref(false)

// 检测是否在 PWA 模式（从主屏幕打开）
const isPWAMode = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true
}

// 检查是否处于全屏状态
const checkFullscreen = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).msFullscreenElement
  )
}

// 检测是否是 iOS 设备
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

// 进入全屏
const requestFullscreen = () => {
  const elem = document.documentElement
  
  // iOS 设备使用滚动方式隐藏地址栏
  if (isIOS()) {
    console.log('iOS 设备：使用滚动方式优化显示')
    // 滚动到顶部以隐藏地址栏
    window.scrollTo(0, 1)
    setTimeout(() => window.scrollTo(0, 0), 0)
    
    // 同时尝试全屏 API（虽然 iOS Safari 可能不支持）
    if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen().catch((err: Error) => {
        console.log('iOS 全屏 API 不可用，使用视口优化')
      })
    }
    return
  }
  
  // 其他设备（Android/桌面）使用标准全屏 API
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => {
      console.warn('无法进入全屏模式:', err)
    })
  } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
    (elem as any).webkitRequestFullscreen()
  } else if ((elem as any).msRequestFullscreen) { /* IE11 */
    (elem as any).msRequestFullscreen()
  }
  
  console.log('已请求全屏模式')
}

// 退出全屏
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if ((document as any).webkitExitFullscreen) { /* Safari */
    (document as any).webkitExitFullscreen()
  } else if ((document as any).msExitFullscreen) { /* IE11 */
    (document as any).msExitFullscreen()
  }
  
  console.log('已退出全屏模式')
}

// 切换全屏
const toggleFullscreen = () => {
  if (isFullscreen.value) {
    exitFullscreen()
  } else {
    requestFullscreen()
  }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
  checkFullscreen()
}

// 监听全屏变化事件
document.addEventListener('fullscreenchange', handleFullscreenChange)
document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
document.addEventListener('msfullscreenchange', handleFullscreenChange)

// 页面加载时检查是否有保存的登录信息
onMounted(() => {
  const savedUsername = localStorage.getItem('savedUsername')
  const savedPassword = localStorage.getItem('savedPassword')
  const savedExpireTime = localStorage.getItem('savedExpireTime')
  
  // 检查是否过期
  if (savedUsername && savedPassword && savedExpireTime) {
    const expireTime = parseInt(savedExpireTime)
    const currentTime = Date.now()
    
    if (currentTime < expireTime) {
      // 未过期，加载保存的信息
      loginForm.value.username = savedUsername
      loginForm.value.password = savedPassword
      loginForm.value.remember = true
    } else {
      // 已过期，清除保存的信息
      localStorage.removeItem('savedUsername')
      localStorage.removeItem('savedPassword')
      localStorage.removeItem('savedExpireTime')
    }
  }
  
  // 自动进入全屏（稍微延迟以确保页面完全加载）
  // PWA 模式下不需要调用全屏 API，因为已经是全屏模式
  if (!isPWAMode()) {
    setTimeout(() => {
      requestFullscreen()
    }, 500)
  } else {
    console.log('PWA 模式：无需调用全屏 API，已处于全屏状态')
  }
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
})

const handleLogin = async () => {
  try {
    errorMessage.value = ''
    showErrorDialog.value = false
    
    // 调用登录接口
    const response = await login(loginForm.value)
    
    // 先保存token
    userStore.setToken((response as any).token)
    
    // 调用 /api/v1/users/me 获取当前用户信息并保存到缓存
    try {
      console.log('登录成功，开始获取当前用户信息...')
      await userStore.fetchCurrentUser()
      console.log('当前用户信息获取成功')
    } catch (err) {
      console.error('获取当前用户信息失败:', err)
      // 如果获取失败，使用登录响应中的用户信息作为备选
      if ((response as any).user) {
        console.log('使用登录响应中的用户信息作为备选')
        userStore.setUser((response as any).user)
      }
    }
    
    // 根据是否勾选记住密码来保存或清除登录信息
    if (loginForm.value.remember) {
      // 保存到 localStorage，设置7天过期时间
      const expireTime = Date.now() + (7 * 24 * 60 * 60 * 1000) // 7天后过期
      localStorage.setItem('savedUsername', loginForm.value.username)
      localStorage.setItem('savedPassword', loginForm.value.password)
      localStorage.setItem('savedExpireTime', expireTime.toString())
    } else {
      // 清除保存的信息
      localStorage.removeItem('savedUsername')
      localStorage.removeItem('savedPassword')
      localStorage.removeItem('savedExpireTime')
    }
    
    // 登录成功后立即初始化权限
    try {
      console.log('开始初始化权限...')
      await initAllPermissions()
      await initUserPermissions()
      console.log('权限初始化完成，准备跳转到dashboard')
      
      // 权限初始化完成后，输出调试信息
      debugPermissions()
    } catch (err) {
      console.error('权限初始化失败:', err)
      // 权限初始化失败不应该阻止用户登录
    }
    
    // 无论权限初始化是否成功，都跳转到dashboard
    console.log('跳转到dashboard页面')
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败'
    showErrorDialog.value = true
  }
}

const closeErrorDialog = () => {
  showErrorDialog.value = false
  errorMessage.value = ''
}


</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  height: 100vh;
  height: 100dvh; /* 使用动态视口高度，适配移动端 */
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: #0f192d;
  /* iOS 优化 */
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* 全屏切换按钮 */
.fullscreen-btn-login {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(0, 188, 212, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 188, 212, 0.4);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #00bcd4;
  transition: all 0.3s ease;
  padding: 0;
  z-index: 100;
}

.fullscreen-btn-login:hover {
  background: rgba(0, 188, 212, 0.3);
  border-color: rgba(0, 188, 212, 0.6);
  color: #fff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 188, 212, 0.4);
}

.fullscreen-btn-login:active {
  transform: scale(0.95);
}

.fullscreen-btn-login svg {
  width: 22px;
  height: 22px;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.login-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-content {
  display: flex;
  height: 100vh;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 5%;
}

.login-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  max-width: 600px;
  margin-top: 0;
  padding-top: 25px;
  padding-left: 1px;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.logo {
  width: 100px;
  height: 100px;
  margin-right: 1rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) 
          drop-shadow(0 0 15px rgba(255, 255, 255, 0.5))
          brightness(1.1);
}

.title {
  color: #FFF;
  text-align: center;
  font-family: YouSheBiaoTiHei;
  font-size: 48px;
  font-style: normal;
  font-weight: bold;
  line-height: 150%;
  letter-spacing: 1px;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8),
               0 0 20px rgba(255, 255, 255, 0.3);
}

.drone-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
}

.drone-illustration img {
  max-width: 100%;
  height: auto;
}

.login-right {
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: calc(50vh - 250px);
  margin-right: 80px;
}

.login-form-container {
  background: rgba(15, 25, 45, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 188, 212, 0.3);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #ffffff;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-input {
  padding: 1rem;
  border: 1px solid rgba(0, 188, 212, 0.3);
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.3);
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0, 188, 212, 0.2);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.remember-section {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.checkbox-label input {
  margin-right: 0.5rem;
}

.login-button {
  padding: 1rem;
  background: linear-gradient(135deg, #00bcd4, #0097a7);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #00acc1, #00838f);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 188, 212, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 6px;
  color: #f44336;
  text-align: center;
  font-size: 0.9rem;
}

/* 错误提示弹窗样式 */
.error-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.error-dialog {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.error-dialog-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #f44336;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.error-icon {
  margin-right: 10px;
  font-size: 1.5rem;
}

.error-dialog-content {
  padding: 20px;
  text-align: center;
  color: #333;
  font-size: 1rem;
  overflow-y: auto;
  flex-grow: 1;
}

.error-dialog-actions {
  padding: 15px 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  background: #f0f0f0;
}

.error-dialog-btn {
  padding: 8px 15px;
  background: #00bcd4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.3s ease;
}

.error-dialog-btn:hover {
  background: #00acc1;
}

@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    padding: 2rem;
  }
  
  .login-left {
    max-width: 100%;
    margin-bottom: 2rem;
  }
  
  .login-right {
    width: 100%;
    max-width: 400px;
  }
  
  .title {
    font-size: 2rem;
  }
}
</style>