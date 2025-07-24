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
          <AlarmLog v-if="currentTab === 'warning'" />
          <template v-else>
            <!-- 筛选区 -->
            <div class="device-top-card card">
              <div class="device-top-header">
                <span class="device-top-title">设备管理</span>
              </div>
              <div class="device-top-row">
                <input v-model="filter.name" class="device-input" placeholder="请输入设备名称" />
                <input v-model="filter.sn" class="device-input" placeholder="请输入设备SN" />
                <div class="custom-select-wrapper">
                  <select v-model="filter.type" class="mission-select">
                    <option value="">全部</option>
                    <option value="dock">机巢</option>
                    <option value="drone">无人机</option>
                  </select>
                  <span class="custom-select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <polygon points="2,4 6,8 10,4" fill="#fff"/>
                    </svg>
                  </span>
                </div>
                <button class="device-btn" @click="handleSearch">查询</button>
                <button class="device-btn device-btn-reset" @click="handleReset">重置</button>
                <button class="device-btn device-btn-add" @click="handleAddDevice">添加设备</button>
              </div>
            </div>
            <!-- 新增和卡片区 -->
            <div class="device-card-list-wrapper">
              <div class="device-card-list">
                <div
                  class="device-card"
                  v-for="(device, idx) in deviceList.slice(0, 2)"
                  :key="device.id"
                >
                  <div class="device-card-header">
                    <span class="device-card-title">{{ device.name }}</span>
                    <span class="device-card-delete" @click="handleDelete(device.id)">
                      <img :src="rubbishIcon" alt="删除" />
                    </span>
                  </div>
                  <div class="device-card-body">
                    <div class="device-card-img-wrap">
                      <img :src="device.img" class="device-card-img" />
                    </div>
                    <div class="device-card-info">
                      <div class="info-row"><span class="info-label">名称：</span><span class="info-value">{{ device.name }}</span></div>
                      <div class="info-row"><span class="info-label">版本号：</span><span class="info-value">{{ device.version }}</span></div>
                      <template v-if="device.type === 'dock'">
                        <div class="info-row"><span class="info-label">主控sn：</span><span class="info-value">{{ device.sn }}</span></div>
                        <div class="info-row"><span class="info-label">铭牌sn：</span><span class="info-value">{{ device.battery }}</span></div>
                        <div class="info-row"><span class="info-label">保养服务：</span><span class="info-value">{{ device.flightHours }}天</span></div>
                        <div class="info-row"><span class="info-label">行业无忧：</span><span class="info-value">{{ device.expire }}</span></div>
                        <div class="info-row"><span class="info-label">状态：</span><span class="info-value">{{ device.status }}</span></div>
                        <div class="info-row"><span class="info-label">告警信息：</span><span class="info-value">{{ device.warning }}</span></div>
                        <div class="info-row">
                          <span class="info-label">机场直播：</span>
                          <span class="info-value">
                            <button class="live-btn" @click="openVideoModal(device.liveUrl)">
                              <img :src="videoIcon" alt="直播" />
                            </button>
                          </span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="info-row"><span class="info-label">机器sn：</span><span class="info-value">{{ device.sn }}</span></div>
                        <div class="info-row"><span class="info-label">电池sn：</span><span class="info-value">{{ device.battery }}</span></div>
                        <div class="info-row"><span class="info-label">保养服务：</span><span class="info-value">{{ device.flightHours }}航时/{{ device.days }}天</span></div>
                        <div class="info-row"><span class="info-label">行业无忧：</span><span class="info-value">{{ device.expire }}</span></div>
                        <div class="info-row"><span class="info-label">状态：</span><span class="info-value">{{ device.status }}</span></div>
                        <div class="info-row"><span class="info-label">告警信息：</span><span class="info-value">{{ device.warning }}</span></div>
                        <div class="info-row">
                          <span class="info-label">云台直播：</span>
                          <span class="info-value">
                            <button class="live-btn" @click="openVideoModal(device.liveUrl)">
                              <img :src="videoIcon" alt="直播" />
                            </button>
                          </span>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 视频弹窗 -->
            <div v-if="showVideoModal" class="video-modal-mask">
              <div class="video-modal">
                <button class="video-modal-close" @click="closeVideoModal">×</button>
                <video v-if="currentLiveUrl" :src="currentLiveUrl" controls autoplay style="width:100%;height:420px;background:#000;border-radius:8px;"></video>
                <div v-else style="color:#fff;text-align:center;padding:40px 0;">暂无视频</div>
              </div>
            </div>
            <!-- 添加设备弹窗 -->
            <div v-if="showAddModal" class="add-device-modal-mask">
              <div class="add-device-modal">
                <div class="add-device-modal-left">
                  <div class="add-device-title">添加设备</div>
                  <div class="add-device-type-select">
                    <label>设备类型：</label>
                    <div class="custom-select-wrapper">
                      <select v-model="addFormType" @change="handleTypeChange" class="mission-select">
                        <option value="dock">机场</option>
                        <option value="drone">无人机</option>
                      </select>
                      <span class="custom-select-arrow">
                        <svg width="12" height="12" viewBox="0 0 12 12">
                          <polygon points="2,4 6,8 10,4" fill="#fff"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div class="add-device-type-preview">
                    <img v-if="addFormType==='dock'" :src="dock3Img" alt="机场预览" class="add-device-type-img" />
                    <img v-else :src="m4tdImg" alt="无人机预览" class="add-device-type-img" />
                  </div>
                </div>
                <div class="add-device-modal-right">
                  <div class="add-device-form">
                    <div class="add-device-row">
                      <label>名称：</label>
                      <input v-model="addForm.name" class="add-device-input" placeholder="请输入名称" />
                    </div>
                    <div class="add-device-row">
                      <label>版本号：</label>
                      <input v-model="addForm.version" class="add-device-input" placeholder="请输入版本号" />
                    </div>
                    <template v-if="addFormType === 'dock'">
                      <div class="add-device-row"><label>主控sn：</label><input v-model="addForm.sn" class="add-device-input" placeholder="请输入主控sn" /></div>
                      <div class="add-device-row"><label>铭牌sn：</label><input v-model="addForm.battery" class="add-device-input" placeholder="请输入铭牌sn" /></div>
                      <div class="add-device-row"><label>保养服务：</label><input v-model="addForm.flightHours" class="add-device-input" placeholder="请输入天数" /></div>
                      <div class="add-device-row"><label>行业无忧：</label><input v-model="addForm.expire" class="add-device-input" placeholder="请输入到期日期" /></div>
                      <div class="add-device-row"><label>状态：</label><input v-model="addForm.status" class="add-device-input" placeholder="请输入状态" /></div>
                      <div class="add-device-row"><label>告警信息：</label><input v-model="addForm.warning" class="add-device-input" placeholder="请输入告警信息" /></div>
                      <div class="add-device-row"><label>机场直播：</label><input v-model="addForm.liveUrl" class="add-device-input" placeholder="请输入直播地址" /></div>
                    </template>
                    <template v-else>
                      <div class="add-device-row"><label>机器sn：</label><input v-model="addForm.sn" class="add-device-input" placeholder="请输入机器sn" /></div>
                      <div class="add-device-row"><label>电池sn：</label><input v-model="addForm.battery" class="add-device-input" placeholder="请输入电池sn" /></div>
                      <div class="add-device-row"><label>保养服务：</label><input v-model="addForm.flightHours" class="add-device-input" placeholder="请输入航时" style="width:90px;" /> / <input v-model="addForm.days" class="add-device-input" placeholder="天数" style="width:90px;" /></div>
                      <div class="add-device-row"><label>行业无忧：</label><input v-model="addForm.expire" class="add-device-input" placeholder="请输入到期日期" /></div>
                      <div class="add-device-row"><label>状态：</label><input v-model="addForm.status" class="add-device-input" placeholder="请输入状态" /></div>
                      <div class="add-device-row"><label>告警信息：</label><input v-model="addForm.warning" class="add-device-input" placeholder="请输入告警信息" /></div>
                      <div class="add-device-row"><label>云台直播：</label><input v-model="addForm.liveUrl" class="add-device-input" placeholder="请输入直播地址" /></div>
                    </template>
                  </div>
                  <div class="add-device-actions">
                    <button class="device-btn" @click="handleAddSubmit">确定</button>
                    <button class="device-btn device-btn-reset" @click="closeAddModal">取消</button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import equipmengStoreIcon from '@/assets/source_data/svg_data/equipmeng_store.svg'
import equipmentWarningsIcon from '@/assets/source_data/svg_data/equipment_warnings.svg'
import dock3Img from '@/assets/source_data/dock3.png'
import m4tdImg from '@/assets/source_data/plane_2.png'
import rubbishIcon from '@/assets/source_data/svg_data/rubbish.svg'
import videoIcon from '@/assets/source_data/svg_data/video.svg'
import AlarmLog from './AlarmLog.vue'

const router = useRouter()
const route = useRoute()
const sidebarTabs = [
  { key: 'manage', label: '设备管理', icon: equipmengStoreIcon },
  { key: 'warning', label: '设备告警', icon: equipmentWarningsIcon }
]
const currentTab = ref('manage')

// 根据路由自动设置currentTab
const syncTabWithRoute = () => {
  if (route.path.includes('/dashboard/alarm-log')) {
    currentTab.value = 'warning'
  } else {
    currentTab.value = 'manage'
  }
}
onMounted(syncTabWithRoute)
watch(() => route.path, syncTabWithRoute)

const handleTabClick = (key: string) => {
  currentTab.value = key
  if (key === 'manage') {
    router.push('/dashboard/device-manage')
  } else if (key === 'warning') {
    router.push('/dashboard/alarm-log')
  }
}

const filter = ref({ name: '', sn: '', type: '' })
const handleSearch = () => {
  // 查询逻辑
}
const handleReset = () => {
  filter.value = { name: '', sn: '', type: '' }
}
const handleDelete = (id: string) => {
  // 删除设备逻辑
}

// 弹窗控制
const showVideoModal = ref(false)
const currentLiveUrl = ref('')
const openVideoModal = (url: string) => {
  currentLiveUrl.value = url
  showVideoModal.value = true
}
const closeVideoModal = () => {
  showVideoModal.value = false
  currentLiveUrl.value = ''
}

// 添加设备弹窗控制
const showAddModal = ref(false)
const addFormType = ref('dock')
const addForm = ref({
  name: '',
  version: '',
  sn: '',
  battery: '',
  flightHours: '',
  days: '',
  expire: '',
  status: '',
  warning: '',
  liveUrl: '',
  img: ''
})
const handleAddDevice = () => {
  showAddModal.value = true
  addFormType.value = 'dock'
  Object.assign(addForm.value, {
    name: '', version: '', sn: '', battery: '', flightHours: '', days: '', expire: '', status: '', warning: '', liveUrl: '', img: ''
  })
}
const closeAddModal = () => {
  showAddModal.value = false
}
const handleTypeChange = (e: Event) => {
  addFormType.value = (e.target as HTMLSelectElement).value
}
const handleAddSubmit = () => {
  // 这里只做收集数据演示
  showAddModal.value = false
}

// 示例设备数据
const deviceList = ref([
  {
    id: '1',
    type: 'dock',
    name: '大疆机场3-1',
    version: 'Dock 3 V13.01.0007',
    sn: 'BUXUN5U0OA90N',
    battery: 'BHEN5W0Q4X2KF',
    flightHours: 180,
    days: 180,
    expire: '2026-07-31',
    status: '离线',
    warning: '暂无',
    liveUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    img: dock3Img
  },
  {
    id: '2',
    type: 'drone',
    name: 'M4TD-1',
    version: 'M4TD V13.01.0007',
    sn: '158FHWCA25SW00A0GW',
    battery: '87UP3NVCAA00F8',
    flightHours: 495,
    days: 363,
    expire: '2026-08-01',
    status: '离线',
    warning: '暂无',
    liveUrl: 'https://www.w3schools.com/html/movie.mp4',
    img: m4tdImg
  }
])
</script>

<style scoped>
@import './mission-common.css';
.device-top-card {
  margin-bottom: 4px;
  background: linear-gradient(135deg, #0a2a3a 80%, #0a0f1c 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px #0003;
  padding: 18px 24px 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.device-top-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.device-top-title {
  font-size: 16px;
  color: #67d5fd;
  font-weight: 600;
}
.device-top-row {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 4px;
  /* 默认靠左排列 */
}
.device-input {
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
.device-input:focus {
  outline: none;
  border: 1.5px solid #16bbf2;
  box-shadow: 0 0 0 2px rgba(22,187,242,0.15);
}
/* 下拉框自定义箭头和样式 */
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
  width: 140px;
  min-width: 140px;
  max-width: 190px;
  height: 32px;
  background: none !important;
  background-color: transparent !important;
  border-radius: 4px;
  border: 1px solid #164159;
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 4px 32px 4px 12px;
  outline: none;
  margin-right: 0;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-sizing: border-box;
  flex-shrink: 0;
  color-scheme: dark;
}
.mission-select:focus {
  border: 1.5px solid #16bbf2;
}
.mission-select option {
  background: #172233;
  color: #fff;
}
.device-btn {
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  padding: 4px 18px;
  cursor: pointer;
  border: none;
  transition: background 0.2s, color 0.2s, border 0.2s;
  height: 32px;
  margin-left: 4px;
}
.device-btn {
  background: #0c3c56;
  color: #67d5fd;
  border: 1px solid rgba(38, 131, 182, 0.8);
}
.device-btn:hover {
  background: #0c4666;
  color: #67d5fd;
}
.device-btn-reset {
  background: #232b3a;
  color: #fff;
  border: 1px solid #232b3a;
}
.device-btn-reset:hover {
  background: #2d3648;
  color: #fff;
}
.device-btn-add {
  margin-left: 4px;
}
.device-card-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
  margin-top: 0;
}
.device-card {
  width: 100%;
  max-width: 400px;
  background: rgba(128, 128, 128, 0.12);
  border-radius: 8px;
  box-shadow: 0 2px 8px #0003;
  padding: 0 0 14px 0;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: box-shadow 0.2s;
  justify-self: center;
}
.device-card.add-card {
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #59c0fc;
  font-size: 36px;
  background: rgba(128, 128, 128, 0.12);
  border: 2px dashed #59c0fc;
  min-height: 160px;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0003;
}
.add-icon {
  font-size: 48px;
  color: #59c0fc;
}
.device-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 0 20px 0 24px;
  min-height: 38px;
  background: rgba(217, 217, 217, 0.10);
  border-radius: 8px 8px 0 0;
  height: 44px;
}
.device-card-title {
  color: #FFF;
  font-family: Inter, 'Microsoft YaHei', Arial, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  letter-spacing: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.device-card-delete {
  color: #ff4d4f;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  transition: filter 0.2s;
  height: 44px;
  padding-left: 12px;
}
.device-card-delete img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: none;
  transition: filter 0.2s;
  display: block;
  margin: auto 0;
  color: #ff4d4f;
}
.device-card-delete:hover img {
  filter: drop-shadow(0 0 4px #ff4d4f);
}
.device-card-body {
  display: flex;
  align-items: center;
  padding: 5px 5px 0 5px;
}
.device-card-img-wrap {
  flex: 0 0 180px;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0;
  background: none;
}
.device-card-img {
  width: 180px;
  height: 180px;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 0;
  background: none;
  box-shadow: none;
}
.device-card-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #d4edfd;
  font-size: 12px;
  justify-content: center;
  min-width: 0;
}
.info-row {
  display: flex;
  gap: 8px;
  align-items: center;
  line-height: 1.7;
}
.info-label {
  color: #b8c7d9;
  min-width: 72px;
  font-weight: 500;
  text-align: right;
  font-size: 12px;
  line-height: 1.7;
}
.info-value {
  color: #fff;
  font-weight: 400;
  word-break: break-all;
  font-size: 10px;
  line-height: 1.7;
}
/* 新增内容区大背景卡片样式 */
.device-card-list-wrapper {
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
.live-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0 0 0 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.live-btn img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}
.video-modal-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-modal {
  background: #172233;
  border-radius: 12px;
  padding: 24px 24px 16px 24px;
  min-width: 720px;
  min-height: 200px;
  box-shadow: 0 4px 24px #0008;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.video-modal-close {
  position: absolute;
  right: 16px;
  top: 12px;
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  z-index: 2;
  line-height: 1;
}
.add-device-modal-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-device-modal {
  background: #172233;
  border-radius: 12px;
  padding: 0;
  min-width: 600px;
  box-shadow: 0 4px 24px #0008;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
}
.add-device-modal-left {
  width: 200px;
  background: linear-gradient(135deg, #0a2a3a 80%, #0a0f1c 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 18px 18px 18px;
  border-radius: 12px 0 0 12px;
  border-right: 1px solid #18344a;
  min-height: 100%;
}
.add-device-title {
  font-size: 20px;
  color: #67d5fd;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
}
.add-device-type-select {
  width: 100%;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.add-device-type-select label {
  color: #b8c7d9;
  font-size: 14px;
  margin-bottom: 2px;
}
.add-device-type-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 12px;
}
.add-device-type-img {
  width: 160px;
  height: 160px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 8px;
}
.add-device-modal-right {
  flex: 1;
  padding: 32px 32px 18px 32px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 320px;
}
.add-device-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.add-device-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
}
.add-device-row label {
  min-width: 80px;
  color: #b8c7d9;
  font-size: 14px;
  text-align: right;
}
.add-device-input {
  flex: 1;
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
.add-device-input:focus {
  outline: none;
  border: 1.5px solid #16bbf2;
  box-shadow: 0 0 0 2px rgba(22,187,242,0.15);
}
.add-device-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 40px;
}
</style>