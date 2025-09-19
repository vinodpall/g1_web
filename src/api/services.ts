import { API_BASE_URL } from './config'

// 认证相关接口 - 只保留登录接口
export const authApi = {
  // 用户登录 - 适配后端API
  login: (username: string, password: string) => {
    // 使用JSON格式发送数据
    const loginData = {
      username: username,
      password: password
    }

    return fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    }).then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    })
  }
}

// 机器人相关接口
export const robotApi = {
  // 获取所有机器人列表
  getRobots: (token: string, searchQuery?: string, skip: number = 0, limit: number = 50) => {
    const url = new URL(`${API_BASE_URL}/robots/`)
    
    // 添加分页参数
    url.searchParams.append('skip', skip.toString())
    url.searchParams.append('limit', limit.toString())
    
    // 添加搜索参数
    if (searchQuery && searchQuery.trim()) {
      url.searchParams.append('q', searchQuery.trim())
    }
    
    console.log('robotApi.getRobots 被调用')
    console.log('请求URL:', url.toString())
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('API响应状态:', response.status)
      console.log('API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('API响应数据:', data)
      return data
    }).catch(error => {
      console.error('API请求失败:', error)
      throw error
    })
  },

  // 创建机器人
  createRobot: (token: string, robotData: {
    sn: string
    name: string
    model: string
    firmware_version: string
    ip_address: string
    mac_address: string
    location: string
    status: string
    online: boolean
    mqtt_client_id: string
    mqtt_status_topic: string
    notes: string
  }) => {
    return fetch(`${API_BASE_URL}/robots/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(robotData)
    }).then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    })
  },

  // 更新机器人
  updateRobot: (token: string, robotId: number, robotData: Partial<{
    sn: string
    name: string
    model: string
    firmware_version: string
    ip_address: string
    mac_address: string
    location: string
    status: string
    online: boolean
    mqtt_client_id: string
    mqtt_status_topic: string
    notes: string
  }>) => {
    return fetch(`${API_BASE_URL}/robots/${robotId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(robotData)
    }).then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    })
  },

  // 删除机器人
  deleteRobot: (token: string, robotId: number) => {
    const url = `${API_BASE_URL}/robots/${robotId}`
    
    console.log('robotApi.deleteRobot 被调用')
    console.log('删除机器人ID:', robotId)
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('删除API响应状态:', response.status)
      console.log('删除API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('删除API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      console.log('机器人删除成功')
      return response.ok
    }).catch(error => {
      console.error('删除API请求失败:', error)
      throw error
    })
  }
}

// 用户相关接口
export const userApi = {
  // 获取所有用户列表
  getUsers: (token: string, searchQuery?: string, skip: number = 0, limit: number = 50) => {
    const url = new URL(`${API_BASE_URL}/users/`)
    
    // 添加分页参数
    url.searchParams.append('skip', skip.toString())
    url.searchParams.append('limit', limit.toString())
    
    // 添加搜索参数
    if (searchQuery && searchQuery.trim()) {
      url.searchParams.append('q', searchQuery.trim())
    }
    
    console.log('userApi.getUsers 被调用')
    console.log('请求URL:', url.toString())
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('用户API响应状态:', response.status)
      console.log('用户API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('用户API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('用户API响应数据:', data)
      return data
    }).catch(error => {
      console.error('用户API请求失败:', error)
      throw error
    })
  },

  // 创建用户
  createUser: (token: string, userData: {
    username: string
    email: string
    full_name: string
    password: string
    is_active?: boolean
    is_superuser?: boolean
  }) => {
    return fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    }).then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    })
  },

  // 更新用户
  updateUser: (token: string, userId: number, userData: Partial<{
    username: string
    email: string
    full_name: string
    password: string
    is_active: boolean
    is_superuser: boolean
  }>) => {
    return fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    }).then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    })
  },

  // 删除用户
  deleteUser: (token: string, userId: number) => {
    const url = `${API_BASE_URL}/users/${userId}`
    
    console.log('userApi.deleteUser 被调用')
    console.log('删除用户ID:', userId)
    console.log('请求URL:', url)
    
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('删除用户API响应状态:', response.status)
      console.log('删除用户API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('删除用户API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      console.log('用户删除成功')
      return response.ok
    }).catch(error => {
      console.error('删除用户API请求失败:', error)
      throw error
    })
  }
}

// 其他API接口已移除，等待重新对接