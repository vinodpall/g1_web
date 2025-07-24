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
                <Treeselect v-model="selectedRecordFolder" :options="folderOptions" :placeholder="recordFolderPlaceholder" class="treeselect-custom" :append-to-body="false" />
                <div style="position: relative; display: inline-block;">
                  <select
                    v-model="selectedRecordTrack"
                    ref="recordTrackSelectRef"
                    class="mission-select treeselect-track"
                    style="width: 90px;"
                    @mousedown="onRecordTrackSelectMousedown"
                    @keydown="onRecordTrackSelectKeydown"
                    @blur="onRecordTrackSelectBlur"
                    @focus="onRecordTrackSelectFocus"
                    @change="onRecordTrackSelectChange"
                  >
                    <option v-for="item in recordTrackList" :key="item" :value="item">{{ item }}</option>
                  </select>
                  <span
                    v-if="!selectedRecordTrack"
                    class="select-placeholder"
                    style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #888; pointer-events: none; font-size: 14px;"
                  >请选择航线</span>
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
                <button class="mission-btn mission-btn-pause">搜索</button>
              </div>
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
const selectedRecordFolder = ref(null)
const recordFolderPlaceholder = computed(() => {
  const val = selectedRecordFolder.value;
  return val ? '' : '请选择文件夹';
})

const recordTrackList = ['航线1', '航线2', '航线3']
const selectedRecordTrack = ref('')
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

const recordTableData = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: '楼宇巡检',
  startTime: '2025-07-06 15:47:20',
  endTime: '2025-07-06 15:57:40',
  creator: '张三'
}))
</script>

<style>
@import './mission-common.css';
</style>