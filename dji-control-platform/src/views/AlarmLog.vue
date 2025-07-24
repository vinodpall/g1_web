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
          <div class="alarm-top-card card">
            <div class="alarm-top-header">
              <span class="alarm-top-title">报警日志</span>
            </div>
            <div class="alarm-top-row">
              <input v-model="filter.name" class="alarm-input" placeholder="设备名称" />
              <div class="custom-select-wrapper">
                <select v-model="filter.type" class="mission-select">
                  <option value="">报警类型</option>
                  <option value="system">系统告警</option>
                  <option value="device">设备告警</option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
              <div class="custom-select-wrapper">
                <select v-model="filter.level" class="mission-select">
                  <option value="">报警等级</option>
                  <option value="normal">普通</option>
                  <option value="serious">严重</option>
                </select>
                <span class="custom-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,4 6,8 10,4" fill="#fff"/>
                  </svg>
                </span>
              </div>
              <button class="device-btn" @click="handleSearch">查询</button>
            </div>
          </div>
          <!-- 列表区 -->
          <div class="alarm-list-card card">
            <div class="alarm-table-header">
              <div class="alarm-th" v-for="col in columns" :key="col.key">{{ col.title }}</div>
            </div>
            <div class="alarm-table-body">
              <div class="alarm-tr" v-for="(row, idx) in alarmList" :key="row.id">
                <div class="alarm-td">{{ idx + 1 }}</div>
                <div class="alarm-td">{{ row.deviceName }}</div>
                <div class="alarm-td">{{ row.type }}</div>
                <div class="alarm-td">{{ row.content }}</div>
                <div class="alarm-td">{{ row.level }}</div>
                <div class="alarm-td">{{ row.time }}</div>
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
</script>

<style scoped>
@import './mission-common.css';
.alarm-top-card {
  margin-bottom: 4px;
  background: linear-gradient(135deg, #0a2a3a 80%, #0a0f1c 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px #0003;
  padding: 18px 24px 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.alarm-top-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.alarm-top-title {
  font-size: 16px;
  color: #67d5fd;
  font-weight: 600;
}
.alarm-top-row {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 4px;
}
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
.alarm-list-card {
  background: linear-gradient(135deg, #0a2a3a 80%, #0a0f1c 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px #0003;
  padding: 32px 32px 24px 32px;
  margin-bottom: 20px;
  min-height: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  min-height: 0;
  height: 100%;
}
.alarm-table-header {
  display: flex;
  background: #164159;
  border-radius: 8px 8px 0 0;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  padding: 0 0 0 0;
  min-height: 48px;
  align-items: center;
}
.alarm-th {
  flex: 1;
  padding: 12px 8px;
  text-align: left;
}
.alarm-table-body {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.alarm-tr {
  display: flex;
  border-bottom: 1px solid #18344a;
  min-height: 44px;
  align-items: center;
  color: #d4edfd;
  font-size: 14px;
}
.alarm-td {
  flex: 1;
  padding: 10px 8px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 