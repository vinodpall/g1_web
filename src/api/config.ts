// API配置文件
import { config, getCurrentConfig } from '../config/environment'

// 根据环境动态获取API配置
const getApiConfig = () => {
  // 在生产环境中使用相对路径（同域部署），在开发环境中使用相对路径（依赖Vite代理）
  if (import.meta.env.PROD) {
    // 生产环境：同域部署，使用相对路径
    return {
      baseUrl: '/api/v1',
      domain: window.location.origin
    }
  } else {
    // 开发环境：使用相对路径，依赖Vite代理
    return {
      baseUrl: config.api.baseUrl,
      domain: ''
    }
  }
}

const apiConfig = getApiConfig()
export const API_BASE_URL = apiConfig.baseUrl
export const API_DOMAIN = apiConfig.domain

// HTTP请求工具类
export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    console.log('ApiClient初始化 - baseURL:', baseURL)
    console.log('默认请求头:', this.defaultHeaders)
  }

  // 设置认证token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
    console.log('设置认证token:', token ? '已设置' : '未设置')
    console.log('Authorization头:', this.defaultHeaders['Authorization'])
  }

  // 清除认证token
  clearAuthToken() {
    delete this.defaultHeaders['Authorization']
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit & { responseType?: 'blob' } = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // 合并请求头，确保自定义的Content-Type不被覆盖
    const headers: Record<string, string> = { ...this.defaultHeaders }
    if (options.headers) {
      Object.assign(headers, options.headers)
    }
    
    // 调试信息：检查Authorization头（开发时使用，生产环境注释）
    // console.log('API请求URL:', url)
    // console.log('完整请求URL:', window.location.origin + url)
    // console.log('请求头:', headers)
    // console.log('Authorization头:', headers['Authorization'])
    
    const config: RequestInit = {
      headers,
      ...options,
    }

    try {
      const response = await fetch(url, config)
      let data: any = null;
      
      // 检查是否需要返回blob
      if (options?.responseType === 'blob') {
        data = await response.blob();
      } else {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
      }
      
      if (!response.ok) {
        // 直接抛出data，这样catch能拿到后端的detail字段
        throw data;
      }
      return data;
    } catch (error) {
      // 只在非网络错误时显示错误信息
      if (!(error instanceof TypeError && error.message.includes('Failed to fetch'))) {
        console.error('API请求失败:', error)
      }
      throw error
    }
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, any>, options?: RequestInit & { responseType?: 'blob' }): Promise<T> {
    let url = endpoint
    if (params) {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
      url = `${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    }
    return this.request<T>(url, { method: 'GET', ...options })
  }

  // POST请求
  async post<T>(endpoint: string, data?: any, options?: RequestInit & { responseType?: 'blob' }): Promise<T> {
    let body: string | undefined
    let modifiedEndpoint = endpoint
    let modifiedData = data

    // 处理SN参数从body移到URL的逻辑
    if (data && typeof data === 'object') {
      // 检查body中是否有sn或robot_sn参数
      const hasSn = 'sn' in data
      const hasRobotSn = 'robot_sn' in data
      
      if (hasSn || hasRobotSn) {
        // 从缓存获取SN值
        const cachedSn = this.getCachedSn()
        
        if (cachedSn) {
          // 复制数据对象以避免修改原始数据
          modifiedData = { ...data }
          
          // 从body中移除sn参数并添加到URL
          if (hasSn) {
            delete modifiedData.sn
            modifiedEndpoint = this.appendSnToUrl(endpoint, cachedSn)
          } else if (hasRobotSn) {
            delete modifiedData.robot_sn
            modifiedEndpoint = this.appendSnToUrl(endpoint, cachedSn)
          }
        }
      }
    }
    
    // 如果data是字符串且options中指定了Content-Type为form-urlencoded，直接使用
    if (typeof modifiedData === 'string' && options?.headers && 
        'content-type' in options.headers && 
        options.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      body = modifiedData
    } else {
      // 否则按JSON格式处理
      body = modifiedData ? JSON.stringify(modifiedData) : undefined
    }
    
    return this.request<T>(modifiedEndpoint, {
      method: 'POST',
      body,
      ...options
    })
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PATCH请求
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // 构建带参数的URL
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private buildUrlWithParams(endpoint: string, params: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
    return url.pathname + url.search
  }

  // 从缓存获取SN
  private getCachedSn(): string | null {
    try {
      // 优先从设备store获取选中的dock SN
      const selectedDockSn = localStorage.getItem('selected_dock_sn')
      if (selectedDockSn) {
        return selectedDockSn
      }
      
      // 如果没有选中的dock，尝试从机器人store获取
      const selectedRobotId = localStorage.getItem('selectedRobotId')
      if (selectedRobotId) {
        const robots = JSON.parse(localStorage.getItem('robots') || '[]')
        const robot = robots.find((r: any) => r.id === parseInt(selectedRobotId))
        if (robot && robot.sn) {
          return robot.sn
        }
      }
      
      // 最后尝试从设备列表获取第一个可用的SN
      const devices = JSON.parse(localStorage.getItem('cached_devices') || '[]')
      if (devices.length > 0 && devices[0].device_sn) {
        return devices[0].device_sn
      }
      
      return null
    } catch (error) {
      console.warn('获取缓存SN失败:', error)
      return null
    }
  }

  // 将SN参数添加到URL中
  private appendSnToUrl(endpoint: string, sn: string): string {
    // 如果URL已经包含查询参数，添加&sn=xxx
    // 如果没有查询参数，添加?sn=xxx
    const separator = endpoint.includes('?') ? '&' : '?'
    return `${endpoint}${separator}sn=${encodeURIComponent(sn)}`
  }
}

// 创建API客户端实例
export const apiClient = new ApiClient(API_BASE_URL)

// 调试信息
console.log('🔧 API客户端配置:')
console.log('- 环境:', import.meta.env.PROD ? '生产环境' : '开发环境')
console.log('- API_BASE_URL:', API_BASE_URL)
console.log('- API_DOMAIN:', API_DOMAIN)
console.log('- 当前域名:', window.location.origin)

// 响应数据类型定义
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  pageSize: number
} 