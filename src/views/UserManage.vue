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
              <span class="mission-top-title">{{ currentTab === 'user' ? '用户管理' : '讲解词管理' }}</span>
            </div>
            <div class="user-top-row">
              <button 
                v-if="currentTab === 'user'"
                class="mission-btn mission-btn-pause" 
                @click="handleAddUser"
              >新增用户</button>
              <!-- 讲解词管理按钮组 -->
              <template v-if="currentTab === 'introduce'">
                <span class="user-label">讲解对象：</span>
                <div class="custom-select-wrapper">
                  <select v-model="selectedIntroduceTarget" class="user-select">
                    <option v-for="target in introduceTargets" :key="target.id" :value="target.id">
                      {{ target.name }}
                    </option>
                  </select>
                  <span class="custom-select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <button class="mission-btn mission-btn-pause introduce-btn" @click="handleAddIntroduceTarget">添加讲解对象</button>
                <button class="mission-btn mission-btn-pause introduce-btn" @click="handleDeleteIntroduceTarget">删除讲解对象</button>
                <button class="mission-btn mission-btn-pause introduce-btn" @click="handleAddIntroduceContent">添加讲解词</button>
                <button class="mission-btn mission-btn-pause introduce-btn" @click="handlePointManage">点位名称管理</button>
              </template>
            </div>
          </div>
          <!-- 用户管理表格 -->
          <div v-if="currentTab === 'user'" class="mission-table-card card">
            <div class="mission-table-header">
              <div class="mission-th">序号</div>
              <div class="mission-th">用户名</div>
              <div class="mission-th">姓名</div>
              <div class="mission-th">邮箱</div>
              <div class="mission-th">状态</div>
              <div class="mission-th">角色</div>
              <div class="mission-th">操作</div>
            </div>
            <div class="mission-table-body">
              <div class="mission-tr" v-for="(user, idx) in users" :key="user.id">
                <div class="mission-td">{{ idx + 1 }}</div>
                <div class="mission-td">{{ user.username }}</div>
                <div class="mission-td">{{ user.full_name || user.userfullname || '-' }}</div>
                <div class="mission-td">{{ user.email || '-' }}</div>
                <div class="mission-td">
                  <span :class="user.is_active ? 'status-active' : 'status-inactive'">
                    {{ user.is_active ? '活跃' : '非活跃' }}
                  </span>
                </div>
                <div class="mission-td">
                  <span :class="user.is_superuser ? 'status-super' : 'status-normal'">
                    {{ user.is_superuser ? '超级管理员' : '普通用户' }}
                  </span>
                </div>
                <div class="mission-td">
                  <div class="user-action-btns">
                    <button class="icon-btn" title="编辑" @click="onClickEditUser(user)"><img :src="editIcon" /></button>
                    <button class="icon-btn" title="删除" @click="onClickDeleteUser(user)"><img :src="deleteIcon" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 讲解词管理内容 -->
          <div v-if="currentTab === 'introduce'" class="mission-table-card card">
            <div v-if="!selectedIntroduceTarget || selectedIntroduceTarget === ''" class="introduce-content">
              <div class="introduce-placeholder">
                <div class="placeholder-icon">📝</div>
                <div class="placeholder-text">讲解词管理功能</div>
                <div class="placeholder-desc">请先选择讲解对象，然后查看和管理讲解词内容</div>
              </div>
            </div>
            
            <!-- 讲解词列表 -->
            <div v-else class="introduce-list-content">
              <div class="introduce-list-table">
                <div class="introduce-table-header">
                  <div class="introduce-th introduce-th-index">序号</div>
                  <div class="introduce-th introduce-th-point">点位名称</div>
                  <div class="introduce-th introduce-th-content">讲解词内容</div>
                  <div class="introduce-th introduce-th-time">创建时间</div>
                  <div class="introduce-th introduce-th-actions">操作</div>
                </div>
                
                <div class="introduce-table-body">
                  <div 
                    v-for="(item, index) in getIntroduceContentsByTarget()" 
                    :key="item.id"
                    class="introduce-tr"
                  >
                    <div class="introduce-td introduce-td-index">{{ index + 1 }}</div>
                    <div class="introduce-td introduce-td-point">{{ item.pointName }}</div>
                    <div class="introduce-td introduce-td-content">
                      <div class="content-preview" @click="showContentDetail(item.content)">
                        {{ item.content }}
                      </div>
                    </div>
                    <div class="introduce-td introduce-td-time">{{ item.createTime }}</div>
                    <div class="introduce-td introduce-td-actions">
                      <button class="icon-btn" title="编辑" @click="editIntroduceContent(item)">
                        <img :src="editIcon" />
                      </button>
                      <button class="icon-btn" title="删除" @click="deleteIntroduceContent(item.id)">
                        <img :src="deleteIcon" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- 空状态 -->
                <div v-if="getIntroduceContentsByTarget().length === 0" class="introduce-empty">
                  <div class="empty-icon">📝</div>
                  <div class="empty-text">暂无讲解词</div>
                  <div class="empty-desc">点击上方"添加讲解词"按钮添加第一条讲解词</div>
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
            <div class="add-user-form-row">
              <label><span class="required">*</span>用户名：</label>
              <input v-model="addUserForm.username" class="user-input" placeholder="请输入用户名" />
            </div>
            <div class="add-user-form-row">
              <label><span class="required">*</span>姓名：</label>
              <input v-model="addUserForm.full_name" class="user-input" placeholder="请输入姓名" />
            </div>
            <div class="add-user-form-row">
              <label><span class="required">*</span>密码：</label>
              <input v-model="addUserForm.password" type="password" class="user-input" placeholder="请输入密码" />
            </div>
            <div class="add-user-form-row">
              <label>邮箱：</label>
              <input v-model="addUserForm.email" type="email" class="user-input" placeholder="请输入邮箱地址" />
            </div>
            <div class="add-user-form-row">
              <label>是否激活：</label>
              <select v-model="addUserForm.is_active" class="user-input">
                <option :value="true">是</option>
                <option :value="false">否</option>
              </select>
            </div>
            <div class="add-user-form-row">
              <label>超级管理员：</label>
              <select v-model="addUserForm.is_superuser" class="user-input">
                <option :value="false">否</option>
                <option :value="true">是</option>
              </select>
            </div>
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-pause" @click="onAddUserConfirm">确认</button>
          <button class="mission-btn mission-btn-cancel" @click="showAddUserDialog = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 权限不足弹窗（与首页一致样式） -->
    <PermissionDenied 
      :show="showPermissionDenied" 
      :required-permission="requiredPermission" 
      @close="showPermissionDenied = false" 
      @contactAdmin="showPermissionDenied = false" 
    />

    <!-- 编辑用户弹窗 -->
    <div v-if="showEditUserDialog" class="custom-dialog-mask">
      <div class="custom-dialog">
        <div class="custom-dialog-title">编辑用户</div>
        <div class="custom-dialog-content">
          <div class="edit-user-form">
            <div class="edit-user-form-row"><label>用户名：</label><input v-model="editUserForm.username" class="user-input" placeholder="请输入用户名" /></div>
            <div class="edit-user-form-row"><label>姓名：</label><input v-model="editUserForm.name" class="user-input" placeholder="请输入姓名" /></div>
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-pause" @click="onEditUserConfirm">确认</button>
          <button class="mission-btn mission-btn-cancel" @click="showEditUserDialog = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 删除用户确认弹窗 -->
    <div v-if="showDeleteUserDialog" class="custom-dialog-mask">
      <div class="custom-dialog delete-confirm-dialog">
        <div class="custom-dialog-title">删除确认</div>
        <div class="custom-dialog-content">
          <div class="delete-confirm-message">
            <div class="delete-icon">⚠️</div>
            <div class="delete-text">
              确定要删除用户"{{ currentUser?.userfullname || currentUser?.name }}"吗？删除后无法恢复，请谨慎操作。
            </div>
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-stop" @click="onDeleteUserConfirm">确认删除</button>
          <button class="mission-btn mission-btn-cancel" @click="showDeleteUserDialog = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 错误提示弹窗 -->
    <ErrorMessage 
      :show="showErrorMessage" 
      :message="errorMessage" 
      @close="closeErrorMessage" 
    />

    <!-- 统一结果弹窗 -->
    <ResultDialog
      :show="resultDialog.show"
      :type="resultDialog.type"
      :title="resultDialog.title"
      :message="resultDialog.message"
      :details="resultDialog.details"
      @close="closeResultDialog"
    />

    <!-- 添加讲解对象弹窗 -->
    <div v-if="showAddIntroduceTargetDialog" class="custom-dialog-mask">
      <div class="custom-dialog">
        <div class="custom-dialog-title">添加讲解对象</div>
        <div class="custom-dialog-content">
          <div class="add-user-form">
            <div class="add-user-form-row">
              <label>对象名称：</label>
              <input v-model="newIntroduceTargetName" class="user-input" placeholder="请输入讲解对象名称" />
            </div>
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-pause" @click="confirmAddIntroduceTarget">确认</button>
          <button class="mission-btn mission-btn-cancel" @click="showAddIntroduceTargetDialog = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 删除讲解对象确认弹窗 -->
    <div v-if="showDeleteIntroduceTargetDialog" class="custom-dialog-mask">
      <div class="custom-dialog delete-confirm-dialog">
        <div class="custom-dialog-title">删除确认</div>
        <div class="custom-dialog-content">
          <div class="delete-confirm-message">
            <div class="delete-icon">⚠️</div>
            <div class="delete-text">
              确定要删除讲解对象"{{ getSelectedTargetName() }}"吗？删除后无法恢复，请谨慎操作。
            </div>
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-stop" @click="confirmDeleteIntroduceTarget">确认删除</button>
          <button class="mission-btn mission-btn-cancel" @click="showDeleteIntroduceTargetDialog = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 添加讲解词弹窗 -->
    <div v-if="showAddIntroduceContentDialog" class="custom-dialog-mask">
      <div class="custom-dialog">
        <div class="custom-dialog-title">添加讲解词</div>
        <div class="custom-dialog-content">
          <div class="add-user-form">
             <div class="add-user-form-row">
               <label>点位：</label>
               <div class="custom-select-wrapper">
                 <select v-model="selectedPointForContent" class="user-select">
                   <option v-for="point in pointNames" :key="point.id" :value="point.id">
                     {{ point.name }}
                   </option>
                 </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="add-user-form-row">
              <label>讲解词：</label>
              <textarea v-model="newIntroduceContent" class="user-textarea" placeholder="请输入讲解词内容" rows="4"></textarea>
            </div>
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-pause" @click="confirmAddIntroduceContent">确认</button>
          <button class="mission-btn mission-btn-cancel" @click="showAddIntroduceContentDialog = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 点位名称管理弹窗 -->
    <div v-if="showPointManageDialog" class="custom-dialog-mask">
      <div class="custom-dialog point-manage-dialog">
        <div class="custom-dialog-title">点位名称管理</div>
        <div class="custom-dialog-content">
          <!-- 添加点位输入区 -->
          <div class="point-add-section">
            <div class="point-input-row">
              <input 
                v-model="newPointName" 
                class="user-input point-input" 
                placeholder="请输入点位名称" 
                @keyup.enter="addPointName"
              />
              <button class="mission-btn mission-btn-pause" @click="addPointName">添加</button>
            </div>
          </div>
          
          <!-- 点位列表 -->
          <div class="point-list-section">
            <div class="point-list-header">点位名称列表</div>
            <div class="point-list">
              <div 
                v-for="point in pointNames" 
                :key="point.id" 
                class="point-item"
              >
                <span class="point-name">{{ point.name }}</span>
                <button 
                  class="point-delete-btn" 
                  @click="deletePointName(point.id)"
                  title="删除"
                >
                  <img :src="deleteIcon" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-cancel" @click="showPointManageDialog = false">关闭</button>
        </div>
      </div>
    </div>

    <!-- 编辑讲解词弹窗 -->
    <div v-if="showEditIntroduceContentDialog" class="custom-dialog-mask">
      <div class="custom-dialog">
        <div class="custom-dialog-title">编辑讲解词</div>
        <div class="custom-dialog-content">
          <div class="add-user-form">
            <div class="add-user-form-row">
              <label>选择点位：</label>
              <div class="custom-select-wrapper">
                <select v-model="editIntroduceContentForm.pointId" class="user-select">
                  <option value="">请选择点位</option>
                  <option v-for="point in pointNames" :key="point.id" :value="point.id">
                    {{ point.name }}
                  </option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="add-user-form-row">
              <label>讲解词：</label>
              <textarea v-model="editIntroduceContentForm.content" class="user-textarea" placeholder="请输入讲解词内容" rows="4"></textarea>
            </div>
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-pause" @click="confirmEditIntroduceContent">确认</button>
          <button class="mission-btn mission-btn-cancel" @click="showEditIntroduceContentDialog = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 查看讲解词详情弹窗 -->
    <div v-if="showContentDetailDialog" class="custom-dialog-mask">
      <div class="custom-dialog content-detail-dialog">
        <div class="custom-dialog-title">讲解词详情</div>
        <div class="custom-dialog-content">
          <div class="content-detail-text">
            {{ contentDetailText }}
          </div>
        </div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-cancel" @click="showContentDetailDialog = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserManagementStore } from '../stores/userManagement'
import { useUserStore } from '../stores/user'
import { usePermissionStore } from '../stores/permission'
import PermissionDenied from '../components/PermissionDenied.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import ResultDialog from '../components/ResultDialog.vue'
import userIcon from '@/assets/source_data/svg_data/user.svg'
import introduceIcon from '@/assets/source_data/robot_source/introduce.svg'
import editIcon from '@/assets/source_data/svg_data/edit.svg'
import deleteIcon from '@/assets/source_data/svg_data/delete.svg'

const router = useRouter()
const route = useRoute()
const userManagementStore = useUserManagementStore()
const userStore = useUserStore()

// 使用用户管理store中的数据
const users = computed(() => userManagementStore.users || [])
const loading = computed(() => userManagementStore.loading)
const error = computed(() => userManagementStore.error)

const sidebarTabs = [
  { key: 'user', label: '用户管理', icon: userIcon, path: '/dashboard/users' },
  { key: 'introduce', label: '讲解词管理', icon: introduceIcon, path: '/dashboard/introduce' }
]
const currentTab = ref(route.path.includes('introduce') ? 'introduce' : 'user')
const handleTabClick = (key: string) => {
  currentTab.value = key
  if (key === 'user' && route.path !== '/dashboard/users') {
    router.push('/dashboard/users')
  } else if (key === 'introduce' && route.path !== '/dashboard/introduce') {
    router.push('/dashboard/introduce')
  }
}

const filter = ref({
  username: '',
  name: '',
  role: ''
})
const onSearch = async () => {
  try {
    const token = userStore.token
    if (!token) {
      console.error('用户未登录')
      errorMessage.value = '用户未登录，请先登录'
      showErrorMessage.value = true
      return
    }
    
    const searchQuery = filter.value.username || filter.value.name
    await userManagementStore.fetchUsers(token, searchQuery, 0, 100)
    
  } catch (err: any) {
    console.error('搜索用户失败:', err)
    
    // 处理错误响应
    let errorMsg = '搜索用户失败，请稍后重试'
    
    if (err.response?.data?.detail) {
      errorMsg = err.response.data.detail
    } else if (err.message) {
      errorMsg = err.message
    }
    
    // 显示错误弹窗
    errorMessage.value = errorMsg
    showErrorMessage.value = true
  }
}

// 页面加载时获取用户列表
const loadUsers = async () => {
  try {
    const token = userStore.token
    if (!token) {
      console.error('用户未登录')
      return
    }
    
    await userManagementStore.fetchUsers(token)
    console.log('用户列表加载完成:', users.value.length, '个用户')
    
  } catch (err: any) {
    console.error('加载用户列表失败:', err)
  }
}

const showAddUserDialog = ref(false)
const showEditUserDialog = ref(false)
const showDeleteUserDialog = ref(false)
const showPermissionDenied = ref(false)
const requiredPermission = ref('')

// 讲解词管理相关状态
const selectedIntroduceTarget = ref('1') // 默认选择第一个
const introduceTargets = ref([
  { id: '1', name: '展厅A' },
  { id: '2', name: '展厅B' },
  { id: '3', name: '展厅C' }
])
const showAddIntroduceTargetDialog = ref(false)
const showDeleteIntroduceTargetDialog = ref(false)
const showAddIntroduceContentDialog = ref(false)
const newIntroduceTargetName = ref('')
const newIntroduceContent = ref('')

// 点位名称管理相关状态
const showPointManageDialog = ref(false)
const newPointName = ref('')
const selectedPointForContent = ref('')
const pointNames = ref([
  { id: '1', name: '入口大厅' },
  { id: '2', name: '展览区A' },
  { id: '3', name: '展览区B' },
  { id: '4', name: '休息区' },
  { id: '5', name: '出口' }
])

// 讲解词内容数据
const introduceContents = ref([
  {
    id: '1',
    targetId: '1', // 讲解对象ID
    pointId: '1',
    pointName: '入口大厅',
    content: '欢迎来到我们的展览馆，这里是入口大厅，请您跟随我继续参观。',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: '2',
    targetId: '1',
    pointId: '2',
    pointName: '展览区A',
    content: '这里是展览区A，展示了我们最新的科技产品和创新成果。',
    createTime: '2024-01-15 11:00:00'
  },
  {
    id: '3',
    targetId: '2',
    pointId: '3',
    pointName: '展览区B',
    content: '展览区B主要展示历史文物和传统工艺品，具有深厚的文化底蕴。',
    createTime: '2024-01-15 11:30:00'
  }
])

// 编辑讲解词相关状态
const showEditIntroduceContentDialog = ref(false)
const editingIntroduceContent = ref(null)
const editIntroduceContentForm = ref({
  pointId: '',
  content: ''
})

// 查看讲解词详情相关状态
const showContentDetailDialog = ref(false)
const contentDetailText = ref('')

// 错误提示相关状态
const showErrorMessage = ref(false)
const errorMessage = ref('')

// 结果弹窗状态
const resultDialog = ref({
  show: false,
  type: 'info' as 'success' | 'error' | 'info',
  title: '',
  message: '',
  details: '' as string | null
})


const addUserForm = ref({
  username: '',
  email: '',
  full_name: '',
  password: '',
  is_active: true,
  is_superuser: false
})

const editUserForm = ref({
  username: '',
  name: '',
  is_activate: '1',
  is_superuser: '0',
  workspace_id: '123456',
  user_type: 1
})

const currentUser = ref<any>(null)

// 权限检查函数（与全站一致，使用权限Store）
const permissionStore = usePermissionStore()
const hasPermission = (permission: string) => permissionStore.hasPermission(permission)

const handleAddUser = () => {
  if (hasPermission('system_management.user.create')) {
    // 重置表单
    addUserForm.value = {
      username: '',
      email: '',
      full_name: '',
      password: '',
      is_active: true,
      is_superuser: false
    }
    showAddUserDialog.value = true
  } else {
    requiredPermission.value = 'system_management.user.create'
    showPermissionDenied.value = true
  }
}

const onClickEditUser = (user: any) => {
  if (hasPermission('system_management.user.edit')) {
    openEditUserDialog(user)
  } else {
    requiredPermission.value = 'system_management.user.edit'
    showPermissionDenied.value = true
  }
}

const onClickDeleteUser = (user: any) => {
  if (hasPermission('system_management.user.delete')) {
    openDeleteUserDialog(user)
  } else {
    requiredPermission.value = 'system_management.user.delete'
    showPermissionDenied.value = true
  }
}

const onAddUserConfirm = async () => {
  try {
    // 表单验证
    if (!addUserForm.value.username.trim()) {
      resultDialog.value = {
        show: true,
        type: 'error',
        title: '新增用户失败',
        message: '',
        details: '请输入用户名'
      }
      return
    }
    
    
    if (!addUserForm.value.full_name.trim()) {
      resultDialog.value = {
        show: true,
        type: 'error',
        title: '新增用户失败',
        message: '',
        details: '请输入姓名'
      }
      return
    }
    
    if (!addUserForm.value.password.trim()) {
      resultDialog.value = {
        show: true,
        type: 'error',
        title: '新增用户失败',
        message: '',
        details: '请输入密码'
      }
      return
    }
    
    const token = userStore.token
    if (!token) {
      resultDialog.value = {
        show: true,
        type: 'error',
        title: '新增用户失败',
        message: '',
        details: '用户未登录，请先登录'
      }
      return
    }
    
    // 准备用户数据
    const userData = {
      username: addUserForm.value.username.trim(),
      email: addUserForm.value.email.trim() || '',
      full_name: addUserForm.value.full_name.trim(),
      password: addUserForm.value.password,
      is_active: addUserForm.value.is_active,
      is_superuser: addUserForm.value.is_superuser
    }
    
    // 创建用户
    await userManagementStore.createUser(token, userData)
    
    // 关闭弹窗并重置表单
    showAddUserDialog.value = false
    addUserForm.value = { 
      username: '',
      email: '',
      full_name: '',
      password: '',
      is_active: true,
      is_superuser: false
    }
    
    console.log('用户创建成功')
    
    // 显示成功结果
    resultDialog.value = {
      show: true,
      type: 'success',
      title: '新增用户成功',
      message: '',
      details: '用户已成功创建'
    }
    
  } catch (err: any) {
    console.error('创建用户失败:', err)
    
    // 处理错误响应
    let errorMsg = '创建用户失败，请稍后重试'
    
    if (err.response?.data?.detail) {
      // 处理 {"detail":"该用户名的用户已存在"} 这种错误
      errorMsg = err.response.data.detail
    } else if (err.message) {
      errorMsg = err.message
    }
    
    // 显示失败结果
    resultDialog.value = {
      show: true,
      type: 'error',
      title: '新增用户失败',
      message: '',
      details: errorMsg
    }
  }
}

// 关闭错误弹窗
const closeErrorMessage = () => {
  showErrorMessage.value = false
  errorMessage.value = ''
}

// 关闭结果弹窗
const closeResultDialog = () => {
  resultDialog.value.show = false
}

// 打开编辑用户弹窗
const openEditUserDialog = (user: any) => {
  currentUser.value = user
  
  editUserForm.value = { 
    username: user.username,
    name: user.userfullname || '',
    is_activate: user.is_activate,
    is_superuser: user.is_superuser,
    workspace_id: user.workspace_id,
    user_type: user.user_type
  }
  showEditUserDialog.value = true
}

// 确认编辑用户
const onEditUserConfirm = async () => {
  if (currentUser.value) {
    try {
      // 将表单数据转换为API需要的格式
      const apiUserData = {
        username: editUserForm.value.username,
        userfullname: editUserForm.value.name,
        is_activate: editUserForm.value.is_activate,
        is_superuser: editUserForm.value.is_superuser,
        workspace_id: editUserForm.value.workspace_id,
        user_type: editUserForm.value.user_type
      }
      
      console.log('更新用户信息:', apiUserData)
      
      // 使用POST接口更新用户信息
      await updateUser(currentUser.value.id.toString(), apiUserData)
      console.log('用户基本信息更新成功')
      
      // 重新获取用户列表以更新显示
      await fetchUsers({ skip: 0, limit: 100 })
      console.log('用户列表已刷新')
      
      // 显示成功结果
      resultDialog.value = {
        show: true,
        type: 'success',
        title: '编辑用户成功',
        message: '',
        details: ''
      }
      
      showEditUserDialog.value = false
      editUserForm.value = { 
        username: '', 
        name: '',
        is_activate: '1',
        is_superuser: '0',
        workspace_id: '123456',
        user_type: 1
      }
    } catch (err: any) {
      console.error('更新用户失败:', err)
      
      // 处理错误响应
      let errorMsg = '更新用户失败，请稍后重试'
      
      if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail
      } else if (err.message) {
        errorMsg = err.message
      }
      
      // 显示失败结果
      resultDialog.value = {
        show: true,
        type: 'error',
        title: '编辑用户失败',
        message: '',
        details: errorMsg
      }
    }
  }
}

// 打开删除用户确认弹窗
const openDeleteUserDialog = (user: any) => {
  currentUser.value = user
  showDeleteUserDialog.value = true
}

// 确认删除用户
const onDeleteUserConfirm = async () => {
  if (currentUser.value) {
    try {
      await deleteUser(currentUser.value.id.toString())
      showDeleteUserDialog.value = false
      
      // 重新获取用户列表以更新显示
      await fetchUsers({ skip: 0, limit: 100 })
      
      // 显示成功结果
      resultDialog.value = {
        show: true,
        type: 'success',
        title: '删除用户成功',
        message: '',
        details: ''
      }
    } catch (err: any) {
      console.error('删除用户失败:', err)
      
      // 处理错误响应
      let errorMsg = '删除用户失败，请稍后重试'
      
      if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail
      } else if (err.message) {
        errorMsg = err.message
      }
      
      // 显示失败结果
      resultDialog.value = {
        show: true,
        type: 'error',
        title: '删除用户失败',
        message: '',
        details: errorMsg
      }
    }
  }
}

// 格式化用户角色显示
const formatUserRole = (user: any) => {
  // 如果用户有角色信息，显示角色名称
  if (user.roles && user.roles.length > 0) {
    const roleNames = user.roles.map((role: any) => {
      // 如果role是对象，取role_name；如果是字符串，直接使用
      return typeof role === 'object' ? role.role_name : role
    }).filter(Boolean) // 过滤掉空值
    
    if (roleNames.length > 0) {
      return roleNames.join(', ')
    }
  }
  
  // 如果没有角色信息，根据is_superuser判断
  if (user.is_superuser === '1') {
    return '超级管理员'
  }
  
  return '普通用户'
}

// 格式化激活状态
const formatActivateStatus = (status: string) => {
  return status === '1' ? '已激活' : '未激活'
}

// 格式化时间
const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
  return new Date(timeStr).toLocaleString('zh-CN')
}

// 讲解词管理相关方法
const handleAddIntroduceTarget = () => {
  showAddIntroduceTargetDialog.value = true
}

const handleDeleteIntroduceTarget = () => {
  if (!selectedIntroduceTarget.value) {
    resultDialog.value = {
      show: true,
      type: 'error',
      title: '操作失败',
      message: '',
      details: '请先选择要删除的讲解对象'
    }
    return
  }
  showDeleteIntroduceTargetDialog.value = true
}

const handleAddIntroduceContent = () => {
  // 默认选择第一个点位
  if (pointNames.value.length > 0) {
    selectedPointForContent.value = pointNames.value[0].id
  }
  showAddIntroduceContentDialog.value = true
}

// 获取选中的讲解对象名称
const getSelectedTargetName = () => {
  const target = introduceTargets.value.find(t => t.id === selectedIntroduceTarget.value)
  return target ? target.name : ''
}

// 确认添加讲解对象
const confirmAddIntroduceTarget = () => {
  if (!newIntroduceTargetName.value.trim()) {
    resultDialog.value = {
      show: true,
      type: 'error',
      title: '操作失败',
      message: '',
      details: '请输入讲解对象名称'
    }
    return
  }
  
  // 生成新的ID
  const newId = (Math.max(...introduceTargets.value.map(t => parseInt(t.id))) + 1).toString()
  
  // 添加到列表
  introduceTargets.value.push({
    id: newId,
    name: newIntroduceTargetName.value.trim()
  })
  
  // 清空输入并关闭弹窗
  newIntroduceTargetName.value = ''
  showAddIntroduceTargetDialog.value = false
  
  resultDialog.value = {
    show: true,
    type: 'success',
    title: '添加成功',
    message: '',
    details: '讲解对象已添加'
  }
}

// 确认删除讲解对象
const confirmDeleteIntroduceTarget = () => {
  const targetIndex = introduceTargets.value.findIndex(t => t.id === selectedIntroduceTarget.value)
  if (targetIndex > -1) {
    introduceTargets.value.splice(targetIndex, 1)
    selectedIntroduceTarget.value = ''
    
    showDeleteIntroduceTargetDialog.value = false
    
    resultDialog.value = {
      show: true,
      type: 'success',
      title: '删除成功',
      message: '',
      details: '讲解对象已删除'
    }
  }
}

// 获取选中的点位名称
const getSelectedPointName = () => {
  const point = pointNames.value.find(p => p.id === selectedPointForContent.value)
  return point ? point.name : ''
}

// 获取当前选中讲解对象的讲解词列表
const getIntroduceContentsByTarget = () => {
  if (!selectedIntroduceTarget.value) return []
  return introduceContents.value.filter(item => item.targetId === selectedIntroduceTarget.value)
}

// 确认添加讲解词
const confirmAddIntroduceContent = () => {
  if (!newIntroduceContent.value.trim()) {
    resultDialog.value = {
      show: true,
      type: 'error',
      title: '操作失败',
      message: '',
      details: '请输入讲解词内容'
    }
    return
  }
  
  // 生成新的ID
  const newId = (Math.max(0, ...introduceContents.value.map(item => parseInt(item.id))) + 1).toString()
  
  // 添加到讲解词列表
  const newIntroduceItem = {
    id: newId,
    targetId: selectedIntroduceTarget.value,
    pointId: selectedPointForContent.value,
    pointName: getSelectedPointName(),
    content: newIntroduceContent.value.trim(),
    createTime: new Date().toLocaleString('zh-CN')
  }
  
  introduceContents.value.push(newIntroduceItem)
  
  // 清空输入并关闭弹窗
  selectedPointForContent.value = ''
  newIntroduceContent.value = ''
  showAddIntroduceContentDialog.value = false
  
  resultDialog.value = {
    show: true,
    type: 'success',
    title: '添加成功',
    message: '',
    details: '讲解词已添加'
  }
}

// 点位名称管理方法
const handlePointManage = () => {
  showPointManageDialog.value = true
}

// 添加点位名称
const addPointName = () => {
  if (!newPointName.value.trim()) {
    resultDialog.value = {
      show: true,
      type: 'error',
      title: '操作失败',
      message: '',
      details: '请输入点位名称'
    }
    return
  }
  
  // 检查是否已存在同名点位
  const exists = pointNames.value.some(point => point.name === newPointName.value.trim())
  if (exists) {
    resultDialog.value = {
      show: true,
      type: 'error',
      title: '操作失败',
      message: '',
      details: '该点位名称已存在'
    }
    return
  }
  
  // 生成新的ID
  const newId = (Math.max(...pointNames.value.map(p => parseInt(p.id))) + 1).toString()
  
  // 添加到列表
  pointNames.value.push({
    id: newId,
    name: newPointName.value.trim()
  })
  
  // 清空输入
  newPointName.value = ''
  
  resultDialog.value = {
    show: true,
    type: 'success',
    title: '添加成功',
    message: '',
    details: '点位名称已添加'
  }
}

// 删除点位名称
const deletePointName = (pointId: string) => {
  const pointIndex = pointNames.value.findIndex(p => p.id === pointId)
  if (pointIndex > -1) {
    pointNames.value.splice(pointIndex, 1)
    
    resultDialog.value = {
      show: true,
      type: 'success',
      title: '删除成功',
      message: '',
      details: '点位名称已删除'
    }
  }
}

// 编辑讲解词
const editIntroduceContent = (item: any) => {
  editingIntroduceContent.value = item
  editIntroduceContentForm.value = {
    pointId: item.pointId,
    content: item.content
  }
  showEditIntroduceContentDialog.value = true
}

// 删除讲解词
const deleteIntroduceContent = (contentId: string) => {
  const contentIndex = introduceContents.value.findIndex(item => item.id === contentId)
  if (contentIndex > -1) {
    introduceContents.value.splice(contentIndex, 1)
    
    resultDialog.value = {
      show: true,
      type: 'success',
      title: '删除成功',
      message: '',
      details: '讲解词已删除'
    }
  }
}

// 显示讲解词详情
const showContentDetail = (content: string) => {
  contentDetailText.value = content
  showContentDetailDialog.value = true
}

// 确认编辑讲解词
const confirmEditIntroduceContent = () => {
  if (!editIntroduceContentForm.value.pointId) {
    resultDialog.value = {
      show: true,
      type: 'error',
      title: '操作失败',
      message: '',
      details: '请选择点位'
    }
    return
  }
  
  if (!editIntroduceContentForm.value.content.trim()) {
    resultDialog.value = {
      show: true,
      type: 'error',
      title: '操作失败',
      message: '',
      details: '请输入讲解词内容'
    }
    return
  }
  
  if (editingIntroduceContent.value) {
    const item = editingIntroduceContent.value as any
    const contentIndex = introduceContents.value.findIndex(c => c.id === item.id)
    
    if (contentIndex > -1) {
      // 获取点位名称
      const selectedPoint = pointNames.value.find(p => p.id === editIntroduceContentForm.value.pointId)
      
      // 更新讲解词
      introduceContents.value[contentIndex] = {
        ...introduceContents.value[contentIndex],
        pointId: editIntroduceContentForm.value.pointId,
        pointName: selectedPoint ? selectedPoint.name : '',
        content: editIntroduceContentForm.value.content.trim()
      }
      
      // 关闭弹窗并清空表单
      showEditIntroduceContentDialog.value = false
      editingIntroduceContent.value = null
      editIntroduceContentForm.value = { pointId: '', content: '' }
      
      resultDialog.value = {
        show: true,
        type: 'success',
        title: '编辑成功',
        message: '',
        details: '讲解词已更新'
      }
    }
  }
}

// 页面加载时获取用户列表
onMounted(async () => {
  console.log('UserManage组件加载')
  try {
    await loadUsers()
    
    // 确保讲解对象有值时默认选择第一个
    if (introduceTargets.value.length > 0 && !selectedIntroduceTarget.value) {
      selectedIntroduceTarget.value = introduceTargets.value[0].id
    }
  } catch (err: any) {
    console.error('获取数据失败:', err)
    
    // 处理错误响应
    let errorMsg = '获取数据失败，请稍后重试'
    
    if (err.response?.data?.detail) {
      errorMsg = err.response.data.detail
    } else if (err.message) {
      errorMsg = err.message
    }
    
    // 显示错误弹窗
    errorMessage.value = errorMsg
    showErrorMessage.value = true
  }
})
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
  flex-wrap: wrap; /* 支持自动换行 */
  overflow-x: visible; /* 避免横向滚动条 */
  padding-bottom: 0;
}
.user-label {
  color: #b6b6b6;
  font-size: 15px;
  margin-right: 2px;
  flex-shrink: 0;
  white-space: nowrap;
}
.user-input, .user-select {
  background: transparent;
  color: #fff;
  border: 1px solid #164159;
  border-radius: 4px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  min-width: 120px;
  max-width: 180px; /* 限制最大宽度 */
  margin-right: 0;
  height: 32px;
  line-height: 32px;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  flex-shrink: 0;
}
.user-input:focus, .user-select:focus {
  outline: none;
  border: 1.5px solid #16bbf2;
  box-shadow: 0 0 0 2px rgba(22,187,242,0.15);
}
.user-select {
  min-width: 140px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: none;
  position: relative;
}
.user-select option {
  background: #172233;
  color: #fff;
}
.custom-select-wrapper {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  min-width: 0;
  max-width: 240px;
  width: 240px;
  vertical-align: middle;
}
.custom-select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
}
.custom-select-wrapper .user-select {
  padding-right: 32px !important;
  background-image: none !important;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}
.mission-btn {
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-action-btns {
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
.icon-btn img {
  width: 18px;
  height: 18px;
  object-fit: contain;
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
/* 保障新增用户弹窗内下拉选择与输入框宽度完全一致 */
.add-user-form .custom-select-wrapper {
  width: 240px;
  max-width: 240px;
  min-width: 0;
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

.permission-dialog {
  min-width: 400px;
  max-width: 450px;
}

.permission-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.permission-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.permission-text {
  color: #b6b6b6;
  font-size: 16px;
  line-height: 1.6;
}

.permission-name {
  color: #ff6b6b;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}
.edit-user-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 8px;
  min-width: 380px;
  max-width: 420px;
}
.edit-user-form-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0;
}
.edit-user-form label {
  color: #b6b6b6;
  font-size: 15px;
  width: 90px;
  text-align: right;
  margin-right: 18px;
  flex-shrink: 0;
}
.edit-user-form .user-input,
.edit-user-form .user-select {
  flex: 1;
  min-width: 0;
  max-width: 240px;
  width: 240px;
  margin-right: 0;
}
.delete-confirm-dialog {
  min-width: 380px;
  max-width: 420px;
}
.delete-confirm-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
}
.delete-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}
.delete-text {
  color: #b6b6b6;
  font-size: 15px;
  line-height: 1.5;
  flex: 1;
}

/* 角色显示列样式 */
.mission-td .user-role-display {
  justify-content: center;
  min-height: 24px;
}

.mission-td .role-tag {
  font-size: 11px;
  padding: 1px 6px;
}

/* 讲解词管理样式 */
.introduce-content {
  padding: 40px 20px;
  text-align: center;
}

.introduce-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.placeholder-icon {
  font-size: 48px;
  opacity: 0.6;
}

.placeholder-text {
  color: #67d5fd;
  font-size: 18px;
  font-weight: 600;
}

.placeholder-desc {
  color: #b6b6b6;
  font-size: 14px;
  line-height: 1.5;
}

.user-textarea {
  background: transparent;
  color: #fff;
  border: 1px solid #164159;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
  outline: none;
  width: 100%;
  min-width: 240px;
  max-width: 240px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.4;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.user-textarea:focus {
  outline: none;
  border: 1.5px solid #16bbf2;
  box-shadow: 0 0 0 2px rgba(22,187,242,0.15);
}

.user-textarea::placeholder {
  color: #666;
}

/* 讲解词管理按钮样式 */
.introduce-btn {
  min-width: 120px;
  max-width: none;
  white-space: nowrap;
}

/* 点位名称管理弹窗样式 */
.point-manage-dialog {
  min-width: 500px;
  max-width: 600px;
}

.point-add-section {
  margin-bottom: 24px;
}

.point-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.point-input {
  flex: 1;
  min-width: 200px;
  max-width: none;
}

.point-list-section {
  width: 100%;
}

.point-list-header {
  color: #67d5fd;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: left;
}

.point-list {
  background: rgba(22, 65, 89, 0.3);
  border-radius: 8px;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.point-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  transition: background 0.2s;
}

.point-item:last-child {
  margin-bottom: 0;
}

.point-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.point-name {
  color: #fff;
  font-size: 14px;
  flex: 1;
}

.point-delete-btn {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.point-delete-btn:hover {
  background: rgba(255, 107, 107, 0.2);
}

.point-delete-btn img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

/* 自定义滚动条样式 */
.point-list::-webkit-scrollbar {
  width: 6px;
}

.point-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.point-list::-webkit-scrollbar-thumb {
  background: rgba(103, 213, 253, 0.6);
  border-radius: 3px;
}

.point-list::-webkit-scrollbar-thumb:hover {
  background: rgba(103, 213, 253, 0.8);
}

/* 讲解词列表样式 */
.introduce-list-content {
  padding: 20px;
}

.introduce-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(22, 65, 89, 0.5);
}

.introduce-list-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.target-name {
  color: #67d5fd;
  font-size: 18px;
  font-weight: 600;
}

.target-desc {
  color: #b6b6b6;
  font-size: 16px;
}

.introduce-list-count {
  color: #b6b6b6;
  font-size: 14px;
}

.introduce-list-table {
  background: rgba(22, 65, 89, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.introduce-table-header {
  display: grid;
  grid-template-columns: 60px 120px 1fr 140px 100px;
  background: rgba(22, 65, 89, 0.6);
  padding: 12px 16px;
  gap: 16px;
}

.introduce-th {
  color: #67d5fd;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
}

.introduce-th-actions {
  text-align: center;
}

.introduce-table-body {
  max-height: 400px;
  overflow-y: auto;
}

.introduce-tr {
  display: grid;
  grid-template-columns: 60px 120px 1fr 140px 100px;
  padding: 12px 16px;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.2s;
}

.introduce-tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.introduce-tr:last-child {
  border-bottom: none;
}

.introduce-td {
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.introduce-td-index {
  justify-content: center;
  color: #b6b6b6;
}

.introduce-td-content {
  overflow: hidden;
}

.content-preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  cursor: pointer;
}

.content-preview:hover {
  color: #67d5fd;
}

.introduce-td-time {
  color: #b6b6b6;
  font-size: 12px;
}

.introduce-td-actions {
  justify-content: center;
  gap: 8px;
}

.introduce-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.6;
  margin-bottom: 16px;
}

.empty-text {
  color: #67d5fd;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-desc {
  color: #b6b6b6;
  font-size: 14px;
  line-height: 1.5;
}

/* 讲解词列表滚动条样式 */
.introduce-table-body::-webkit-scrollbar {
  width: 6px;
}

.introduce-table-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.introduce-table-body::-webkit-scrollbar-thumb {
  background: rgba(103, 213, 253, 0.6);
  border-radius: 3px;
}

.introduce-table-body::-webkit-scrollbar-thumb:hover {
  background: rgba(103, 213, 253, 0.8);
}

/* 查看讲解词详情弹窗样式 */
.content-detail-dialog {
  min-width: 500px;
  max-width: 700px;
}

.content-detail-text {
  background: rgba(22, 65, 89, 0.3);
  border-radius: 8px;
  padding: 20px;
  color: #fff;
  font-size: 15px;
  line-height: 1.8;
  max-height: 400px;
  overflow-y: auto;
  word-wrap: break-word;
  white-space: pre-wrap;
}

/* 内容预览点击样式优化 */
.content-preview {
  cursor: pointer;
  transition: color 0.2s;
}

.content-preview:hover {
  color: #67d5fd;
}

/* 内容详情文本滚动条样式 */
.content-detail-text::-webkit-scrollbar {
  width: 6px;
}

.content-detail-text::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.content-detail-text::-webkit-scrollbar-thumb {
  background: rgba(103, 213, 253, 0.6);
  border-radius: 3px;
}

.content-detail-text::-webkit-scrollbar-thumb:hover {
  background: rgba(103, 213, 253, 0.8);
}

/* 用户状态样式 */
.status-active {
  color: #52c41a;
  font-weight: 500;
}

.status-inactive {
  color: #ff4d4f;
  font-weight: 500;
}

.status-super {
  color: #faad14;
  font-weight: 500;
}

.status-normal {
  color: #67d5fd;
  font-weight: 500;
}

/* 必填字段标识样式 */
.required {
  color: #ff4d4f;
  margin-right: 4px;
}

/* 下拉框样式优化 */
.user-input select,
select.user-input {
  background-color: transparent !important;
}

.user-input select option,
select.user-input option {
  background-color: rgba(0, 0, 0, 0.8) !important;
  color: #fff !important;
}
</style>