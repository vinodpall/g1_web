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
            <div class="device-top-card card">
              <div class="device-top-header">
                <img src="@/assets/source_data/bg_data/card_logo.png" style="width:22px;height:22px;margin-right:8px;vertical-align:middle;" alt="logo" />
                <span class="device-top-title">机器人管理</span>
              </div>
              <div class="device-top-row">
                <input 
                  v-model="filter.keyword" 
                  class="device-input" 
                  placeholder="请输入关键字搜索" 
                />
                <button class="device-btn" @click="handleSearch">查询</button>
                <button class="device-btn device-btn-add" @click="handleAddRobot">添加机器人</button>
              </div>
            </div>
            <!-- 新增和卡片区 -->
            <div class="device-card-list-wrapper">
              <div class="device-card-list">
                <div
                  class="device-card"
                  v-for="(device, idx) in devices"
                  :key="device.id"
                >
                <div class="device-card-header">
                  <span class="device-card-title">{{ device.name || '-' }}</span>
                  <div class="device-card-actions">
                    <span class="device-card-edit" v-permission-click-dialog="'device_management.device.update'" @click="handleEditRobot(device)">
                      <img :src="editIcon" alt="编辑" />
                    </span>
                    <span class="device-card-delete" v-permission-click-dialog="'device_management.device.delete'" @click="handleDelete(device.id.toString())">
                      <img :src="rubbishIcon" alt="删除" />
                    </span>
                  </div>
                </div>
                  <div class="device-card-body">
                    <div class="device-card-img-wrap">
                      <img :src="getDeviceImage(device)" class="device-card-img" />
                    </div>
                    <div class="device-card-info">
                      <div class="info-row"><span class="info-label">名称：</span><span class="info-value">{{ device.name || '-' }}</span></div>
                      <div class="info-row"><span class="info-label">SN：</span><span class="info-value">{{ device.sn || '-' }}</span></div>
                      <div class="info-row"><span class="info-label">型号：</span><span class="info-value">{{ device.model || '-' }}</span></div>
                      <div class="info-row"><span class="info-label">状态：</span><span class="info-value" :class="getStatusClass(device)">{{ formatStatus(device) }}</span></div>
                      <div class="info-row"><span class="info-label">在线：</span><span class="info-value" :class="device.online ? 'status-online' : 'status-offline'">{{ device.online ? '是' : '否' }}</span></div>
                      <div class="info-row"><span class="info-label">位置：</span><span class="info-value">{{ device.location || '-' }}</span></div>
                      <div class="info-row"><span class="info-label">创建日期：</span><span class="info-value">{{ formatCreateDate(device) }}</span></div>
                      <div class="info-row"><span class="info-label">备注：</span><span class="info-value">{{ device.notes || '-' }}</span></div>
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
            <!-- 添加机器人弹窗 -->
            <div v-if="showAddRobotModal" class="add-device-modal-mask">
              <div class="add-device-modal">
                <div class="add-device-modal-left">
                  <div class="add-device-title">添加机器人</div>
                  <div class="add-device-type-preview">
                    <img :src="robotForm.imagePreview || g1CompStandImg" alt="机器人预览" class="add-device-type-img" />
                    <div class="image-upload-wrapper">
                      <input 
                        type="file" 
                        ref="imageInput" 
                        @change="handleImageUpload" 
                        accept="image/*" 
                        style="display: none;"
                      />
                      <button class="upload-btn" @click="triggerImageUpload">上传图片</button>
                      <button v-if="robotForm.imagePreview" class="reset-btn" @click="resetImage">使用默认</button>
                    </div>
                  </div>
                </div>
                <div class="add-device-modal-right">
                  <div class="add-device-form">
                    <div class="add-device-row">
                      <label><span class="required">*</span>SN：</label>
                      <input 
                        v-model="robotForm.sn" 
                        class="add-device-input" 
                        :class="{ 'error': formErrors.sn }"
                        placeholder="请输入设备序列号（必填）" 
                      />
                      <div v-if="formErrors.sn" class="error-message">{{ formErrors.sn }}</div>
                    </div>
                    <div class="add-device-row">
                      <label><span class="required">*</span>名称：</label>
                      <input 
                        v-model="robotForm.name" 
                        class="add-device-input" 
                        :class="{ 'error': formErrors.name }"
                        placeholder="请输入机器人名称（必填）" 
                      />
                      <div v-if="formErrors.name" class="error-message">{{ formErrors.name }}</div>
                    </div>
                    <div class="add-device-row">
                      <label>型号：</label>
                      <input v-model="robotForm.model" class="add-device-input" placeholder="请输入机器人型号" />
                    </div>
                    <div class="add-device-row">
                      <label>固件版本：</label>
                      <input v-model="robotForm.firmware_version" class="add-device-input" placeholder="请输入固件版本" />
                    </div>
                    <div class="add-device-row">
                      <label><span class="required">*</span>IP地址：</label>
                      <input 
                        v-model="robotForm.ip_address" 
                        class="add-device-input" 
                        :class="{ 'error': formErrors.ip_address }"
                        placeholder="请输入IP地址（必填）" 
                      />
                      <div v-if="formErrors.ip_address" class="error-message">{{ formErrors.ip_address }}</div>
                    </div>
                    <div class="add-device-row">
                      <label>语音IP：</label>
                      <input v-model="robotForm.voice_ip" class="add-device-input" placeholder="请输入语音IP地址" />
                    </div>
                    <div class="add-device-row">
                      <label>MAC地址：</label>
                      <input v-model="robotForm.mac_address" class="add-device-input" placeholder="请输入MAC地址" />
                    </div>
                    <div class="add-device-row">
                      <label>位置：</label>
                      <input v-model="robotForm.location" class="add-device-input" placeholder="请输入机器人位置" />
                    </div>
                    <div class="add-device-row">
                      <label>状态：</label>
                      <select v-model="robotForm.status" class="add-device-input">
                        <option value="active">活跃</option>
                        <option value="inactive">非活跃</option>
                        <option value="maintenance">维护中</option>
                        <option value="error">故障</option>
                      </select>
                    </div>
                    <div class="add-device-row">
                      <label>是否在线：</label>
                      <select v-model="robotForm.online" class="add-device-input">
                        <option :value="true">在线</option>
                        <option :value="false">离线</option>
                      </select>
                    </div>
                    <div class="add-device-row">
                      <label>MQTT ID：</label>
                      <input v-model="robotForm.mqtt_client_id" class="add-device-input" placeholder="请输入MQTT ID" />
                    </div>
                    <div class="add-device-row">
                      <label>MQTT Topic：</label>
                      <input v-model="robotForm.mqtt_status_topic" class="add-device-input" placeholder="请输入MQTT Topic" />
                    </div>
                    <div class="add-device-row">
                      <label>备注：</label>
                      <textarea v-model="robotForm.notes" class="add-device-textarea" placeholder="请输入机器人备注" rows="3"></textarea>
                    </div>
                  </div>
                  <div class="add-device-actions">
                    <button class="device-btn" @click="handleAddRobotSubmit">确定</button>
                    <button class="device-btn device-btn-reset" @click="closeAddRobotModal">取消</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 编辑机器人弹窗 -->
            <div v-if="showEditRobotModal" class="add-device-modal-mask">
              <div class="add-device-modal">
                <div class="add-device-modal-left">
                  <div class="add-device-title">编辑机器人</div>
                  <div class="add-device-type-preview">
                    <img :src="editRobotForm.imagePreview || g1CompStandImg" alt="机器人预览" class="add-device-type-img" />
                    <div class="image-upload-wrapper">
                      <input 
                        type="file" 
                        ref="editImageInput" 
                        @change="handleEditImageUpload" 
                        accept="image/*" 
                        style="display: none;"
                      />
                      <button class="upload-btn" @click="triggerEditImageUpload">上传图片</button>
                      <button v-if="editRobotForm.imagePreview" class="reset-btn" @click="resetEditImage">使用默认</button>
                    </div>
                  </div>
                </div>
                <div class="add-device-modal-right">
                  <div class="add-device-form">
                    <div class="add-device-row">
                      <label><span class="required">*</span>SN：</label>
                      <input 
                        v-model="editRobotForm.sn" 
                        class="add-device-input" 
                        placeholder="SN不可修改"
                        disabled
                      />
                    </div>
                    <div class="add-device-row">
                      <label><span class="required">*</span>名称：</label>
                      <input 
                        v-model="editRobotForm.name" 
                        class="add-device-input" 
                        placeholder="请输入机器人名称（必填）" 
                      />
                    </div>
                    <div class="add-device-row">
                      <label>型号：</label>
                      <input v-model="editRobotForm.model" class="add-device-input" placeholder="请输入机器人型号" />
                    </div>
                    <div class="add-device-row">
                      <label>固件版本：</label>
                      <input v-model="editRobotForm.firmware_version" class="add-device-input" placeholder="请输入固件版本" />
                    </div>
                    <div class="add-device-row">
                      <label>IP地址：</label>
                      <input v-model="editRobotForm.ip_address" class="add-device-input" placeholder="请输入IP地址" />
                    </div>
                    <div class="add-device-row">
                      <label>语音IP：</label>
                      <input v-model="editRobotForm.voice_ip" class="add-device-input" placeholder="请输入语音IP地址" />
                    </div>
                    <div class="add-device-row">
                      <label>MAC地址：</label>
                      <input v-model="editRobotForm.mac_address" class="add-device-input" placeholder="请输入MAC地址" />
                    </div>
                    <div class="add-device-row">
                      <label>位置：</label>
                      <input v-model="editRobotForm.location" class="add-device-input" placeholder="请输入机器人位置" />
                    </div>
                    <div class="add-device-row">
                      <label>状态：</label>
                      <select v-model="editRobotForm.status" class="add-device-input">
                        <option value="active">活跃</option>
                        <option value="inactive">非活跃</option>
                        <option value="maintenance">维护中</option>
                        <option value="error">故障</option>
                      </select>
                    </div>
                    <div class="add-device-row">
                      <label>是否在线：</label>
                      <select v-model="editRobotForm.online" class="add-device-input">
                        <option :value="true">在线</option>
                        <option :value="false">离线</option>
                      </select>
                    </div>
                    <div class="add-device-row">
                      <label>MQTT ID：</label>
                      <input v-model="editRobotForm.mqtt_client_id" class="add-device-input" placeholder="请输入MQTT ID" />
                    </div>
                    <div class="add-device-row">
                      <label>MQTT Topic：</label>
                      <input v-model="editRobotForm.mqtt_status_topic" class="add-device-input" placeholder="请输入MQTT Topic" />
                    </div>
                    <div class="add-device-row">
                      <label>备注：</label>
                      <textarea v-model="editRobotForm.notes" class="add-device-textarea" placeholder="请输入机器人备注" rows="3"></textarea>
                    </div>
                  </div>
                  <div class="add-device-actions">
                    <button class="device-btn" @click="handleEditRobotSubmit">确定</button>
                    <button class="device-btn device-btn-reset" @click="closeEditRobotModal">取消</button>
                  </div>
                </div>
              </div>
            </div>
        </section>
      </div>
    </main>

    <!-- ResultDialog 结果弹窗 -->
    <ResultDialog
      :show="resultDialog.show"
      :type="resultDialog.type"
      :title="resultDialog.title"
      :message="resultDialog.message"
      :details="resultDialog.details"
      @close="closeResultDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRobotStore } from '../stores/robot'
import { useUserStore } from '../stores/user'
import robotManagementIcon from '@/assets/source_data/robot_source/robot_management.svg'
import dock3Img from '@/assets/source_data/dock3.png'
import m4tdImg from '@/assets/source_data/plane_2.png'
import g1CompStandImg from '@/assets/source_data/robot_source/g1_comp_stand.png'
import rubbishIcon from '@/assets/source_data/svg_data/rubbish.svg'
import videoIcon from '@/assets/source_data/svg_data/video.svg'
import editIcon from '@/assets/source_data/svg_data/edit.svg'
import ResultDialog from '@/components/ResultDialog.vue'

const router = useRouter()
const route = useRoute()
const robotStore = useRobotStore()
const userStore = useUserStore()

// 使用机器人store中的数据
const devices = computed(() => robotStore.robots || [])

// 从缓存加载机器人数据
const loadRobotsFromCache = () => {
  robotStore.hydrateFromCache()
  console.log('已从缓存加载机器人数据:', devices.value.length, '个机器人')
}

const sidebarTabs = [
  { key: 'manage', label: '机器人管理', icon: robotManagementIcon }
]
const currentTab = ref('manage')

// 根据路由自动设置currentTab
const syncTabWithRoute = () => {
  currentTab.value = 'manage'
}

// 页面加载时同步路由
onMounted(() => {
  console.log('DeviceManage组件加载')
  // 同步路由状态
  syncTabWithRoute()
  // 从缓存加载机器人数据
  loadRobotsFromCache()
  console.log('机器人列表加载完成:', devices.value.length, '个机器人')
})

// 监听路由变化
watch(() => route.path, syncTabWithRoute)

const handleTabClick = (key: string) => {
  currentTab.value = key
  if (key === 'manage') {
    router.push('/dashboard/device-manage')
  }
}

const filter = ref<{ keyword: string }>({ keyword: '' })

const handleSearch = async () => {
  console.log('handleSearch 被调用')
  const keyword = filter.value.keyword.trim()
  console.log('搜索关键字:', keyword)
  
  try {
    const token = userStore.token
    if (!token) {
      console.error('用户未登录')
      alert('用户未登录，请先登录')
      return
    }
    
    console.log('开始调用API搜索')
    await robotStore.fetchRobots(token, keyword)
    console.log('搜索API调用完成')
    
  } catch (error) {
    console.error('搜索失败:', error)
    alert('搜索失败：' + (error as Error).message)
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('确定要删除这个机器人吗？')) {
    return
  }
  
  try {
    const robotId = parseInt(id)
    const token = userStore.token
    if (!token) {
      console.error('用户未登录')
      return
    }
    
    await robotStore.deleteRobot(token, robotId)
    console.log('机器人删除成功:', id)
  } catch (error) {
    console.error('删除机器人失败:', error)
    alert('删除机器人失败，请稍后重试')
  }
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

// 添加机器人弹窗控制
const showAddRobotModal = ref(false)
const imageInput = ref<HTMLInputElement>()
const robotForm = ref({
  sn: '',
  name: '',
  model: '',
  firmware_version: '',
  ip_address: '',
  voice_ip: '',
  mac_address: '',
  location: '',
  status: 'inactive',
  online: false,
  mqtt_client_id: '',
  mqtt_status_topic: '',
  notes: '',
  imagePreview: ''
})

// 表单验证错误
const formErrors = ref({
  sn: '',
  name: '',
  ip_address: ''
})

// ResultDialog 状态
const resultDialog = ref({
  show: false,
  type: 'info' as 'success' | 'error' | 'info',
  title: '',
  message: '',
  details: '' as string | null
})

const closeResultDialog = () => {
  resultDialog.value.show = false
}

const handleAddRobot = () => {
  showAddRobotModal.value = true
  // 重置表单
  Object.assign(robotForm.value, {
    sn: '',
    name: '',
    model: '',
    firmware_version: '',
    ip_address: '',
    voice_ip: '',
    mac_address: '',
    location: '',
    status: 'inactive',
    online: false,
    mqtt_client_id: '',
    mqtt_status_topic: '',
    notes: '',
    imagePreview: ''
  })
  // 重置表单验证错误
  Object.assign(formErrors.value, {
    sn: '',
    name: '',
    ip_address: ''
  })
}

const closeAddRobotModal = () => {
  showAddRobotModal.value = false
}

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      robotForm.value.imagePreview = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const resetImage = () => {
  robotForm.value.imagePreview = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

// 表单验证
const validateForm = () => {
  let isValid = true
  
  // 重置错误信息
  formErrors.value.sn = ''
  formErrors.value.name = ''
  formErrors.value.ip_address = ''
  
  // 验证SN（必填）
  if (!robotForm.value.sn.trim()) {
    formErrors.value.sn = 'SN是必填项'
    isValid = false
  }
  
  // 验证名称（必填）
  if (!robotForm.value.name.trim()) {
    formErrors.value.name = '名称是必填项'
    isValid = false
  }
  
  // 验证IP地址（必填）
  if (!robotForm.value.ip_address.trim()) {
    formErrors.value.ip_address = 'IP地址是必填项'
    isValid = false
  }
  
  return isValid
}

const handleAddRobotSubmit = async () => {
  // 表单验证
  if (!validateForm()) {
    return
  }
  
  try {
    const token = userStore.token
    if (!token) {
      resultDialog.value = {
        show: true,
        type: 'error',
        title: '操作失败',
        message: '',
        details: '用户未登录，请先登录'
      }
      return
    }
    
    // 准备机器人数据
    const robotData = {
      sn: robotForm.value.sn.trim(),
      name: robotForm.value.name.trim(),
      model: robotForm.value.model || '',
      firmware_version: robotForm.value.firmware_version || '',
      ip_address: robotForm.value.ip_address.trim(),
      voice_ip: robotForm.value.voice_ip || '',
      mac_address: robotForm.value.mac_address || '',
      location: robotForm.value.location || '',
      status: robotForm.value.status || 'inactive',
      online: robotForm.value.online || false,
      mqtt_client_id: robotForm.value.mqtt_client_id || '',
      mqtt_status_topic: robotForm.value.mqtt_status_topic || '',
      notes: robotForm.value.notes || ''
    }
    
    // 调用API创建机器人
    await robotStore.createRobot(token, robotData)
    
    // 关闭弹窗
    showAddRobotModal.value = false
    
    console.log('机器人创建成功:', robotData)
    
    // 显示成功提示
    resultDialog.value = {
      show: true,
      type: 'success',
      title: '创建成功',
      message: '',
      details: '机器人创建成功！'
    }
    
  } catch (error: any) {
    console.error('创建机器人失败:', error)
    
    // 从错误对象中提取 detail 字段
    let errorMessage = '创建机器人失败，请稍后重试'
    if (error && typeof error === 'object') {
      if (error.detail) {
        errorMessage = error.detail
      } else if (error.message) {
        errorMessage = error.message
      } else if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail
      }
    }
    
    resultDialog.value = {
      show: true,
      type: 'error',
      title: '创建失败',
      message: '',
      details: errorMessage
    }
  }
}

// 编辑机器人弹窗控制
const showEditRobotModal = ref(false)
const editImageInput = ref<HTMLInputElement>()
const currentEditRobotId = ref<number>(0)
const editRobotForm = ref({
  sn: '',
  name: '',
  model: '',
  firmware_version: '',
  ip_address: '',
  voice_ip: '',
  mac_address: '',
  location: '',
  status: 'inactive',
  online: false,
  mqtt_client_id: '',
  mqtt_status_topic: '',
  notes: '',
  imagePreview: ''
})

const handleEditRobot = (device: any) => {
  currentEditRobotId.value = device.id
  showEditRobotModal.value = true
  // 填充表单数据
  Object.assign(editRobotForm.value, {
    sn: device.sn || '',
    name: device.name || '',
    model: device.model || '',
    firmware_version: device.firmware_version || '',
    ip_address: device.ip_address || '',
    voice_ip: device.voice_ip || '',
    mac_address: device.mac_address || '',
    location: device.location || '',
    status: device.status || 'inactive',
    online: device.online || false,
    mqtt_client_id: device.mqtt_client_id || '',
    mqtt_status_topic: device.mqtt_status_topic || '',
    notes: device.notes || '',
    imagePreview: device.photo_url || ''
  })
}

const closeEditRobotModal = () => {
  showEditRobotModal.value = false
}

const triggerEditImageUpload = () => {
  editImageInput.value?.click()
}

const handleEditImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editRobotForm.value.imagePreview = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const resetEditImage = () => {
  editRobotForm.value.imagePreview = ''
  if (editImageInput.value) {
    editImageInput.value.value = ''
  }
}

const handleEditRobotSubmit = async () => {
  // 验证名称
  if (!editRobotForm.value.name.trim()) {
    alert('名称是必填项')
    return
  }
  
  try {
    const token = userStore.token
    if (!token) {
      alert('用户未登录，请先登录')
      return
    }
    
    // 准备机器人数据（不包含SN，SN不可修改）
    const robotData: any = {
      name: editRobotForm.value.name.trim(),
      model: editRobotForm.value.model || '',
      firmware_version: editRobotForm.value.firmware_version || '',
      ip_address: editRobotForm.value.ip_address || '',
      voice_ip: editRobotForm.value.voice_ip || '',
      mac_address: editRobotForm.value.mac_address || '',
      location: editRobotForm.value.location || '',
      status: editRobotForm.value.status || 'inactive',
      online: editRobotForm.value.online || false,
      mqtt_client_id: editRobotForm.value.mqtt_client_id || '',
      mqtt_status_topic: editRobotForm.value.mqtt_status_topic || '',
      notes: editRobotForm.value.notes || ''
    }
    
    // 如果有图片预览，添加photo_url
    if (editRobotForm.value.imagePreview) {
      robotData.photo_url = editRobotForm.value.imagePreview
    }
    
    // 调用API更新机器人
    await robotStore.updateRobot(token, currentEditRobotId.value, robotData)
    
    // 关闭弹窗
    showEditRobotModal.value = false
    
    console.log('机器人更新成功:', robotData)
    alert('机器人更新成功！')
    
  } catch (error) {
    console.error('更新机器人失败:', error)
    alert('更新机器人失败，请稍后重试')
  }
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

// 辅助函数：获取设备图片
const getDeviceImage = (device: any) => {
  // 使用默认的g1_comp_stand图片
  return g1CompStandImg
}

// 辅助函数：格式化状态
const formatStatus = (device: any) => {
  // 状态映射
  const statusMap: { [key: string]: string } = {
    'active': '活跃',
    'inactive': '非活跃',
    'maintenance': '维护中',
    'error': '故障'
  }
  return statusMap[device.status] || device.status || '-'
}

// 辅助函数：获取状态样式类名
const getStatusClass = (device: any) => {
  if (device.status === 'active') {
    return 'status-online'
  } else if (device.status === 'error') {
    return 'status-error'
  } else {
    return 'status-offline'
  }
}

// 辅助函数：格式化创建日期
const formatCreateDate = (device: any) => {
  // 格式化创建日期
  if (device.created_at) {
    const date = new Date(device.created_at)
    return date.toLocaleDateString('zh-CN')
  } else if (device.create_time) {
    const date = new Date(device.create_time)
    return date.toLocaleDateString('zh-CN')
  } else {
    return '-'
  }
}
</script>

<style scoped>
@import './mission-common.css';

/* 表单验证样式 */
.required {
  color: #ff4d4f;
  margin-right: 4px;
}

.add-device-input.error {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.2;
}

.status-error {
  color: #ff4d4f !important;
}

/* 下拉框样式优化 */
.add-device-input select,
select.add-device-input {
  background-color: transparent !important;
}

.add-device-input select option,
select.add-device-input option {
  background-color: rgba(0, 0, 0, 0.8) !important;
  color: #fff !important;
}

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
  flex-wrap: wrap; /* 支持自动换行 */
  overflow-x: visible; /* 避免横向滚动条 */
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
  min-width: 120px;
  max-width: 180px; /* 限制最大宽度 */
  flex-shrink: 0;
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
  min-width: 140px;
  max-width: 180px;
  width: 100%;
  vertical-align: middle;
  flex-shrink: 0;
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
  width: 100%;
  min-width: 140px;
  max-width: 180px;
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
  max-width: 120px; /* 限制最大宽度 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
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
  gap: 20px 20px;
  row-gap: 32px;
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
.device-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.device-card-edit {
  color: #1890ff;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  transition: filter 0.2s;
  height: 44px;
  padding-left: 8px;
}
.device-card-edit img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: none;
  transition: filter 0.2s;
  display: block;
  margin: auto 0;
}
.device-card-edit:hover img {
  filter: drop-shadow(0 0 4px #1890ff);
}
.device-card-delete {
  color: #ff4d4f;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  transition: filter 0.2s;
  height: 44px;
  padding-left: 8px;
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

/* 状态颜色样式 */
.status-online {
  color: #52c41a !important;
  font-weight: 500;
  text-shadow: 0 0 2px rgba(82, 196, 26, 0.3);
}

.status-offline {
  color: #ff4d4f !important;
  font-weight: 500;
  text-shadow: 0 0 2px rgba(255, 77, 79, 0.3);
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
  min-width: 100px;
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

/* 图片上传相关样式 */
.image-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  align-items: center;
}

.upload-btn, .reset-btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #164159;
  background: #0c3c56;
  color: #67d5fd;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
  width: 80px;
}

.upload-btn:hover, .reset-btn:hover {
  background: #0c4666;
}

.reset-btn {
  background: #232b3a;
  color: #fff;
  border-color: #232b3a;
}

.reset-btn:hover {
  background: #2d3648;
}

/* 文本域样式 */
.add-device-textarea {
  flex: 1;
  min-height: 60px;
  border-radius: 4px;
  border: 1px solid #164159;
  background: transparent;
  color: #fff;
  padding: 8px 12px;
  font-size: 14px;
  box-shadow: 0 0 0 1px #164159 inset;
  transition: border 0.2s, box-shadow 0.2s;
  resize: vertical;
  font-family: inherit;
}

.add-device-textarea:focus {
  outline: none;
  border: 1.5px solid #16bbf2;
  box-shadow: 0 0 0 2px rgba(22,187,242,0.15);
}

/* 侧边栏样式 */
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
  height: calc(100vh - 104px); /* 修改：使用视口高度减去顶部84px和margin-top 20px */
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: hidden; /* 修改：改为hidden避免滚动条 */
  position: relative;
}

.sidebar-tabs {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 40px;
  align-items: center;
  flex: 1; /* 新增：让标签区域占据剩余空间 */
  justify-content: flex-start; /* 新增：从顶部开始排列 */
  padding-top: 20px; /* 新增：顶部留出一些空间 */
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
  height: calc(100vh - 104px); /* 修改：与侧边栏保持一致的高度计算 */
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
  padding-bottom: 0;
  padding-right: 32px;
}

/* 高分辨率屏幕优化 */
@media (min-width: 1920px) {
  .sidebar-menu {
    height: calc(100vh - 104px);
    overflow: hidden;
  }
  .main-content {
    height: calc(100vh - 104px);
  }
  .sidebar-tabs {
    gap: 20px; /* 在高分辨率下稍微减少间距 */
  }
}
</style>