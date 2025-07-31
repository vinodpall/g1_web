import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { permission, permissionAll } from './directives/permission'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 注册权限指令
app.directive('permission', permission)
app.directive('permission-all', permissionAll)

app.mount('#app')
