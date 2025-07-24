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
          <div class="mission-top-card card user-top-card">
            <div class="mission-top-header">
              <img class="mission-top-logo" src="@/assets/source_data/bg_data/card_logo.png" alt="logo" />
              <span class="mission-top-title">{{ currentTab === 'user' ? '用户管理' : '角色管理' }}</span>
            </div>
            <div class="user-top-row">
              <label class="user-label">用户名：</label>
              <input v-model="filter.username" class="user-input" placeholder="请输入用户名" />
              <label class="user-label">姓名：</label>
              <input v-model="filter.name" class="user-input" placeholder="请输入姓名" />
              <label class="user-label">角色：</label>
              <select v-model="filter.role" class="user-select">
                <option value="">请选择角色</option>
                <option value="超级管理员">超级管理员</option>
                <option value="管理员">管理员</option>
                <option value="操作员">操作员</option>
              </select>
              <button class="mission-btn mission-btn-pause" @click="onSearch">查询</button>
              <button class="mission-btn mission-btn-pause" @click="showAddUserDialog = true">新增用户</button>
            </div>
          </div>
          <div class="mission-table-card card">
            <div class="mission-table-header">
              <div class="mission-th">序号</div>
              <div class="mission-th">用户名</div>
              <div class="mission-th">姓名</div>
              <div class="mission-th">角色</div>
              <div class="mission-th">联系方式</div>
              <div class="mission-th">性别</div>
              <div class="mission-th">身份证号</div>
              <div class="mission-th">注册时间</div>
              <div class="mission-th">操作</div>
            </div>
            <div class="mission-table-body">
              <div class="mission-tr" v-for="(user, idx) in userList" :key="user.id">
                <div class="mission-td">{{ idx + 1 }}</div>
                <div class="mission-td">{{ user.username }}</div>
                <div class="mission-td">{{ user.name }}</div>
                <div class="mission-td">{{ user.role }}</div>
                <div class="mission-td">{{ user.phone }}</div>
                <div class="mission-td">{{ user.gender }}</div>
                <div class="mission-td">{{ user.idCard }}</div>
                <div class="mission-td">{{ user.registerTime }}</div>
                <div class="mission-td">
                  <div class="user-action-btns">
                    <button class="mission-btn mission-btn-pause">编辑</button>
                    <button class="mission-btn mission-btn-stop">删除</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 新增用户弹窗 -->
    <div v-if="showAddUserDialog" class="custom-dialog-mask">
      <div class="custom-dialog">
        <div class="custom-dialog-title">新增用户</div>
        <div class="custom-dialog-content">
          <div class="add-user-form">
            <div class="add-user-form-row"><label>用户名：</label><input v-model="addUserForm.username" class="user-input" placeholder="请输入用户名" /></div>
            <div class="add-user-form-row"><label>姓名：</label><input v-model="addUserForm.name" class="user-input" placeholder="请输入姓名" /></div>
            <div class="add-user-form-row"><label>角色：</label>
              <select v-model="addUserForm.role" class="user-select">
                <option value="">请选择角色</option>
                <option value="超级管理员">超级管理员</option>
                <option value="管理员">管理员</option>
                <option value="操作员">操作员</option>
              </select>
            </div>
            <div class="add-user-form-row"><label>联系方式：</label><input v-model="addUserForm.phone" class="user-input" placeholder="请输入联系方式" /></div>
            <div class="add-user-form-row"><label>性别：</label>
              <select v-model="addUserForm.gender" class="user-select">
                <option value="">请选择性别</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="add-user-form-row"><label>身份证号：</label><input v-model="addUserForm.idCard" class="user-input" placeholder="请输入身份证号" /></div>
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-pause" @click="onAddUserConfirm">确认</button>
          <button class="mission-btn mission-btn-cancel" @click="showAddUserDialog = false">取消</button>
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
const currentTab = ref(route.path.includes('roles') ? 'role' : 'user')
const handleTabClick = (key: string) => {
  const tab = sidebarTabs.find(t => t.key === key)
  if (tab && route.path !== tab.path) {
    router.push(tab.path)
  }
  currentTab.value = key
}

const filter = ref({
  username: '',
  name: '',
  role: ''
})
const onSearch = () => {
  // 查询逻辑
}

const showAddUserDialog = ref(false)
const addUserForm = ref({
  username: '',
  name: '',
  role: '',
  phone: '',
  gender: '',
  idCard: ''
})
const onAddUser = () => {
  showAddUserDialog.value = true
}
const onAddUserConfirm = () => {
  // 这里只做简单演示，实际可校验和提交
  userList.value.push({
    id: userList.value.length + 1,
    username: addUserForm.value.username,
    name: addUserForm.value.name,
    role: addUserForm.value.role,
    phone: addUserForm.value.phone,
    gender: addUserForm.value.gender,
    idCard: addUserForm.value.idCard,
    registerTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
  })
  showAddUserDialog.value = false
  addUserForm.value = { username: '', name: '', role: '', phone: '', gender: '', idCard: '' }
}

// 示例用户数据
const userList = ref([
  { id: 1, username: 'jack', name: '张三', role: '超级管理员', phone: '13215614237', gender: '男', idCard: '320581199010236247', registerTime: '2025-07-06 16:55:19' },
  { id: 2, username: 'rose', name: '李四', role: '管理员', phone: '13215614237', gender: '女', idCard: '320581199010236247', registerTime: '2025-07-06 16:55:19' },
  { id: 3, username: 'john', name: '王五', role: '操作员', phone: '13215614237', gender: '男', idCard: '320581199010236247', registerTime: '2025-07-06 16:55:19' },
  // ...可继续补充
])
</script>

<style scoped>
@import './mission-common.css';
.user-top-card {
  min-height: 92px;
  padding-bottom: 10px;
}
.user-top-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.user-label {
  color: #b6b6b6;
  font-size: 15px;
  margin-right: 2px;
}
.user-input, .user-select {
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
.user-select {
  min-width: 140px;
}
.user-action-btns {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}
.add-user-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 8px;
  min-width: 380px;
  max-width: 420px;
}
.add-user-form-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0;
}
.add-user-form label {
  color: #b6b6b6;
  font-size: 15px;
  width: 90px;
  text-align: right;
  margin-right: 18px;
  flex-shrink: 0;
}
.add-user-form .user-input,
.add-user-form .user-select {
  flex: 1;
  min-width: 0;
  max-width: 240px;
  width: 240px;
  margin-right: 0;
}
.custom-dialog {
  background: linear-gradient(135deg, #1a233a 80%, #16213a 100%);
  border-radius: 18px;
  min-width: 420px;
  max-width: 480px;
  padding: 36px 44px 28px 44px;
  box-shadow: 0 8px 40px #000a, 0 2px 16px #59c0fc33;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.custom-dialog-title {
  font-size: 22px;
  color: #67d5fd;
  font-weight: 700;
  margin-bottom: 22px;
  text-align: center;
  letter-spacing: 1px;
}
.custom-dialog-content {
  width: 100%;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.custom-dialog-actions {
  display: flex;
  gap: 32px;
  justify-content: center;
  width: 100%;
  margin-top: 8px;
}
</style>