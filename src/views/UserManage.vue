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
              <button 
                class="mission-btn mission-btn-pause" 
                @click="handleAddUser"
              >新增用户</button>
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
              <div class="mission-tr" v-for="(user, idx) in users" :key="user.id">
                <div class="mission-td">{{ idx + 1 }}</div>
                <div class="mission-td">{{ user.username }}</div>
                <div class="mission-td">{{ user.userfullname || '-' }}</div>
                <div class="mission-td">
                  <UserRoleDisplay :user="(user as any)" />
                </div>
                <div class="mission-td">{{ '-' }}</div>
                <div class="mission-td">{{ '-' }}</div>
                <div class="mission-td">{{ '-' }}</div>
                <div class="mission-td">{{ formatTime(user.created_time) }}</div>
                <div class="mission-td">
                  <div class="user-action-btns">
                    <button class="icon-btn" title="编辑" @click="onClickEditUser(user)"><img :src="editIcon" /></button>
                    <button class="icon-btn" title="删除" @click="onClickDeleteUser(user)"><img :src="deleteIcon" /></button>
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
            <div class="add-user-form-row"><label>密码：</label><input v-model="addUserForm.password" type="password" class="user-input" placeholder="请输入密码" /></div>
            <div class="add-user-form-row"><label>角色：</label>
              <div class="custom-select-wrapper">
                <select v-model="addUserForm.role" class="user-select">
                  <option value="">请选择角色</option>
                  <option v-for="role in roleList" :key="role.id" :value="role.role_name">
                    {{ role.role_name }}
                  </option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="add-user-form-row"><label>联系方式：</label><input v-model="addUserForm.phone" class="user-input" placeholder="请输入联系方式" /></div>
            <div class="add-user-form-row"><label>性别：</label>
              <div class="custom-select-wrapper">
                <select v-model="addUserForm.gender" class="user-select">
                  <option value="">请选择性别</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
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
            <div class="edit-user-form-row"><label>角色：</label>
              <div class="custom-select-wrapper">
                <select v-model="editUserForm.role" class="user-select">
                  <option value="">请选择角色</option>
                  <option v-for="role in roleList" :key="role.id" :value="role.role_name">
                    {{ role.role_name }}
                  </option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="edit-user-form-row"><label>联系方式：</label><input v-model="editUserForm.phone" class="user-input" placeholder="请输入联系方式" /></div>
            <div class="edit-user-form-row"><label>性别：</label>
              <div class="custom-select-wrapper">
                <select v-model="editUserForm.gender" class="user-select">
                  <option value="">请选择性别</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="edit-user-form-row"><label>身份证号：</label><input v-model="editUserForm.idCard" class="user-input" placeholder="请输入身份证号" /></div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUsers, useRoles } from '../composables/useApi'
import { UserRoleManager } from '../utils/userRoleManager'
import UserRoleDisplay from '../components/UserRoleDisplay.vue'
// 取消按钮上的权限包装，改为点击时校验
import { usePermissionStore } from '../stores/permission'
import PermissionDenied from '../components/PermissionDenied.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import ResultDialog from '../components/ResultDialog.vue'
import userIcon from '@/assets/source_data/svg_data/user.svg'
import roleIcon from '@/assets/source_data/svg_data/role.svg'
import editIcon from '@/assets/source_data/svg_data/edit.svg'
import deleteIcon from '@/assets/source_data/svg_data/delete.svg'

const router = useRouter()
const route = useRoute()

// 使用用户管理API
const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser, assignUserRole, removeUserRole, syncUserRole } = useUsers()

// 使用角色管理API
const { roles: roleList, fetchRoles } = useRoles()

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
const onSearch = async () => {
  try {
    await fetchUsers({ 
      skip: 0, 
      limit: 100,
      search: filter.value.username || filter.value.name 
    })
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

const showAddUserDialog = ref(false)
const showEditUserDialog = ref(false)
const showDeleteUserDialog = ref(false)
const showPermissionDenied = ref(false)
const requiredPermission = ref('')

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
  name: '',
  password: '',
  role: '',
  phone: '',
  gender: '',
  idCard: '',
  is_activate: '1',
  is_superuser: '0',
  workspace_id: '123456',
  user_type: 1
})

const editUserForm = ref({
  username: '',
  name: '',
  role: '',
  phone: '',
  gender: '',
  idCard: '',
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
    // 根据选择的角色名称找到对应的角色ID
    const selectedRole = roleList.value.find(role => role.role_name === addUserForm.value.role)
    
    // 将表单数据转换为API需要的格式
    const apiUserData = {
      username: addUserForm.value.username,
      userfullname: addUserForm.value.name,
      password: addUserForm.value.password,
      is_activate: '1', // 默认激活
      is_superuser: selectedRole ? '0' : '0', // 根据实际角色设置
      created_by: null, // 后端会自动设置
      created_time: new Date().toISOString(), // 后端会自动设置
      updated_by: null, // 后端会自动设置
      updated_time: new Date().toISOString(), // 后端会自动设置
      workspace_id: '123456', // 默认工作空间
      user_type: 1
    }
    
    // 创建用户
    const newUser = await createUser(apiUserData)
    
    // 如果选择了角色，为用户分配角色
    if (selectedRole && newUser) {
      const roleId = UserRoleManager.getRoleIdByName(selectedRole.role_name, roleList.value as any)
      if (roleId) {
        const result = await UserRoleManager.assignRole(newUser.id, roleId, assignUserRole)
        if (result.success) {
          console.log(`用户 ${newUser.username} 已分配角色 ${selectedRole.role_name}`)
        } else {
          console.error('分配角色失败:', result.error)
        }
      }
    }
    
    showAddUserDialog.value = false
    addUserForm.value = { 
      username: '', 
      name: '', 
      password: '',
      role: '', 
      phone: '', 
      gender: '', 
      idCard: '',
      is_activate: '1',
      is_superuser: '0',
      workspace_id: '123456',
      user_type: 1
    }
    
    // 重新获取用户列表以更新显示
    await fetchUsers({ skip: 0, limit: 100 })
    console.log('用户创建成功，列表已刷新')
    
    // 显示成功结果
    resultDialog.value = {
      show: true,
      type: 'success',
      title: '新增用户成功',
      message: '',
      details: ''
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
  // 根据用户的角色信息设置表单
  let roleName = ''
  if (user.roles && user.roles.length > 0) {
    roleName = user.roles[0].role_name // 取第一个角色
  } else if (user.is_superuser === '1') {
    roleName = '超级管理员'
  }
  
  editUserForm.value = { 
    username: user.username,
    name: user.userfullname || '',
    role: roleName,
    phone: '', // API中没有这个字段，置空
    gender: '', // API中没有这个字段，置空
    idCard: '', // API中没有这个字段，置空
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
      // 根据选择的角色名称找到对应的角色ID
      const selectedRole = roleList.value.find(role => role.role_name === editUserForm.value.role)
      
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
      
      // 处理角色分配 - 如果修改了角色，同步更新角色关联
      if (selectedRole) {
        const roleId = UserRoleManager.getRoleIdByName(selectedRole.role_name, roleList.value as any)
        if (roleId) {
          const currentUserRoles = currentUser.value.roles || []
          const currentRoleIds = currentUserRoles.map((role: any) => role.id)
          
          // 检查角色是否发生变化
          if (!currentRoleIds.includes(roleId)) {
            console.log(`用户角色发生变化，从 ${currentUserRoles.map((r: any) => r.role_name).join(', ')} 更新为 ${selectedRole.role_name}`)
            
            // 删除所有当前角色
            for (const currentRoleId of currentRoleIds) {
              try {
                await removeUserRole(currentUser.value.id, currentRoleId)
                console.log(`已删除用户角色: ${currentRoleId}`)
              } catch (err) {
                console.error(`删除用户角色失败: ${currentRoleId}`, err)
              }
            }
            
            // 使用同步接口分配新角色
            try {
              await syncUserRole(currentUser.value.id, roleId)
              console.log(`用户 ${currentUser.value.username} 角色已同步更新为 ${selectedRole.role_name}`)
            } catch (err) {
              console.error('同步角色失败:', err)
              // 如果同步失败，尝试使用普通分配接口
              try {
                await assignUserRole(currentUser.value.id, roleId)
                console.log(`用户 ${currentUser.value.username} 角色已分配为 ${selectedRole.role_name}`)
              } catch (assignErr) {
                console.error('分配新角色失败:', assignErr)
              }
            }
          } else {
            console.log('用户角色未发生变化')
          }
        }
      }
      
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
        role: '', 
        phone: '', 
        gender: '', 
        idCard: '',
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

// 页面加载时获取用户列表
onMounted(async () => {
  try {
    await Promise.all([
      fetchUsers({ skip: 0, limit: 100 }),
      fetchRoles({ skip: 0, limit: 100 })
    ])
    

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
</style>