import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Device } from '../types'

export const useDeviceStore = defineStore('device', () => {
  const devices = ref<Device[]>([])
  const selectedDockSn = ref<string>(localStorage.getItem('selected_dock_sn') || '')

  // 计算属性：机场列表
  const docks = computed(() => {
    return devices.value.filter(device => device.device_type_info?.device_type === 3)
  })

  // 计算属性：无人机列表
  const drones = computed(() => {
    return devices.value.filter(device => device.child_sn === '')
  })

  // 计算属性：选中的机场
  const selectedDock = computed(() => {
    return devices.value.find(device => device.device_sn === selectedDockSn.value)
  })

  // 设置设备列表
  const setDevices = (deviceList: Device[]) => {
    devices.value = deviceList
  }

  // 设置选中的机场
  const setSelectedDock = (dockSn: string) => {
    selectedDockSn.value = dockSn
    localStorage.setItem('selected_dock_sn', dockSn)
  }

  // 从本地缓存恢复设备列表
  const hydrateFromCache = () => {
    try {
      const cached = JSON.parse(localStorage.getItem('cached_devices') || '[]')
      if (Array.isArray(cached) && cached.length > 0) {
        devices.value = cached as Device[]
      }
    } catch (_e) {
      // ignore
    }
  }

  // 根据SN获取设备
  const getDeviceBySn = (deviceSn: string) => {
    return devices.value.find(device => device.device_sn === deviceSn)
  }

  // 获取机场SN列表
  const getDockSns = () => {
    return docks.value.map(dock => dock.device_sn)
  }

  // 获取无人机SN列表
  const getDroneSns = () => {
    return drones.value.map(drone => drone.device_sn)
  }

  return {
    devices,
    docks,
    drones,
    selectedDockSn,
    selectedDock,
    setDevices,
    setSelectedDock,
    hydrateFromCache,
    getDeviceBySn,
    getDockSns,
    getDroneSns
  }
})