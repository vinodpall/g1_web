// 设备状态API服务
import { http } from './config'

/**
 * 设备状态相关API
 */
export const deviceStatusApi = {
  /**
   * 获取所有设备能力信息
   */
  getCapacity: () => {
    return http.get('/api/v1/livestream/capacity')
  },

  /**
   * 获取指定设备的详细状态
   */
  getDeviceStatus: (deviceSn: string) => {
    return http.get(`/api/v1/control/devices/${deviceSn}/status`)
  },

  /**
   * 获取指定设备的直播能力
   */
  getDeviceCapacity: (deviceSn: string) => {
    return http.get(`/api/v1/livestream/devices/${deviceSn}/capacity`)
  },

  /**
   * 获取云台状态
   */
  getGimbalStatus: (deviceSn: string) => {
    return http.get(`/api/v1/control/devices/${deviceSn}/gimbal/status`)
  },

  /**
   * 获取DRC状态
   */
  getDrcStatus: (deviceSn: string) => {
    return http.get(`/api/v1/drc/devices/${deviceSn}/drc/status`)
  },

  /**
   * 获取控制权限状态
   */
  getAuthorityStatus: (deviceSn: string) => {
    return http.get(`/api/v1/control/devices/${deviceSn}/authority`)
  }
}

/**
 * 设备状态数据类型定义
 */
export interface DeviceStatus {
  basic_info: {
    longitude: number
    latitude: number
    height: number
    connect_status: boolean
  }
  live_status: {
    battery?: {
      voltage: number
      current: number
      temperature: number
      capacity_percent: number
    }
    position_state?: {
      velocity: {
        x: number
        y: number
        z: number
      }
      gps_number: number
    }
    environment_info?: {
      temperature: number
      humidity: number
      wind_speed: number
      wind_direction: number
    }
    cover_state?: boolean
  }
}

export interface CapacityResponse {
  available_devices: Array<{
    sn: string
    domain: 'drone' | 'dock'
    type: string
    sub_type: string
    device_name: string
    camera_list: Array<{
      camera_index: string
      camera_type: string
      video_list: Array<{
        video_id: string
        video_index: string
        video_type: string
      }>
    }>
  }>
}