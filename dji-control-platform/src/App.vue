<template>
  <div id="app">
    <router-view />
    <!-- 全局任务完成弹窗 -->
    <TaskCompletionDialog />
    <!-- 全局报警通知弹窗 -->
    <AlertNotificationDialog />
    <!-- 权限调试面板（仅开发环境） -->
    <PermissionStatus />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useTaskProgressStore } from './stores/taskProgress'
import TaskCompletionDialog from './components/TaskCompletionDialog.vue'
import AlertNotificationDialog from './components/AlertNotificationDialog.vue'
import PermissionStatus from './components/PermissionStatus.vue'
import { initUserPermissions, initAllPermissions } from './utils/initPermissions'
import { debugPermissions } from './utils/permissionDebug'

const taskProgressStore = useTaskProgressStore()

// 应用启动时初始化
onMounted(async () => {
  // 开始任务进度轮询
  taskProgressStore.startPolling()
  
  // 初始化权限系统
  try {
    await initAllPermissions()
    await initUserPermissions()
    
    // 权限初始化完成后，输出调试信息
    setTimeout(() => {
      debugPermissions()
    }, 1000)
  } catch (err) {
    console.error('权限初始化失败:', err)
  }
})

// 应用卸载时停止轮询
onUnmounted(() => {
  taskProgressStore.stopPolling()
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
