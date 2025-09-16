<template>
  <div v-if="showDebug" class="permission-debug-panel">
    <div class="debug-header">
      <h3>权限调试面板</h3>
      <button @click="showDebug = false" class="close-btn">×</button>
    </div>
    
    <div class="debug-content">
      <div class="user-info">
        <h4>用户信息</h4>
        <p><strong>用户ID:</strong> {{ userStore.user?.id || '未知' }}</p>
        <p><strong>用户名:</strong> {{ userStore.user?.username || '未知' }}</p>
        <p><strong>角色数量:</strong> {{ Array.isArray(userStore.user?.roles) ? userStore.user?.roles?.length : 0 }}</p>
        <div v-if="Array.isArray(userStore.user?.roles) && (userStore.user?.roles?.length || 0) > 0" class="roles-info">
          <p><strong>角色详情:</strong></p>
          <ul class="roles-list">
            <li 
              v-for="(role, idx) in userStore.user?.roles as any[]" 
              :key="typeof role === 'string' ? role : (role?.id ?? idx)" 
              class="role-item"
            >
              {{ typeof role === 'string' ? role : (role?.role_name || '未知角色') }}
              ({{ typeof role === 'object' ? (role?.permissions?.length || 0) : 0 }}个权限)
            </li>
          </ul>
        </div>
      </div>
      
      <div class="permissions-info">
        <h4>权限信息</h4>
        <p><strong>权限数量:</strong> {{ permissionStore.userPermissions.length }}</p>
        <p><strong>所有权限配置数量:</strong> {{ permissionStore.allPermissions.length }}</p>
      </div>
      
      <div class="permission-list">
        <h4>用户权限列表</h4>
        <div v-if="permissionStore.userPermissions.length === 0" class="no-permissions">
          暂无权限
        </div>
        <ul v-else class="permissions">
          <li v-for="permission in permissionStore.userPermissions" :key="permission" class="permission-item">
            {{ permission }}
          </li>
        </ul>
      </div>
      
      <div class="test-permissions">
        <h4>权限检查测试</h4>
        <div v-for="permission in testPermissions" :key="permission" class="test-item">
          <span class="permission-name">{{ permission }}</span>
          <span :class="['status', permissionStore.hasPermission(permission) ? 'success' : 'error']">
            {{ permissionStore.hasPermission(permission) ? '✅' : '❌' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePermissionStore } from '../stores/permission'
import { useUserStore } from '../stores/user'

const permissionStore = usePermissionStore()
const userStore = useUserStore()

// 只在开发环境显示
const showDebug = ref(import.meta.env.DEV)

const testPermissions = [
  'home.view',
  'drone_control.view',
  'dock_control.view',
  'wayline_management.view',
  'task_logs.view',
  'task_records.view',
  'device_management.view'
]
</script>

<style scoped>
.permission-debug-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  max-height: 600px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  overflow: hidden;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.debug-header h3 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.debug-content {
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.debug-content h4 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #333;
}

.debug-content p {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
}

.user-info, .permissions-info, .permission-list, .test-permissions {
  margin-bottom: 16px;
}

.permissions {
  list-style: none;
  padding: 0;
  margin: 0;
}

.permission-item {
  padding: 4px 0;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
}

.no-permissions {
  font-size: 12px;
  color: #999;
  font-style: italic;
}

.test-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 12px;
}

.permission-name {
  color: #666;
}

.status {
  font-weight: bold;
}

.status.success {
  color: #52c41a;
}

.status.error {
  color: #ff4d4f;
}

.roles-info {
  margin-top: 8px;
}

.roles-list {
  list-style: none;
  padding: 0;
  margin: 4px 0;
}

.role-item {
  padding: 2px 0;
  font-size: 11px;
  color: #666;
  background: #f5f5f5;
  padding: 4px 8px;
  margin: 2px 0;
  border-radius: 4px;
}
</style> 