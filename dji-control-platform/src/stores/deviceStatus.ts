import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { deviceStatusApi, type DeviceStatus, type CapacityResponse } from '@/api/deviceStatus'

/**
 * 设备状态管理Store
 */
export const useDeviceStatusStore = defineStore('deviceStatus', () => {
  // 状态数据
  const devices = ref<CapacityResponse['available_devices']>([])
  const deviceStatusMap = ref<Record<string, DeviceStatus>>({})
  const isLoading = ref(false)
  const lastUpdateTime = ref<Date | null>(null)

  // 计算属性
  const droneDevices = computed(() => 
    devices.value.filter(device => device.domain === 'drone')
  )

  const dockDevices = computed(() => 
    devices.value.filter(device => device.domain === 'dock')
  )

  // 获取指定设备状态
  const getDeviceStatus = (deviceSn: string) => {
    return deviceStatusMap.value[deviceSn]
  }

  // 获取无人机状态
  const getDroneStatus = computed(() => {
    const drone = droneDevices.value[0]
    if (!drone) return null
    return deviceStatusMap.value[drone.sn]
  })

  // 获取机场状态  
  const getDockStatus = computed(() => {
    const dock = dockDevices.value[0]
    if (!dock) return null
    return deviceStatusMap.value[dock.sn]
  })

  // 格式化的无人机状态数据
  const formattedDroneStatus = computed(() => {
    const status = getDroneStatus.value
    if (!status) return null

    return {
      // 基础信息
      isOnline: status.basic_info.connect_status,
      longitude: status.basic_info.longitude?.toFixed(2) + '°E',
      latitude: status.basic_info.latitude?.toFixed(2) + '°N',
      altitude: status.basic_info.height + 'm',
      
      // 电池信息
      battery: {
        voltage: status.live_status.battery?.voltage + 'V',
        current: status.live_status.battery?.current + 'A',
        temperature: status.live_status.battery?.temperature + '°C',
        percent: status.live_status.battery?.capacity_percent + '%'
      },
      
      // 飞行信息
      flight: {
        speed: Math.sqrt(
          Math.pow(status.live_status.position_state?.velocity.x || 0, 2) +
          Math.pow(status.live_status.position_state?.velocity.y || 0, 2)
        ).toFixed(2) + 'm/s',
        gpsCount: status.live_status.position_state?.gps_number || 0
      },
      
      // 环境信息
      environment: {
        temperature: status.live_status.environment_info?.temperature + '°C',
        humidity: status.live_status.environment_info?.humidity + '%',
        windSpeed: status.live_status.environment_info?.wind_speed + 'm/s',
        windDirection: getWindDirection(status.live_status.environment_info?.wind_direction)
      }
    }
  })

  // 格式化的机场状态数据
  const formattedDockStatus = computed(() => {
    const status = getDockStatus.value
    if (!status) return null

    return {
      // 基础信息
      isOnline: status.basic_info.connect_status,
      longitude: status.basic_info.longitude?.toFixed(2) + '°E',
      latitude: status.basic_info.latitude?.toFixed(2) + '°N',
      
      // 机场系统状态
      system: {
        coverClosed: status.live_status.cover_state === false,
        temperature: status.live_status.environment_info?.temperature + '°C',
        humidity: status.live_status.environment_info?.humidity + '%'
      },
      
      // 环境信息
      environment: {
        temperature: status.live_status.environment_info?.temperature + '°C',
        humidity: status.live_status.environment_info?.humidity + '%',
        windSpeed: status.live_status.environment_info?.wind_speed + 'm/s',
        windDirection: getWindDirection(status.live_status.environment_info?.wind_direction)
      }
    }
  })

  // 获取风向文字描述
  const getWindDirection = (degree?: number): string => {
    if (degree === undefined) return '未知'
    
    const directions = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风']
    const index = Math.round(degree / 45) % 8
    return directions[index]
  }

  // Actions
  const fetchCapacity = async () => {
    try {
      isLoading.value = true
      const response = await deviceStatusApi.getCapacity()
      devices.value = response.available_devices || []
      return response
    } catch (error) {
      console.error('获取设备能力失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchDeviceStatus = async (deviceSn: string) => {
    try {
      const status = await deviceStatusApi.getDeviceStatus(deviceSn)
      deviceStatusMap.value[deviceSn] = status
      return status
    } catch (error) {
      console.error(`获取设备${deviceSn}状态失败:`, error)
      throw error
    }
  }

  const fetchAllDeviceStatus = async () => {
    try {
      isLoading.value = true
      
      // 先获取设备列表
      await fetchCapacity()
      
      // 然后获取所有设备的状态
      const statusPromises = devices.value.map(device => 
        fetchDeviceStatus(device.sn)
      )
      
      await Promise.allSettled(statusPromises)
      lastUpdateTime.value = new Date()
      
    } catch (error) {
      console.error('批量获取设备状态失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 开始轮询
  const startPolling = (interval = 5000) => {
    // 立即执行一次
    fetchAllDeviceStatus()
    
    // 设置定时器
    return setInterval(() => {
      fetchAllDeviceStatus()
    }, interval)
  }

  return {
    // 状态
    devices,
    deviceStatusMap,
    isLoading,
    lastUpdateTime,
    
    // 计算属性
    droneDevices,
    dockDevices,
    getDroneStatus,
    getDockStatus,
    formattedDroneStatus,
    formattedDockStatus,
    
    // 方法
    getDeviceStatus,
    fetchCapacity,
    fetchDeviceStatus,
    fetchAllDeviceStatus,
    startPolling
  }
})