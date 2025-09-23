import { ref, computed } from 'vue'
import type { WebSocketConfig, WebSocketMessage } from '@/types/websocket'
import { parseWebSocketMessage, buildWebSocketUrl } from '@/utils/websocketParser'
import { getCurrentConfig } from '@/config/environment'

// 简单的WebSocket客户端，只连接 ws://10.10.1.3:8000
export class SimpleWebSocketClient {
  private ws: WebSocket | null = null
  private reconnectTimer: number | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000

  // 响应式状态
  public isConnected = ref(false)
  public isConnecting = ref(false)
  public error = ref<string>('')
  public dataCount = ref(0)
  public lastMessage = ref<WebSocketMessage | null>(null)
  public lastUpdateTime = ref<Date | null>(null)

  // 配置和回调
  private config: WebSocketConfig
  private messageHandlers: Array<(message: WebSocketMessage) => void> = []

  private token: string

  constructor(config: WebSocketConfig = {}, token: string = '') {
    this.token = token
    const envConfig = getCurrentConfig()
    this.config = {
      sn: 'broadcast',
      kinds: ['pose', 'cmd_status', 'current_map'],
      baseUrl: envConfig.websocket.fullUrl,
      ...config
    }
  }

  // 连接WebSocket
  async connect(): Promise<boolean> {
    if (this.isConnecting.value || this.isConnected.value) {
      // WebSocket已经在连接中或已连接
      return true
    }

    this.isConnecting.value = true
    this.error.value = ''

    try {
      const wsUrl = buildWebSocketUrl(this.config)
      console.log(`🚀 连接WebSocket: ${wsUrl}`)
      
      this.ws = new WebSocket(wsUrl)
      this.setupEventHandlers()
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket连接超时'))
        }, 10000)

        const onOpen = () => {
          clearTimeout(timeout)
          this.cleanup()
          resolve(true)
        }

        const onError = () => {
          clearTimeout(timeout)
          this.cleanup()
          reject(new Error('WebSocket连接失败'))
        }

        this.ws!.addEventListener('open', onOpen, { once: true })
        this.ws!.addEventListener('error', onError, { once: true })
      })
    } catch (error) {
      this.isConnecting.value = false
      this.error.value = `连接失败: ${error}`
      return false
    }
  }

  private cleanup() {
    // 移除临时事件监听器的清理逻辑已在Promise中处理
  }

  // 设置WebSocket事件处理器
  private setupEventHandlers(): void {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log('🟢 WebSocket 已连接')
      this.isConnected.value = true
      this.isConnecting.value = false
      this.error.value = ''
      this.resetReconnectAttempts()

      // 发送认证消息（如果需要）
      if (this.token) {
        this.send({
          type: 'auth',
          token: this.token
        })
      }
    }

    this.ws.onmessage = (event) => {
      try {
        const rawMessage = JSON.parse(event.data)
        // console.log('🔗 收到原始WebSocket消息:', rawMessage)
        const parsedMessage = parseWebSocketMessage(rawMessage)
        
        if (parsedMessage) {
          // console.log('✅ 解析成功:', parsedMessage.channel)
          this.handleMessage(parsedMessage)
        } else {
          console.warn('⚠️ WebSocket 消息解析失败:', rawMessage)
          // 尝试处理旧格式消息
          this.handleLegacyMessage(rawMessage)
        }
      } catch (error) {
        console.error('❌ WebSocket 解析错误:', error)
        this.error.value = `消息解析错误: ${error}`
      }
    }

    this.ws.onerror = (error) => {
      console.error('🔴 WebSocket 连接错误:', error)
      this.error.value = 'WebSocket连接错误'
    }

    this.ws.onclose = (event) => {
      console.log(`🔴 WebSocket 已断开`)
      this.isConnected.value = false
      this.isConnecting.value = false
      
      // 如果不是主动关闭，尝试重连
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`🔄 重连中 (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`)
        this.scheduleReconnect()
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn('⚠️ 重连失败')
      }
    }
  }

  // 处理收到的消息（新格式）
  private handleMessage(message: WebSocketMessage): void {
    // 收到WebSocket消息
    
    this.lastMessage.value = message
    this.dataCount.value++
    this.lastUpdateTime.value = new Date()

    // 调用所有注册的消息处理器
    this.messageHandlers.forEach(handler => {
      try {
        handler(message)
      } catch (error) {
        // 消息处理器执行失败
      }
    })
  }

  // 处理旧格式消息（向后兼容）
  private handleLegacyMessage(message: any): void {
    // 收到旧格式WebSocket消息
    
    this.dataCount.value++
    this.lastUpdateTime.value = new Date()

    // 根据消息类型进行处理
    switch (message.type) {
      case 'connected':
        // WebSocket认证成功
        break
      case 'vision_data':
        // 收到视觉数据
        break
      case 'vision_alert':
        // 收到视觉告警
        break
      case 'pong':
        // 收到心跳响应
        break
      case 'error':
        this.error.value = message.message
        // 服务端错误
        break
      default:
        // 未知消息类型
    }
  }

  // 发送消息
  send(message: any): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
      return true
    }
      // WebSocket未连接，无法发送消息
    return false
  }

  // 发送心跳
  ping(): boolean {
    return this.send({ type: 'ping' })
  }

  // 安排重连
  private scheduleReconnect(): void {
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
      // 尝试重连
    
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectAttempts++
      this.connect().catch(error => {
        // 重连失败
      })
    }, delay)
  }

  // 重置重连计数
  private resetReconnectAttempts(): void {
    this.reconnectAttempts = 0
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  // 断开连接
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    
    if (this.ws) {
      this.ws.close(1000, '主动断开')
      this.ws = null
    }
    
    this.isConnected.value = false
    this.isConnecting.value = false
  }

  // 清理资源
  destroy(): void {
    this.disconnect()
  }

  // 更新token
  updateToken(token: string): void {
    this.token = token
  }

  // 更新配置
  updateConfig(config: Partial<WebSocketConfig>): void {
    this.config = { ...this.config, ...config }
  }

  // 添加消息处理器
  addMessageHandler(handler: (message: WebSocketMessage) => void): void {
    this.messageHandlers.push(handler)
  }

  // 移除消息处理器
  removeMessageHandler(handler: (message: WebSocketMessage) => void): void {
    const index = this.messageHandlers.indexOf(handler)
    if (index > -1) {
      this.messageHandlers.splice(index, 1)
    }
  }

  // 清空所有消息处理器
  clearMessageHandlers(): void {
    this.messageHandlers = []
  }

  // 获取当前配置
  getConfig(): WebSocketConfig {
    return { ...this.config }
  }
}

// 全局WebSocket实例
let globalWebSocketClient: SimpleWebSocketClient | null = null

// 获取全局WebSocket实例
export function useSimpleWebSocket(config: WebSocketConfig = {}, token: string = '') {
  if (!globalWebSocketClient) {
    globalWebSocketClient = new SimpleWebSocketClient(config, token)
  } else {
    if (token) {
      globalWebSocketClient.updateToken(token)
    }
    if (Object.keys(config).length > 0) {
      globalWebSocketClient.updateConfig(config)
    }
  }

  return {
    // 状态
    isConnected: computed(() => globalWebSocketClient!.isConnected.value),
    isConnecting: computed(() => globalWebSocketClient!.isConnecting.value),
    error: computed(() => globalWebSocketClient!.error.value),
    dataCount: computed(() => globalWebSocketClient!.dataCount.value),
    lastMessage: computed(() => globalWebSocketClient!.lastMessage.value),
    lastUpdateTime: computed(() => globalWebSocketClient!.lastUpdateTime.value),
    
    // 方法
    connect: () => globalWebSocketClient!.connect(),
    disconnect: () => globalWebSocketClient!.disconnect(),
    send: (message: any) => globalWebSocketClient!.send(message),
    ping: () => globalWebSocketClient!.ping(),
    updateToken: (token: string) => globalWebSocketClient!.updateToken(token),
    updateConfig: (config: Partial<WebSocketConfig>) => globalWebSocketClient!.updateConfig(config),
    addMessageHandler: (handler: (message: WebSocketMessage) => void) => globalWebSocketClient!.addMessageHandler(handler),
    removeMessageHandler: (handler: (message: WebSocketMessage) => void) => globalWebSocketClient!.removeMessageHandler(handler),
    clearMessageHandlers: () => globalWebSocketClient!.clearMessageHandlers(),
    getConfig: () => globalWebSocketClient!.getConfig(),
    
    // 原始客户端实例
    client: globalWebSocketClient
  }
}