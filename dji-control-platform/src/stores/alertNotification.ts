import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { HmsAlert } from '../types'

export const useAlertNotificationStore = defineStore('alertNotification', () => {
  // 报警弹窗状态
  const showAlertDialog = ref(false)
  const alertData = ref<(HmsAlert & { deviceType?: string }) | null>(null)
  
  // 记录已显示的报警ID，避免重复显示
  const shownAlertIds = ref<Set<string>>(new Set())
  
  // 记录最后一次显示报警的时间
  const lastAlertTime = ref<number>(0)
  
  // 显示报警弹窗
  const triggerAlertDialog = (alert: HmsAlert & { deviceType?: string }) => {
    // 生成唯一ID
    const alertId = generateAlertId(alert)
    
    // 检查是否已经显示过
    if (shownAlertIds.value.has(alertId)) {
      return
    }
    
    // 检查报警等级是否为警告
    if (!isWarningLevel(alert)) {
      return
    }
    
    // 设置报警数据并显示弹窗
    alertData.value = alert
    showAlertDialog.value = true
    
    // 记录已显示的报警ID
    shownAlertIds.value.add(alertId)
    
    // 限制已显示报警ID的数量，避免内存泄漏
    if (shownAlertIds.value.size > 1000) {
      const idsArray = Array.from(shownAlertIds.value)
      shownAlertIds.value = new Set(idsArray.slice(-500))
    }
  }
  
  // 关闭报警弹窗
  const closeAlertDialog = () => {
    showAlertDialog.value = false
    alertData.value = null
  }
  
  // 生成报警唯一ID
  const generateAlertId = (alert: HmsAlert): string => {
    return `hms_${alert.id}_${alert.create_time}`
  }
  
  // 检查是否为警告级别
  const isWarningLevel = (alert: HmsAlert): boolean => {
    // HmsAlert: level 2 为警告
    return alert.level === 2
  }
  
  // 清除已显示的报警记录（用于测试或重置）
  const clearShownAlerts = () => {
    shownAlertIds.value.clear()
  }
  
  return {
    // 状态
    showAlertDialog: computed(() => showAlertDialog.value),
    alertData: computed(() => alertData.value),
    
    // 方法
    triggerAlertDialog,
    closeAlertDialog,
    clearShownAlerts
  }
})
