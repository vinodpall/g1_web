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
    
    // 如果data是字符串且options中指定了Content-Type为form-urlencoded，直接使用
    if (typeof data === 'string' && options?.headers && 
        'content-type' in options.headers && 
        options.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      body = data
    } else {
      // 否则按JSON格式处理
      body = data ? JSON.stringify(data) : undefined
    }
    
    return this.request<T>(endpoint, {
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