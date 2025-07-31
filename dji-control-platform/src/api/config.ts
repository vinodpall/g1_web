// API配置文件
export const API_BASE_URL = '/api/v1'

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
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // 合并请求头，确保自定义的Content-Type不被覆盖
    const headers: Record<string, string> = { ...this.defaultHeaders }
    if (options.headers) {
      Object.assign(headers, options.headers)
    }
    
    // 调试信息：检查Authorization头
    console.log('API请求URL:', url)
    console.log('完整请求URL:', window.location.origin + url)
    console.log('请求头:', headers)
    console.log('Authorization头:', headers['Authorization'])
    
    const config: RequestInit = {
      headers,
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        console.error('API请求失败:', response.status, response.statusText)
        console.error('请求URL:', url)
        console.error('响应头:', Object.fromEntries(response.headers.entries()))
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 检查响应内容类型
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text() as T
      }
    } catch (error) {
      console.error('API请求失败:', error)
      throw error
    }
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
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
    return this.request<T>(url, { method: 'GET' })
  }

  // POST请求
  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
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

  // DELETE请求
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // 构建带参数的URL
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