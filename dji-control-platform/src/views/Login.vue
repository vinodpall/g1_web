<template>
  <div class="login-container">
    <div class="login-background">
      <img src="/src/assets/source_data/bg_data/mian_pg_bg.png" alt="background" />
    </div>
    
    <div class="login-content">
      <div class="login-left">
        <div class="logo-section">
          <img src="/src/assets/source_data/plane_2.png" alt="logo" class="logo" />
          <h1 class="title">无人机管控平台</h1>
        </div>
        <div class="drone-illustration">
          <img src="/src/assets/source_data/bg_data/main_pg_front.png" alt="drone" />
        </div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useAuth } from '../composables/useApi'

const router = useRouter()
const userStore = useUserStore()
const { login, loading, error } = useAuth()

const loginForm = ref({
  username: 'admin',
  password: 'admin123',
  remember: false
})

const errorMessage = ref('')
const showErrorDialog = ref(false)

const handleLogin = async () => {
  try {
    errorMessage.value = ''
    showErrorDialog.value = false
    
    // 正确的代码 👇
    const response = await login(loginForm.value)
    
    userStore.setUser(response.user)
    userStore.setToken(response.token)
    
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
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
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
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
}

.login-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 600px;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
}

.logo {
  width: 70px;
  height: 70px;
  margin-right: 1rem;
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