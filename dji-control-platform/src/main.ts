import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { permission, permissionAll } from './directives/permission'
import { useAuth } from './composables/useApi'
import { apiClient } from './api/config'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 注册权限指令
app.directive('permission', permission)
app.directive('permission-all', permissionAll)

// 初始化认证状态
const { initAuth } = useAuth()
initAuth()

// 确保API客户端使用正确的token
const savedToken = localStorage.getItem('token')
if (savedToken) {
  apiClient.setAuthToken(savedToken)
  console.log('应用启动时已设置API认证token')
}

app.mount('#app')
