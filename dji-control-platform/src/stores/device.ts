import { defineStore } from 'pinia'
import type { Dock, Drone } from '@/types'
import { mockDocks, mockDrones } from '@/api'

export const useDeviceStore = defineStore('device', {
  state: () => ({
    selectedDockId: localStorage.getItem('selectedDockId') || 'dock-1',
    docks: mockDocks,
    drones: mockDrones
  }),
  
  getters: {
    selectedDock: (state) => state.docks.find(dock => dock.id === state.selectedDockId),
    selectedDrone: (state) => {
      const dock = state.docks.find(dock => dock.id === state.selectedDockId)
      return dock ? state.drones.find(drone => drone.id === dock.droneId) : null
    },
    availableDocks: (state) => state.docks.filter(dock => dock.status === 'online')
  },
  
  actions: {
    setSelectedDock(dockId: string) {
      this.selectedDockId = dockId
      localStorage.setItem('selectedDockId', dockId)
    },
    
    addDock(dock: Dock) {
      this.docks.push(dock)
    },
    
    updateDock(dock: Dock) {
      const index = this.docks.findIndex(d => d.id === dock.id)
      if (index !== -1) {
        this.docks[index] = dock
      }
    },
    
    deleteDock(dockId: string) {
      this.docks = this.docks.filter(dock => dock.id !== dockId)
      // 如果删除的是当前选中的机巢，切换到第一个可用的机巢
      if (this.selectedDockId === dockId && this.docks.length > 0) {
        this.setSelectedDock(this.docks[0].id)
      }
    },
    
    addDrone(drone: Drone) {
      this.drones.push(drone)
    },
    
    updateDrone(drone: Drone) {
      const index = this.drones.findIndex(d => d.id === drone.id)
      if (index !== -1) {
        this.drones[index] = drone
      }
    },
    
    deleteDrone(droneId: string) {
      this.drones = this.drones.filter(drone => drone.id !== droneId)
      // 解除机巢绑定
      this.docks.forEach(dock => {
        if (dock.droneId === droneId) {
          dock.droneId = undefined
        }
      })
    },
    
    bindDroneToDock(droneId: string, dockId: string) {
      // 先解除所有绑定
      this.docks.forEach(dock => {
        if (dock.droneId === droneId) {
          dock.droneId = undefined
        }
      })
      this.drones.forEach(drone => {
        if (drone.dockId === dockId) {
          drone.dockId = undefined
        }
      })
      
      // 建立新绑定
      const dock = this.docks.find(d => d.id === dockId)
      const drone = this.drones.find(d => d.id === droneId)
      if (dock && drone) {
        dock.droneId = droneId
        drone.dockId = dockId
      }
    }
  }
})