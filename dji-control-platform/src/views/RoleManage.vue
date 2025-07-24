<template>
  <div class="drone-control-main">
    <!-- 侧边栏 -->
    <aside class="sidebar-menu">
      <div class="sidebar-tabs">
        <div
          v-for="tab in sidebarTabs"
          :key="tab.key"
          :class="['sidebar-tab', { active: currentTab === tab.key }]"
          @click="handleTabClick(tab.key)"
        >
          <img :src="tab.icon" :alt="tab.label" />
        </div>
      </div>
    </aside>
    <!-- 主体内容区 -->
    <main class="main-content">
      <div class="main-flex">
        <section class="right-panel">
          <div class="mission-top-card card role-top-card">
            <div class="mission-top-header">
              <img class="mission-top-logo" src="@/assets/source_data/bg_data/card_logo.png" alt="logo" />
              <span class="mission-top-title">角色管理</span>
            </div>
            <div class="role-top-row">
              <label class="role-label">角色名称：</label>
              <input v-model="filter.roleName" class="role-input" placeholder="请输入角色名" />
              <button class="mission-btn mission-btn-pause" @click="onSearch">查询</button>
              <button class="mission-btn mission-btn-pause" @click="showAddRoleDialog = true">新增角色</button>
            </div>
          </div>
          <div class="mission-table-card card">
            <div class="mission-table-header">
              <div class="mission-th">序号</div>
              <div class="mission-th">角色名称</div>
              <div class="mission-th">创建时间</div>
              <div class="mission-th">操作</div>
            </div>
            <div class="mission-table-body">
              <div class="mission-tr" v-for="(role, idx) in roleList" :key="role.id">
                <div class="mission-td">{{ idx + 1 }}</div>
                <div class="mission-td">{{ role.roleName }}</div>
                <div class="mission-td">{{ role.createTime }}</div>
                <div class="mission-td">
                  <div class="role-action-btns">
                    <button class="icon-btn" title="查看"><svg width="18" height="18" viewBox="0 0 20 20"><path fill="#16BBF2" d="M10 4c-5 0-8 6-8 6s3 6 8 6 8-6 8-6-3-6-8-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6a2 2 0 100 4 2 2 0 000-4z"/></svg></button>
                    <button class="icon-btn" title="编辑"><svg width="18" height="18" viewBox="0 0 20 20"><path fill="#67d5fd" d="M14.7 2.3a1 1 0 011.4 0l1.6 1.6a1 1 0 010 1.4l-9.2 9.2-2.8.8.8-2.8 9.2-9.2zM3 17h14v2H3v-2z"/></svg></button>
                    <button class="icon-btn" title="删除"><svg width="18" height="18" viewBox="0 0 20 20"><path fill="#fd6767" d="M6 7v9a2 2 0 002 2h4a2 2 0 002-2V7H6zm2-3h4a1 1 0 011 1v1H7V5a1 1 0 011-1zm9 1v2H5V5a3 3 0 013-3h4a3 3 0 013 3z"/></svg></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    <!-- 新增角色弹窗 -->
    <div v-if="showAddRoleDialog" class="custom-dialog-mask">
      <div class="custom-dialog">
        <div class="custom-dialog-title">新增角色</div>
        <div class="custom-dialog-content">
          <div class="add-role-form">
            <div class="add-role-form-row">
              <label>角色名称：</label>
              <input v-model="addRoleForm.roleName" class="role-input" placeholder="请输入角色名称" />
            </div>
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-pause" @click="onAddRoleConfirm">确认</button>
          <button class="mission-btn mission-btn-cancel" @click="showAddRoleDialog = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import userIcon from '@/assets/source_data/svg_data/user.svg'
import roleIcon from '@/assets/source_data/svg_data/role.svg'

const router = useRouter()
const route = useRoute()

const sidebarTabs = [
  { key: 'user', label: '用户管理', icon: userIcon, path: '/dashboard/users' },
  { key: 'role', label: '角色管理', icon: roleIcon, path: '/dashboard/roles' }
]
const currentTab = ref('role')
const handleTabClick = (key: string) => {
  const tab = sidebarTabs.find(t => t.key === key)
  if (tab && route.path !== tab.path) {
    router.push(tab.path)
  }
  currentTab.value = key
}

const filter = ref({
  roleName: ''
})
const onSearch = () => {
  // 查询逻辑
}
const showAddRoleDialog = ref(false)
const addRoleForm = ref({
  roleName: ''
})
const onAddRoleConfirm = () => {
  roleList.value.push({
    id: roleList.value.length + 1,
    roleName: addRoleForm.value.roleName,
    createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
  })
  showAddRoleDialog.value = false
  addRoleForm.value = { roleName: '' }
}

const roleList = ref([
  { id: 1, roleName: '超级管理员', createTime: '2025-07-06 16:55:19' },
  { id: 2, roleName: '管理员', createTime: '2025-07-06 16:55:19' },
  { id: 3, roleName: '操作员', createTime: '2025-07-06 16:55:19' },
  { id: 4, roleName: '演示员', createTime: '2025-07-06 16:55:19' }
])
</script>

<style scoped>
@import './mission-common.css';
.role-top-card {
  min-height: 92px;
  padding-bottom: 10px;
}
.role-top-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.role-label {
  color: #b6b6b6;
  font-size: 15px;
  margin-right: 2px;
}
.role-input {
  background: transparent;
  color: #fff;
  border: 1px solid #164159;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 14px;
  outline: none;
  min-width: 120px;
  margin-right: 0;
  height: 32px;
  line-height: 32px;
}
.role-action-btns {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}
.icon-btn {
  background: transparent;
  border: none;
  padding: 0 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}
.icon-btn:hover {
  background: #223a5e44;
  border-radius: 4px;
}
.add-role-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 320px;
  max-width: 400px;
}
.add-role-form-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.add-role-form label {
  color: #b6b6b6;
  font-size: 15px;
  width: 90px;
  text-align: right;
  margin-right: 18px;
  flex-shrink: 0;
}
.add-role-form .role-input {
  flex: 1;
  min-width: 0;
  max-width: 240px;
  width: 240px;
  margin-right: 0;
}
</style>