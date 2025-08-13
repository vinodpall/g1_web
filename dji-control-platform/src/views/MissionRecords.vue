<template>
  <div class="drone-control-main">
    <!-- 侧边栏菜单 -->
    <aside class="sidebar-menu">
      <div class="sidebar-tabs">
        <div
          v-for="tab in sidebarTabs"
          :key="tab.key"
          :class="['sidebar-tab', { active: route.path === tab.path }]"
          @click="handleTabClick(tab)"
        >
          <img :src="tab.icon" :alt="tab.label" />
        </div>
      </div>
    </aside>
    <!-- 主体内容区 -->
    <main class="main-content">
      <div class="main-flex">
        <section class="right-panel">
          <div class="mission-top-card card">
            <div class="mission-top-header">
              <img class="mission-top-logo" src="@/assets/source_data/bg_data/card_logo.png" alt="logo" />
              <span class="mission-top-title">任务记录</span>
            </div>
            <div class="mission-top-row">
              <span class="mission-lib-label">航线库</span>
              <div class="mission-top-selects">
                <div style="position: relative; display: inline-block;">
                  <select
                    v-model="selectedWaylineFile"
                    ref="recordTrackSelectRef"
                    class="mission-select treeselect-track"
                    style="width: 90px;"
                    @mousedown="onRecordTrackSelectMousedown"
                    @keydown="onRecordTrackSelectKeydown"
                    @blur="onRecordTrackSelectBlur"
                    @focus="onRecordTrackSelectFocus"
                    @change="onRecordTrackSelectChange"
                    :disabled="waylineFileLoading"
                  >
                    <option value="">全部航线</option>
                    <option v-for="file in waylineFiles" :key="file.wayline_id" :value="file.wayline_id">
                      {{ file.name }}
                    </option>
                  </select>
                  <span
                    class="custom-select-arrow"
                    @click="openRecordTrackSelect"
                    style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon v-if="!isRecordTrackSelectOpen" points="2,4 6,8 10,4" fill="#fff"/>
                      <polygon v-else points="2,8 6,4 10,8" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <!-- 任务状态筛选 -->
                <div style="position: relative; display: inline-block;">
                  <select
                    v-model="selectedStatus"
                    class="mission-select treeselect-track"
                    style="width: 120px;"
                    @change="onFilterChange"
                  >
                    <option value="">全部状态</option>
                    <option value="0">待执行</option>
                    <option value="1">已发送</option>
                    <option value="2">执行中</option>
                    <option value="3">已暂停</option>
                    <option value="4">已取消</option>
                    <option value="5">执行成功</option>
                    <option value="6">执行失败</option>
                    <option value="7">准备执行</option>
                  </select>
                  <span class="custom-select-arrow" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <!-- 任务类型筛选 -->
                <div style="position: relative; display: inline-block;">
                  <select
                    v-model="selectedTaskType"
                    class="mission-select treeselect-track"
                    style="width: 120px;"
                    @change="onFilterChange"
                  >
                    <option value="">全部类型</option>
                    <option value="0">立即任务</option>
                    <option value="1">定时任务</option>
                    <option value="2">条件任务</option>
                  </select>
                  <span class="custom-select-arrow" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <button class="mission-btn mission-btn-pause" @click="onFilterChange">搜索</button>
              </div>
            </div>
          </div>
          <div class="mission-table-card card">
            <div class="mission-table-header">
              <div class="mission-th">序号</div>
              <div class="mission-th">任务名称</div>
              <div class="mission-th">航线名称</div>
              <div class="mission-th">任务类型</div>
              <div class="mission-th">状态</div>
              <div class="mission-th">开始时间</div>
              <div class="mission-th">结束时间</div>
              <div class="mission-th">创建人</div>
            </div>
            <div class="mission-table-body">
              <div v-if="loading" class="mission-loading">
                加载中...
              </div>
              <div v-else-if="error" class="mission-error">
                {{ error }}
              </div>
              <div v-else-if="jobs.length === 0" class="mission-empty">
                暂无任务记录
              </div>
              <div v-else class="mission-tr" v-for="(job, idx) in jobs" :key="job.job_id">
                <div class="mission-td">{{ (currentPage - 1) * pageSize + idx + 1 }}</div>
                <div class="mission-td">{{ job.name }}</div>
                <div class="mission-td">{{ job.file_name || job.name }}</div>
                <div class="mission-td">{{ getTaskTypeText(job.task_type) }}</div>
                <div class="mission-td">
                  <div v-if="job.status === 6" class="error-tooltip-wrapper">
                    <span
                      class="status-badge status-failed"
                      @click.stop="toggleErrorTooltip(job)"
                      title="点击查看错误信息"
                      style="cursor: pointer;"
                    >
                      {{ getStatusText(job.status) }}
                    </span>
                    <div v-if="openErrorTooltipJobId === job.job_id" class="error-tooltip-content">
                      <div class="error-title">异常信息</div>
                      <div class="error-text">{{ getJobErrorMessage(job) }}</div>
                      <div v-if="job.error_code" class="error-code">错误码：{{ job.error_code }}</div>
                    </div>
                  </div>
                  <span v-else :class="['status-badge', getStatusClass(job.status)]">
                    {{ getStatusText(job.status) }}
                  </span>
                </div>
                <div class="mission-td">{{ formatTimestamp(job.begin_time) }}</div>
                <div class="mission-td">{{ formatTimestamp(job.completed_time) }}</div>
                <div class="mission-td">{{ job.username }}</div>
              </div>
            </div>
            <!-- 分页组件 -->
            <div class="pagination-wrapper" v-if="total > 0">
              <div class="pagination-info">
                共 {{ total }} 条记录，当前第 {{ currentPage }} 页
              </div>
              <div class="pagination-controls">
                <button 
                  class="pagination-btn pagination-btn-icon" 
                  :disabled="currentPage <= 1"
                  @click="changePage(currentPage - 1)"
                  title="上一页"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#67d5fd" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                
                <div class="pagination-page-input">
                  <input 
                    v-model="pageInput" 
                    type="text" 
                    class="page-input"
                    @keyup.enter="jumpToPage"
                    @blur="jumpToPage"
                  />
                  <span class="page-separator">/</span>
                  <span class="total-pages">{{ totalPages }}</span>
                </div>
                
                <button 
                  class="pagination-btn pagination-btn-icon" 
                  :disabled="currentPage >= totalPages"
                  @click="changePage(currentPage + 1)"
                  title="下一页"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#67d5fd" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
                
                <button 
                  class="pagination-btn pagination-btn-jump" 
                  @click="jumpToPage"
                  title="跳转到指定页码"
                >
                  跳转
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import trackListIcon from '@/assets/source_data/svg_data/track_list.svg'
import trackRecordsIcon from '@/assets/source_data/svg_data/track_records.svg'
import trackLogsIcon from '@/assets/source_data/svg_data/track_logs.svg'
import { useWaylineJobs, useDevices } from '../composables/useApi'
import { getErrorMessage } from '@/utils/errorCodes'

const router = useRouter()
const route = useRoute()

// 使用任务记录API
const { jobs, waylineFiles, loading, error, pagination, fetchJobs, fetchWaylineFiles, clearJobs } = useWaylineJobs()
const { getCachedWorkspaceId } = useDevices()

// 航线文件相关
const selectedWaylineFile = ref('')
const waylineFileLoading = ref(false)
// 筛选：任务状态与任务类型
const selectedStatus = ref<string | number>('')
const selectedTaskType = ref<string | number>('')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const pageInput = ref('')

// 失败信息气泡相关
const openErrorTooltipJobId = ref<string | null>(null)
const closeErrorTooltip = () => { openErrorTooltipJobId.value = null }
const toggleErrorTooltip = (job: any) => {
  openErrorTooltipJobId.value = openErrorTooltipJobId.value === job.job_id ? null : job.job_id
}
const getJobErrorMessage = (job: any) => {
  if (!job || job.status !== 6) return ''
  const code = job.error_code ?? job.error?.code ?? job.errorCode
  if (!code && job.error?.message) return job.error.message
  return getErrorMessage(code, undefined, { fallback: '执行失败，具体原因未知' })
}

// 加载航线文件列表
const loadWaylineFiles = async () => {
  const workspaceId = getCachedWorkspaceId()
  if (!workspaceId) {
    console.error('未找到workspace_id，无法加载航线文件')
    return
  }
  
  waylineFileLoading.value = true
  try {
    await fetchWaylineFiles(workspaceId, {
      page: 1,
      page_size: 100
    })
  } catch (err) {
    console.error('加载航线文件失败:', err)
  } finally {
    waylineFileLoading.value = false
  }
}

const sidebarTabs = [
  { key: 'list', label: '航线管理', icon: trackListIcon, path: '/dashboard/mission' },
  { key: 'records', label: '任务记录', icon: trackRecordsIcon, path: '/dashboard/mission-records' },
  { key: 'logs', label: '任务日志', icon: trackLogsIcon, path: '/dashboard/mission-logs' }
]

const handleTabClick = (tab: any) => {
  if (route.path !== tab.path) {
    router.push(tab.path)
  }
}

// 格式化时间戳
const formatTimestamp = (timestamp: string) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取任务状态文本
const getStatusText = (status: number) => {
  const statusMap: { [key: number]: string } = {
    [-1]: '未知状态',
    [0]: '待执行',
    [1]: '已发送',
    [2]: '执行中',
    [3]: '已暂停',
    [4]: '已取消',
    [5]: '执行成功',
    [6]: '执行失败',
    [7]: '准备执行'
  }
  return statusMap[status] || '未知'
}

// 获取任务状态样式
const getStatusClass = (status: number) => {
  const statusClassMap: { [key: number]: string } = {
    [-1]: 'status-unknown',
    [0]: 'status-pending',
    [1]: 'status-sent',
    [2]: 'status-running',
    [3]: 'status-paused',
    [4]: 'status-cancelled',
    [5]: 'status-success',
    [6]: 'status-failed',
    [7]: 'status-pending'
  }
  return statusClassMap[status] || 'status-unknown'
}

// 获取任务类型文本
const getTaskTypeText = (taskType: number) => {
  const taskTypeMap: { [key: number]: string } = {
    [0]: '立即任务',
    [1]: '定时任务',
    [2]: '条件任务'
  }
  return taskTypeMap[taskType] || '未知'
}

// 加载任务记录数据
const loadJobRecords = async () => {
  const workspaceId = getCachedWorkspaceId()
  console.log('获取到的workspace_id:', workspaceId)
  console.log('localStorage中的workspace_id:', localStorage.getItem('workspace_id'))
  console.log('localStorage中的user:', localStorage.getItem('user'))
  console.log('当前选中的航线文件:', selectedWaylineFile.value)
  
  // 先清空现有数据
  clearJobs()
  
  if (!workspaceId) {
    console.error('未找到workspace_id，无法加载任务记录')
    // 尝试从用户信息中获取
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        console.log('从localStorage解析的用户数据:', userData)
        if (userData.workspace_id) {
          console.log('从用户数据中找到workspace_id:', userData.workspace_id)
          await fetchJobs(userData.workspace_id, {
            page: currentPage.value,
            page_size: pageSize.value,
            file_id: selectedWaylineFile.value || undefined,
            status: selectedStatus.value === '' ? undefined : Number(selectedStatus.value),
            task_type: selectedTaskType.value === '' ? undefined : Number(selectedTaskType.value)
          })
          // 更新总数
          if (pagination.value) {
            total.value = pagination.value.total || 0
          }
          return
        }
      } catch (err) {
        console.error('解析用户数据失败:', err)
      }
    }
    return
  }
  
  await fetchJobs(workspaceId, {
    page: currentPage.value,
    page_size: pageSize.value,
    file_id: selectedWaylineFile.value || undefined,
    status: selectedStatus.value === '' ? undefined : Number(selectedStatus.value),
    task_type: selectedTaskType.value === '' ? undefined : Number(selectedTaskType.value)
  })
  
  // 更新总数
  if (pagination.value) {
    total.value = pagination.value.total || 0
  }
  
  // 同步分页输入框
  pageInput.value = currentPage.value.toString()
}

// 页面加载时获取数据
onMounted(async () => {
  // 初始化分页输入框
  pageInput.value = currentPage.value.toString()
  
  await Promise.all([
    loadWaylineFiles(),
    loadJobRecords()
  ])
  // 点击页面空白关闭
  window.addEventListener('click', closeErrorTooltip)
})

// 离开时移除监听
onUnmounted(() => {
  window.removeEventListener('click', closeErrorTooltip)
})

// 切换页面
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    pageInput.value = page.toString()
    loadJobRecords()
  }
}

// 跳转到指定页面
const jumpToPage = () => {
  const page = parseInt(pageInput.value)
  if (page && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadJobRecords()
  } else {
    pageInput.value = currentPage.value.toString()
  }
}

// 筛选条件变化
const onFilterChange = () => {
  currentPage.value = 1
  loadJobRecords()
}

const recordTrackSelectRef = ref<HTMLSelectElement | null>(null)
const isRecordTrackSelectOpen = ref(false)
function openRecordTrackSelect() {
  if (recordTrackSelectRef.value) {
    recordTrackSelectRef.value.focus()
    recordTrackSelectRef.value.click && recordTrackSelectRef.value.click()
    isRecordTrackSelectOpen.value = true
  }
}
function onRecordTrackSelectBlur() {
  isRecordTrackSelectOpen.value = false
}
function onRecordTrackSelectFocus() {
  isRecordTrackSelectOpen.value = true
}
function onRecordTrackSelectChange() {
  isRecordTrackSelectOpen.value = false
  // 航线切换时清空当前数据并刷新任务列表
  console.log('航线切换，当前选中:', selectedWaylineFile.value)
  onFilterChange()
}
function onRecordTrackSelectMousedown() {
  isRecordTrackSelectOpen.value = true
}
function onRecordTrackSelectKeydown(e: KeyboardEvent) {
  if ([" ", "Enter", "ArrowDown"].includes(e.key)) {
    isRecordTrackSelectOpen.value = true
  }
  if (["Escape", "Esc"].includes(e.key)) {
    isRecordTrackSelectOpen.value = false
  }
}
</script>

<style>
@import './mission-common.css';

/* 任务状态样式 */
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: rgba(144, 147, 153, 0.2);
  color: #909399;
  border: 1px solid rgba(144, 147, 153, 0.3);
}

.status-sent {
  background: rgba(64, 158, 255, 0.2);
  color: #409eff;
  border: 1px solid rgba(64, 158, 255, 0.3);
}

.status-running {
  background: rgba(64, 158, 255, 0.2);
  color: #409eff;
  border: 1px solid rgba(64, 158, 255, 0.3);
}

.status-paused {
  background: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
  border: 1px solid rgba(230, 162, 60, 0.3);
}

.status-cancelled {
  background: rgba(144, 147, 153, 0.2);
  color: #909399;
  border: 1px solid rgba(144, 147, 153, 0.3);
}

.status-completed {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
  border: 1px solid rgba(103, 194, 58, 0.3);
}

.status-success {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
  border: 1px solid rgba(103, 194, 58, 0.3);
}

.status-failed {
  background: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
  border: 1px solid rgba(245, 108, 108, 0.3);
}

/* 错误提示气泡 */
.error-tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.error-tooltip-content {
  position: absolute;
  z-index: 10;
  left: 50%;
  top: calc(100% + 6px);
  min-width: 220px;
  max-width: 360px;
  background: #0a2a3a;
  border: 1px solid #164159;
  border-radius: 6px;
  padding: 10px 12px;
  color: #e6a23c;
  box-shadow: 0 6px 20px rgba(0,0,0,0.35);
  transform: translateX(-50%);
}
.error-title {
  font-size: 12px;
  color: #67d5fd;
  margin-bottom: 6px;
}
.error-text {
  font-size: 12px;
  line-height: 1.5;
  color: #ffd8d8;
}
.error-code {
  margin-top: 8px;
  font-size: 12px;
  color: #67d5fd;
  opacity: 0.8;
}

.status-unknown {
  background: rgba(144, 147, 153, 0.2);
  color: #909399;
  border: 1px solid rgba(144, 147, 153, 0.3);
}

/* 加载和错误状态样式 */
.mission-loading,
.mission-error,
.mission-empty {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
  font-size: 14px;
}

.mission-error {
  color: #f56c6c;
}

/* 分页组件样式 */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: none;
  background: transparent;
}

.pagination-info {
  color: #67d5fd;
  font-size: 14px;
  font-weight: 400;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  padding: 6px 12px;
  cursor: pointer;
  border: none;
  transition: background 0.2s, color 0.2s, border 0.2s;
}

.pagination-btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #0c3c56;
  color: #67d5fd;
  border: 1px solid rgba(38, 131, 182, 0.8);
}

.pagination-btn-icon:hover:not(:disabled) {
  background: #0c4666;
  color: #67d5fd;
}

.pagination-btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-page-input {
  display: flex;
  align-items: center;
  gap: 2px;
  background: #0a2a3a;
  border-radius: 4px;
  padding: 0;
  border: 1px solid #164159;
  min-width: 80px;
  height: 36px;
}

.page-input {
  width: 35px;
  height: 36px;
  padding: 0 2px;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 12px;
  color: #fff;
  font-weight: 400;
}

.page-input:focus {
  outline: none;
  background: #0c3c56;
  border-radius: 2px;
}

.page-input::placeholder {
  color: #67d5fd;
}

.page-separator {
  color: #67d5fd;
  font-size: 12px;
  font-weight: 400;
  line-height: 36px;
}

.total-pages {
  color: #67d5fd;
  font-size: 12px;
  font-weight: 400;
  min-width: 16px;
  line-height: 36px;
}

.pagination-btn-jump {
  background: #0c3c56;
  color: #67d5fd;
  border: 1px solid rgba(38, 131, 182, 0.8);
  padding: 6px 12px;
  height: 36px;
  border-radius: 4px;
  font-size: 13px;
}

.pagination-btn-jump:hover {
  background: #0c4666;
  color: #67d5fd;
}
</style>