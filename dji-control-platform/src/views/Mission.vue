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
      <div class="sidebar-menu-bottom">
        <img src="@/assets/source_data/svg_data/sheet.svg" alt="菜单" />
      </div>
    </aside>
    <!-- 主体内容区 -->
    <main class="main-content">
      <div class="main-flex">
        <section class="right-panel">
          <div class="mission-top-card card">
            <div class="mission-top-header">
              <img class="mission-top-logo" src="@/assets/source_data/bg_data/card_logo.png" alt="logo" />
              <span class="mission-top-title">航线管理</span>
            </div>
            <div class="mission-top-row">
              <span class="mission-lib-label">航线库</span>
              <div class="mission-top-selects">
                <div style="position: relative; display: inline-block;">
                  <select
                    v-model="selectedTrack"
                    ref="trackSelectRef"
                    class="mission-select treeselect-track"
                    style="width: 90px;"
                    @mousedown="onTrackSelectMousedown"
                    @keydown="onTrackSelectKeydown"
                    @blur="onTrackSelectBlur"
                    @focus="onTrackSelectFocus"
                    @change="onTrackSelectChange"
                    :disabled="trackFileLoading"
                  >
                    <option v-for="file in waylineFiles" :key="file.wayline_id" :value="file.wayline_id">
                      {{ file.name }}
                    </option>
                  </select>
                  <span
                    class="custom-select-arrow"
                    @click="openTrackSelect"
                    style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon v-if="!isTrackSelectOpen" points="2,4 6,8 10,4" fill="#fff"/>
                      <polygon v-else points="2,8 6,4 10,8" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <div class="mission-top-btns">
                  <button class="mission-btn mission-btn-pause" @click="handleDeleteTrack">删除航线</button>
                  <button class="mission-btn mission-btn-pause" @click="handleAddTrack">新增航线</button>
                  <button class="mission-btn mission-btn-pause" @click="handleDispatchTask">下发任务</button>
                </div>
              </div>
            </div>
          </div>
          <div class="mission-table-card card">
            <div class="mission-table-header">
              <div class="mission-th">航点编号</div>
              <div class="mission-th">坐标</div>
              <div class="mission-th">航点类型</div>
              <div class="mission-th">操作</div>
            </div>
            <div class="mission-table-body">
              <div class="mission-tr" v-for="waypoint in waypointsData" :key="waypoint.index">
                <div class="mission-td">{{ waypoint.index + 1 }}</div>
                <div class="mission-td">{{ formatCoordinates(waypoint.coordinates) }}</div>
                <div class="mission-td mission-icons">
                  <span v-for="action in waypoint.actions" :key="action.actionId" class="mission-icon">
                    <img :src="getActionIcon(action.type)" :title="action.typeName" />
                  </span>
                </div>
                <div class="mission-td">
                  <button class="mission-btn mission-btn-pause" disabled>删除航点</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    <!-- 弹窗等 -->
    <div v-if="confirmDialog.visible" class="custom-dialog-mask">
      <div class="custom-dialog">
        <div class="custom-dialog-title">操作确认</div>
        <div class="custom-dialog-content">{{ confirmDialog.message }}</div>
        <div class="custom-dialog-actions">
          <button class="mission-btn mission-btn-pause" @click="onConfirmDialogOk">确定</button>
          <button v-if="confirmDialog.showCancel" class="mission-btn mission-btn-cancel" @click="onConfirmDialogCancel">取消</button>
        </div>
      </div>
    </div>
    <div v-if="uploadDialog.visible" class="custom-dialog-mask">
      <div class="custom-dialog upload-dialog">
        <div class="custom-dialog-title">上传航线文件</div>
        <div class="custom-dialog-content upload-dialog-content">
          <label class="upload-file-label">
            <input
              type="file"
              accept=".kml,.wpml"
              @change="onFileChange"
              ref="fileInputRef"
              class="upload-file-input"
            />
            <span class="upload-file-btn">选择文件</span>
            <span class="upload-file-tip">仅支持 .kml 或 .wpml 文件</span>
          </label>
          <div v-if="uploadDialog.fileName" class="upload-file-name">
            <svg class="upload-file-icon" viewBox="0 0 20 20" width="18" height="18"><path fill="#67d5fd" d="M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.83A2 2 0 0 0 17.41 7l-4.42-4.42A2 2 0 0 0 11.17 2H4zm6 1.5V8a1 1 0 0 0 1 1h4.5L10 3.5z"></path></svg>
            {{ uploadDialog.fileName }}
          </div>
        </div>
        <div class="custom-dialog-actions upload-dialog-actions">
          <button class="mission-btn mission-btn-pause" :disabled="!uploadDialog.file" @click="onUploadConfirm">上传</button>
          <button class="mission-btn mission-btn-cancel" @click="onUploadCancel">取消</button>
        </div>
      </div>
    </div>
    <div v-if="dispatchTaskDialog.visible" class="custom-dialog-mask">
      <div class="dispatch-task-modal">
        <div class="dispatch-task-modal-content">
          <div class="dispatch-task-title">下发任务</div>
          <div class="dispatch-task-form">
            <div class="dispatch-task-row">
              <label>任务名称：</label>
              <input 
                v-model="dispatchTaskDialog.form.name" 
                class="dispatch-task-input" 
                placeholder="请输入任务名称"
              />
            </div>
            <div class="dispatch-task-row">
              <label>设备序列号：</label>
              <input 
                v-model="dispatchTaskDialog.form.dock_sn" 
                class="dispatch-task-input" 
                disabled
              />
            </div>
            <div class="dispatch-task-row">
              <label>航线文件ID：</label>
              <input 
                v-model="dispatchTaskDialog.form.file_id" 
                class="dispatch-task-input" 
                disabled
              />
            </div>
            <div class="dispatch-task-row">
              <label>任务类型：</label>
              <div class="custom-select-wrapper">
                <select v-model="dispatchTaskDialog.form.task_type" class="mission-select">
                  <option :value="0">立即任务</option>
                  <option :value="1">定时任务</option>
                  <option :value="2">条件任务</option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
            </div>
            <div v-if="dispatchTaskDialog.form.task_type === 1 || dispatchTaskDialog.form.task_type === 2" class="dispatch-task-row">
              <label>开始时间：</label>
              <input 
                v-model="dispatchTaskDialog.form.begin_time" 
                type="datetime-local" 
                class="dispatch-task-input"
              />
            </div>
            <div class="dispatch-task-row">
              <label>返航高度：</label>
              <input 
                v-model="dispatchTaskDialog.form.rth_altitude" 
                type="number" 
                class="dispatch-task-input" 
                placeholder="100"
              />
              <span class="unit-label">米</span>
            </div>
            <div class="dispatch-task-row">
              <label>返航模式：</label>
              <div class="custom-select-wrapper">
                <select v-model="dispatchTaskDialog.form.rth_mode" class="mission-select">
                  <option :value="0">自动模式</option>
                  <option :value="1">设定高度模式</option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="dispatch-task-row">
              <label>失控动作：</label>
              <div class="custom-select-wrapper">
                <select v-model="dispatchTaskDialog.form.out_of_control_action" class="mission-select">
                  <option :value="0">返航</option>
                  <option :value="1">悬停</option>
                  <option :value="2">降落</option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="dispatch-task-row">
              <label>失控处理：</label>
              <div class="custom-select-wrapper">
                <select v-model="dispatchTaskDialog.form.exit_wayline_when_rc_lost" class="mission-select">
                  <option :value="0">继续执行航线</option>
                  <option :value="1">退出航线</option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="dispatch-task-row">
              <label>精度类型：</label>
              <div class="custom-select-wrapper">
                <select v-model="dispatchTaskDialog.form.wayline_precision_type" class="mission-select">
                  <option :value="0">标准精度</option>
                  <option :value="1">高精度RTK任务</option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div class="dispatch-task-actions">
            <button class="mission-btn mission-btn-cancel" @click="onDispatchTaskCancel">取消</button>
            <button class="mission-btn mission-btn-pause" @click="onDispatchTaskConfirm">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import trackListIcon from '@/assets/source_data/svg_data/track_list.svg'
import trackRecordsIcon from '@/assets/source_data/svg_data/track_records.svg'
import trackLogsIcon from '@/assets/source_data/svg_data/track_logs.svg'
import { useWaylineJobs, useDevices } from '../composables/useApi'
import icon360Photo from '@/assets/source_data/svg_data/task_line_svg/360_photo.svg'
import iconAbsPhoto from '@/assets/source_data/svg_data/task_line_svg/abs_photo.svg'
import iconBigger from '@/assets/source_data/svg_data/task_line_svg/bigger.svg'
import iconHover from '@/assets/source_data/svg_data/task_line_svg/hover.svg'
import iconIntervalDistance from '@/assets/source_data/svg_data/task_line_svg/interval_distance.svg'
import iconIntervalStop from '@/assets/source_data/svg_data/task_line_svg/interval_stop.svg'
import iconIntervalTime from '@/assets/source_data/svg_data/task_line_svg/interval_time.svg'
import iconLeftRight from '@/assets/source_data/svg_data/task_line_svg/left_right.svg'
import iconRightDown from '@/assets/source_data/svg_data/task_line_svg/right_down.svg'
import iconStartVideo from '@/assets/source_data/svg_data/task_line_svg/start_video.svg'
import iconStopVideo from '@/assets/source_data/svg_data/task_line_svg/stop_video.svg'
import iconTakePhoto from '@/assets/source_data/svg_data/task_line_svg/take_photo.svg'

const router = useRouter()
const route = useRoute()

// 使用航线文件API
const { waylineFiles, waylineDetail, fetchWaylineFiles, fetchWaylineDetail, createJob } = useWaylineJobs()
const { getCachedWorkspaceId, getCachedDeviceSns } = useDevices()

// 航线文件相关
const selectedTrack = ref('')
const trackFileLoading = ref(false)

// 加载航线文件列表
const loadWaylineFiles = async () => {
  const workspaceId = getCachedWorkspaceId()
  if (!workspaceId) {
    console.error('未找到workspace_id，无法加载航线文件')
    return
  }
  
  trackFileLoading.value = true
  try {
    await fetchWaylineFiles(workspaceId, {
      page: 1,
      page_size: 100
    })
    // 默认选择第一条数据
    if (waylineFiles.value && waylineFiles.value.length > 0) {
      selectedTrack.value = waylineFiles.value[0].wayline_id
      console.log('默认选择第一个航线:', selectedTrack.value)
      // 立即加载第一个航线的详情
      await loadWaylineDetail(selectedTrack.value)
    }
  } catch (err) {
    console.error('加载航线文件失败:', err)
  } finally {
    trackFileLoading.value = false
  }
}

// 加载航线详情
const loadWaylineDetail = async (waylineId: string) => {
  const workspaceId = getCachedWorkspaceId()
  if (!workspaceId || !waylineId) {
    console.error('加载航线详情失败: workspaceId 或 waylineId 为空', { workspaceId, waylineId })
    return
  }
  
  try {
    await fetchWaylineDetail(workspaceId, waylineId)
    console.log('航线详情加载成功')
  } catch (err) {
    console.error('加载航线详情失败:', err)
  }
}

// 监听选中的航线变化
watch(selectedTrack, (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    console.log('航线选择变化，加载详情:', newValue)
    loadWaylineDetail(newValue)
  }
}, { immediate: false })

// 计算属性：获取航点数据
const waypointsData = computed(() => {
  if (!waylineDetail.value || !waylineDetail.value.waylines || waylineDetail.value.waylines.length === 0) {
    return []
  }
  return waylineDetail.value.waylines[0].waypoints || []
})

// 获取当前航线名称
const getCurrentWaylineName = () => {
  const currentWayline = waylineFiles.value.find(f => f.wayline_id === selectedTrack.value)
  return currentWayline ? currentWayline.name : '未知航线'
}

// 格式化坐标显示
const formatCoordinates = (coordinates: [number, number]) => {
  if (!coordinates || coordinates.length !== 2) {
    return '-'
  }
  const [lng, lat] = coordinates
  return `${lng.toFixed(6)}, ${lat.toFixed(6)}`
}

// 获取动作图标
const getActionIcon = (actionType: string) => {
  const iconMap: { [key: string]: string } = {
    'rotateYaw': iconLeftRight,
    'gimbalRotate': iconHover,
    'zoom': iconBigger,
    'startRecord': iconStartVideo,
    'stopRecord': iconStopVideo,
    'takePhoto': iconTakePhoto,
    'focus': iconAbsPhoto
  }
  return iconMap[actionType] || iconTakePhoto
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

const trackSelectRef = ref<HTMLSelectElement | null>(null)
const isTrackSelectOpen = ref(false)
function openTrackSelect() {
  if (trackSelectRef.value) {
    trackSelectRef.value.focus()
    trackSelectRef.value.click && trackSelectRef.value.click()
    isTrackSelectOpen.value = true
  }
}
function onTrackSelectBlur() {
  isTrackSelectOpen.value = false
}
function onTrackSelectFocus() {
  isTrackSelectOpen.value = true
}
function onTrackSelectChange() {
  isTrackSelectOpen.value = false
  console.log('下拉选择框变化事件触发')
}
function onTrackSelectMousedown() {
  isTrackSelectOpen.value = true
}
function onTrackSelectKeydown(e: KeyboardEvent) {
  if ([" ", "Enter", "ArrowDown"].includes(e.key)) {
    isTrackSelectOpen.value = true
  }
  if (["Escape", "Esc"].includes(e.key)) {
    isTrackSelectOpen.value = false
  }
}

const confirmDialog = ref({
  visible: false,
  message: '',
  onOk: () => {},
  showCancel: true
})
function showConfirmDialog(message: string, onOk: () => void, showCancel = true) {
  confirmDialog.value.visible = true
  confirmDialog.value.message = message
  confirmDialog.value.onOk = onOk
  confirmDialog.value.showCancel = showCancel
}
function onConfirmDialogOk() {
  confirmDialog.value.visible = false
  confirmDialog.value.onOk && confirmDialog.value.onOk()
}
function onConfirmDialogCancel() {
  confirmDialog.value.visible = false
}
function handleDeleteTrack() {
  const trackName = selectedTrack.value ? waylineFiles.value.find(f => f.wayline_id === selectedTrack.value)?.name : '未知航线'
  showConfirmDialog(`确定要删除航线'${trackName}'吗？`, () => {
    // 执行删除航线逻辑
    console.log('删除航线')
  })
}
const uploadDialog = ref({
  visible: false,
  file: null as File | null,
  fileName: ''
})

// 下发任务弹窗
const dispatchTaskDialog = ref({
  visible: false,
  form: {
    name: '',
    dock_sn: '',
    file_id: '',
    task_type: 0,
    out_of_control_action: 0,
    rth_altitude: 100,
    rth_mode: 1,
    exit_wayline_when_rc_lost: 0,
    wayline_precision_type: 1,
    begin_time: null as string | null,
    end_time: null as string | null
  }
})

const fileInputRef = ref<HTMLInputElement | null>(null)
function showUploadDialog() {
  uploadDialog.value.visible = true
  uploadDialog.value.file = null
  uploadDialog.value.fileName = ''
  setTimeout(() => {
    if (fileInputRef.value) fileInputRef.value.value = ''
  }, 0)
}
function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.name.endsWith('.kml') || file.name.endsWith('.wpml')) {
      uploadDialog.value.file = file
      uploadDialog.value.fileName = file.name
    } else {
      uploadDialog.value.file = null
      uploadDialog.value.fileName = ''
      alert('请选择.kml或.wpml格式的文件')
      if (fileInputRef.value) fileInputRef.value.value = ''
    }
  }
}
function onUploadConfirm() {
  if (uploadDialog.value.file) {
    // 这里处理上传逻辑
    console.log('上传文件', uploadDialog.value.file)
    uploadDialog.value.visible = false
    // 可在此处添加实际上传接口
  }
}
function onUploadCancel() {
  uploadDialog.value.visible = false
}
function handleAddTrack() {
  // 直接弹出上传文件弹窗
  showUploadDialog()
}
function handleDispatchTask() {
  // 获取当前选中的航线信息
  const currentWayline = waylineFiles.value.find(f => f.wayline_id === selectedTrack.value)
  if (!currentWayline) {
    alert('请先选择一个航线')
    return
  }
  
  // 获取缓存的设备序列号
  const deviceSns = getCachedDeviceSns()
  if (!deviceSns.dockSns || deviceSns.dockSns.length === 0) {
    alert('未找到可用的设备')
    return
  }
  
  // 初始化弹窗数据
  dispatchTaskDialog.value.form = {
    name: `航线任务_${Date.now()}`,
    dock_sn: deviceSns.dockSns[0], // 使用第一个机场设备
    file_id: currentWayline.wayline_id,
    task_type: 0,
    out_of_control_action: 0,
    rth_altitude: 100,
    rth_mode: 1,
    exit_wayline_when_rc_lost: 0,
    wayline_precision_type: 1,
    begin_time: null,
    end_time: null
  }
  
  dispatchTaskDialog.value.visible = true
}

async function onDispatchTaskConfirm() {
  const form = dispatchTaskDialog.value.form
  
  // 验证必填字段
  if (!form.name.trim()) {
    alert('请输入任务名称')
    return
  }
  
  if ((form.task_type === 1 || form.task_type === 2) && !form.begin_time) {
    alert('定时任务和条件任务需要设置开始时间')
    return
  }
  
  // 执行下发任务逻辑
  console.log('下发任务参数:', form)
  
  try {
    const workspaceId = getCachedWorkspaceId()
    if (!workspaceId) {
      alert('未找到workspace_id')
      return
    }
    
    const response = await createJob(workspaceId, form)
    console.log('任务下发成功:', response)
    dispatchTaskDialog.value.visible = false
    alert('任务下发成功')
  } catch (err) {
    console.error('任务下发失败:', err)
    alert('任务下发失败')
  }
}

function onDispatchTaskCancel() {
  dispatchTaskDialog.value.visible = false
}

// 页面加载时获取数据
onMounted(async () => {
  await loadWaylineFiles()
})
</script>

<style>
@import './mission-common.css';

/* 下发任务弹窗样式 */
.dispatch-task-modal {
  display: flex;
  background: #172233;
  border-radius: 12px;
  box-shadow: 0 4px 24px #0008;
  overflow: hidden;
  width: 90%;
  max-width: 500px;
  margin: 10px auto;
  position: relative;
  border: 1px solid #18344a;
}

.dispatch-task-modal-content {
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  background: #172233;
}

.dispatch-task-title {
  font-size: 24px;
  font-weight: 600;
  color: #67d5fd;
  margin-bottom: 24px;
  text-align: center;
}

.dispatch-task-form {
  margin-bottom: 20px;
}

.dispatch-task-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.dispatch-task-row label {
  font-size: 14px;
  color: #b8c7d9;
  min-width: 100px;
  text-align: right;
}

.dispatch-task-input {
  flex: 1;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #164159;
  background: transparent;
  color: #fff;
  padding: 0 12px;
  font-size: 14px;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
}

.dispatch-task-input:focus {
  outline: none;
  border: 1.5px solid #67d5fd;
  box-shadow: 0 0 0 2px rgba(103, 213, 253, 0.15);
}

.dispatch-task-input:disabled {
  background: rgba(103, 213, 253, 0.1);
  color: #67d5fd;
  border-color: rgba(103, 213, 253, 0.3);
}

.custom-select-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.mission-select {
  width: 100%;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #164159;
  background: transparent;
  color: #fff;
  padding: 0 12px;
  font-size: 14px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 30px;
  cursor: pointer;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
}

.mission-select:focus {
  outline: none;
  border: 1.5px solid #67d5fd;
  box-shadow: 0 0 0 2px rgba(103, 213, 253, 0.15);
}

.custom-select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
}

.custom-select-arrow svg {
  width: 100%;
  height: 100%;
}

.unit-label {
  margin-left: 8px;
  color: #b8c7d9;
  font-size: 14px;
}

.dispatch-task-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.dispatch-task-actions .mission-btn {
  min-width: 100px;
  height: 36px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.dispatch-task-actions .mission-btn-cancel {
  background: rgba(103, 213, 253, 0.1);
  color: #b8c7d9;
  border: 1px solid rgba(103, 213, 253, 0.2);
}

.dispatch-task-actions .mission-btn-cancel:hover {
  background: rgba(103, 213, 253, 0.2);
  color: #67d5fd;
}

.dispatch-task-actions .mission-btn-pause {
  background: #67d5fd;
  color: #fff;
}

.dispatch-task-actions .mission-btn-pause:hover {
  background: #50c7f7;
  box-shadow: 0 2px 8px rgba(103, 213, 253, 0.3);
}

/* 侧边栏底部 */
.sidebar-menu-bottom {
  margin-top: auto;
  padding-bottom: 20px;
}

.sidebar-menu-bottom img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  cursor: pointer;
}

.sidebar-menu-bottom img:hover {
  filter: brightness(0) invert(1) drop-shadow(0 0 8px #67d5fd);
}
</style>