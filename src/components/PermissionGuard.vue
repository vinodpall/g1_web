<template>
  <div class="permission-guard">
    <template v-if="hasPermission">
      <slot />
    </template>
    <template v-else>
      <div class="permission-denied" @click="showPermissionDialog">
        <slot name="fallback">
          <button class="permission-denied-btn" :disabled="true">
            <span class="permission-denied-icon">🔒</span>
            <span class="permission-denied-text">{{ fallbackText }}</span>
          </button>
        </slot>
      </div>
    </template>
    
    <!-- 权限不足提示弹窗 -->
    <div v-if="showDialog" class="permission-dialog-overlay" @click="closeDialog">
      <div class="permission-dialog" @click.stop>
        <div class="permission-dialog-header">
          <span class="permission-dialog-icon">⚠️</span>
          <span class="permission-dialog-title">权限不足</span>
        </div>
        <div class="permission-dialog-content">
          <p class="permission-dialog-message">
            您没有执行此操作的权限<br>
            请联系管理员开通相应权限
          </p>
          <div class="permission-dialog-details" v-if="permissionNames.length > 0">
            <p class="permission-details-title">所需权限：</p>
            <div class="permission-details-list">
              <span 
                v-for="permission in permissionNames" 
                :key="permission"
                class="permission-detail-item"
              >
                {{ permission }}
              </span>
            </div>
          </div>
        </div>
        <div class="permission-dialog-actions">
          <button class="permission-dialog-btn" @click="closeDialog">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePermissionStore } from '../stores/permission'

interface Props {
  permission: string | string[]
  fallbackText?: string
  requireAll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fallbackText: '权限不足',
  requireAll: false
})

const permissionStore = usePermissionStore()
const showDialog = ref(false)

// 检查权限 - 已禁用权限验证，始终返回true
const hasPermission = computed(() => {
  console.log('PermissionGuard权限检查已禁用，允许访问:', props.permission)
  return true
})

// 获取权限名称列表
const permissionNames = computed(() => {
  const permissions = Array.isArray(props.permission) ? props.permission : [props.permission]
  const allPermissions = permissionStore.getAllPermissions
  
  return permissions.map(permissionKey => {
    // 尝试从权限映射中找到对应的权限名称
    const permission = allPermissions.find(p => {
      // 检查是否匹配权限代码或权限名称
      return p.permission_code === permissionKey || 
             p.permission_name.includes(permissionKey.replace(':', '-'))
    })
    
    return permission ? permission.permission_name : permissionKey
  })
})

// 显示权限对话框
const showPermissionDialog = () => {
  showDialog.value = true
}

// 关闭权限对话框
const closeDialog = () => {
  showDialog.value = false
}
</script>

<style scoped>
.permission-guard {
  display: inline-block;
}

.permission-denied {
  cursor: pointer;
}

.permission-denied-btn {
  background: #2a3a4a;
  border: 1px solid #4a5a6a;
  color: #8a9aa9;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: not-allowed;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.permission-denied-btn:hover {
  background: #3a4a5a;
  border-color: #5a6a7a;
}

.permission-denied-icon {
  font-size: 14px;
}

.permission-denied-text {
  color: #8a9aa9;
}

/* 权限对话框样式 */
.permission-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.permission-dialog {
  background: #1a2332;
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
}

.permission-dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.permission-dialog-icon {
  font-size: 20px;
}

.permission-dialog-title {
  color: #ff6b6b;
  font-size: 18px;
  font-weight: 600;
}

.permission-dialog-content {
  margin-bottom: 20px;
}

.permission-dialog-message {
  color: #b6b6b6;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.permission-details-title {
  color: #ff6b6b;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.permission-details-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.permission-detail-item {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

.permission-dialog-actions {
  display: flex;
  justify-content: center;
}

.permission-dialog-btn {
  background: #ff6b6b;
  color: #fff;
  border: none;
  padding: 8px 24px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.permission-dialog-btn:hover {
  background: #ff5252;
  transform: translateY(-1px);
}
</style>
