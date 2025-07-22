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
          <div class="mission-top-card card">
            <div class="mission-top-header">
              <img class="mission-top-logo" src="@/assets/source_data/bg_data/card_logo.png" alt="logo" />
              <span class="mission-top-title">航线管理</span>
            </div>
            <div class="mission-top-row">
              <span class="mission-lib-label">航线库</span>
              <div class="mission-top-selects">
                <Treeselect v-model="selectedFolder" :options="folderOptions" placeholder="请选择文件夹" class="mission-select treeselect-custom" :append-to-body="false" />
                <select v-model="selectedTrack" class="mission-select">
                  <option v-for="track in trackList" :key="track" :value="track">{{ track }}</option>
                </select>
                <div class="mission-top-btns">
                  <button class="mission-btn mission-btn-pause">删除文件夹</button>
                  <button class="mission-btn mission-btn-stop">删除航线</button>
                  <button class="mission-btn mission-btn-normal">新增航线</button>
                  <button class="mission-btn mission-btn-normal">下发任务</button>
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
                  <button class="mission-btn mission-btn-danger">删除航点</button>
                </div>
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
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import trackListIcon from '@/assets/source_data/svg_data/track_list.svg'
import trackRecordsIcon from '@/assets/source_data/svg_data/track_records.svg'
import trackLogsIcon from '@/assets/source_data/svg_data/track_logs.svg'
import icon1 from '@/assets/source_data/svg_data/track_list.svg'
import icon2 from '@/assets/source_data/svg_data/track_records.svg'
import icon3 from '@/assets/source_data/svg_data/track_logs.svg'

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
const tableData = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  icons: [icon1, icon2, icon3]
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
        label: '文件夹',
        children: [
          { id: 'a-1', label: '文件夹(1)' },
          { id: 'a-2', label: '文件夹' }
        ]
      },
      {
        id: 'b',
        label: '文件夹(1)',
        children: [
          { id: 'b-1', label: '文件夹' }
        ]
      }
    ]
  }
]
const selectedFolder = ref(null)
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
  gap: 16px;
  height: 100%;
  background: transparent;
  padding-bottom: 20px;
  padding-right: 32px;
}
.mission-top-card {
  margin-bottom: 12px;
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
  border: 1px solid #164159;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 14px;
  outline: none;
  min-width: 120px;
  margin-right: 0;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
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
.mission-table-card {
  background: linear-gradient(135deg, #0a2a3a 80%, #0a0f1c 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px #0003;
  padding: 0 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
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
.mission-icon img {
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
.treeselect-custom {
  width: 120px;
  min-width: 120px;
  margin-right: 8px;
}
.treeselect-custom:deep(.treeselect__control) {
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
.treeselect-custom:deep(.treeselect__value-container) {
  background: transparent !important;
  color: #fff !important;
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
  width: 120px !important;
  min-width: 120px !important;
  height: 32px !important;
  min-height: 32px !important;
  box-sizing: border-box;
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
</style>