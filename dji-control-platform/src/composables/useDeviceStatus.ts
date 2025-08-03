import { ref, computed } from 'vue'
import { deviceStatusApi, type DeviceStatus, StatusMaps } from '@/api/deviceStatus'
import { useDevices } from './useApi'

/**
 * 设备状态管理
 */
export function useDeviceStatus() {
  // 设备状态数据
  const deviceStatus = ref<DeviceStatus | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 获取缓存的设备SN
  const { getCachedDeviceSns } = useDevices()
  
  // 获取设备状态
  const fetchDeviceStatus = async (deviceSn: string) => {
    if (!deviceSn) {
      error.value = '设备SN不能为空'
      return null
    }
    
    loading.value = true
    error.value = null
    
    try {
      const response = await deviceStatusApi.getDeviceStatus(deviceSn)
      deviceStatus.value = response.data || response
      return deviceStatus.value
    } catch (err: any) {
      error.value = err.message || '获取设备状态失败'
      console.error('获取设备状态失败:', err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 获取主要设备状态（使用第一个机场）
  const fetchMainDeviceStatus = async () => {
    const { dockSns } = getCachedDeviceSns()
    
    if (dockSns.length === 0) {
      console.log('没有缓存的机场设备，跳过状态获取')
      return null
    }
    
    // 使用第一个机场作为主要设备
    const mainDeviceSn = dockSns[0]
    console.log('获取主要设备状态:', mainDeviceSn)
    
    return await fetchDeviceStatus(mainDeviceSn)
  }
  
  // 获取OSD数据（优先从osd.data获取，备用从根级别获取）
  const osdData = computed(() => {
    if (!deviceStatus.value) return null
    return deviceStatus.value.osd?.data || deviceStatus.value
  })
  
  // 基础位置信息
  const position = computed(() => {
    if (!deviceStatus.value) return null
    
    // 优先从根级别获取
    if (deviceStatus.value.longitude !== undefined && deviceStatus.value.latitude !== undefined) {
      return {
        longitude: deviceStatus.value.longitude,
        latitude: deviceStatus.value.latitude,
        height: deviceStatus.value.height || 0
      }
    }
    
    // 备用从OSD数据获取
    if (osdData.value) {
      return {
        longitude: osdData.value.longitude,
        latitude: osdData.value.latitude,
        height: osdData.value.height || 0
      }
    }
    
    return null
  })
  
  // 环境数据
  const environment = computed(() => {
    if (!osdData.value) return null
    
    return {
      environmentTemperature: osdData.value.environment_temperature,
      temperature: osdData.value.temperature,
      windSpeed: osdData.value.wind_speed,
      humidity: osdData.value.humidity,
      rainfall: osdData.value.rainfall
    }
  })
  
  // 机场状态
  const dockStatus = computed(() => {
    if (!osdData.value) return null
    
    return {
      modeCode: osdData.value.mode_code,
      modeText: osdData.value.mode_code !== undefined ? StatusMaps.dockMode[osdData.value.mode_code as keyof typeof StatusMaps.dockMode] : undefined,
      coverState: osdData.value.cover_state,
      coverText: osdData.value.cover_state !== undefined ? StatusMaps.coverState[osdData.value.cover_state as keyof typeof StatusMaps.coverState] : undefined,
      jobNumber: osdData.value.job_number,
      isOnline: deviceStatus.value?.connect_status !== false // 默认在线，除非明确为false
    }
  })
  
  // 无人机状态
  const droneStatus = computed(() => {
    if (!osdData.value) return null
    
    return {
      inDock: osdData.value.drone_in_dock,
      inDockText: osdData.value.drone_in_dock !== undefined ? StatusMaps.dronePosition[osdData.value.drone_in_dock as keyof typeof StatusMaps.dronePosition] : undefined,
      isOnline: osdData.value.drone_in_dock !== undefined, // 通过是否在舱判断在线状态
      chargeState: osdData.value.drone_charge_state?.state,
      chargeText: osdData.value.drone_charge_state?.state !== undefined ? StatusMaps.chargeState[osdData.value.drone_charge_state.state as keyof typeof StatusMaps.chargeState] : undefined,
      batteryPercent: osdData.value.drone_charge_state?.capacity_percent
    }
  })
  
  // GPS/RTK状态
  const gpsStatus = computed(() => {
    if (!osdData.value?.position_state) return null
    
    const pos = osdData.value.position_state
    return {
      isFixed: pos.is_fixed,
      fixedText: StatusMaps.rtkFixed[pos.is_fixed as keyof typeof StatusMaps.rtkFixed],
      quality: pos.quality,
      gpsNumber: pos.gps_number,
      rtkNumber: pos.rtk_number,
      velocity: pos.velocity,
      // 计算总速度
      totalSpeed: pos.velocity ? Math.sqrt(pos.velocity.x ** 2 + pos.velocity.y ** 2 + pos.velocity.z ** 2) : 0
    }
  })
  
  // 任务状态
  const taskStatus = computed(() => {
    if (!osdData.value) return null
    
    return {
      stepCode: osdData.value.flighttask_step_code,
      stepText: osdData.value.flighttask_step_code !== undefined ? StatusMaps.taskStatus[osdData.value.flighttask_step_code as keyof typeof StatusMaps.taskStatus] : undefined
    }
  })
  
  // 格式化坐标显示
  const formatCoordinate = (value: number | undefined, type: 'longitude' | 'latitude') => {
    if (value === undefined || value === null) return '--'
    
    const absValue = Math.abs(value)
    const degrees = Math.floor(absValue)
    const minutes = (absValue - degrees) * 60
    
    const direction = type === 'longitude' 
      ? (value >= 0 ? 'E' : 'W')
      : (value >= 0 ? 'N' : 'S')
    
    return `${degrees}°${minutes.toFixed(2)}'${direction}`
  }
  
  // 格式化高度显示
  const formatHeight = (value: number | undefined) => {
    if (value === undefined || value === null) return '--'
    return `${value.toFixed(1)}m`
  }
  
  // 格式化速度显示
  const formatSpeed = (value: number | undefined) => {
    if (value === undefined || value === null) return '0.00m/s'
    return `${value.toFixed(2)}m/s`
  }
  
  // 格式化温度显示
  const formatTemperature = (value: number | undefined) => {
    if (value === undefined || value === null) return '--°C'
    return `${value.toFixed(1)}°C`
  }
  
  // 格式化湿度显示
  const formatHumidity = (value: number | undefined) => {
    if (value === undefined || value === null) return '--%'
    return `${value.toFixed(0)}%`
  }
  
  // 格式化风速显示
  const formatWindSpeed = (value: number | undefined) => {
    if (value === undefined || value === null) return '--m/s'
    return `${value.toFixed(1)}m/s`
  }
  
  // 格式化降水量显示
  const formatRainfall = (value: number | undefined) => {
    if (value === undefined || value === null) return '--'
    return StatusMaps.rainfall[value as keyof typeof StatusMaps.rainfall] || `${value}`
  }
  
  // 格式化电池电量显示
  const formatBattery = (value: number | undefined) => {
    if (value === undefined || value === null) return '--%'
    return `${value.toFixed(0)}%`
  }
  
  return {
    // 状态
    deviceStatus,
    loading,
    error,
    
    // 方法
    fetchDeviceStatus,
    fetchMainDeviceStatus,
    
    // 计算属性
    osdData,
    position,
    environment,
    dockStatus,
    droneStatus,
    gpsStatus,
    taskStatus,
    
    // 格式化方法
    formatCoordinate,
    formatHeight,
    formatSpeed,
    formatTemperature,
    formatHumidity,
    formatWindSpeed,
    formatRainfall,
    formatBattery
  }
} 