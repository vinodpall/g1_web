<template>
  <div class="dock-info-row">
    <div
      v-for="(item, idx) in items"
      :key="idx"
      class="dock-info-item"
      :class="{ 'clickable': item.clickable }"
      @click="handleItemClick(item, idx)"
    >
      <div class="dock-info-value">
        <template v-if="item.icon">
          <img :src="item.icon" class="dock-info-icon" />
        </template>
        {{ item.value }}
      </div>
      <div class="dock-info-label">{{ item.label }}</div>
      
      <!-- 气泡弹窗 -->
      <div v-if="activeTooltipIndex === idx && item.coordinates" class="tooltip-popup tooltip-bottom">
        <div class="tooltip-content">
          <div class="tooltip-item">
            <span class="tooltip-label">经度：</span>
            <span class="tooltip-value">{{ item.coordinates?.longitude ? item.coordinates.longitude.toFixed(6) : '--' }}</span>
          </div>
          <div class="tooltip-item">
            <span class="tooltip-label">纬度：</span>
            <span class="tooltip-value">{{ item.coordinates?.latitude ? item.coordinates.latitude.toFixed(6) : '--' }}</span>
          </div>
          <div class="tooltip-item">
            <span class="tooltip-label">高度：</span>
            <span class="tooltip-value">{{ item.coordinates?.height || '--' }}m</span>
          </div>
        </div>
        <div class="tooltip-arrow tooltip-arrow-bottom"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ items: any[] }>()

// 使用独立的响应式数据来控制弹窗显示
const activeTooltipIndex = ref<number | null>(null)

const handleItemClick = (item: any, index: number) => {
  if (item.clickable) {
    if (activeTooltipIndex.value === index) {
      // 如果当前项已经显示弹窗，则隐藏
      activeTooltipIndex.value = null
    } else if (item.coordinates) {
      // 显示当前项的弹窗
      activeTooltipIndex.value = index
      
      // 3秒后自动隐藏
      setTimeout(() => {
        if (activeTooltipIndex.value === index) {
          activeTooltipIndex.value = null
        }
      }, 3000)
    }
  }
}
</script>

<style scoped>
.dock-info-row {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
  align-items: stretch;
}

.dock-info-item {
  position: relative;
}

.dock-info-item.clickable {
  cursor: pointer;
}

.dock-info-item.clickable:hover .dock-info-value {
  color: #67D5FD;
}

.dock-info-value {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  justify-content: center;
  text-align: center;
  transition: color 0.2s ease;
}

.dock-info-label {
  color: #67D5FD !important;
  font-size: 14px !important;
  font-weight: 400;
  margin-top: 0;
  text-align: center;
  letter-spacing: 0.5px;
}

/* 气泡弹窗样式 */
.tooltip-popup {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;
}

/* 弹窗显示在下方 */
.tooltip-popup.tooltip-bottom {
  top: 100%;
  margin-top: 8px;
}

.tooltip-content {
  background: rgba(0, 20, 40, 0.95);
  border: 1px solid #67D5FD;
  border-radius: 6px;
  padding: 6px 8px;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}


.tooltip-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1px;
  line-height: 1.2;
}

.tooltip-item:last-child {
  margin-bottom: 0;
}

.tooltip-label {
  color: rgba(212, 237, 253, 0.8);
  font-size: 12px;
  font-weight: 400;
}

.tooltip-value {
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  text-align: right;
}

.tooltip-arrow {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
}

/* 箭头向上（弹窗在下方时） */
.tooltip-arrow-bottom {
  bottom: 100%;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #67D5FD;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style> 