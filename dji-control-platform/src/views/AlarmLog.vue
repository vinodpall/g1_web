<template>
  <div class="drone-control-main">
    <!-- 侧边栏菜单 -->
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
          <!-- 筛选区 -->
          <div class="mission-top-card card">
            <div class="mission-top-header">
              <img src="@/assets/source_data/bg_data/card_logo.png" style="width:22px;height:22px;margin-right:8px;vertical-align:middle;" alt="logo" />
              <span class="mission-top-title">报警日志</span>
            </div>
            <div class="mission-top-row">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="color:#b8c7d9;min-width:64px;">设备名称：</span>
                <input v-model="filter.name" class="alarm-input" placeholder="请输入设备名称" />
              </div>
              <div style="display:flex;align-items:center;gap:8px;position:relative;">
                <span style="color:#b8c7d9;min-width:64px;">报警类型：</span>
                <div class="custom-select-wrapper">
                  <select v-model="filter.type" class="mission-select">
                    <option value="">请选择报警类型</option>
                    <option value="system">系统告警</option>
                    <option value="device">设备告警</option>
                  </select>
                  <span class="custom-select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;position:relative;">
                <span style="color:#b8c7d9;min-width:64px;">报警等级：</span>
                <div class="custom-select-wrapper">
                  <select v-model="filter.level" class="mission-select">
                    <option value="">请选择报警等级</option>
                    <option value="normal">普通</option>
                    <option value="serious">严重</option>
                  </select>
                  <span class="custom-select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
              </div>
              <button class="mission-btn mission-btn-pause" @click="handleSearch" style="min-width:72px;">查询</button>
            </div>
          </div>
          <!-- 列表区 -->
          <div class="mission-table-card card">
            <div class="mission-table-header">
              <div class="mission-th" v-for="col in columns" :key="col.key">{{ col.title }}</div>
            </div>
            <div class="mission-table-body">
              <div class="mission-tr" v-for="(row, idx) in alarmList" :key="row.id">
                <div class="mission-td">{{ idx + 1 }}</div>
                <div class="mission-td">{{ row.deviceName }}</div>
                <div class="mission-td">{{ row.type }}</div>
                <div class="mission-td">{{ row.content }}</div>
                <div class="mission-td">{{ row.level }}</div>
                <div class="mission-td">{{ row.time }}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import equipmengStoreIcon from '@/assets/source_data/svg_data/equipmeng_store.svg'
import equipmentWarningsIcon from '@/assets/source_data/svg_data/equipment_warnings.svg'

const router = useRouter()
const sidebarTabs = [
  { key: 'manage', label: '设备管理', icon: equipmengStoreIcon },
  { key: 'warning', label: '设备告警', icon: equipmentWarningsIcon }
]
const currentTab = ref('warning')
const handleTabClick = (key: string) => {
  currentTab.value = key
  if (key === 'manage') {
    router.push('/dashboard/device-manage')
  } else if (key === 'warning') {
    router.push('/dashboard/alarm-log')
  }
}
const filter = ref({ name: '', type: '', level: '' })
const handleSearch = () => {}
const columns = [
  { key: 'index', title: '序号' },
  { key: 'deviceName', title: '设备名称' },
  { key: 'type', title: '报警类型' },
  { key: 'content', title: '报警内容' },
  { key: 'level', title: '报警等级' },
  { key: 'time', title: '报警时间' }
]
const alarmList = ref([
  { id: 1, deviceName: '大疆机场3', type: '系统告警', content: '外部风速过快，不建议飞行', level: '普通', time: '2025-07-06 16:55:19' },
  { id: 2, deviceName: 'M4TD', type: '系统告警', content: '电池电量低，请及时充电', level: '严重', time: '2025-07-06 16:55:19' },
  { id: 3, deviceName: 'M4TD', type: '系统告警', content: '电池电量过低，建议勿前往飞行', level: '严重', time: '2025-07-06 16:55:19' },
  { id: 4, deviceName: '大疆机场3', type: '系统告警', content: '外部风速过快，不建议飞行', level: '严重', time: '2025-07-06 16:55:19' },
  // ...更多数据
])
// 下拉箭头交互
const typeSelectOpen = ref(false)
const levelSelectOpen = ref(false)
const handleTypeFocus = () => { typeSelectOpen.value = true }
const handleTypeBlur = () => { typeSelectOpen.value = false }
const handleLevelFocus = () => { levelSelectOpen.value = true }
const handleLevelBlur = () => { levelSelectOpen.value = false }
</script>

<style scoped>
@import './mission-common.css';
.alarm-input {
  height: 32px;
  border-radius: 4px;
  border: 1px solid #164159;
  background: transparent;
  color: #fff;
  padding: 0 12px;
  font-size: 14px;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
}
.alarm-input:focus {
  outline: none;
  border: 1.5px solid #16bbf2;
  box-shadow: 0 0 0 2px rgba(22,187,242,0.15);
}
.custom-select-wrapper {
  position: relative;
  display: inline-block;
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
.mission-select {
  background: transparent !important;
  background-color: transparent !important;
}
/* 保证下拉菜单（option）背景色不变 */
.mission-select option {
  background: #172233;
  color: #fff;
}
/* 其余 alarm-xxx 样式已移除，统一复用 mission-common.css */
.mission-th:last-child,
.mission-td:last-child {
  min-width: 220px;
  max-width: 320px;
  text-align: center;
  padding-left: 16px;
  padding-right: 16px;
}
</style> 