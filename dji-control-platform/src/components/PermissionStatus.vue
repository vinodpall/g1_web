<template>
  <div class="permission-status">
    <div class="permission-status-header">
      <h4>权限状态</h4>
      <span class="role-badge">{{ currentRole }}</span>
    </div>
    <div class="permission-list">
      <div 
        v-for="permission in permissionList" 
        :key="permission.key"
        class="permission-item"
        :class="{ 'has-permission': hasPermission(permission.key) }"
      >
        <span class="permission-icon">
          {{ hasPermission(permission.key) ? '✓' : '✗' }}
        </span>
        <span class="permission-label">{{ permission.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissionStore } from '../stores/permission'

const permissionStore = usePermissionStore()

const currentRole = computed(() => permissionStore.getCurrentRole)

const permissionList = [
  { key: 'home:view', label: '查看首页' },
  { key: 'home:task_dispatch', label: '任务下发' },
  { key: 'home:emergency_stop', label: '急停控制' },
  { key: 'home:data_export', label: '数据导出' }
]

const hasPermission = (permission: string) => {
  return permissionStore.hasPermission(permission)
}
</script>

<style scoped>
.permission-status {
  background: rgba(34, 58, 94, 0.3);
  border: 1px solid #223a5e;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.permission-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #223a5e;
}

.permission-status-header h4 {
  color: #67d5fd;
  font-size: 16px;
  margin: 0;
}

.role-badge {
  background: #16bbf2;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 14px;
  color: #b6b6b6;
}

.permission-item.has-permission {
  color: #67d5fd;
}

.permission-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.permission-item.has-permission .permission-icon {
  color: #52c41a;
}

.permission-item:not(.has-permission) .permission-icon {
  color: #ff4d4f;
}

.permission-label {
  flex: 1;
}
</style> 