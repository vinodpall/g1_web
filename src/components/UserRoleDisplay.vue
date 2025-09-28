<template>
  <div class="user-role-display">
    <template v-if="roleNames.length > 0">
      <span 
        v-for="(roleName, index) in roleNames" 
        :key="index"
        class="role-tag"
      >
        {{ roleName }}
      </span>
    </template>
    <template v-else>
      <span class="role-tag role-tag-default">
        {{ defaultRole }}
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User, Role } from '../types'

interface Props {
  user: User
}

const props = defineProps<Props>()

// 计算角色名称列表
const roleNames = computed(() => {
  const roles = props.user.roles as (Role | string)[] | ReadonlyArray<Role | string> | undefined
  if (!roles || roles.length === 0) return []
  return Array.from(roles).map((role: Role | string) => (typeof role === 'object' ? role.role_name : role)).filter(Boolean)
})

// 计算默认角色显示
const defaultRole = computed(() => {
  const isSuperuser = props.user.is_superuser as any
  if (isSuperuser === true || isSuperuser === 1 || isSuperuser === '1') {
    return '超级管理员'
  }
  return '普通用户'
})
</script>

<style scoped>
.user-role-display {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.role-tag {
  display: inline-block;
  padding: 2px 8px;
  background: linear-gradient(135deg, #16bbf2 0%, #0d8bb8 100%);
  color: #fff;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(22, 187, 242, 0.3);
}

.role-tag-default {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  box-shadow: 0 1px 3px rgba(108, 117, 125, 0.3);
}

.role-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(22, 187, 242, 0.4);
  transition: all 0.2s ease;
}

.role-tag-default:hover {
  box-shadow: 0 2px 6px rgba(108, 117, 125, 0.4);
}
</style>
