import type { User, Dock, Drone, Mission, MissionRecord, Alert, Role, Device } from '../types'
import { authApi, userApi, dockApi, droneApi, missionApi, missionRecordApi, alertApi, roleApi, deviceApi } from './services'

// 导出所有API服务
export {
  authApi,
  userApi,
  dockApi,
  droneApi,
  missionApi,
  missionRecordApi,
  alertApi,
  roleApi,
  deviceApi
}