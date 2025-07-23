<template>
  <div class="drone-control-main">
    <!-- 侧边栏菜单 -->
    <aside class="sidebar-menu">
      <div class="sidebar-tabs">
        <div
          v-for="(item, idx) in sidebarTabs"
          :key="item.key"
          :class="['sidebar-tab', { active: currentTab === item.key }]"
          @click="handleTabClick(item.key)"
        >
          <img :src="item.icon" :alt="item.label" />
        </div>
      </div>
    </aside>
    <!-- 主体内容区 -->
    <main class="main-content">
      <div class="main-flex">
        <section class="right-panel">
          <template v-if="currentTab === 'list'">
            <div class="mission-top-card card">
              <div class="mission-top-header">
                <img class="mission-top-logo" src="@/assets/source_data/bg_data/card_logo.png" alt="logo" />
                <span class="mission-top-title">航线管理</span>
              </div>
              <div class="mission-top-row">
                <span class="mission-lib-label">航线库</span>
                <div class="mission-top-selects">
                  <Treeselect v-model="selectedFolder" :options="folderOptions" :placeholder="folderPlaceholder" class="treeselect-custom" :append-to-body="false" />
                  <div class="custom-select-wrapper">
                    <select v-model="selectedTrack" class="mission-select">
                      <option v-for="track in trackList" :key="track" :value="track">{{ track }}</option>
                    </select>
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
          </template>
          <template v-else-if="currentTab === 'records'">
            <div class="mission-top-card card">
              <div class="mission-top-header">
                <span class="mission-top-title">任务记录</span>
              </div>
              <div class="mission-top-row">
                <span class="mission-lib-label">航线库：</span>
                <select v-model="selectedRecordFolder" class="mission-select" style="width: 180px;">
                  <option v-for="item in recordFolderList" :key="item" :value="item">{{ item }}</option>
                </select>
                <select v-model="selectedRecordTrack" class="mission-select" style="width: 120px;">
                  <option v-for="item in recordTrackList" :key="item" :value="item">{{ item }}</option>
                </select>
                <button class="mission-btn mission-btn-pause">搜索</button>
              </div>
            </div>
            <div class="mission-table-card card">
              <div class="mission-table-header">
                <div class="mission-th">序号</div>
                <div class="mission-th">航线名称</div>
                <div class="mission-th">开始时间</div>
                <div class="mission-th">结束时间</div>
                <div class="mission-th">创建人</div>
              </div>
              <div class="mission-table-body">
                <div class="mission-tr" v-for="(record, idx) in recordTableData" :key="record.id">
                  <div class="mission-td">{{ idx + 1 }}</div>
                  <div class="mission-td">{{ record.name }}</div>
                  <div class="mission-td">{{ record.startTime }}</div>
                  <div class="mission-td">{{ record.endTime }}</div>
                  <div class="mission-td">{{ record.creator }}</div>
                </div>
              </div>
            </div>
          </template>
        </section>
      </div>
    </main>
    <!-- 自定义确认弹窗 -->
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
    <!-- 上传航线文件弹窗 -->
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

const sidebarTabs = [
  { key: 'list', label: '航线列表', icon: trackListIcon },
  { key: 'records', label: '历史记录', icon: trackRecordsIcon },
  { key: 'logs', label: '日志', icon: trackLogsIcon }
]
const currentTab = ref('list')
const handleTabClick = (key: string) => {
  currentTab.value = key
  // 这里可根据key切换右侧内容
}

const libList = ['默认文件夹', '文件夹A', '文件夹B']
const selectedLib = ref(libList[0])
const trackList = ['航线1', '航线2', '航线3']
const selectedTrack = ref(trackList[0])
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

const recordFolderList = ['自默认文件夹', '文件夹A', '文件夹B']
const selectedRecordFolder = ref(recordFolderList[0])
const recordTrackList = ['航线1', '航线2', '航线3']
const selectedRecordTrack = ref(recordTrackList[0])
const recordTableData = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: '楼宇巡检',
  startTime: '2025-07-06 15:47:20',
  endTime: '2025-07-06 15:57:40',
  creator: '张三'
}))
</script>

<style scoped>
.drone-control-main {
  display: flex;
  height: calc(100vh - 84px);
  background: #0a0f1c;
  color: #fff;
  position: fixed;
  top: 84px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
}
.sidebar-menu {
  width: 4%;
  min-width: 56px;
  max-width: 100px;
  background: linear-gradient(180deg, #004161cc 0%, #051b26cc 100%);
  border-radius: 0 10px 10px 0;
  box-shadow: 2px 0 12px 0 #00334a33;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 15px 0 15px;
  border-right: 1.5px solid #164159;
  z-index: 2;
  margin-top: 20px;
  margin-right: 20px;
  height: calc(100% - 20px);
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: auto;
  position: relative;
}
.sidebar-tabs {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 40px;
  align-items: center;
}
.sidebar-tab {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  font-size: 16px;
  font-family: 'Source Han Sans CN', 'Microsoft YaHei', Arial, sans-serif;
  font-weight: 400;
  color: #fff;
  margin-top: 10px;
  box-sizing: border-box;
}
.sidebar-tab:first-child {
  margin-top: 0;
}
.sidebar-tab.active {
  background: #01314f !important;
  color: #67d5fd;
  font-weight: 500;
  box-shadow: 0 0 12px #59c0fc33;
}
.sidebar-tab:hover {
  background: #164159;
}
.sidebar-tab img {
  width: 23px;
  height: 23px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transition: filter 0.2s, box-shadow 0.2s;
}
.sidebar-tab.active img {
  filter: brightness(0) invert(1) drop-shadow(0 0 8px #67d5fd) drop-shadow(0 0 2px #67d5fd);
  opacity: 1;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  box-sizing: border-box;
  margin: 20px 0 0 0;
  height: calc(100% - 20px);
}
.main-flex {
  display: flex;
  height: 100%;
  gap: 0.8vw;
}
.right-panel {
  flex-basis: 100%;
  max-width: 100%;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  background: transparent;
  padding-bottom: 0; /* 取消原有padding-bottom */
  padding-right: 32px;
}
.mission-top-card {
  margin-bottom: 4px;
  background: linear-gradient(135deg, #0a2a3a 80%, #0a0f1c 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px #0003;
  padding: 18px 24px 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mission-top-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #67d5fd;
  font-weight: 600;
  margin-bottom: 8px;
  gap: 10px;
}
.mission-top-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  margin-right: 6px;
}
.mission-top-title {
  font-size: 16px;
  color: #67d5fd;
  font-weight: 600;
}
.mission-top-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 4px;
}
.mission-lib-label {
  font-size: 14px;
  color: #fff;
  margin-right: 8px;
  min-width: 48px;
}
.mission-top-selects {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mission-select {
  background: #16213a;
  color: #fff;
  /* border: 1px solid #164159; */
  border-radius: 4px; /* 只保留右侧圆角 */
  padding: 4px 12px;
  font-size: 14px;
  outline: none;
  min-width: 120px;
  margin-right: 0;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border-left: none; /* 让左侧边框消失 */
  position: relative;
  z-index: 1;
  height: 32px;
  line-height: 32px;
}
.mission-folder-select option[disabled] {
  color: #888;
}
.mission-top-btns {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}
.mission-btn {
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  padding: 4px 18px;
  cursor: pointer;
  border: none;
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.mission-btn-pause {
  background: #0c3c56;
  color: #67d5fd;
  border: 1px solid rgba(38, 131, 182, 0.8);
}
.mission-btn-pause:hover {
  background: #0c4666;
  color: #67d5fd;
}
.mission-btn-stop {
  background: #561c1c;
  color: #fd6767;
  border: 1px solid rgba(182, 38, 38, 0);
}
.mission-btn-stop:hover {
  background: #a94442;
  color: #fff;
}
.mission-btn-normal {
  background: #1a3a4a;
  color: #fff;
  border: 1px solid #164159;
}
.mission-btn-normal:hover {
  background: #16bbf2;
  color: #fff;
  border: 1.5px solid #16bbf2;
}
.mission-btn:disabled,
.mission-btn[disabled] {
  opacity: 1 !important;
  background: #0c3c56 !important;
  color: #67d5fd !important;
  border: 1px solid rgba(38, 131, 182, 0.8) !important;
  cursor: not-allowed !important;
}
.mission-table-card {
  background: linear-gradient(135deg, #0a2a3a 80%, #0a0f1c 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px #0003;
  padding: 0 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
  flex: 1;
  min-height: 0;
  margin-bottom: 20px;
}
.mission-table-header {
  display: flex;
  background: #164159;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  padding: 14px 0 14px 24px;
  border-radius: 8px 8px 0 0;
}
.mission-th {
  flex: 1;
  text-align: left;
}
.mission-th:last-child {
  flex: 0 0 120px;
  text-align: center;
}
.mission-table-body {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}
.mission-tr {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #223a5e;
  font-size: 15px;
  color: #fff;
  min-height: 44px;
  padding-left: 24px;
}
.mission-td {
  flex: 1;
  text-align: left;
}
.mission-td:last-child {
  flex: 0 0 120px;
  text-align: center;
}
.mission-icons {
  display: flex;
  gap: 8px;
}
.mission-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
}
.mission-icon img {
  width: 90%;
  height: 90%;
  max-width: 22px;
  max-height: 22px;
  min-width: 18px;
  min-height: 18px;
  object-fit: contain;
  display: block;
  margin: auto;
  padding: 0;
  filter: brightness(0) invert(1);
  background: transparent;
  aspect-ratio: 1/1;
}
.treeselect-custom {
  width: 120px;
  min-width: 120px;
  margin-right: -1px; /* 让边框重叠 */
  z-index: 2;
}
.treeselect-custom:deep(.treeselect__control) {
  background: transparent !important;
  border: 1px solid #164159 !important;
  border-right: none !important;
  color: #fff !important;
  border-radius: 4px 0 0 4px !important;
  font-size: 14px;
  min-height: 28px;
  height: 28px;
  box-sizing: border-box;
  display: flex !important;
  align-items: center !important;
  padding: 0 12px !important;
  box-shadow: none !important;
  line-height: normal !important;
}
.treeselect-custom:deep(.treeselect__value-container) {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}
.mission-select {
  background: transparent;
  height: 32px;
  line-height: normal;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
.treeselect-custom:deep(.treeselect__single-value),
.treeselect-custom:deep(.treeselect__placeholder) {
  color: #fff !important;
  background: transparent !important;
}
.treeselect-custom:deep(.treeselect__control-arrow) {
  color: #fff !important;
}
.treeselect-custom:deep(.treeselect__menu) {
  background: #16213a !important;
  color: #fff !important;
  border: 1px solid #164159 !important;
  border-radius: 4px !important;
  font-size: 14px;
}
.treeselect-custom:deep(.treeselect__input) {
  height: 28px !important;
  line-height: 28px !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
  box-sizing: border-box !important;
  color: #fff !important;
  background: transparent !important;
}
.treeselect-custom:deep(input) {
  height: 28px !important;
  line-height: 28px !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
  box-sizing: border-box !important;
  color: #fff !important;
  background: transparent !important;
}
.mission-th, .mission-td {
  text-align: center;
}
.mission-th:first-child,
.mission-td:first-child,
.mission-th:last-child,
.mission-td:last-child {
  flex: 0 0 120px;
  max-width: 120px;
  min-width: 120px;
}
.mission-th:nth-child(2),
.mission-td:nth-child(2) {
  flex: 1;
  min-width: 0;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
.upload-dialog {
  min-width: 440px;
  max-width: 90vw;
  padding: 36px 40px 28px 40px;
  border-radius: 16px;
  box-shadow: 0 8px 40px #000a;
  background: linear-gradient(135deg, #1a233a 80%, #16213a 100%);
}
.upload-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}
.upload-file-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.upload-file-input {
  display: none;
}
.upload-file-btn {
  background: #0c3c56;
  color: #67d5fd;
  border: 1px solid #67d5fd;
  border-radius: 6px;
  padding: 6px 22px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-weight: 500;
}
.upload-file-btn:hover {
  background: #67d5fd;
  color: #0c3c56;
}
.upload-file-tip {
  color: #8bb7d8;
  font-size: 13px;
}
.upload-file-name {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #67d5fd;
  font-size: 15px;
  margin-top: 2px;
  word-break: break-all;
}
.upload-file-icon {
  flex-shrink: 0;
}
.upload-dialog-actions {
  gap: 28px;
}
.mission-btn[disabled] {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}
</style>

<style>
.vue-treeselect__control {
  background: #16213a !important;
  border: 1px solid #164159 !important;
  color: #fff !important;
  border-radius: 4px !important;
  font-size: 14px;
  min-height: 32px;
  height: 32px;
  box-sizing: border-box;
  padding: 4px 12px !important;
  box-shadow: none !important;
}
.vue-treeselect__single-value,
.vue-treeselect__placeholder {
  color: #fff !important;
  background: transparent !important;
}
.vue-treeselect__menu {
  box-shadow: none !important;
  background: #16213a !important;
}

/* 统一宽高，填满父容器 */
.treeselect-custom,
.treeselect-custom .vue-treeselect,
.treeselect-custom .vue-treeselect__control {
  width: 300px !important;
  min-width: 300px !important;
  max-width: 300px !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
}
.treeselect-custom:deep(.treeselect__control) {
  min-height: 28px;
  height: 28px;
}
.treeselect-custom:deep(.treeselect__input) {
  height: 28px !important;
  line-height: 28px !important;
}
.treeselect-custom:deep(input) {
  height: 28px !important;
  line-height: 28px !important;
}
.mission-select {
  width: 190px;
  min-width: 190px;
  max-width: 190px;
  height: 32px;
  background: transparent;
  box-shadow: 0 0 0 1px #164159 inset;
  border-radius: 4px;
  border: none;
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 4px 12px;
  outline: none;
  margin-right: 0;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 悬浮、激活、展开时的边框色和背景色 */
.vue-treeselect__control:hover,
.vue-treeselect--focused .vue-treeselect__control,
.vue-treeselect--open .vue-treeselect__control {
  border-color: #16bbf2 !important;
  background: #16213a !important;
  box-shadow: 0 0 0 2px rgba(22,187,242,0.15) !important;
}

/* 覆盖弹层容器背景 */
.vue-treeselect__menu-container {
  background: transparent !important;
  box-shadow: none !important;
}

/* 覆盖弹层本体背景 */
.vue-treeselect__menu {
  background: #16213a !important;
  color: #fff !important;
  border: 1px solid #164159 !important;
  border-radius: 4px !important;
  font-size: 14px;
  box-shadow: 0 2px 8px #0003 !important;
}

/* 覆盖弹层选项 hover/active 效果 */
.vue-treeselect__option--highlight {
  background: #223a5e !important;
  color: #67d5fd !important;
}
.vue-treeselect__option--selected {
  background: #164159 !important;
  color: #67d5fd !important;
}
.vue-treeselect__option--selected.vue-treeselect__option--highlight {
  background: #16bbf2 !important;
  color: #fff !important;
}

/* portal 容器也设为透明 */
.vue-treeselect__portal-target {
  background: transparent !important;
}
.treeselect-custom:deep(.treeselect__control),
.treeselect-custom:deep(.vue-treeselect__control),
.treeselect-custom:deep(.treeselect__value-container),
.treeselect-custom:deep(.vue-treeselect__value-container),
.treeselect-custom:deep(.treeselect__single-value),
.treeselect-custom:deep(.vue-treeselect__single-value),
.treeselect-custom:deep(.treeselect__placeholder),
.treeselect-custom:deep(.vue-treeselect__placeholder),
.treeselect-custom:deep(.treeselect__multi-value) {
  background: transparent !important;
}
.treeselect-custom:deep(.treeselect__value-container),
.treeselect-custom:deep(.vue-treeselect__value-container) {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}
</style>

<style>
.treeselect-custom .vue-treeselect__control,
.treeselect-custom .treeselect__control,
.treeselect-custom .vue-treeselect__value-container,
.treeselect-custom .treeselect__value-container,
.treeselect-custom .vue-treeselect__single-value,
.treeselect-custom .treeselect__single-value,
.treeselect-custom .vue-treeselect__placeholder,
.treeselect-custom .treeselect__placeholder,
.treeselect-custom .treeselect__multi-value {
  background: transparent !important;
  box-shadow: none !important;
}
.treeselect-custom .vue-treeselect__control,
.treeselect-custom .treeselect__control {
  display: flex !important;
  align-items: center !important;
  min-height: 28px !important;
  height: 28px !important;
  border-radius: 4px !important;
  border: 1px solid #164159 !important;
  border-right: none !important;
}
.treeselect-custom .vue-treeselect__value-container,
.treeselect-custom .treeselect__value-container {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
  padding: 0 12px !important;
}
.treeselect-custom input,
.treeselect-custom .treeselect__input {
  height: 28px !important;
  line-height: 28px !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
  box-sizing: border-box !important;
  color: #fff !important;
  background: transparent !important;
}
</style>

<style>
.treeselect-custom .vue-treeselect__control,
.treeselect-custom .treeselect__control {
  width: 300px !important;
  min-width: 300px !important;
  height: 32px !important;
  min-height: 32px !important;
  background: transparent !important;
  box-shadow: 0 0 0 1px #164159 inset !important;
  border-radius: 4px !important;
  border: none !important;
  display: flex !important;
  align-items: center !important;
  padding: 4px 12px !important;
  font-size: 14px !important;
}
.treeselect-custom .vue-treeselect__value-container,
.treeselect-custom .treeselect__value-container {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
  padding: 0 !important;
}
.treeselect-custom input,
.treeselect-custom .treeselect__input {
  height: 32px !important;
  line-height: 32px !important;
  padding: 0 !important;
  margin: 0 !important;
  color: #fff !important;
  background: transparent !important;
  font-size: 14px !important;
}
.treeselect-custom .vue-treeselect__placeholder,
.treeselect-custom .vue-treeselect__single-value,
.treeselect-custom .treeselect__placeholder,
.treeselect-custom .treeselect__single-value {
  color: #fff !important;
  font-size: 14px !important;
  background: transparent !important;
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}
</style>

<style>
.treeselect-custom .vue-treeselect__menu,
.treeselect-custom .treeselect__menu {
  width: 300px !important;
  min-width: 300px !important;
  max-width: 300px !important;
  box-sizing: border-box !important;
}
</style>

<style>
.custom-select-wrapper {
  position: relative;
  display: inline-block;
}
.custom-select-wrapper .mission-select {
  padding-right: 32px !important;
  background-image: none !important;
}
.custom-select-wrapper::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 6px 0 6px;
  border-style: solid;
  border-color: #fff transparent transparent transparent;
  pointer-events: none;
}
</style>

<style>
.mission-table-body::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}
.mission-table-body::-webkit-scrollbar-thumb {
  background: #225c7a; /* 更暗的主题色 */
  border-radius: 4px;
  border: none;
}
.mission-table-body::-webkit-scrollbar-track {
  background: transparent;
}
.mission-table-body::-webkit-scrollbar-button {
  display: none;
  height: 0;
  width: 0;
}
.mission-table-body {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #225c7a transparent; /* Firefox */
}
</style>

<style>
.custom-dialog-mask {
  position: fixed;
  z-index: 9999;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(10, 15, 28, 0.65);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
}
.custom-dialog {
  background: #16213a;
  border-radius: 12px;
  min-width: 420px;
  max-width: 600px;
  padding: 32px 36px 20px 36px;
  box-shadow: 0 4px 32px #0008;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.custom-dialog-title {
  font-size: 18px;
  color: #67d5fd;
  font-weight: 600;
  margin-bottom: 18px;
  text-align: center;
}
.custom-dialog-content {
  font-size: 16px;
  color: #fff;
  margin-bottom: 28px;
  text-align: center;
}
.custom-dialog-actions {
  display: flex;
  gap: 18px;
  justify-content: center;
}
.mission-btn-cancel {
  background: #232b3a;
  color: #fff;
  border: 1px solid #232b3a;
}
.mission-btn-cancel:hover {
  background: #2d3648;
  color: #fff;
}
</style>