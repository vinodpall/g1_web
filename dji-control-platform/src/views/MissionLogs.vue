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
              <span class="mission-lib-label">状态筛选</span>
              <div class="mission-top-selects">
                <div style="position: relative; display: inline-block;">
                  <select
                    v-model="filters.status"
                    class="mission-select treeselect-track"
                    style="width: 120px;"
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
              </div>
            </div>
          </div>
          <div class="mission-table-card card">
            <div class="mission-table-header">
              <div class="mission-th">序号</div>
              <div class="mission-th">航线名称</div>
              <div class="mission-th">任务名称</div>
              <div class="mission-th">目标图片</div>
              <div class="mission-th">位置预览</div>
              <div class="mission-th">目标数量</div>
              <div class="mission-th">算法名称</div>
              <div class="mission-th">检测时间</div>
              <div class="mission-th">操作</div>
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
                <div class="mission-td">
                  <button 
                    v-if="alert.latitude && alert.longitude"
                    class="location-preview-btn"
                    @click="showLocationPreview(alert)"
                    title="查看位置"
                  >
                    预览
                  </button>
                  <span v-else class="no-location">--</span>
                </div>
                <div class="mission-td">{{ alert.target_count }}</div>
                <div class="mission-td">{{ getAlgorithmName(alert.target_type) }}</div>
                <div class="mission-td">{{ formatTime(alert.detection_time) }}</div>
                <div class="mission-td">
                  <button 
                    class="status-btn"
                    :class="getStatusBtnClass(alert.status)"
                    @click="handleStatusClick(alert)"
                    :title="getStatusBtnTitle(alert.status)"
                  >
                    {{ getStatusBtnText(alert.status) }}
                  </button>
                </div>
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
    <div class="big-image-content" @click.stop>
      <img v-if="bigImageUrl" :src="bigImageUrl" class="big-image" @load="handleBigImageLoaded" @error="handleBigImageErrored" />
      <div v-if="bigImageLoading" class="big-image-loading">
        <div class="spinner"></div>
        <div class="loading-text">图片加载中...</div>
      </div>
      <div v-if="bigImageError" class="big-image-error">{{ bigImageError }}</div>
    </div>
  </div>
  
  <!-- 位置预览弹窗 -->
  <div v-if="showLocationModal" class="location-modal-mask" @click="closeLocationModal">
    <div class="location-modal-content" @click.stop>
      <div class="location-modal-header">
        <h3>位置预览</h3>
        <button class="location-modal-close" @click="closeLocationModal">×</button>
      </div>
      <div class="location-modal-body">
        <div id="location-map-container" class="location-map-container"></div>
        <div class="location-map-watermark">
          <div>经度：{{ selectedAlert?.longitude?.toFixed(6) }}　纬度：{{ selectedAlert?.latitude?.toFixed(6) }}</div>
          <div v-if="selectedAlert?.altitude">高度：{{ selectedAlert.altitude.toFixed(2) }} 米</div>
          <div>检测时间：{{ selectedAlert?.detection_time ? formatTime(selectedAlert.detection_time) : '--' }}</div>
          <div>位置：<span style="word-break: break-all;">{{ selectedAddress || '地址查询中...' }}</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 状态处理弹窗 -->
  <div v-if="showStatusDialog" class="status-dialog-mask">
    <div class="status-dialog-content">
      <div class="status-dialog-header">
        <h3>处理告警</h3>
        <button class="status-dialog-close" @click="closeStatusDialog">×</button>
      </div>
      <div class="status-dialog-body">
        <div class="status-form">
          <div class="form-row">
            <label>处理方式：</label>
            <div class="radio-group">
              <label class="radio-item">
                <input 
                  type="radio" 
                  v-model="statusForm.handleType" 
                  value="false_alarm" 
                  name="handleType"
                />
                <span>误报</span>
              </label>
              <label class="radio-item">
                <input 
                  type="radio" 
                  v-model="statusForm.handleType" 
                  value="real_alarm" 
                  name="handleType"
                />
                <span>非误报</span>
              </label>
            </div>
          </div>
          <div class="form-row">
            <label>处理描述：</label>
            <textarea 
              v-model="statusForm.handleNote" 
              class="handle-note-input"
              placeholder="请输入处理描述"
              :class="{ 'required': statusForm.handleType === 'real_alarm' }"
            ></textarea>
          </div>
        </div>
        <div class="status-dialog-actions">
          <button class="status-btn status-btn-cancel" @click="closeStatusDialog">取消</button>
          <button 
            class="status-btn status-btn-submit" 
            @click="submitStatus"
            :disabled="!canSubmit"
          >
            提交
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 详情弹窗 -->
  <div v-if="showDetailDialog" class="detail-dialog-mask">
    <div class="detail-dialog-content">
      <div class="detail-dialog-header">
        <h3>处理详情</h3>
        <button class="detail-dialog-close" @click="closeDetailDialog">×</button>
      </div>
      <div class="detail-dialog-body">
        <div class="detail-info">
          <div class="detail-row">
            <span class="detail-label">处理结果：</span>
            <span class="detail-value" :class="selectedAlert?.status ? getStatusColorClass(selectedAlert.status) : ''">
              {{ selectedAlert?.status ? getStatusText(selectedAlert.status) : '--' }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">处理内容：</span>
            <span class="detail-value">{{ selectedAlert?.handle_note || '--' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">处理人：</span>
            <span class="detail-value">{{ selectedAlert?.handler_name || '--' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">处理时间：</span>
            <span class="detail-value">{{ selectedAlert?.handle_time ? formatTime(selectedAlert.handle_time) : '--' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { visionApi } from '@/api/services'
import { API_BASE_URL } from '@/api/config'
import AMapLoader from '@amap/amap-jsapi-loader'
// 统一构建图片请求URL，避免本地出现 /api/v1/api/v1 的重复
const buildImageFetchUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }
  // 如果后端已经返回了 /api/ 前缀，直接使用
  if (path.startsWith('/api/')) {
    return path
  }
  // 兼容返回以 / 开头但未带 /api 的路径
  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`
  }
  return `${API_BASE_URL}/${path}`
}
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
// 已移除设备和任务筛选

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
    
    // 保留简单数据加载，不再维护设备/任务列表
    
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

// 状态按钮相关函数
const getStatusBtnText = (status: string) => {
  switch (status) {
    case 'PENDING': return '待处理'
    case 'HANDLED': return '已处理'
    case 'IGNORED': return '已忽略'
    default: return status
  }
}

const getStatusBtnClass = (status: string) => {
  switch (status) {
    case 'PENDING': return 'status-btn-pending'
    case 'HANDLED': return 'status-btn-handled'
    case 'IGNORED': return 'status-btn-ignored'
    default: return 'status-btn-default'
  }
}

const getStatusBtnTitle = (status: string) => {
  switch (status) {
    case 'PENDING': return '点击处理告警'
    case 'HANDLED': return '点击查看详情'
    case 'IGNORED': return '点击查看详情'
    default: return '点击操作'
  }
}

const getStatusColorClass = (status: string) => {
  switch (status) {
    case 'PENDING': return 'status-pending'
    case 'HANDLED': return 'status-handled'
    case 'IGNORED': return 'status-ignored'
    default: return 'status-default'
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

// 获取算法名称
const getAlgorithmName = (targetType: string | number) => {
  // 如果target_type是unknown，显示"无"
  if (targetType === 'unknown' || targetType === 'Unknown') {
    return '无'
  }
  
  const algorithmMap: { [key: string]: string } = {
    '49': '常熟1号线路灯',
    '50': '常熟2号线路灯',
    '51': '常熟3号线路灯',
    '52': '常熟楼宇亮化',
    '9': '人车检测'
  }
  return algorithmMap[targetType?.toString()] || `算法${targetType}`
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
    const response = await fetch(buildImageFetchUrl(imagePath), {
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
const bigImageLoading = ref(false)
const bigImageError = ref('')

const handleImageClick = async (markedUrl: string) => {
  if (!markedUrl) return
  // 先弹出弹窗，显示加载中，再去拉图片
  showBigImage.value = true
  bigImageLoading.value = true
  bigImageError.value = ''
  bigImageUrl.value = ''
  try {
    const token = userStore.token
    const response = await fetch(buildImageFetchUrl(markedUrl), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'image/*'
      }
    })
    if (!response.ok) throw new Error('图片下载失败')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    bigImageUrl.value = url
    // 等待 <img> 的 onload 再隐藏 loading
  } catch (e) {
    bigImageUrl.value = ''
    bigImageLoading.value = false
    bigImageError.value = '图片加载失败，请稍后重试'
  }
}

const handleBigImageLoaded = () => {
  bigImageLoading.value = false
}

const handleBigImageErrored = () => {
  bigImageLoading.value = false
  bigImageError.value = '图片加载失败，请稍后重试'
}
const closeBigImage = () => {
  if (bigImageUrl.value) URL.revokeObjectURL(bigImageUrl.value)
  showBigImage.value = false
  bigImageUrl.value = ''
  bigImageLoading.value = false
  bigImageError.value = ''
  // 清理事件绑定，避免内存泄漏（如果弹窗关闭时不再需要）
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
    const response = await fetch(buildImageFetchUrl(thumbPath), {
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
  // 监听从地图缩略图触发的大图打开事件
  window.addEventListener('openBigImageFromMap', async (e: any) => {
    const url = e?.detail?.url as string
    if (url) {
      await handleImageClick(url)
    }
  })
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

// 位置预览相关
const showLocationModal = ref(false)
const selectedAlert = ref<VisionAlert | null>(null)
const selectedAddress = ref<string>('')
let locationMapInstance: any = null

// 状态管理相关
const showStatusDialog = ref(false)
const showDetailDialog = ref(false)
const statusForm = ref({
  handleType: 'false_alarm', // false_alarm: 误报, real_alarm: 非误报
  handleNote: ''
})

// 计算是否可以提交
const canSubmit = computed(() => {
  if (statusForm.value.handleType === 'real_alarm') {
    return statusForm.value.handleNote.trim().length > 0
  }
  return true
})

// 状态处理相关函数
const handleStatusClick = (alert: VisionAlert) => {
  selectedAlert.value = alert
  
  if (alert.status === 'PENDING') {
    // 待处理状态，显示处理弹窗
    console.log('显示状态处理弹窗')
    showStatusDialog.value = true
    // 重置表单
    statusForm.value.handleType = 'false_alarm'
    statusForm.value.handleNote = ''
  } else {
    // 已处理或已忽略状态，显示详情弹窗
    console.log('显示详情弹窗')
    showDetailDialog.value = true
  }
}

const closeStatusDialog = () => {
  console.log('关闭状态弹窗')
  showStatusDialog.value = false
  selectedAlert.value = null
  // 重置表单
  statusForm.value.handleType = 'false_alarm'
  statusForm.value.handleNote = ''
}

const closeDetailDialog = () => {
  showDetailDialog.value = false
  selectedAlert.value = null
}

const submitStatus = async () => {
  if (!selectedAlert.value) return
  
  try {
    const workspaceId = getWorkspaceId()
    const alertId = selectedAlert.value.id
    
    // 根据处理方式确定状态
    let status: 'HANDLED' | 'IGNORED'
    if (statusForm.value.handleType === 'false_alarm') {
      status = 'IGNORED' // 误报标记为已忽略
    } else {
      status = 'HANDLED' // 非误报标记为已处理
    }
    
    const requestData = {
      status: status,
      handle_note: statusForm.value.handleNote
    }
    
    // 调用API更新状态
    await visionApi.updateAlertStatus(workspaceId, alertId, requestData)
    
    // 关闭弹窗
    closeStatusDialog()
    
    // 重新加载数据
    await loadAlerts()
    
    // 显示成功提示
    alert('状态更新成功')
  } catch (error) {
    console.error('更新状态失败:', error)
    alert('状态更新失败，请重试')
  }
}

// 显示位置预览
const showLocationPreview = (alert: VisionAlert) => {
  selectedAlert.value = alert
  selectedAddress.value = ''
  showLocationModal.value = true
  nextTick(() => {
    initLocationMap()
  })
}

// 关闭位置预览
const closeLocationModal = () => {
  showLocationModal.value = false
  selectedAlert.value = null
  selectedAddress.value = ''
  if (locationMapInstance) {
    locationMapInstance.destroy()
    locationMapInstance = null
  }
}

// 初始化位置地图
const initLocationMap = async () => {
  if (!selectedAlert.value?.latitude || !selectedAlert.value?.longitude) return
  
  try {
    // 读取凭据：优先使用通过 vite.define 注入的常量，其次使用 VITE_ 环境变量
    // @ts-ignore
    const definedAmapKey = (typeof __AMAP_KEY__ !== 'undefined' ? __AMAP_KEY__ : '') as string
    // @ts-ignore
    const definedAmapSec = (typeof __AMAP_SECURITY__ !== 'undefined' ? __AMAP_SECURITY__ : '') as string
    const envAmapKey = (import.meta as any).env?.VITE_AMAP_KEY || ''
    const envAmapSec = (import.meta as any).env?.VITE_AMAP_SECURITY || ''
    const amapKey = definedAmapKey || envAmapKey || '6f9eaf51960441fa4f813ea2d7e7cfff'
    const amapSec = definedAmapSec || envAmapSec || ''
    
    if (amapSec) {
      ;(window as any)._AMapSecurityConfig = { securityJsCode: amapSec }
    }
    
    const AMap = await AMapLoader.load({
      key: amapKey,
      version: '2.0',
      plugins: ['AMap.ToolBar', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.MapType', 'AMap.Geocoder']
    })
    
    // 将WGS84坐标转换为GCJ-02坐标
    const wgsLongitude = selectedAlert.value.longitude
    const wgsLatitude = selectedAlert.value.latitude
    const gcjCoords = transformWGS84ToGCJ02(wgsLongitude, wgsLatitude)
    
    locationMapInstance = new AMap.Map('location-map-container', {
      zoom: 16,
      center: [gcjCoords.longitude, gcjCoords.latitude],
      logoEnable: false,
      copyrightEnable: false,
      mapStyle: 'amap://styles/satellite',
      layers: [
        new AMap.TileLayer.Satellite(),
        new AMap.TileLayer.RoadNet()
      ]
    })
    
    // 添加标记点（图标 + 文字“检测点”）
    const marker = new AMap.Marker({
      position: [gcjCoords.longitude, gcjCoords.latitude],
      title: `检测位置`,
      icon: new AMap.Icon({
        image: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" fill="#ff4d4f" stroke="#ffffff" stroke-width="2" />
          </svg>
        `),
        imageSize: new AMap.Size(20, 20),
        size: new AMap.Size(20, 20)
      }),
      anchor: 'center',
      offset: new AMap.Pixel(0, 0)
    })

    // 在图标右侧添加“检测点”标签
    marker.setLabel({
      direction: 'right',
      offset: new AMap.Pixel(6, 0),
      content: `
        <div style="
          background: rgba(255,255,255,0.9);
          color: #ff4d4f;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
        ">检测点</div>
      `
    })

    locationMapInstance.add(marker)

    // 在坐标点上方显示报警缩略图
    try {
      const thumbPath = selectedAlert.value?.thumbnail_image_url as string | undefined
      if (thumbPath) {
        const thumbUrl = await getThumbnailUrl(thumbPath)
        if (thumbUrl) {
          const imageMarker = new AMap.Marker({
            position: [gcjCoords.longitude, gcjCoords.latitude],
            content: `
              <div style="
                width: 40px;
                height: 40px;
                border-radius: 6px;
                overflow: hidden;
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                border: 2px solid rgba(255,255,255,0.85);
                background: rgba(0,0,0,0.2);
              ">
                <img src="${thumbUrl}" style="width: 100%; height: 100%; object-fit: cover; display: block; cursor: zoom-in;" alt="报警图片" onclick="window.dispatchEvent(new CustomEvent('openBigImageFromMap',{ detail: { url: '${selectedAlert.value?.marked_image_url || ''}' } }))"/>
              </div>
            `,
            anchor: 'bottom-center',
            offset: new AMap.Pixel(0, -26)
          })
          locationMapInstance.add(imageMarker)
        }
      }
    } catch {}

    // 逆地理编码：在右侧信息面板显示地址
    try {
      const geocoder = new AMap.Geocoder({
        // 默认城市自动判断
      })
      geocoder.getAddress([gcjCoords.longitude, gcjCoords.latitude], (status: string, result: any) => {
        if (status === 'complete' && result?.regeocode?.formattedAddress) {
          const addr = result.regeocode.formattedAddress as string
          selectedAddress.value = addr
          marker.setTitle(addr)
        }
      })
    } catch {}
    
  } catch (error) {
    console.error('初始化位置地图失败:', error)
  }
}

// WGS84坐标转GCJ-02坐标系
const transformWGS84ToGCJ02 = (wgsLng: number, wgsLat: number) => {
  const PI = Math.PI
  const ee = 0.00669342162296594323
  const a = 6378245.0
  
  if (outOfChina(wgsLng, wgsLat)) {
    return { longitude: wgsLng, latitude: wgsLat }
  }
  
  let dLat = transformLat(wgsLng - 105.0, wgsLat - 35.0)
  let dLng = transformLng(wgsLng - 105.0, wgsLat - 35.0)
  
  const radLat = wgsLat / 180.0 * PI
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
  
  const mgLat = wgsLat + dLat
  const mgLng = wgsLng + dLng
  
  return { longitude: mgLng, latitude: mgLat }
}

// 辅助函数：判断是否在中国境内
const outOfChina = (lng: number, lat: number) => {
  return (lng < 72.004 || lng > 137.8347) || (lat < 0.8293 || lat > 55.8271)
}

// 辅助函数：纬度转换
const transformLat = (lng: number, lat: number) => {
  const PI = Math.PI
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
  return ret
}

// 辅助函数：经度转换
const transformLng = (lng: number, lat: number) => {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0 / 3.0
  return ret
}
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
  z-index: 10050; /* 高于位置预览弹窗，确保置顶 */
  display: flex;
  align-items: center;
  justify-content: center;
}
.big-image-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  min-height: 200px;
}
.big-image-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #67d5fd;
}
.loading-text {
  font-size: 12px;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(103, 213, 253, 0.2);
  border-top-color: #67d5fd;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* 位置预览按钮样式 */
.location-preview-btn {
  background: #0c3c56;
  color: #67d5fd;
  border: 1px solid rgba(38, 131, 182, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.location-preview-btn:hover {
  background: #0c4666;
  color: #67d5fd;
  border-color: #67d5fd;
}

.no-location {
  color: #666;
  font-size: 12px;
}

/* 位置预览弹窗样式 */
.location-modal-mask {
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

.location-modal-content {
  position: relative;
  background: #0a0f1c;
  border: 1px solid #164159;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  height: 80%;
  max-height: 820px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.location-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #164159;
  background: #0c3c56;
}

.location-modal-header h3 {
  color: #67d5fd;
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.location-modal-close {
  background: none;
  border: none;
  color: #67d5fd;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.location-modal-close:hover {
  background: rgba(103, 213, 253, 0.1);
}

.location-modal-body {
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
}

.location-map-container {
  flex: 1;
  height: 100%;
}

/* 地图信息水印，显示经纬度/高度/时间/地址 */
.location-map-watermark {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 2;
  max-width: 50%;
  color: #e6f7ff;
  font-size: 12px;
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(103, 213, 253, 0.25);
  padding: 8px 10px;
  border-radius: 6px;
  backdrop-filter: blur(2px);
}

/* 覆盖 AMap 默认标签样式：去掉白色背景与蓝色边框 */
.location-map-container .amap-marker-label {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.location-info {
  width: 200px;
  padding: 16px;
  background: #0a2a3a;
  border-left: 1px solid #164159;
  overflow-y: auto;
}

.location-info p {
  margin: 8px 0;
  color: #67d5fd;
  font-size: 12px;
  line-height: 1.4;
}

.location-info strong {
  color: #fff;
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.big-image-error {
  color: #f56c6c;
  background: rgba(245,108,108,0.08);
  border: 1px solid rgba(245,108,108,0.4);
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
}
.big-image {
  max-width: 60vw; /* 比位置预览稍小 */
  max-height: 60vh;
  border-radius: 8px;
  box-shadow: 0 4px 24px #000a;
  background: #fff;
}

/* 状态按钮样式 */
.status-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
}

.status-btn-pending {
  background: #faad14;
  color: #fff;
}

.status-btn-pending:hover {
  background: #d48806;
}

.status-btn-handled {
  background: #52c41a;
  color: #fff;
}

.status-btn-handled:hover {
  background: #389e0d;
}

.status-btn-ignored {
  background: #666;
  color: #fff;
}

.status-btn-ignored:hover {
  background: #4d4d4d;
}

.status-btn-default {
  background: #666;
  color: #fff;
}

.status-btn-default:hover {
  background: #4d4d4d;
}

/* 状态弹窗样式 */
.status-dialog-mask {
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
  cursor: pointer;
}

.status-dialog-content {
  background: #172233;
  border-radius: 12px;
  box-shadow: 0 4px 24px #0008;
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  overflow: hidden;
  border: 1px solid #18344a;
  cursor: default;
}

.status-dialog-header {
  padding: 20px 24px;
  border-bottom: 1px solid #18344a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-dialog-header h3 {
  margin: 0;
  color: #67d5fd;
  font-size: 18px;
  font-weight: 600;
}

.status-dialog-close {
  background: none;
  border: none;
  color: #67d5fd;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.status-dialog-close:hover {
  background: rgba(103, 213, 253, 0.1);
}

.status-dialog-body {
  padding: 24px;
}

.status-form {
  margin-bottom: 20px;
}

.form-row {
  margin-bottom: 16px;
}

.form-row label {
  display: block;
  margin-bottom: 8px;
  color: #b8c7d9;
  font-size: 14px;
  font-weight: 500;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
}

.radio-item input[type="radio"] {
  accent-color: #67d5fd;
  cursor: pointer;
}

.handle-note-input {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #164159;
  border-radius: 6px;
  background: transparent;
  color: #fff;
  font-size: 14px;
  resize: vertical;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
}

.handle-note-input:focus {
  outline: none;
  border: 1.5px solid #67d5fd;
  box-shadow: 0 0 0 2px rgba(103, 213, 253, 0.15);
}

.handle-note-input.required {
  border-color: #faad14;
  box-shadow: 0 0 0 1px #faad14 inset;
}

.status-dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.status-btn-cancel {
  background: #666;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.status-btn-cancel:hover {
  background: #4d4d4d;
}

.status-btn-submit {
  background: #67d5fd;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.status-btn-submit:hover {
  background: #4db8e8;
}

.status-btn-submit:disabled {
  background: #666;
  cursor: not-allowed;
}

/* 详情弹窗样式 */
.detail-dialog-mask {
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
  cursor: pointer;
}

.detail-dialog-content {
  background: #172233;
  border-radius: 12px;
  box-shadow: 0 4px 24px #0008;
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  overflow: hidden;
  border: 1px solid #18344a;
  cursor: default;
}

.detail-dialog-header {
  padding: 20px 24px;
  border-bottom: 1px solid #18344a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-dialog-header h3 {
  margin: 0;
  color: #67d5fd;
  font-size: 18px;
  font-weight: 600;
}

.detail-dialog-close {
  background: none;
  border: none;
  color: #67d5fd;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.detail-dialog-close:hover {
  background: rgba(103, 213, 253, 0.1);
}

.detail-dialog-body {
  padding: 24px;
}

.detail-info {
  color: #fff;
}

.detail-row {
  display: flex;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #18344a;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  min-width: 100px;
  color: #b8c7d9;
  font-size: 14px;
}

.detail-value {
  flex: 1;
  color: #fff;
  font-size: 14px;
}

.status-pending {
  color: #faad14;
}

.status-handled {
  color: #52c41a;
}

.status-ignored {
  color: #666;
}

.status-default {
  color: #666;
}
</style>