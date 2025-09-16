import { apiClient } from './config'

// 设备状态接口定义
export interface DeviceStatus {
  longitude?: number
  latitude?: number
  height?: number
  connect_status?: boolean
  online?: boolean
  emergency_stop_state?: boolean
  osd?: {
    data: {
      environment_temperature?: number
      temperature?: number
      wind_speed?: number
      humidity?: number
      rainfall?: number
      mode_code?: number
      flighttask_step_code?: number
      drone_in_dock?: number
      cover_state?: number
      job_number?: number
      // 无人机特有字段
      total_flight_distance?: number
      total_flight_sorties?: number
      total_flight_time?: number
      horizontal_speed?: number
      vertical_speed?: number
      attitude_head?: number
      attitude_pitch?: number
      attitude_roll?: number
      battery?: number
      // 子设备状态
      sub_device?: {
        device_online_status?: number
      }
      position_state?: {
        is_fixed: number
        quality: number
        gps_number: number
        rtk_number: number
        velocity?: {
          x: number
          y: number
          z: number
        }
      }
      drone_charge_state?: {
        state: number
        capacity_percent: number
      }
    }
  }
}

// 状态映射
export const StatusMaps = {
  // 机场模式状态
  dockMode: {
    0: '空闲中',
    1: '现场调试',
    2: '远程调试',
    3: '固件升级中',
    4: '作业中',
    5: '待标定'
  },
  // 舱盖状态
  coverState: {
    0: '关闭',
    1: '开启',
    2: '开启中',
    3: '关闭中'
  },
  // 充电状态
  chargeState: {
    0: '未充电',
    1: '充电中',
    2: '充电完成',
    3: '充电异常'
  },
  // 任务状态
  taskStatus: {
    0: '待执行',
    1: '执行中',
    2: '已完成',
    3: '已取消',
    4: '执行失败'
  },
  // 无人机位置状态
  dronePosition: {
    0: '在舱外',
    1: '在舱内'
  },
  // RTK固定状态
  rtkFixed: {
    0: '未固定',
    1: '已固定'
  },
  // 降水量状态
  rainfall: {
    0: '无雨',
    1: '小雨',
    2: '中雨',
    3: '大雨'
  }
}

// 设备状态API
export const deviceStatusApi = {
  // 获取设备状态
  getDeviceStatus: (deviceSn: string) =>
    apiClient.get(`/control/devices/${deviceSn}/status`),
  
  // 获取设备容量信息
  getDeviceCapacity: (deviceSn: string) =>
    apiClient.get(`/control/devices/${deviceSn}/capacity`)
} 