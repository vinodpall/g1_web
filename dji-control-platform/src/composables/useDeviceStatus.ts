import { ref, computed } from 'vue'
import { deviceStatusApi, type DeviceStatus, StatusMaps } from '@/api/deviceStatus'
import { useDevices } from './useApi'

/**
 * 设备状态管理
 */
export function useDeviceStatus() {
  // 设备状态数据
  const deviceStatus = ref<DeviceStatus | null>(null)
  const droneDeviceStatus = ref<DeviceStatus | null>(null) // 新增：无人机设备状态
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
      const response: any = await deviceStatusApi.getDeviceStatus(deviceSn)
      deviceStatus.value = (response && (response.data || response)) as DeviceStatus
      return deviceStatus.value
    } catch (err: any) {
      error.value = err.message || '获取设备状态失败'
      // 只在非网络错误时显示错误信息
      if (!(err instanceof TypeError && err.message.includes('Failed to fetch'))) {
        console.error('获取设备状态失败:', err)
      }
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
    
    const result = await fetchDeviceStatus(mainDeviceSn)
    return result
  }

  // 获取无人机状态
  const fetchDroneStatus = async () => {
    const { droneSns } = getCachedDeviceSns()
    
    if (droneSns.length === 0) {
      console.log('没有缓存的无人机设备，跳过状态获取')
      return null
    }
    
    // 使用第一个无人机作为主要设备
    const mainDroneSn = droneSns[0]
    // console.log('获取无人机状态:', mainDroneSn)
    
    loading.value = true
    error.value = null
    
    try {
      const response: any = await deviceStatusApi.getDeviceStatus(mainDroneSn)
      droneDeviceStatus.value = (response && (response.data || response)) as DeviceStatus
      return droneDeviceStatus.value
    } catch (err: any) {
      error.value = err.message || '获取无人机状态失败'
      // 只在非网络错误时显示错误信息
      if (!(err instanceof TypeError && err.message.includes('Failed to fetch'))) {
        console.error('获取无人机状态失败:', err)
      }
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 获取OSD数据（优先从osd.data获取，备用从根级别获取）
  const osdData = computed(() => {
    if (!deviceStatus.value) return null
    // API返回的数据结构: response.data.osd.data
    const responseData = deviceStatus.value as any
    if (responseData.osd?.data) {
      return responseData.osd.data
    }
    // 兼容旧的数据结构
    return deviceStatus.value.osd?.data || deviceStatus.value
  })
  
  // 基础位置信息
  const position = computed(() => {
    if (!osdData.value) return null
    
    // 从OSD数据获取位置信息
    return {
      longitude: osdData.value.longitude,
      latitude: osdData.value.latitude,
      height: osdData.value.height || 0
    }
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
    if (!deviceStatus.value) return null
    
    const responseData = deviceStatus.value as any
    const osd = osdData.value
    
    return {
      modeCode: osd?.mode_code,
      modeText: osd?.mode_code !== undefined ? StatusMaps.dockMode[osd.mode_code as keyof typeof StatusMaps.dockMode] : undefined,
      coverState: osd?.cover_state,
      coverText: osd?.cover_state !== undefined ? StatusMaps.coverState[osd.cover_state as keyof typeof StatusMaps.coverState] : undefined,
      jobNumber: osd?.job_number,
      isOnline: responseData.online === true, // 使用API返回的online字段
      networkRate: osd?.network_state?.rate, // 网络速率
      accTime: osd?.acc_time, // 累计运行时间（秒）
      workingVoltage: osd?.working_voltage, // 工作电压
      workingCurrent: osd?.working_current // 工作电流
    }
  })
  
  // 无人机状态
  const droneStatus = computed((): any => {
    // 如果没有机场状态数据，返回null
    if (!osdData.value) return null
    
    // 统一从机场status数据中获取无人机信息（包括电池和充电状态）
    const isDroneOnline = osdData.value.sub_device?.device_online_status === 1
    
    // 如果有无人机自己的状态数据，用于获取飞行相关数据
    let droneOsdData = null
    if (droneDeviceStatus.value) {
      droneOsdData = (droneDeviceStatus.value as any).osd?.data || droneDeviceStatus.value
    }
    
    // 尝试多种可能的电量字段，并添加数据验证
    // 记忆上一次有效电量，避免异常值或短暂无效导致界面跳到0
    // 使用闭包级变量保存
    ;(droneStatus as any)._lastValidBatteryPercent = (droneStatus as any)._lastValidBatteryPercent ?? null
    const getLastValid = (): number | null => (droneStatus as any)._lastValidBatteryPercent as number | null
    const setLastValid = (v: number) => { (droneStatus as any)._lastValidBatteryPercent = v }
    let batteryPercent = null
    
    // 数据标准化与验证函数：
    // - 接受 number 或可转为 number 的字符串
    // - 若在 0-1 范围且非0，视为比例，乘以100
    // - 裁剪到 0-100 区间
    const validateBatteryValue = (raw: any): number | null => {
      if (raw === undefined || raw === null) return null
      let value: number
      if (typeof raw === 'string') {
        let trimmed = raw.trim()
        if (trimmed.endsWith('%')) trimmed = trimmed.slice(0, -1)
        if (trimmed === '') return null
        const parsed = Number(trimmed)
        if (!Number.isFinite(parsed)) return null
        value = parsed
      } else if (typeof raw === 'number') {
        value = raw
      } else {
        return null
      }
      if (!Number.isFinite(value)) return null
      // 如果是 0-1 之间的小数，按比例处理（如 0.87 => 87）
      if (value > 0 && value <= 1) {
        value = value * 100
      }
      // 过滤明显异常的大数
      if (value > 1000) return null
      // 裁剪到 0-100
      value = Math.max(0, Math.min(100, value))
      return value
    }
    
    // 起飞后优先读取无人机自身 OSD 的电量，避免机场status短暂为0覆盖
    const candidateValues: Array<any> = []
    if (droneOsdData) {
      candidateValues.push(
        droneOsdData?.drone_charge_state?.capacity_percent,
        droneOsdData?.drone_battery_state?.capacity_percent,
        droneOsdData?.battery
      )
    }
    // 其次读取机场 status 内映射出来的电量字段
    candidateValues.push(
      osdData.value.drone_charge_state?.capacity_percent,
      osdData.value.drone_battery_state?.capacity_percent,
      osdData.value.battery,
      osdData.value.capacity_percent
    )
    
    for (const v of candidateValues) {
      const validated = validateBatteryValue(v)
      if (validated !== null) {
        batteryPercent = validated
        break
      }
    }
    
    // 如果拿到有效值，更新记忆；否则回退到上一次有效值，避免闪到0
    if (batteryPercent !== null) {
      setLastValid(batteryPercent)
    } else {
      const last: number | null = getLastValid()
      if (last !== null) {
        batteryPercent = last
      } else {
        batteryPercent = 0
      }
    }
    
    return {
      inDock: osdData.value.drone_in_dock,
      inDockText: osdData.value.drone_in_dock !== undefined ? StatusMaps.dronePosition[osdData.value.drone_in_dock as keyof typeof StatusMaps.dronePosition] : undefined,
      isOnline: isDroneOnline,
      // 电量和充电状态统一从机场status数据中获取
      chargeState: osdData.value.drone_charge_state?.state,
      chargeText: osdData.value.drone_charge_state?.state !== undefined ? StatusMaps.chargeState[osdData.value.drone_charge_state.state as keyof typeof StatusMaps.chargeState] : undefined,
      batteryPercent: batteryPercent,
      battery: osdData.value.battery,
      // 优先使用无人机自己的飞行数据，否则使用机场status中的数据
      modeCode: droneOsdData?.mode_code || osdData.value.mode_code,
      totalFlightDistance: droneOsdData?.total_flight_distance || osdData.value.total_flight_distance,
      totalFlightSorties: droneOsdData?.total_flight_sorties || osdData.value.total_flight_sorties,
      totalFlightTime: droneOsdData?.total_flight_time || osdData.value.total_flight_time,
      height: droneOsdData?.height || osdData.value.height,
      horizontalSpeed: droneOsdData?.horizontal_speed || osdData.value.horizontal_speed,
      verticalSpeed: droneOsdData?.vertical_speed || osdData.value.vertical_speed,
      latitude: droneOsdData?.latitude || osdData.value.latitude,
      longitude: droneOsdData?.longitude || osdData.value.longitude,
      attitude: {
        head: droneOsdData?.attitude_head || osdData.value.attitude_head,
        pitch: droneOsdData?.attitude_pitch || osdData.value.attitude_pitch,
        roll: droneOsdData?.attitude_roll || osdData.value.attitude_roll
      }
    }
  })
  
  // GPS/RTK状态
  const gpsStatus = computed(() => {
    if (!osdData.value) return null
    
    // 检查是否为无人机数据
    const isDroneData = osdData.value.battery !== undefined
    
    if (isDroneData) {
      // 无人机GPS数据解析
      const pos = osdData.value.position_state
      if (!pos) return null
      
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
    } else {
      // 机场GPS数据解析（兼容旧逻辑）
      if (!osdData.value.position_state) return null
      
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
  const formatBattery = (value: number | undefined | null) => {
    // 严格的数据验证
    if (value === undefined || value === null) return '0%'
    if (typeof value !== 'number') return '0%'
    
    // 检查是否为有效数字（不是NaN或Infinity）
    if (!Number.isFinite(value)) return '0%'
    
    // 检查电量是否在合理范围内（0-100）
    if (value < 0 || value > 100) {
      console.warn(`电池电量值异常: ${value}%，已重置为0%`)
      return '0%'
    }
    
    // 检查是否为整数或小数，如果是异常大的值则重置
    if (value > 1000) {
      console.warn(`电池电量值过大: ${value}%，可能是数据错误，已重置为0%`)
      return '0%'
    }
    
    return `${Math.round(value)}%`
  }
  
  // 格式化网络速率显示
  const formatNetworkRate = (value: number | undefined) => {
    if (value === undefined || value === null) return '--KB/s'
    return `${value}KB/s`
  }
  
  // 格式化累计运行时间显示（秒转换为小时）
  const formatAccTime = (value: number | undefined) => {
    if (value === undefined || value === null) return '--小时'
    const hours = Math.floor(value / 3600)
    return `${hours}小时`
  }
  
  // 格式化电压显示（毫伏转换为伏特）
  const formatVoltage = (value: number | undefined) => {
    if (value === undefined || value === null) return '--V'
    const volts = value / 1000
    return `${volts.toFixed(1)}V`
  }
  
  // 格式化电流显示（毫安转换为安培）
  const formatCurrent = (value: number | undefined) => {
    if (value === undefined || value === null) return '--A'
    const amps = value / 1000
    return `${amps.toFixed(1)}A`
  }

  // 格式化飞行距离显示（米转换为公里）
  const formatFlightDistance = (value: number | undefined) => {
    if (value === undefined || value === null) return '--km'
    const km = value / 1000
    return `${km.toFixed(1)}km`
  }
  
  return {
    // 状态
    deviceStatus,
    droneDeviceStatus,
    loading,
    error,
    
    // 方法
    fetchDeviceStatus,
    fetchMainDeviceStatus,
    fetchDroneStatus,
    
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
    formatBattery,
    formatNetworkRate,
    formatAccTime,
    formatVoltage,
    formatCurrent,
    formatFlightDistance
  }
} 