import { ref, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { visionConfig } from '@/config/vision'

interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

interface Detection {
  bbox: BoundingBox
  confidence: number
  label: string
  raw_rect: number[]
}

interface AlgorithmResult {
  algorithm_id: string
  active: boolean
  state: boolean
  detections: Detection[]
  raw_data: any
}

interface VisionData {
  frame_number: number
  frame_time: number
  results: Record<string, AlgorithmResult>
  raw_results: Record<string, any>
  device_properties: {
    position: {
      latitude: number
      longitude: number
      height: number
    }
    attitude: {
      pitch: number
      roll: number
      yaw: number
    }
    gimbal: {
      pitch: number
      roll: number
      yaw: number
    }
    battery: number
    velocity: {
      x: number
      y: number
      z: number
    }
  }
}

interface VisionMessage {
  type: 'connected' | 'vision_data' | 'pong' | 'error'
  device_sn?: string
  timestamp?: number
  data?: VisionData
  message?: string
}

export function useVisionWebSocket(serverHost: string = visionConfig.serverHost) {
  const userStore = useUserStore()
  
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const latestVisionData = ref<VisionData | null>(null)
  const connectionError = ref<string>('')
  
  let heartbeatInterval: number | null = null
  let reconnectTimeout: number | null = null
  let reconnectAttempts = 0
  const maxReconnectAttempts = visionConfig.maxReconnectAttempts
  const reconnectDelay = visionConfig.reconnectDelay

  const connect = (deviceSn?: string) => {
    if (isConnecting.value || isConnected.value) {
      return
    }

    // 获取设备SN - 必须明确传入设备SN
    const targetDeviceSn = deviceSn
    
    if (!targetDeviceSn) {
      connectionError.value = '设备SN不能为空，请确保传入有效的设备SN'
      console.error('Vision WebSocket: 设备SN不能为空，请确保传入有效的设备SN')
      return
    }

    if (!userStore.token) {
      connectionError.value = '未找到认证令牌'
      console.error('Vision WebSocket: 未找到认证令牌')
      return
    }

    console.log(`🔗 Vision WebSocket: 尝试连接设备 ${targetDeviceSn}，服务器: ${serverHost}`)
    console.log('🏠 使用服务器地址:', serverHost)
    console.log('📡 构建的WebSocket URL 将是:', `ws://${serverHost}/api/v1/vision-stream/devices/${targetDeviceSn}/vision/stream`)

    isConnecting.value = true
    connectionError.value = ''

    // 构建WebSocket URL - 使用配置的host
    const wsUrl = `ws://${serverHost}/api/v1/vision-stream/devices/${targetDeviceSn}/vision/stream`
    
    try {
      ws.value = new WebSocket(wsUrl)

      ws.value.onopen = () => {
        console.log('Vision WebSocket connected')
        
        // 发送认证消息
        sendMessage({
          type: 'auth',
          token: userStore.token
        })
      }

      ws.value.onmessage = (event) => {
        try {
          const message: VisionMessage = JSON.parse(event.data)
          handleMessage(message)
        } catch (error) {
          console.error('解析WebSocket消息失败:', error)
        }
      }

      ws.value.onclose = (event) => {
        console.log('Vision WebSocket disconnected', event)
        isConnected.value = false
        isConnecting.value = false
        
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval)
          heartbeatInterval = null
        }

        // 如果不是主动断开连接，尝试重连
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          scheduleReconnect(targetDeviceSn)
        }
      }

      ws.value.onerror = (error) => {
        console.error('Vision WebSocket error:', error)
        console.error('连接地址:', wsUrl)
        connectionError.value = `WebSocket连接错误: ${wsUrl}`
        isConnecting.value = false
        
        // 连接失败时也尝试重连
        if (reconnectAttempts < maxReconnectAttempts) {
          scheduleReconnect(targetDeviceSn)
        }
      }

    } catch (error) {
      console.error('创建WebSocket连接失败:', error)
      connectionError.value = '创建WebSocket连接失败'
      isConnecting.value = false
    }
  }

  const handleMessage = (message: VisionMessage) => {
    switch (message.type) {
      case 'connected':
        console.log('Vision WebSocket认证成功')
        isConnected.value = true
        isConnecting.value = false
        reconnectAttempts = 0
        
        // 配置推送间隔
        configurePushInterval(visionConfig.defaultPushInterval)
        
        // 启动心跳
        startHeartbeat()
        break

      case 'vision_data':
        if (message.data) {
          latestVisionData.value = message.data
          
          // 调试：输出数据接收时间
          const now = Date.now()
          const dataTime = message.data.timestamp || message.timestamp
          if (dataTime) {
            const latency = now - dataTime
            if (latency > 200) {
              console.warn(`🐌 数据传输延迟: ${latency}ms`)
            }
          }
        }
        break

      case 'pong':
        // 心跳响应，无需处理
        break

      case 'error':
        console.error('Vision WebSocket错误:', message.message)
        connectionError.value = message.message || 'WebSocket服务端错误'
        break

      // 新增：静默处理已知但无需警告的类型
      case 'config_updated':
      case 'subscription_updated':
      case 'heartbeat':
        // 不做任何处理，也不输出警告
        break;
      default:
        console.warn('未知的WebSocket消息类型:', message.type)
    }
  }

  const sendMessage = (message: any) => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(message))
    }
  }

  const configurePushInterval = (intervalMs: number) => {
    const clampedInterval = Math.max(
      visionConfig.minPushInterval, 
      Math.min(visionConfig.maxPushInterval, intervalMs)
    )
    sendMessage({
      type: 'config',
      data: {
        push_interval: clampedInterval
      }
    })
  }

  const subscribeAlgorithms = (algorithmIds: number[]) => {
    sendMessage({
      type: 'subscribe',
      algorithms: algorithmIds
    })
  }

  const startHeartbeat = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
    }
    
    // 定期发送心跳
    heartbeatInterval = setInterval(() => {
      sendMessage({ type: 'ping' })
    }, visionConfig.heartbeatInterval)
  }

  const scheduleReconnect = (deviceSn: string) => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
    }
    
    reconnectAttempts++
    console.log(`计划重连 (${reconnectAttempts}/${maxReconnectAttempts})`)
    
    reconnectTimeout = setTimeout(() => {
      connect(deviceSn)
    }, reconnectDelay)
  }

  const disconnect = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }
    
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
    
    if (ws.value) {
      ws.value.close(1000) // 正常关闭
      ws.value = null
    }
    
    isConnected.value = false
    isConnecting.value = false
    reconnectAttempts = 0
    latestVisionData.value = null
    connectionError.value = ''
  }

  // 组件卸载时自动断开连接
  onUnmounted(() => {
    disconnect()
  })

  return {
    // 状态
    isConnected,
    isConnecting,
    latestVisionData,
    connectionError,
    
    // 方法
    connect,
    disconnect,
    configurePushInterval,
    subscribeAlgorithms
  }
}