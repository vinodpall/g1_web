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
              <span class="mission-lib-label">航线库</span>
              <div class="mission-top-selects">
                <Treeselect v-model="selectedLogFolder" :options="folderOptions" :placeholder="logFolderPlaceholder" class="treeselect-custom" :append-to-body="false" />
                <div style="position: relative; display: inline-block;">
                  <select
                    v-model="selectedLogTrack"
                    ref="logTrackSelectRef"
                    class="mission-select treeselect-track"
                    style="width: 90px;"
                    @mousedown="onLogTrackSelectMousedown"
                    @keydown="onLogTrackSelectKeydown"
                    @blur="onLogTrackSelectBlur"
                    @focus="onLogTrackSelectFocus"
                    @change="onLogTrackSelectChange"
                  >
                    <option v-for="item in logTrackList" :key="item" :value="item">{{ item }}</option>
                  </select>
                  <span
                    v-if="!selectedLogTrack"
                    class="select-placeholder"
                    style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #888; pointer-events: none; font-size: 14px;"
                  >请选择航线</span>
                  <span
                    class="custom-select-arrow"
                    @click="openLogTrackSelect"
                    style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon v-if="!isLogTrackSelectOpen" points="2,4 6,8 10,4" fill="#fff"/>
                      <polygon v-else points="2,8 6,4 10,8" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <button class="mission-btn mission-btn-pause">搜索</button>
                <div style="position: relative; display: inline-block; margin-left: 8px;">
                  <select
                    v-model="selectedAlgorithm"
                    ref="algorithmSelectRef"
                    class="mission-select treeselect-track"
                    style="width: 110px;"
                    @mousedown="onAlgorithmSelectMousedown"
                    @keydown="onAlgorithmSelectKeydown"
                    @blur="onAlgorithmSelectBlur"
                    @focus="onAlgorithmSelectFocus"
                    @change="onAlgorithmSelectChange"
                  >
                    <option v-for="item in algorithmOptions" :key="item" :value="item">{{ item }}</option>
                  </select>
                  <span
                    v-if="!selectedAlgorithm"
                    class="select-placeholder"
                    style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #888; pointer-events: none; font-size: 14px;"
                  >请选择检测算法</span>
                  <span
                    class="custom-select-arrow"
                    @click="openAlgorithmSelect"
                    style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon v-if="!isAlgorithmSelectOpen" points="2,4 6,8 10,4" fill="#fff"/>
                      <polygon v-else points="2,8 6,4 10,8" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <div style="position: relative; display: inline-block; margin-left: 8px;">
                  <select
                    v-model="selectedResult"
                    ref="resultSelectRef"
                    class="mission-select treeselect-track"
                    style="width: 90px;"
                    @mousedown="onResultSelectMousedown"
                    @keydown="onResultSelectKeydown"
                    @blur="onResultSelectBlur"
                    @focus="onResultSelectFocus"
                    @change="onResultSelectChange"
                  >
                    <option v-for="item in resultOptions" :key="item" :value="item">{{ item }}</option>
                  </select>
                  <span
                    v-if="!selectedResult"
                    class="select-placeholder"
                    style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #888; pointer-events: none; font-size: 14px;"
                  >请选择检测结果</span>
                  <span
                    class="custom-select-arrow"
                    @click="openResultSelect"
                    style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon v-if="!isResultSelectOpen" points="2,4 6,8 10,4" fill="#fff"/>
                      <polygon v-else points="2,8 6,4 10,8" fill="#fff"/>
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
              <div class="mission-th">检测算法</div>
              <div class="mission-th">图片</div>
              <div class="mission-th">目标数量</div>
              <div class="mission-th">检测结果</div>
              <div class="mission-th">检测时间</div>
            </div>
            <div class="mission-table-body">
              <div class="mission-tr" v-for="(log, idx) in logTableData" :key="log.id">
                <div class="mission-td">{{ idx + 1 }}</div>
                <div class="mission-td">{{ log.trackName }}</div>
                <div class="mission-td">{{ log.algorithm }}</div>
                <div class="mission-td">
                  <img :src="log.img" alt="图片" style="width:32px;height:32px;object-fit:contain;vertical-align:middle;" />
                </div>
                <div class="mission-td">{{ log.targetCount }}</div>
                <div class="mission-td">
                  <span :style="{color: log.result === '正常' ? '#1ecb7a' : '#ff4d4f'}">{{ log.result }}</span>
                </div>
                <div class="mission-td">{{ log.time }}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
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

// 多级文件夹树结构，与Mission.vue一致
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
const selectedLogFolder = ref(null)
const logFolderPlaceholder = computed(() => {
  const val = selectedLogFolder.value;
  return val ? '' : '请选择文件夹';
})

const logTrackList = ['航线1', '航线2', '航线3']
const selectedLogTrack = ref('')
const logTrackSelectRef = ref<HTMLSelectElement | null>(null)
const isLogTrackSelectOpen = ref(false)
function openLogTrackSelect() {
  if (logTrackSelectRef.value) {
    logTrackSelectRef.value.focus()
    logTrackSelectRef.value.click && logTrackSelectRef.value.click()
    isLogTrackSelectOpen.value = true
  }
}
function onLogTrackSelectBlur() {
  isLogTrackSelectOpen.value = false
}
function onLogTrackSelectFocus() {
  isLogTrackSelectOpen.value = true
}
function onLogTrackSelectChange() {
  isLogTrackSelectOpen.value = false
}
function onLogTrackSelectMousedown() {
  isLogTrackSelectOpen.value = true
}
function onLogTrackSelectKeydown(e: KeyboardEvent) {
  if ([" ", "Enter", "ArrowDown"].includes(e.key)) {
    isLogTrackSelectOpen.value = true
  }
  if (["Escape", "Esc"].includes(e.key)) {
    isLogTrackSelectOpen.value = false
  }
}

const algorithmOptions = ['全部', '呼吸灯检测', '路灯检测']
const selectedAlgorithm = ref('全部')
const resultOptions = ['全部', '正常', '异常']
const selectedResult = ref('全部')

const algorithmSelectRef = ref<HTMLSelectElement | null>(null)
const isAlgorithmSelectOpen = ref(false)
function openAlgorithmSelect() {
  if (algorithmSelectRef.value) {
    algorithmSelectRef.value.focus()
    algorithmSelectRef.value.click && algorithmSelectRef.value.click()
    isAlgorithmSelectOpen.value = true
  }
}
function onAlgorithmSelectBlur() { isAlgorithmSelectOpen.value = false }
function onAlgorithmSelectFocus() { isAlgorithmSelectOpen.value = true }
function onAlgorithmSelectChange() { isAlgorithmSelectOpen.value = false }
function onAlgorithmSelectMousedown() { isAlgorithmSelectOpen.value = true }
function onAlgorithmSelectKeydown(e: KeyboardEvent) {
  if ([" ", "Enter", "ArrowDown"].includes(e.key)) isAlgorithmSelectOpen.value = true
  if (["Escape", "Esc"].includes(e.key)) isAlgorithmSelectOpen.value = false
}

const resultSelectRef = ref<HTMLSelectElement | null>(null)
const isResultSelectOpen = ref(false)
function openResultSelect() {
  if (resultSelectRef.value) {
    resultSelectRef.value.focus()
    resultSelectRef.value.click && resultSelectRef.value.click()
    isResultSelectOpen.value = true
  }
}
function onResultSelectBlur() { isResultSelectOpen.value = false }
function onResultSelectFocus() { isResultSelectOpen.value = true }
function onResultSelectChange() { isResultSelectOpen.value = false }
function onResultSelectMousedown() { isResultSelectOpen.value = true }
function onResultSelectKeydown(e: KeyboardEvent) {
  if ([" ", "Enter", "ArrowDown"].includes(e.key)) isResultSelectOpen.value = true
  if (["Escape", "Esc"].includes(e.key)) isResultSelectOpen.value = false
}

const logTableData = [
  { id: 1, trackName: '楼宇巡检', algorithm: '呼吸灯检测', img: trackListIcon, targetCount: 3, result: '正常', time: '2025-07-06 15:57:40' },
  { id: 2, trackName: '楼宇巡检', algorithm: '呼吸灯检测', img: trackListIcon, targetCount: 1, result: '异常', time: '2025-07-06 15:57:40' },
  { id: 3, trackName: '南东路路灯巡检', algorithm: '路灯检测', img: trackListIcon, targetCount: 6, result: '正常', time: '2025-07-06 15:57:40' },
  { id: 4, trackName: '南东路路灯巡检', algorithm: '路灯检测', img: trackListIcon, targetCount: 1, result: '异常', time: '2025-07-06 15:57:40' },
  { id: 5, trackName: '楼宇巡检', algorithm: '路灯检测', img: trackListIcon, targetCount: 3, result: '正常', time: '2025-07-06 15:57:40' },
  { id: 6, trackName: '楼宇巡检', algorithm: '路灯检测', img: trackListIcon, targetCount: 3, result: '正常', time: '2025-07-06 15:57:40' },
  { id: 7, trackName: '楼宇巡检', algorithm: '路灯检测', img: trackListIcon, targetCount: 3, result: '正常', time: '2025-07-06 15:57:40' },
  { id: 8, trackName: '楼宇巡检', algorithm: '路灯检测', img: trackListIcon, targetCount: 3, result: '正常', time: '2025-07-06 15:57:40' },
]
</script>

<style>
@import './mission-common.css';
</style>