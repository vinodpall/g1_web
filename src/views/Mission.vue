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
              <span class="mission-top-title">展厅管理</span>
            </div>
            <div class="hall-toolbar">
              <div class="hall-toolbar-row">
                <div class="hall-actions">
                  <button
                    class="mission-btn mission-btn-pause hall-btn"
                    :disabled="isGenerating"
                    @click="isRecording ? stopHallRecording() : startHallRecording()"
                  >
                    {{ isRecording ? '停止地图录制' : '展厅地图录制' }}
                  </button>
                  <button
                    class="mission-btn mission-btn-pause hall-btn"
                    :disabled="isRecording || isGenerating"
                    @click="startGenerateHallMap"
                  >
                    生成展厅地图
                  </button>
                </div>
                <div class="map-progress" v-show="isGenerating || (mapGenProgress > 0 && mapGenProgress < 100)">
                  <div class="map-progress-track">
                    <div class="map-progress-fill" :style="{ width: mapGenProgress + '%' }"></div>
                  </div>
                  <span class="map-progress-text">{{ mapGenProgress }}%</span>
                </div>
              </div>
            </div>
            </div>
          <div class="hall-grid-card card">
            <div class="hall-grid-content">
              <div class="gridmap-wrapper">
                <canvas ref="hallGridCanvas" class="grid-canvas"></canvas>
          </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    <!-- 旧弹窗与任务下发模块已移除 -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import trackListIcon from '@/assets/source_data/svg_data/track_list.svg'
import trackRecordsIcon from '@/assets/source_data/svg_data/track_records.svg'
import trackLogsIcon from '@/assets/source_data/svg_data/track_logs.svg'
// import { useWaylineJobs, useDevices } from '../composables/useApi'
// import { waylineApi } from '@/api/services'
// import { useDeviceStatus } from '../composables/useDeviceStatus'
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

// 展厅管理相关状态
const isRecording = ref(false)
const isGenerating = ref(false)
const mapGenProgress = ref(0)
const hallOptions = ref<Array<{ id: string; name: string; gridUrl?: string }>>([
  { id: 'hall_a', name: 'A展厅' },
  { id: 'hall_b', name: 'B展厅' }
])
const selectedHall = ref('hall_a')
const currentGridUrl = computed(() => hallOptions.value.find(h => h.id === selectedHall.value)?.gridUrl || '')

// 动作：开始/停止录制、生成地图/栅格图（此处占位，后端对接时替换）
const startHallRecording = () => { isRecording.value = true }
const stopHallRecording = () => { isRecording.value = false }
const generateHallMap = () => { /* TODO: 生成地图 */ }
const generateHallGrid = () => { /* TODO: 生成栅格图并更新对应hall的gridUrl */ }

// Demo: 模拟生成进度（对接接口后替换）
watch(isGenerating, (val) => {
  if (!val) return
  mapGenProgress.value = 0
  const step = () => {
    if (!isGenerating.value) return
    mapGenProgress.value = Math.min(100, mapGenProgress.value + Math.round(Math.random() * 8 + 4))
    if (mapGenProgress.value < 100) {
      requestAnimationFrame(step)
    } else {
      isGenerating.value = false
    }
  }
  requestAnimationFrame(step)
})

const startGenerateHallMap = () => {
  if (isRecording.value || isGenerating.value) return
  isGenerating.value = true
}

// 航线相关功能已移除

// 航线详情相关逻辑已移除

// 航线选择监听已移除

// 航点数据已移除

// 航线名称获取已移除

// 坐标格式化已移除

// 动作图标映射已移除

const sidebarTabs = [
  { key: 'list', label: '展厅管理', icon: trackListIcon, path: '/dashboard/mission' }
]

const handleTabClick = (tab: any) => {
  if (route.path !== tab.path) {
    router.push(tab.path)
  }
}

// 旧航线选择交互已移除

// 旧确认弹窗已移除
// 旧删除航线函数已移除
// 旧上传对话框状态已移除

// 算法选项
const algorithmOptions = {
  49: "常熟1号线路灯",
  50: "常熟2号线路灯", 
  51: "常熟3号线路灯",
  52: "常熟楼宇亮化",
  9: "人车检测"
}

// 旧任务下发弹窗已移除

const fileInputRef = ref<HTMLInputElement | null>(null)

// 返回当前本地时间+4分钟（到分钟）的最小值，供 datetime-local 作为最小值
const getMinLocalDateTime = () => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 4)
  const pad = (n: number) => String(n).padStart(2, '0')
  const y = now.getFullYear()
  const m = pad(now.getMonth() + 1)
  const d = pad(now.getDate())
  const hh = pad(now.getHours())
  const mm = pad(now.getMinutes())
  return `${y}-${m}-${d}T${hh}:${mm}`
}

// 返回今天的日期，格式为 YYYY-MM-DD
const getTodayDate = () => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const y = now.getFullYear()
  const m = pad(now.getMonth() + 1)
  const d = pad(now.getDate())
  return `${y}-${m}-${d}`
}

// 格式化本地日期时间为 YYYY-MM-DDTHH:mm:ss 格式
const formatLocalDateTime = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}`
}

// 旧上传入口已移除
// 旧上传事件已移除
// 旧上传确认/取消已移除
/* 旧任务下发逻辑已移除
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
  
  // 刷新一次设备/无人机状态以获取最新电量
  try {
    await Promise.all([fetchMainDeviceStatus(), fetchDroneStatus()])
  } catch (e) {
    // 静默处理
  }

  // 低电量提示（小于30%时给予二次确认）
  const currentBatteryPercent = typeof droneStatus.value?.batteryPercent === 'number'
    ? Math.round(droneStatus.value.batteryPercent as number)
    : null
  if (currentBatteryPercent !== null && currentBatteryPercent < 30) {
    const confirmContinue = window.confirm(`当前电量为${currentBatteryPercent}%，低于30%，不建议飞行。是否继续下发任务？`)
    if (!confirmContinue) {
      return
    }
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
    end_time: null,
    execute_time: null,
    enable_vision: false, // 新增算法开关
    vision_algorithms: [] as number[], // 新增算法选择
    vision_threshold: 0.5, // 新增算法阈值
    enable_recurrence: false,
    recurrence_start_date: '',
    recurrence_end_date: ''
  }
  
  dispatchTaskDialog.value.visible = true
*/

/* 旧任务下发逻辑已移除
  const form = dispatchTaskDialog.value.form
  
  // 验证必填字段
  if (!form.name.trim()) {
    alert('请输入任务名称')
    return
  }
  
  if (form.task_type === 1 && !form.begin_time) {
    alert('定时任务需要设置开始时间')
    return
  }
  
  // 验证定时任务的时间（必须在当前时间4分钟及以后）
  if (form.task_type === 1 && form.begin_time) {
    const selectedTime = new Date(form.begin_time)
    const currentTime = new Date()
    const minTime = new Date(currentTime.getTime() + 4 * 60 * 1000)
    if (selectedTime < minTime) {
      alert('定时任务的开始时间必须在当前时间4分钟及以后')
      return
    }
  }
  
  // 验证周期任务的日期
  if (form.task_type === 1 && form.enable_recurrence) {
    if (!form.recurrence_start_date || !form.recurrence_end_date) {
      alert('周期任务需要设置开始日期和结束日期')
      return
    }
    
    const startDate = new Date(form.recurrence_start_date)
    const endDate = new Date(form.recurrence_end_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (startDate < today || endDate < today) {
      alert('周期任务的开始日期和结束日期不能早于今天')
      return
    }
    
    if (startDate > endDate) {
      alert('开始日期不能晚于结束日期')
      return
    }
  }
  
  // 执行下发任务逻辑
  console.log('下发任务参数:', form)
  
  try {
    const workspaceId = getCachedWorkspaceId()
    if (!workspaceId) {
      alert('未找到workspace_id')
      return
    }
    
    // 构建任务数据
    const taskData: any = {
      ...form,
      // 保留隐藏的字段（使用默认值）
      rth_mode: form.rth_mode || 1,
      out_of_control_action: form.out_of_control_action || 0,
      exit_wayline_when_rc_lost: form.exit_wayline_when_rc_lost || 0,
      wayline_precision_type: form.wayline_precision_type || 1
    }
    
    // 如果选择了周期任务，将task_type改为3
    if (form.task_type === 1 && form.enable_recurrence) {
      taskData.task_type = 3
      // 添加周期配置
      taskData.recurrence_config = {
        recurrence_type: 'date_range',
        start_date: form.recurrence_start_date,
        end_date: form.recurrence_end_date
      }
    }
    
    // 根据任务类型设置execute_time
    if (form.task_type === 0) {
      // 立即任务：设置当前时间作为execute_time
      taskData.execute_time = formatLocalDateTime(new Date())
    } else if (form.task_type === 1 && form.begin_time) {
      // 定时任务：使用begin_time作为execute_time
      taskData.execute_time = formatLocalDateTime(new Date(form.begin_time))
    }
    
    // 创建任务
    const response = await createJob(workspaceId, taskData)
    console.log('任务创建成功:', response)
    
    if (response && response.job_id) {
      // 立即任务需要调用execute接口
      if (form.task_type === 0) {
        try {
          await executeJob(workspaceId, response.job_id, {
            enable_vision: form.enable_vision,
            vision_algorithms: form.vision_algorithms,
            vision_threshold: form.vision_threshold
          })
          alert('立即任务创建并执行成功')
        } catch (executeErr) {
          console.error('任务执行失败:', executeErr)
          alert('立即任务创建成功，但执行失败')
        }
      } else {
        // 定时任务不调用execute接口
        alert('定时任务创建成功')
      }
    } else {
      alert('任务创建成功，但未获取到任务ID')
    }
    
    dispatchTaskDialog.value.visible = false
  } catch (err) {
    console.error('任务下发失败:', err)
    alert('任务下发失败')
  }
*/

// 旧任务下发取消已移除

// 页面加载时获取数据
onMounted(() => {})

// 栅格图渲染（参考首页实现，简化版）
const hallGridCanvas = ref<HTMLCanvasElement | null>(null)
let hallGridCleanup: (() => void) | null = null

const loadAndRenderHallPGM = async () => {
  try {
    const canvas = hallGridCanvas.value
    if (!canvas) return
    // 示例：可以根据 selectedHall 切换不同资源，这里先固定为 gridMap.pgm
    const url = new URL('../assets/source_data/pgm_data/gridMap.pgm', import.meta.url).href
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    // 解析头
    let header = ''
    let i = 0, newlines = 0
    while (i < bytes.length && newlines < 3) {
      const ch = String.fromCharCode(bytes[i++])
      header += ch
      if (ch === '\n') newlines++
    }
    const headerClean = header.split('\n').filter(l => l.trim() && !l.startsWith('#')).join('\n')
    const parts = headerClean.split(/\s+/).filter(Boolean)
    const magic = parts[0]
    const width = parseInt(parts[1]); const height = parseInt(parts[2])
    const maxVal = parseInt(parts[3]) || 255
    const pixelStart = i
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const imageData = ctx.createImageData(width, height)
    if (magic === 'P5') {
      const bytesPerSample = maxVal > 255 ? 2 : 1
      let p = pixelStart
      for (let idx = 0; idx < width * height; idx++) {
        let v = 0
        if (bytesPerSample === 1) v = bytes[p++]
        else { v = (bytes[p] << 8) | bytes[p + 1]; p += 2 }
        const c = Math.max(0, Math.min(255, Math.round((v / maxVal) * 255)))
        const off = idx * 4
        imageData.data[off] = c; imageData.data[off + 1] = c; imageData.data[off + 2] = c; imageData.data[off + 3] = 255
      }
    } else {
      const text = new TextDecoder().decode(bytes)
      const tokens = text.replace(/#.*\n/g, '').trim().split(/\s+/)
      const pixelTokens = tokens.slice(4)
      for (let idx = 0; idx < width * height; idx++) {
        const v = parseInt(pixelTokens[idx] || `${maxVal}`)
        const c = Math.max(0, Math.min(255, Math.round((v / maxVal) * 255)))
        const off = idx * 4
        imageData.data[off] = c; imageData.data[off + 1] = c; imageData.data[off + 2] = c; imageData.data[off + 3] = 255
      }
    }
    // 黑白映射
    for (let k = 0; k < imageData.data.length; k += 4) {
      const g = imageData.data[k]
      if (g < 128) {
        imageData.data[k] = 0; imageData.data[k + 1] = 0; imageData.data[k + 2] = 0
      } else {
        imageData.data[k] = 255; imageData.data[k + 1] = 255; imageData.data[k + 2] = 255
      }
    }
    ctx.putImageData(imageData, 0, 0)

    // 交互
    let scale = 1, offsetX = 0, offsetY = 0
    let isDragging = false, lastX = 0, lastY = 0

    const resize = () => {
      const parent = canvas.parentElement as HTMLElement
      if (!parent) return
      const sw = parent.clientWidth; const sh = parent.clientHeight
      scale = Math.min(sw / width, sh / height) * 1.0
      canvas.style.width = `${Math.floor(width * scale)}px`
      canvas.style.height = `${Math.floor(height * scale)}px`
      offsetX = (sw - width * scale) / 2
      offsetY = (sh - height * scale) / 2
      canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      scale = Math.max(0.1, Math.min(10, scale * delta))
      canvas.style.width = `${Math.floor(width * scale)}px`
      canvas.style.height = `${Math.floor(height * scale)}px`
      canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`
    }
    const onMouseDown = (e: MouseEvent) => { isDragging = true; lastX = e.clientX; lastY = e.clientY }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const dx = e.clientX - lastX; const dy = e.clientY - lastY
      offsetX += dx; offsetY += dy
      canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`
      lastX = e.clientX; lastY = e.clientY
    }
    const endDrag = () => { isDragging = false }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', endDrag)
    canvas.addEventListener('mouseleave', endDrag)

    if (hallGridCleanup) hallGridCleanup()
    hallGridCleanup = () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('wheel', onWheel as any)
      canvas.removeEventListener('mousedown', onMouseDown as any)
      canvas.removeEventListener('mousemove', onMouseMove as any)
      canvas.removeEventListener('mouseup', endDrag as any)
      canvas.removeEventListener('mouseleave', endDrag as any)
    }
  } catch (e) {
    // 忽略
  }
}

watch(selectedHall, () => {
  // 切换展厅时重载（未来可切换不同PGM来源）
  loadAndRenderHallPGM()
})

onMounted(() => {
  // 初次渲染
  // 等 DOM 就绪后加载
  setTimeout(() => loadAndRenderHallPGM(), 0)
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
  margin: 2vh auto;
  position: relative;
  border: 1px solid #18344a;
  max-height: 85vh;
}

.dispatch-task-modal-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  background: #172233;
  overflow-y: auto;
}

.dispatch-task-title {
  font-size: 24px;
  font-weight: 600;
  color: #67d5fd;
  margin-bottom: 20px;
  text-align: center;
}

.dispatch-task-form {
  margin-bottom: 16px;
}

.dispatch-task-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
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
  /* Firefox特定样式 */
  text-indent: 0.01px;
  text-overflow: '';
  /* 完全隐藏默认箭头 */
  background-image: none;
  -webkit-background-image: none;
  -moz-background-image: none;
}

.mission-select:focus {
  outline: none;
  border: 1.5px solid #67d5fd;
  box-shadow: 0 0 0 2px rgba(103, 213, 253, 0.15);
}

/* 隐藏所有浏览器的默认下拉箭头 */
.mission-select::-ms-expand {
  display: none;
}

.mission-select::-webkit-select-placeholder {
  display: none;
}

.mission-select::-moz-select-placeholder {
  display: none;
}

/* 针对不同浏览器的额外隐藏规则 */
.mission-select::-webkit-inner-spin-button,
.mission-select::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.mission-select::-webkit-calendar-picker-indicator {
  display: none;
}

/* 确保在Safari中也不显示默认箭头 */
.mission-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* 覆盖mission-common.css中的::after伪元素，移除重复箭头 */
.custom-select-wrapper::after {
  display: none !important;
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
  margin-top: 16px;
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

/* 上传弹窗表单样式 */
.upload-form-row {
  margin-bottom: 16px;
}

.upload-form-label {
  display: block;
  color: #b8c7d9;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.upload-form-input {
  width: 100%;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #164159;
  background: transparent;
  color: #fff;
  padding: 0 12px;
  font-size: 14px;
  box-shadow: 0 0 0 1px #164159 inset;
}

.upload-form-input:focus {
  outline: none;
  border: 1.5px solid #67d5fd;
  box-shadow: 0 0 0 2px rgba(103, 213, 253, 0.15);
}

.upload-form-input::placeholder {
  color: #6b7a8c;
}

.upload-form-display {
  width: 100%;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #164159;
  background: rgba(22, 65, 89, 0.3);
  color: #b8c7d9;
  padding: 0 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 0 1px #164159 inset;
}

.sidebar-menu-bottom img:hover {
  filter: brightness(0) invert(1) drop-shadow(0 0 8px #67d5fd);
}

/* 新增算法开关样式 */
.dispatch-switch-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
}

.dispatch-switch-label {
  color: #b8c7d9;
  font-size: 14px;
  font-weight: 500;
}

/* 新增算法选择样式 */
.dispatch-algorithm-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 100px;
  overflow-y: auto;
  padding: 6px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border: 1px solid rgba(103, 213, 253, 0.2);
  flex: 1;
  min-width: 200px;
}

.dispatch-algorithm-options::-webkit-scrollbar {
  width: 6px;
}

.dispatch-algorithm-options::-webkit-scrollbar-track {
  background: rgba(103, 213, 253, 0.1);
  border-radius: 3px;
}

.dispatch-algorithm-options::-webkit-scrollbar-thumb {
  background: rgba(103, 213, 253, 0.3);
  border-radius: 3px;
  transition: background 0.2s;
}

.dispatch-algorithm-options::-webkit-scrollbar-thumb:hover {
  background: rgba(103, 213, 253, 0.5);
}

.dispatch-algorithm-options {
  scrollbar-width: thin;
  scrollbar-color: rgba(103, 213, 253, 0.3) rgba(103, 213, 253, 0.1);
}

.dispatch-algorithm-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 0;
  transition: all 0.2s;
}

.dispatch-algorithm-option:hover {
  /* 移除动态效果 */
}

.dispatch-algorithm-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #67D5FD;
  cursor: pointer;
}

.dispatch-algorithm-label {
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.dispatch-algorithm-label.disabled {
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}

.dispatch-algorithm-checkbox:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Switch开关样式 */
.switch-container {
  width: 40px;
  height: 20px;
  background: #B0B0B0;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  border: 1px solid #888;
  transition: background 0.3s, border 0.3s;
}

.switch-container.active {
  background: #16bbf2;
  border: 1px solid #16bbf2;
}

.switch-toggle {
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: left 0.3s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.switch-container.active .switch-toggle {
  left: 21px;
}

/* 文件上传相关样式 */
.upload-file-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.upload-file-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 16px;
  background: rgba(103, 213, 253, 0.1);
  border: 1px solid rgba(103, 213, 253, 0.3);
  border-radius: 6px;
  color: #67d5fd;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.upload-file-btn:hover {
  background: rgba(103, 213, 253, 0.2);
  border-color: rgba(103, 213, 253, 0.5);
}

.upload-file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-file-tip {
  font-size: 12px;
  color: #6b7a8c;
  margin-top: 4px;
}

.upload-file-name {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(103, 213, 253, 0.1);
  border: 1px solid rgba(103, 213, 253, 0.2);
  border-radius: 6px;
  color: #67d5fd;
  font-size: 14px;
}

.upload-file-icon {
  flex-shrink: 0;
}

/* 上传弹窗专用样式 */
.upload-task-modal {
  width: 80%;
  max-width: 400px;
}

.upload-task-modal .dispatch-task-row {
  align-items: flex-start;
}

.upload-task-modal .dispatch-task-row label {
  min-width: 80px;
  margin-top: 8px;
}

.upload-task-modal .upload-file-wrapper {
  flex: 1;
  min-width: 0;
}

.upload-task-modal .upload-file-btn {
  width: 100%;
  justify-content: center;
}

/* 时间提示样式 */
.time-tip {
  font-size: 12px;
  color: #ffa500;
  margin-top: 4px;
  padding: 4px 8px;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 4px;
  line-height: 1.4;
}

/* 周期任务开关样式 */
.dispatch-switch-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.dispatch-switch-label {
  font-size: 14px;
  color: #b8c7d9;
  user-select: none;
}

/* 展厅栅格图容器，作为绝对定位子元素的定位上下文 */
.hall-grid-content {
  position: relative;
  flex: 1;
  min-height: 360px;
  background: #fff;
  border: 1px solid #164159;
  border-radius: 6px;
  padding: 0;
  overflow: hidden;
}

/* 让卡片拉伸到底部，并在底部留出间距 */
.hall-grid-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
  flex: 1;
  min-height: 0;
}

.gridmap-wrapper { position: absolute; inset: 0; display: flex; align-items: flex-start; justify-content: flex-start; overflow: hidden; background: #fff; }
.grid-canvas { display: block; background: #fff; cursor: grab; user-select: none; transform-origin: 0 0; }
.grid-canvas:active { cursor: grabbing; }

/* 展厅管理工具栏与进度条 */
.hall-toolbar { display: flex; flex-direction: column; gap: 10px; }
.hall-toolbar-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.hall-actions { display: flex; align-items: center; gap: 10px; flex-wrap: nowrap; }
.hall-btn { height: 32px; padding: 0 14px; border-radius: 6px; }
.hall-select { display: flex; align-items: center; gap: 8px; }
.map-progress { display: flex; align-items: center; gap: 10px; }
.map-progress-track { flex: 1; height: 6px; background: rgba(103,213,253,.15); border: 1px solid rgba(103,213,253,.3); border-radius: 6px; overflow: hidden; }
.map-progress-fill { height: 100%; background: linear-gradient(90deg, #59c0fc, #16bbf2); transition: width .2s ease; }
.map-progress-text { color: #cfe9f3; font-size: 12px; min-width: 38px; text-align: right; }
</style>