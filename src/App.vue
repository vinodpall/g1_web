<template>
  <div id="app">
    <router-view />
    
    <!-- 全局任务完成弹窗 -->
    <TaskCompletionDialog />
    <!-- 全局报警通知弹窗 -->
    <AlertNotificationDialog />

    
    <!-- 全局权限拒绝提示 -->
    <PermissionDenied 
      :show="showPermissionDenied"
      :required-permission="requiredPermission"
      @close="closePermissionDenied"
      @contact-admin="contactAdmin"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTaskProgressStore } from './stores/taskProgress'
import TaskCompletionDialog from './components/TaskCompletionDialog.vue'
import AlertNotificationDialog from './components/AlertNotificationDialog.vue'

import PermissionDenied from './components/PermissionDenied.vue'
import { initUserPermissions, initAllPermissions } from './utils/initPermissions'

import { usePermissionStore } from './stores/permission'

const taskProgressStore = useTaskProgressStore()

// 权限管理状态
const showPermissionDenied = ref(false)
const requiredPermission = ref('')

// 权限不足事件处理
const handlePermissionDenied = (event: CustomEvent) => {
  requiredPermission.value = event.detail.permission
  showPermissionDenied.value = true
}

// 关闭权限提示
const closePermissionDenied = () => {
  showPermissionDenied.value = false
}

// 联系管理员
const contactAdmin = () => {
  console.log('联系管理员')
  showPermissionDenied.value = false
  // 可以跳转到联系页面或显示联系方式
}

// 应用启动时初始化
onMounted(async () => {
  // 轮询功能已移除，使用手动获取
  
  // 初始化权限系统
  try {
    await initAllPermissions()
    await initUserPermissions()
    
            // 权限初始化完成
  } catch (err) {
    console.error('权限初始化失败:', err)
  }
  
  // 监听权限不足事件
  document.addEventListener('permission-denied', handlePermissionDenied as EventListener)
})

// 应用卸载时清理
onUnmounted(() => {
  document.removeEventListener('permission-denied', handlePermissionDenied as EventListener)
})
</script>

<style>
#app {
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
