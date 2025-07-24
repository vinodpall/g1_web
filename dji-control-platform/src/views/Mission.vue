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
              <span class="mission-top-title">航线管理</span>
            </div>
            <div class="mission-top-row">
              <span class="mission-lib-label">航线库</span>
              <div class="mission-top-selects">
                <Treeselect v-model="selectedFolder" :options="folderOptions" :placeholder="folderPlaceholder" class="treeselect-custom" :append-to-body="false" />
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
                  >
                    <option v-for="item in trackList" :key="item" :value="item">{{ item }}</option>
                  </select>
                  <span
                    v-if="!selectedTrack"
                    class="select-placeholder"
                    style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #888; pointer-events: none; font-size: 14px;"
                  >请选择航线</span>
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
                  <button class="mission-btn mission-btn-pause" @click="handleDeleteFolder">删除文件夹</button>
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
              <div class="mission-th">航点类型</div>
              <div class="mission-th">操作</div>
            </div>
            <div class="mission-table-body">
              <div class="mission-tr" v-for="item in tableData" :key="item.id">
                <div class="mission-td">{{ item.id }}</div>
                <div class="mission-td mission-icons">
                  <span v-for="icon in item.icons" :key="icon" class="mission-icon"><img :src="icon" /></span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import trackListIcon from '@/assets/source_data/svg_data/track_list.svg'
import trackRecordsIcon from '@/assets/source_data/svg_data/track_records.svg'
import trackLogsIcon from '@/assets/source_data/svg_data/track_logs.svg'
import icon1 from '@/assets/source_data/svg_data/track_list.svg'
import icon2 from '@/assets/source_data/svg_data/track_records.svg'
import icon3 from '@/assets/source_data/svg_data/track_logs.svg'
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

const libList = ['默认文件夹', '文件夹A', '文件夹B']
const selectedLib = ref(libList[0])
const trackList = ['航线1', '航线2', '航线3']
const selectedTrack = ref('')
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
const taskLineIcons = [
  icon360Photo,
  iconAbsPhoto,
  iconBigger,
  iconHover,
  iconIntervalDistance,
  iconIntervalStop,
  iconIntervalTime,
  iconLeftRight,
  iconRightDown,
  iconStartVideo,
  iconStopVideo,
  iconTakePhoto
]

const tableData = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  icons: taskLineIcons // 每个航点都显示12个图标
}))

const subLibList = ['子文件夹A-1', '子文件夹A-2', '子文件夹B-1']

// 多级文件夹树结构
const folderOptions = [
  {
    id: 'root',
    label: '常熟素材采集',
    children: [
      {
        id: 'a',
        label: '东南街道',
        children: [
          { id: 'a-1', label: '路灯' },
          { id: 'a-2', label: '大楼' }
        ]
      },
      {
        id: 'b',
        label: '西北街道',
        children: [
          { id: 'b-1', label: '高架桥' }
        ]
      }
    ]
  }
]
const selectedFolder = ref(null)
// 动态 placeholder 逻辑
const folderPlaceholder = computed(() => {
  const val = selectedFolder.value;
  const result = val ? '' : '请选择文件夹';
  console.log('folderPlaceholder:', result, 'selectedFolder:', val);
  return result;
})

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
function handleDeleteFolder() {
  showConfirmDialog('确定要删除该文件夹吗？', () => {
    // 执行删除文件夹逻辑
    console.log('删除文件夹')
  })
}
function handleDeleteTrack() {
  showConfirmDialog('确定要删除该航线吗？', () => {
    // 执行删除航线逻辑
    console.log('删除航线')
  })
}
function getCurrentFolderLabel(): string {
  function findLabel(options: any[], id: string | null): string {
    for (const opt of options) {
      if (opt.id === id) return opt.label
      if (opt.children) {
        const found: string = findLabel(opt.children, id)
        if (found) return found
      }
    }
    return ''
  }
  return findLabel(folderOptions, selectedFolder.value) || '未选择文件夹'
}
const uploadDialog = ref({
  visible: false,
  file: null as File | null,
  fileName: ''
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
  const folderName = getCurrentFolderLabel()
  if (folderName === '未选择文件夹') {
    showConfirmDialog('请先选择一个文件夹再新增航线', () => {}, false)
    return
  }
  showConfirmDialog(`确定在「${folderName}」上传航线吗？`, () => {
    // 弹出上传文件弹窗
    showUploadDialog()
  })
}
function handleDispatchTask() {
  const trackName = selectedTrack.value || '未知航线'
  showConfirmDialog(`确定要立即开始执行‘${trackName}’任务吗？`, () => {
    // 执行下发任务逻辑
    console.log('下发任务：', trackName)
  })
}
</script>

<style>
@import './mission-common.css';
</style>