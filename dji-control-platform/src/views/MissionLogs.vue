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
              <span class="mission-top-title">任务日志</span>
            </div>
            <div class="mission-top-row">
              <span class="mission-lib-label">设备筛选</span>
              <div class="mission-top-selects">
                <div style="position: relative; display: inline-block;">
                  <select
                    v-model="filters.device_sn"
                    class="mission-select treeselect-track"
                    style="width: 120px;"
                    @change="onFilterChange"
                  >
                    <option value="">全部设备</option>
                    <option v-for="device in deviceList" :key="device" :value="device">{{ device }}</option>
                  </select>
                  <span
                    class="custom-select-arrow"
                    style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <div style="position: relative; display: inline-block; margin-left: 8px;">
                  <select
                    v-model="filters.job_id"
                    class="mission-select treeselect-track"
                    style="width: 120px;"
                    @change="onFilterChange"
                  >
                    <option value="">全部任务</option>
                    <option v-for="job in jobList" :key="job" :value="job">{{ job }}</option>
                  </select>
                  <span
                    class="custom-select-arrow"
                    style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <div style="position: relative; display: inline-block; margin-left: 8px;">
                  <select
                    v-model="filters.alert_level"
                    class="mission-select treeselect-track"
                    style="width: 90px;"
                    @change="onFilterChange"
                  >
                    <option value="">全部等级</option>
                    <option value="LOW">低</option>
                    <option value="MEDIUM">中</option>
                    <option value="HIGH">高</option>
                  </select>
                  <span
                    class="custom-select-arrow"
                    style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <div style="position: relative; display: inline-block; margin-left: 8px;">
                  <select
                    v-model="filters.status"
                    class="mission-select treeselect-track"
                    style="width: 90px;"
                    @change="onFilterChange"
                  >
                    <option value="">全部状态</option>
                    <option value="PENDING">待处理</option>
                    <option value="HANDLED">已处理</option>
                    <option value="IGNORED">已忽略</option>
                  </select>
                  <span
                    class="custom-select-arrow"
                    style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <button class="mission-btn mission-btn-pause" @click="loadAlerts">搜索</button>
              </div>
            </div>
          </div>
          <div class="mission-table-card card">
            <div class="mission-table-header">
              <div class="mission-th">序号</div>
              <div class="mission-th">航线名称</div>
              <div class="mission-th">任务名称</div>
              <div class="mission-th">目标图片</div>
              <div class="mission-th">目标数量</div>
              <div class="mission-th">置信度</div>
              <div class="mission-th">检测时间</div>
            </div>
            <div class="mission-table-body">
              <div class="mission-tr" v-for="(alert, idx) in alerts" :key="alert.id">
                <div class="mission-td">{{ (currentPage - 1) * pageSize + idx + 1 }}</div>
                <div class="mission-td">{{ alert.wayline_name }}</div>
                <div class="mission-td">{{ alert.mission_name }}</div>
                <div class="mission-td">
                  <template v-if="alert.thumbnail_image_url">
                    <img 
                      v-if="thumbCache[alert.thumbnail_image_url] && !thumbError[alert.thumbnail_image_url]"
                      :src="thumbCache[alert.thumbnail_image_url]"
                      alt="目标图片"
                      class="target-image"
                      @click="handleImageClick(alert.marked_image_url)"
                      style="cursor:pointer;"
                    />
                    <div v-else-if="thumbLoading[alert.thumbnail_image_url]" class="loading-image">
                      <span>加载中...</span>
                    </div>
                    <div v-else-if="thumbError[alert.thumbnail_image_url]" class="loading-image">
                      <span style='color:#f66;'>加载失败</span>
                    </div>
                  </template>
                  <div v-else-if="alert.marked_image_url" class="loading-image">
                    <span>加载中...</span>
                  </div>
                  <span v-else class="no-image">--</span>
                </div>
                <div class="mission-td">{{ alert.target_count }}</div>
                <div class="mission-td">{{ (alert.max_confidence * 100).toFixed(1) }}%</div>
                <div class="mission-td">{{ formatTime(alert.detection_time) }}</div>
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
  <div v-if="showBigImage" class="big-image-mask" @click="closeBigImage">
    <img :src="bigImageUrl" class="big-image" @click.stop />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { visionApi } from '@/api/services'
import { API_DOMAIN } from '@/api/config'
import { useUserStore } from '@/stores/user'
import type { VisionAlert } from '@/types'
import trackListIcon from '@/assets/source_data/svg_data/track_list.svg'
import trackRecordsIcon from '@/assets/source_data/svg_data/track_records.svg'
import trackLogsIcon from '@/assets/source_data/svg_data/track_logs.svg'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

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

// 筛选条件
const filters = ref({
  device_sn: '',
  job_id: '',
  alert_level: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const pageInput = ref('')

// 数据列表
const alerts = ref<VisionAlert[]>([])
const deviceList = ref<string[]>([])
const jobList = ref<string[]>([])

// 获取workspaceId
const getWorkspaceId = () => {
  // 从用户store中获取workspaceId
  if (userStore.user?.workspace_id) {
    return userStore.user.workspace_id
  }
  // 如果用户信息中没有workspaceId，使用默认值
  return '123456'
}

// 加载报警数据
const loadAlerts = async () => {
  try {
    const workspaceId = getWorkspaceId()
    const params = {
      ...filters.value,
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value
    }
    
    const response = await visionApi.getAlerts(workspaceId, params)
    alerts.value = response.alerts
    total.value = response.total
    
    // 更新设备列表和任务列表（去重）
    const devices = new Set<string>()
    const jobs = new Set<string>()
    response.alerts.forEach((alert: VisionAlert) => {
      devices.add(alert.device_sn)
      jobs.add(alert.job_id)
    })
    deviceList.value = Array.from(devices)
    jobList.value = Array.from(jobs)
    
    // 异步下载图片
    downloadImages(response.alerts)
  } catch (error) {
    console.error('加载报警数据失败:', error)
  }
}

// 筛选条件变化
const onFilterChange = () => {
  currentPage.value = 1
  loadAlerts()
}

// 切换页面
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    pageInput.value = page.toString()
    loadAlerts()
  }
}

// 跳转到指定页面
const jumpToPage = () => {
  const page = parseInt(pageInput.value)
  if (page && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadAlerts()
  } else {
    pageInput.value = currentPage.value.toString()
  }
}

// 获取报警等级颜色
const getAlertLevelColor = (level: string) => {
  switch (level) {
    case 'LOW': return '#52c41a'
    case 'MEDIUM': return '#faad14'
    case 'HIGH': return '#ff4d4f'
    default: return '#666'
  }
}

// 获取报警等级文本
const getAlertLevelText = (level: string) => {
  switch (level) {
    case 'LOW': return '低'
    case 'MEDIUM': return '中'
    case 'HIGH': return '高'
    default: return level
  }
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return '#faad14'
    case 'HANDLED': return '#52c41a'
    case 'IGNORED': return '#666'
    default: return '#666'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'PENDING': return '待处理'
    case 'HANDLED': return '已处理'
    case 'IGNORED': return '已忽略'
    default: return status
  }
}

// 格式化时间
const formatTime = (timestamp: number) => {
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

// 图片缓存
const imageCache = ref<Record<string, string>>({})

// 下载并缓存图片
const downloadAndCacheImage = async (imagePath: string) => {
  if (imageCache.value[imagePath]) {
    return // 已经缓存过了
  }

  try {
    const token = userStore.token
    const response = await fetch(`${API_DOMAIN}${imagePath}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'image/*'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }
    
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    
    // 更新缓存
    imageCache.value[imagePath] = url
  } catch (error) {
    console.error('Failed to load image:', error)
  }
}

// 批量下载图片
const downloadImages = async (alerts: VisionAlert[]) => {
  const imagePromises = alerts
    .filter(alert => alert.marked_image_url)
    .map(alert => downloadAndCacheImage(alert.marked_image_url))
  
  await Promise.allSettled(imagePromises)
}

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  // 可以在这里添加错误处理逻辑
}

// 清理图片缓存
const clearImageCache = () => {
  // 释放所有blob URL
  Object.values(imageCache.value).forEach(url => {
    URL.revokeObjectURL(url)
  })
  imageCache.value = {}
}

// 大图弹窗相关
const bigImageUrl = ref('')
const showBigImage = ref(false)

const handleImageClick = async (markedUrl: string) => {
  if (!markedUrl) return
  try {
    const token = userStore.token
    const response = await fetch(`${API_DOMAIN}${markedUrl}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'image/*'
      }
    })
    if (!response.ok) throw new Error('图片下载失败')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    bigImageUrl.value = url
    showBigImage.value = true
  } catch (e) {
    bigImageUrl.value = ''
    showBigImage.value = false
  }
}
const closeBigImage = () => {
  if (bigImageUrl.value) URL.revokeObjectURL(bigImageUrl.value)
  showBigImage.value = false
  bigImageUrl.value = ''
}

const thumbCache = ref<Record<string, string>>({})
const thumbLoading = ref<Record<string, boolean>>({})
const thumbError = ref<Record<string, boolean>>({})

const getThumbnailUrl = async (thumbPath: string) => {
  if (!thumbPath) return ''
  if (thumbCache.value[thumbPath]) return thumbCache.value[thumbPath]
  if (thumbLoading.value[thumbPath]) return ''
  thumbLoading.value[thumbPath] = true
  try {
    const token = userStore.token
    const response = await fetch(`${API_DOMAIN}${thumbPath}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'image/*'
      }
    })
    if (!response.ok) throw new Error('缩略图下载失败')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    thumbCache.value[thumbPath] = url
    thumbError.value[thumbPath] = false
    return url
  } catch {
    thumbError.value[thumbPath] = true
    return ''
  } finally {
    thumbLoading.value[thumbPath] = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadAlerts()
  pageInput.value = currentPage.value.toString()
})

// 监听token变化，清理缓存
watch(() => userStore.token, (newToken, oldToken) => {
  if (newToken !== oldToken) {
    clearImageCache()
  }
})

// 页面加载和alerts变化时批量下载缩略图
watch(alerts, (newAlerts: VisionAlert[]) => {
  newAlerts.forEach((alert: VisionAlert) => {
    if (alert.thumbnail_image_url) getThumbnailUrl(alert.thumbnail_image_url)
  })
}, { immediate: true })
</script>

<style>
@import './mission-common.css';

/* 分页样式 */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
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

.target-image {
  max-width: 60px;
  max-height: 40px;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 1px solid #164159;
  display: block;
  margin: 0 auto;
}

.target-image:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(103, 213, 253, 0.3);
}

.loading-image {
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a2a3a;
  border: 1px solid #164159;
  border-radius: 4px;
  font-size: 10px;
  color: #67d5fd;
}

/* 目标图片列居中显示 */
.mission-td:nth-child(4) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-image {
  color: #666;
  font-size: 12px;
}

.big-image-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.big-image {
  max-width: 80vw;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 4px 24px #000a;
  background: #fff;
}
</style>