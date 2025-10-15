import { API_BASE_URL } from './config'

// 辅助函数：构建完整的API URL
function buildApiUrl(path: string): string {
  const baseUrl = API_BASE_URL.startsWith('http') ? API_BASE_URL : `${window.location.origin}${API_BASE_URL}`
  return `${baseUrl}${path}`
}

// 辅助函数：从缓存获取SN
function getCachedSn(): string | null {
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

// 辅助函数：处理SN参数从body移到URL
function processSnParams(url: string, data: any): { url: string, data: any } {
  if (!data || typeof data !== 'object') {
    return { url, data }
  }

  const hasSn = 'sn' in data
  const hasRobotSn = 'robot_sn' in data
  
  if (hasSn || hasRobotSn) {
    // 优先使用传入数据中的sn参数，如果没有则从缓存获取
    let targetSn = null
    if (hasSn && data.sn) {
      targetSn = data.sn
    } else if (hasRobotSn && data.robot_sn) {
      targetSn = data.robot_sn
    } else {
      targetSn = getCachedSn()
    }
    
    if (targetSn) {
      // 复制数据对象以避免修改原始数据
      const modifiedData = { ...data }
      
      // 从body中移除sn参数并添加到URL
      if (hasSn) {
        delete modifiedData.sn
      } else if (hasRobotSn) {
        delete modifiedData.robot_sn
      }
      
      // 将SN添加到URL
      const separator = url.includes('?') ? '&' : '?'
      const modifiedUrl = `${url}${separator}sn=${encodeURIComponent(targetSn)}`
      
      return { url: modifiedUrl, data: modifiedData }
    }
  }
  
  return { url, data }
}

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
        // 根据HTTP状态码直接返回中文错误提示
        let errorMessage = '登录失败'
        if (response.status === 401) {
          errorMessage = '用户名或密码错误'
        } else if (response.status === 403) {
          errorMessage = '没有访问权限'
        } else if (response.status === 500) {
          errorMessage = '服务器错误，请稍后重试'
        } else if (response.status === 503) {
          errorMessage = '服务暂时不可用，请稍后重试'
        }
        throw new Error(errorMessage)
      }
      return response.json()
    }).catch(error => {
      // 处理网络错误（如服务器未启动、网络断开等）
      if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed') || error.message.includes('Network'))) {
        throw new Error('网络连接失败，请检查网络或服务器是否正常')
      }
      // 如果已经是自定义错误（如401、500等），直接抛出
      throw error
    })
  }
}

// 机器人相关接口
export const robotApi = {
  // 获取所有机器人列表
  getRobots: (token: string, searchQuery?: string, skip: number = 0, limit: number = 50) => {
    const url = new URL(buildApiUrl('/robots/'))
    
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
    voice_ip: string
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
    name: string
    model: string
    firmware_version: string
    ip_address: string
    voice_ip: string
    mac_address: string
    location: string
    status: string
    online: boolean
    mqtt_client_id: string
    mqtt_status_topic: string
    notes: string
    photo_url: string
  }>) => {
    const url = `${API_BASE_URL}/robots/${robotId}`
    
    console.log('robotApi.updateRobot 被调用')
    console.log('请求URL:', url)
    console.log('机器人ID:', robotId)
    console.log('更新数据:', robotData)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(robotData)
    }).then(response => {
      console.log('更新机器人API响应状态:', response.status)
      console.log('更新机器人API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('更新机器人API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('更新机器人API响应数据:', data)
      return data
    }).catch(error => {
      console.error('更新机器人API请求失败:', error)
      throw error
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
    const url = new URL(buildApiUrl('/users/'))
    
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
        return response.json()
          .then(errorData => {
            console.error('用户API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
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
        return response.json()
          .then(errorData => {
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
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
    const url = `${API_BASE_URL}/users/${userId}`
    
    console.log('userApi.updateUser 被调用')
    console.log('请求URL:', url)
    console.log('用户ID:', userId)
    console.log('更新数据:', userData)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    }).then(response => {
      console.log('更新用户API响应状态:', response.status)
      console.log('更新用户API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('更新用户API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('更新用户API响应数据:', data)
      return data
    }).catch(error => {
      console.error('更新用户API请求失败:', error)
      throw error
    })
  },

  // 获取当前用户信息
  getCurrentUser: (token: string) => {
    const url = `${API_BASE_URL}/users/me`
    
    console.log('userApi.getCurrentUser 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('获取当前用户API响应状态:', response.status)
      console.log('获取当前用户API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('获取当前用户API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('获取当前用户API响应数据:', data)
      return data
    }).catch(error => {
      console.error('获取当前用户API请求失败:', error)
      throw error
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
        return response.json()
          .then(errorData => {
            console.error('删除用户API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
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

// 讲解词管理相关接口
export const guideApi = {
  // 获取点位名称列表
  getPointNames: (token: string) => {
    const url = `${API_BASE_URL}/guide/point-names`
    
    console.log('guideApi.getPointNames 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('点位名称API响应状态:', response.status)
      console.log('点位名称API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('点位名称API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('点位名称API响应数据:', data)
      return data
    }).catch(error => {
      console.error('点位名称API请求失败:', error)
      throw error
    })
  },

  // 创建点位名称
  createPointName: (token: string, name: string) => {
    const url = `${API_BASE_URL}/guide/point-names`
    const requestData = { name }
    
    console.log('guideApi.createPointName 被调用')
    console.log('请求URL:', url)
    console.log('请求参数:', requestData)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    }).then(response => {
      console.log('创建点位名称API响应状态:', response.status)
      console.log('创建点位名称API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('创建点位名称API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('创建点位名称API响应数据:', data)
      return data
    }).catch(error => {
      console.error('创建点位名称API请求失败:', error)
      throw error
    })
  },

  // 删除点位名称
  deletePointName: (token: string, pointNameId: number) => {
    const url = `${API_BASE_URL}/guide/point-names/${pointNameId}`
    
    console.log('guideApi.deletePointName 被调用')
    console.log('请求URL:', url)
    console.log('点位名称ID:', pointNameId)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('删除点位名称API响应状态:', response.status)
      console.log('删除点位名称API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('删除点位名称API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json().catch(() => ({})) // 如果响应体为空，返回空对象
    }).then(data => {
      console.log('删除点位名称API响应数据:', data)
      return data
    }).catch(error => {
      console.error('删除点位名称API请求失败:', error)
      throw error
    })
  },

  // 获取讲解对象列表
  getAudiences: (token: string) => {
    const url = `${API_BASE_URL}/guide/audiences`
    
    console.log('guideApi.getAudiences 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('讲解对象API响应状态:', response.status)
      console.log('讲解对象API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('讲解对象API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('讲解对象API响应数据:', data)
      return data
    }).catch(error => {
      console.error('讲解对象API请求失败:', error)
      throw error
    })
  },

  // 创建讲解对象
  createAudience: (token: string, name: string) => {
    const url = `${API_BASE_URL}/guide/audiences`
    const requestData = { name }
    
    console.log('guideApi.createAudience 被调用')
    console.log('请求URL:', url)
    console.log('请求参数:', requestData)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    }).then(response => {
      console.log('创建讲解对象API响应状态:', response.status)
      console.log('创建讲解对象API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('创建讲解对象API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('创建讲解对象API响应数据:', data)
      return data
    }).catch(error => {
      console.error('创建讲解对象API请求失败:', error)
      throw error
    })
  },

  // 删除讲解对象
  deleteAudience: (token: string, audienceId: number) => {
    const url = `${API_BASE_URL}/guide/audiences/${audienceId}`
    
    console.log('guideApi.deleteAudience 被调用')
    console.log('请求URL:', url)
    console.log('删除讲解对象ID:', audienceId)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('删除讲解对象API响应状态:', response.status)
      console.log('删除讲解对象API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('删除讲解对象API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      
      // DELETE请求可能返回空响应
      if (response.status === 204) {
        return { success: true }
      }
      
      return response.json()
    }).then(data => {
      console.log('删除讲解对象API响应数据:', data)
      return data
    }).catch(error => {
      console.error('删除讲解对象API请求失败:', error)
      throw error
    })
  },

  // 获取讲解词列表
  getScripts: (token: string) => {
    const url = `${API_BASE_URL}/guide/scripts`
    
    console.log('guideApi.getScripts 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('讲解词API响应状态:', response.status)
      console.log('讲解词API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('讲解词API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('讲解词API响应数据:', data)
      return data
    }).catch(error => {
      console.error('讲解词API请求失败:', error)
      throw error
    })
  },

  // 创建讲解词
  createScript: (token: string, scriptData: {
    audience_id: number,
    point_name_id: number,
    content: string
  }) => {
    const url = `${API_BASE_URL}/guide/scripts`
    
    console.log('guideApi.createScript 被调用')
    console.log('请求URL:', url)
    console.log('请求参数:', scriptData)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scriptData)
    }).then(response => {
      console.log('创建讲解词API响应状态:', response.status)
      console.log('创建讲解词API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('创建讲解词API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            // JSON解析失败时的处理
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('创建讲解词API响应数据:', data)
      return data
    }).catch(error => {
      console.error('创建讲解词API请求失败:', error)
      throw error
    })
  },

  // 更新讲解词
  updateScript: (token: string, scriptId: number, content: string) => {
    const url = `${API_BASE_URL}/guide/scripts/${scriptId}`
    const requestData = { content }
    
    console.log('guideApi.updateScript 被调用')
    console.log('请求URL:', url)
    console.log('请求参数:', requestData)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    }).then(response => {
      console.log('更新讲解词API响应状态:', response.status)
      console.log('更新讲解词API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('更新讲解词API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('更新讲解词API响应数据:', data)
      return data
    }).catch(error => {
      console.error('更新讲解词API请求失败:', error)
      throw error
    })
  },

  // 删除讲解词
  deleteScript: (token: string, scriptId: number) => {
    const url = `${API_BASE_URL}/guide/scripts/${scriptId}`
    
    console.log('guideApi.deleteScript 被调用')
    console.log('请求URL:', url)
    console.log('删除讲解词ID:', scriptId)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('删除讲解词API响应状态:', response.status)
      console.log('删除讲解词API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('删除讲解词API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      console.log('讲解词删除成功')
      return response.ok
    }).catch(error => {
      console.error('删除讲解词API请求失败:', error)
      throw error
    })
  }
}

// 展厅管理相关接口
export const hallApi = {
  // 获取展厅列表
  getHalls: (token: string) => {
    const url = `${API_BASE_URL}/halls`
    
    console.log('hallApi.getHalls 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('展厅API响应状态:', response.status)
      console.log('展厅API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('展厅API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('展厅API响应数据:', data)
      return data
    }).catch(error => {
      console.error('展厅API请求失败:', error)
      throw error
    })
  }
}

// 展区管理相关接口
export const zoneApi = {
  // 获取展区列表
  getZones: (token: string, hallId?: number) => {
    let url = `${API_BASE_URL}/zones`
    if (hallId) {
      url += `?hall_id=${hallId}`
    }
    
    console.log('zoneApi.getZones 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('展厅ID:', hallId || '全部')
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('展区API响应状态:', response.status)
      console.log('展区API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('展区API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('展区API响应数据:', data)
      return data
    }).catch(error => {
      console.error('展区API请求失败:', error)
      throw error
    })
  },

  // 创建新展区
  createZone: (token: string, zoneData: { hall_id: number, name: string, seq: number, is_enabled: boolean }) => {
    const url = `${API_BASE_URL}/zones`
    
    console.log('zoneApi.createZone 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('展区数据:', zoneData)
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(zoneData)
    }).then(response => {
      console.log('创建展区API响应状态:', response.status)
      console.log('创建展区API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('创建展区API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('创建展区API响应数据:', data)
      return data
    }).catch(error => {
      console.error('创建展区API请求失败:', error)
      throw error
    })
  },

  // 删除展区
  deleteZone: (token: string, zoneId: number) => {
    const url = `${API_BASE_URL}/zones/${zoneId}`
    
    console.log('zoneApi.deleteZone 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('展区ID:', zoneId)
    
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('删除展区API响应状态:', response.status)
      console.log('删除展区API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('删除展区API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      // 删除操作通常返回空响应或成功消息
      return response.status === 204 ? { success: true } : response.json()
    }).then(data => {
      console.log('删除展区API响应数据:', data)
      return data
    }).catch(error => {
      console.error('删除展区API请求失败:', error)
      throw error
    })
  }
}

// 展厅任务管理相关接口
export const tourApi = {
  // 获取展厅任务运行列表
  getTourRuns: (token: string) => {
    const url = `${API_BASE_URL}/tours/runs`
    
    console.log('tourApi.getTourRuns 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('任务运行列表API响应状态:', response.status)
      console.log('任务运行列表API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            console.error('任务运行列表API错误响应:', errorData)
            const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`
            throw new Error(errorMessage)
          }, () => {
            throw new Error(`HTTP error! status: ${response.status}`)
          })
      }
      return response.json()
    }).then(data => {
      console.log('任务运行列表API响应数据:', data)
      return data
    }).catch(error => {
      console.error('任务运行列表API请求失败:', error)
      throw error
    })
  },

  // 获取展厅任务预设列表
  getTourPresets: (token: string) => {
    const url = `${API_BASE_URL}/tours/presets`
    
    console.log('tourApi.getTourPresets 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('展厅任务API响应状态:', response.status)
      console.log('展厅任务API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('展厅任务API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('展厅任务API响应数据:', data)
      return data
    }).catch(error => {
      console.error('展厅任务API请求失败:', error)
      throw error
    })
  },

  // 创建新展厅任务预设
  createTourPreset: (token: string, presetData: { name: string, description: string | null, hall_id: number }) => {
    const url = `${API_BASE_URL}/tours/presets`
    
    console.log('tourApi.createTourPreset 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('任务预设数据:', presetData)
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(presetData)
    }).then(response => {
      console.log('创建展厅任务API响应状态:', response.status)
      console.log('创建展厅任务API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('创建展厅任务API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('创建展厅任务API响应数据:', data)
      return data
    }).catch(error => {
      console.error('创建展厅任务API请求失败:', error)
      throw error
    })
  },

  // 获取任务预设详情（包含任务点）
  getTourPresetItems: (token: string, presetId: number) => {
    const url = `${API_BASE_URL}/tours/presets/${presetId}/items`
    
    console.log('tourApi.getTourPresetItems 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('预设ID:', presetId)
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('任务预设详情API响应状态:', response.status)
      console.log('任务预设详情API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('任务预设详情API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('任务预设详情API响应数据:', data)
      return data
    }).catch(error => {
      console.error('任务预设详情API请求失败:', error)
      throw error
    })
  },

  // 添加任务预设项（展区任务）
  addTourPresetItem: (token: string, presetId: number, itemData: { zone_id: number, seq?: number }) => {
    const url = `${API_BASE_URL}/tours/presets/${presetId}/items`
    
    console.log('tourApi.addTourPresetItem 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('预设ID:', presetId)
    console.log('任务预设项数据:', itemData)
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemData)
    }).then(response => {
      console.log('添加任务预设项API响应状态:', response.status)
      console.log('添加任务预设项API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('添加任务预设项API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('添加任务预设项API响应数据:', data)
      return data
    }).catch(error => {
      console.error('添加任务预设项API请求失败:', error)
      throw error
    })
  },

  // 开始展厅任务
  startTourPreset: (token: string, presetId: number, startData: { audience_id: number, robot_sn: string, prefer_current_pose: boolean }) => {
    const baseUrl = `${API_BASE_URL}/tours/presets/${presetId}/start`
    
    // 同时在URL和body中包含SN信息
    const url = `${baseUrl}?sn=${encodeURIComponent(startData.robot_sn)}`
    
    console.log('tourApi.startTourPreset 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('预设ID:', presetId)
    console.log('任务数据:', startData)
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(startData)
    }).then(response => {
      console.log('开始展厅任务API响应状态:', response.status)
      console.log('开始展厅任务API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('开始展厅任务API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('开始展厅任务API响应数据:', data)
      return data
    }).catch(error => {
      console.error('开始展厅任务API请求失败:', error)
      throw error
    })
  },

  // 删除展厅任务预设
  deleteTourPreset: (token: string, presetId: number) => {
    const url = `${API_BASE_URL}/tours/presets/${presetId}`
    
    console.log('tourApi.deleteTourPreset 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('预设ID:', presetId)
    
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('删除展厅任务预设API响应状态:', response.status)
      console.log('删除展厅任务预设API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('删除展厅任务预设API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      
      // DELETE请求可能返回空响应
      if (response.status === 204) {
        return { success: true }
      }
      
      return response.json()
    }).then(data => {
      console.log('删除展厅任务预设API响应数据:', data)
      return data
    }).catch(error => {
      console.error('删除展厅任务预设API请求失败:', error)
      throw error
    })
  }
}

// 导航SLAM相关接口
export const navigationApi = {
  // 展厅地图录制接口
  slamControl: (token: string, slamData: { sn: string, map_name: string, action: number, data_name: string, timeout?: number }) => {
    const originalUrl = `${API_BASE_URL}/navigation/recording`
    
    // 构建URL并添加timeout参数
    const fullUrl = new URL(buildApiUrl('/navigation/recording'))
    
    // 添加timeout参数到URL，默认值为10
    const timeoutValue = slamData.timeout || 10
    fullUrl.searchParams.append('timeout', timeoutValue.toString())
    
    // 处理SN参数从body移到URL
    const { url, data } = processSnParams(fullUrl.toString(), slamData)
    
    console.log('navigationApi.slamControl 被调用')
    console.log('原始URL:', originalUrl)
    console.log('修改后URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('原始SLAM数据:', slamData)
    console.log('修改后SLAM数据:', data)
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => {
      console.log('SLAM控制API响应状态:', response.status)
      console.log('SLAM控制API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('SLAM控制API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('SLAM控制API响应数据:', data)
      return data
    }).catch(error => {
      console.error('SLAM控制API请求失败:', error)
      throw error
    })
  },

  // 生成地图接口
  generateMap: (token: string, mapData: { sn: string, map_name: string, action: number, data_name: string, timeout?: number }) => {
    const originalUrl = `${API_BASE_URL}/navigation/slam`
    
    // 构建URL并添加timeout参数
    const fullUrl = new URL(buildApiUrl('/navigation/slam'))
    
    // 添加timeout参数到URL，默认值为10
    const timeoutValue = mapData.timeout || 10
    fullUrl.searchParams.append('timeout', timeoutValue.toString())
    
    // 处理SN参数从body移到URL
    const { url, data } = processSnParams(fullUrl.toString(), mapData)
    
    console.log('navigationApi.generateMap 被调用')
    console.log('原始URL:', originalUrl)
    console.log('修改后URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('原始地图生成数据:', mapData)
    console.log('修改后地图生成数据:', data)
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => {
      console.log('生成地图API响应状态:', response.status)
      console.log('生成地图API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('生成地图API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('生成地图API响应数据:', data)
      return data
    }).catch(error => {
      console.error('生成地图API请求失败:', error)
      throw error
    })
  },

  // 获取数据包列表接口
  getDataPackages: (token: string, params: { sn: string, timeout?: number }) => {
    const baseUrl = buildApiUrl('/navigation/data/list')
    const url = new URL(baseUrl)
    
    // 添加参数到URL
    url.searchParams.append('sn', params.sn)
    url.searchParams.append('timeout', (params.timeout || 10).toString())
    
    console.log('navigationApi.getDataPackages 被调用')
    console.log('请求URL:', url.toString())
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('获取数据包参数:', params)
    
    return fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('获取数据包列表API响应状态:', response.status)
      console.log('获取数据包列表API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('获取数据包列表API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('获取数据包列表API响应数据:', data)
      return data
    }).catch(error => {
      console.error('获取数据包列表API请求失败:', error)
      throw error
    })
  },

  // 地图下载接口
  downloadMap: (token: string, params: { sn: string, map_name: string, file: string, timeout?: number }) => {
    const baseUrl = buildApiUrl('/navigation/maps/download')
    const url = new URL(baseUrl)
    
    // 添加参数到URL
    url.searchParams.append('sn', params.sn)
    url.searchParams.append('map_name', params.map_name)
    url.searchParams.append('file', params.file)
    url.searchParams.append('timeout', (params.timeout || 10).toString())
    
    console.log('navigationApi.downloadMap 被调用')
    console.log('请求URL:', url.toString())
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('下载地图参数:', params)
    
    return fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      console.log('下载地图API响应状态:', response.status)
      console.log('下载地图API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('下载地图API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        }).catch(() => {
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      
      // 返回 ArrayBuffer 用于处理二进制文件
      return response.arrayBuffer()
    }).then(buffer => {
      console.log('地图文件下载成功，大小:', buffer.byteLength, 'bytes')
      return buffer
    }).catch(error => {
      console.error('下载地图API请求失败:', error)
      throw error
    })
  },

  // 删除地图接口
  deleteMap: (token: string, params: { sn: string, map_name: string, timeout?: number }) => {
    const baseUrl = buildApiUrl('/navigation/maps/delete')
    const url = new URL(baseUrl)
    
    // 添加参数到URL
    url.searchParams.append('sn', params.sn)
    url.searchParams.append('map_name', params.map_name)
    url.searchParams.append('timeout', (params.timeout || 10).toString())
    
    console.log('navigationApi.deleteMap 被调用')
    console.log('请求URL:', url.toString())
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('删除地图参数:', params)
    
    return fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('删除地图API响应状态:', response.status)
      console.log('删除地图API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('删除地图API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('删除地图API响应数据:', data)
      return data
    }).catch(error => {
      console.error('删除地图API请求失败:', error)
      throw error
    })
  },

  // 展厅同步接口
  syncFromNav: (token: string, params: { sn: string, timeout?: number }) => {
    const baseUrl = buildApiUrl('/halls/sync-from-nav')
    const url = new URL(baseUrl)
    
    // 添加参数到URL
    url.searchParams.append('sn', params.sn)
    url.searchParams.append('timeout', (params.timeout || 10).toString())
    
    console.log('navigationApi.syncFromNav 被调用')
    console.log('请求URL:', url.toString())
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('同步参数:', params)
    
    return fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('展厅同步API响应状态:', response.status)
      console.log('展厅同步API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('展厅同步API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('展厅同步API响应数据:', data)
      return data
    }).catch(error => {
      console.error('展厅同步API请求失败:', error)
      throw error
    })
  },

  // 导航开关接口
  navigationSwitch: (token: string, navData: { sn: string, map_name: string, action: number, data_name: string, timeout?: number }) => {
    const baseUrl = buildApiUrl('/navigation/nav')
    const url = new URL(baseUrl)
    
    // 添加timeout参数到URL，默认值为15
    const timeoutValue = navData.timeout || 15
    url.searchParams.append('timeout', timeoutValue.toString())
    
    // 处理SN参数从body移到URL
    const { url: finalUrl, data } = processSnParams(url.toString(), navData)
    
    console.log('navigationApi.navigationSwitch 被调用')
    console.log('原始URL:', baseUrl)
    console.log('修改后URL:', finalUrl)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('原始导航开关数据:', navData)
    console.log('修改后导航开关数据:', data)
    
    return fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => {
      console.log('导航开关API响应状态:', response.status)
      console.log('导航开关API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('导航开关API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('导航开关API响应数据:', data)
      return data
    }).catch(error => {
      console.error('导航开关API请求失败:', error)
      throw error
    })
  },

  // 暂停/恢复导航接口
  pauseResumeNav: (token: string, navData: { sn: string, action: number, timeout?: number }) => {
    const baseUrl = buildApiUrl('/navigation/nav/pause')
    const url = new URL(baseUrl)
    
    // 添加timeout参数到URL，默认值为10
    const timeoutValue = navData.timeout || 10
    url.searchParams.append('timeout', timeoutValue.toString())
    
    // 处理SN参数从body移到URL
    const { url: finalUrl, data } = processSnParams(url.toString(), navData)
    
    console.log('navigationApi.pauseResumeNav 被调用')
    console.log('原始URL:', baseUrl)
    console.log('修改后URL:', finalUrl)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('导航暂停/恢复数据:', navData)
    console.log('修改后数据:', data)
    
    return fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => {
      console.log('暂停/恢复导航API响应状态:', response.status)
      console.log('暂停/恢复导航API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('暂停/恢复导航API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('暂停/恢复导航API响应数据:', data)
      return data
    }).catch(error => {
      console.error('暂停/恢复导航API请求失败:', error)
      throw error
    })
  },

  // 删除数据包接口
  deleteDataPackage: (token: string, params: { sn: string, data_name: string, timeout?: number }) => {
    const baseUrl = buildApiUrl('/navigation/data/delete')
    const url = new URL(baseUrl)
    
    // 添加参数到URL
    url.searchParams.append('sn', params.sn)
    url.searchParams.append('data_name', params.data_name)
    url.searchParams.append('timeout', (params.timeout || 20).toString())
    
    console.log('navigationApi.deleteDataPackage 被调用')
    console.log('请求URL:', url.toString())
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('删除数据包参数:', params)
    
    return fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('删除数据包API响应状态:', response.status)
      console.log('删除数据包API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('删除数据包API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('删除数据包API响应数据:', data)
      return data
    }).catch(error => {
      console.error('删除数据包API请求失败:', error)
      throw error
    })
  },

  // 设置重定位位姿接口
  setRelopose: (token: string, params: { sn: string, pos_x: number, pos_y: number, theta: number, timeout?: number }) => {
    const baseUrl = buildApiUrl('/navigation/nav/relo')
    const url = new URL(baseUrl)
    
    // 添加timeout参数到URL，默认值为10
    const timeoutValue = params.timeout || 10
    url.searchParams.append('timeout', timeoutValue.toString())
    
    // 处理SN参数从body移到URL
    const { url: finalUrl, data } = processSnParams(url.toString(), params)
    
    console.log('navigationApi.setRelopose 被调用')
    console.log('原始URL:', baseUrl)
    console.log('修改后URL:', finalUrl)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('原始重定位参数:', params)
    console.log('修改后重定位参数:', data)
    
    return fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => {
      console.log('重定位API响应状态:', response.status)
      console.log('重定位API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('重定位API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        }).catch(() => {
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('重定位API响应数据:', data)
      return data
    }).catch(error => {
      console.error('重定位API请求失败:', error)
      throw error
    })
  }
}

// 任务点管理相关接口
export const pointApi = {
  // 获取任务点列表
  getPoints: (token: string, zoneId?: number) => {
    let url = `${API_BASE_URL}/points`
    if (zoneId) {
      url += `?zone_id=${zoneId}`
    }
    
    console.log('pointApi.getPoints 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('展区ID:', zoneId || '全部')
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('任务点API响应状态:', response.status)
      console.log('任务点API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('任务点API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('任务点API响应数据:', data)
      return data
    }).catch(error => {
      console.error('任务点API请求失败:', error)
      throw error
    })
  },

  // 创建新任务点
  createPoint: (token: string, pointData: {
    zone_id: number,
    type: string,
    point_name_id: number,
    custom_name: string,
    is_enabled: boolean,
    pose_x: number,
    pose_y: number,
    pose_theta: number,
    action_code: string,
    action_params: string,
    robot_sn: string
  }) => {
    const url = `${API_BASE_URL}/points`
    
    console.log('pointApi.createPoint 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('任务点数据:', pointData)
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pointData)
    }).then(response => {
      console.log('创建任务点API响应状态:', response.status)
      console.log('创建任务点API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('创建任务点API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('创建任务点API响应数据:', data)
      return data
    }).catch(error => {
      console.error('创建任务点API请求失败:', error)
      throw error
    })
  },

  // 更新任务点
  updatePoint: (token: string, pointId: number, pointData: {
    zone_id?: number,
    type?: string,
    point_name_id?: number,
    custom_name?: string,
    is_enabled?: boolean,
    pose_x?: number,
    pose_y?: number,
    pose_theta?: number,
    action_code?: string,
    action_params?: string,
    robot_sn?: string
  }) => {
    const url = `${API_BASE_URL}/points/${pointId}`
    
    console.log('pointApi.updatePoint 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('任务点ID:', pointId)
    console.log('更新数据:', pointData)
    
    return fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pointData)
    }).then(response => {
      console.log('更新任务点API响应状态:', response.status)
      console.log('更新任务点API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('更新任务点API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      return response.json()
    }).then(data => {
      console.log('更新任务点API响应数据:', data)
      return data
    }).catch(error => {
      console.error('更新任务点API请求失败:', error)
      throw error
    })
  },

  // 删除任务点
  deletePoint: (token: string, pointId: number) => {
    const url = `${API_BASE_URL}/points/${pointId}`
    
    console.log('pointApi.deletePoint 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('任务点ID:', pointId)
    
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('删除任务点API响应状态:', response.status)
      console.log('删除任务点API响应OK:', response.ok)
      
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('删除任务点API错误响应:', errorData)
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      }
      
      // DELETE请求可能返回空响应
      if (response.status === 204) {
        return { success: true }
      }
      
      return response.json()
    }).then(data => {
      console.log('删除任务点API响应数据:', data)
      return data
    }).catch(error => {
      console.error('删除任务点API请求失败:', error)
      throw error
    })
  }
}

// Tours API
export async function getTourRunDetails(token: string, runId: number): Promise<any> {
  const url = buildApiUrl(`/tours/runs/${runId}`)
  
  console.log('getTourRunDetails 被调用')
  console.log('请求URL:', url)
  console.log('请求token:', token ? '存在' : '不存在')
  
  return fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }).then(response => {
    console.log(`获取任务详情 API 响应状态 [${runId}]:`, response.status)
    console.log(`获取任务详情 API 响应OK [${runId}]:`, response.ok)
    
    if (!response.ok) {
      return response.json().then(errorData => {
        console.error(`获取任务详情 API 错误响应 [${runId}]:`, errorData)
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }).catch(parseError => {
        // 如果响应不是JSON格式，使用状态码作为错误信息
        console.error(`获取任务详情 API 解析错误 [${runId}]:`, parseError)
        throw new Error(`HTTP error! status: ${response.status}`)
      })
    }
    
    return response.json()
  }).then(data => {
    console.log(`获取任务详情 API 响应数据 [${runId}]:`, data)
    return data
  }).catch(error => {
    console.error(`获取任务详情 API 请求失败 [${runId}]:`, error)
    throw error
  })
}

export async function getTourRunPoints(token: string, runId: number): Promise<any> {
  const url = buildApiUrl(`/tours/runs/${runId}/points`)
  
  console.log('getTourRunPoints 被调用')
  console.log('请求URL:', url)
  console.log('请求token:', token ? '存在' : '不存在')
  
  return fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }).then(response => {
    console.log(`获取任务运行点位 API 响应状态 [${runId}]:`, response.status)
    console.log(`获取任务运行点位 API 响应OK [${runId}]:`, response.ok)
    
    if (!response.ok) {
      return response.json().then(errorData => {
        console.error(`获取任务运行点位 API 错误响应 [${runId}]:`, errorData)
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }).catch(parseError => {
        // 如果响应不是JSON格式，使用状态码作为错误信息
        console.error(`解析错误响应失败 [${runId}]:`, parseError)
        throw new Error(`HTTP error! status: ${response.status}`)
      })
    }
    return response.json()
  }).then(data => {
    console.log(`获取任务运行点位 API 响应数据 [${runId}]:`, data)
    return data
  }).catch(error => {
    console.error(`获取任务运行点位 API 请求失败 [${runId}]:`, error)
    throw error
  })
}

export async function stopTourRun(token: string, runId: number): Promise<any> {
  const url = buildApiUrl(`/tours/runs/${runId}/stop`)
  
  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }).then(response => {
    console.log(`停止任务运行 API 响应状态 [${runId}]:`, response.status)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }).then(data => {
    console.log(`停止任务运行 API 响应数据 [${runId}]:`, data)
    return data
  }).catch(error => {
    console.error(`停止任务运行 API 请求失败 [${runId}]:`, error)
    throw error
  })
}

// 获取机器人动作列表
export async function getRobotActions(token: string): Promise<any> {
  const url = buildApiUrl('/actions/arm')
  
  console.log('getRobotActions 被调用')
  console.log('请求URL:', url)
  console.log('请求token:', token ? '存在' : '不存在')
  
  return fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }).then(response => {
    console.log('获取机器人动作列表 API 响应状态:', response.status)
    console.log('获取机器人动作列表 API 响应OK:', response.ok)
    
    if (!response.ok) {
      return response.json().then(errorData => {
        console.error('获取机器人动作列表 API 错误响应:', errorData)
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }).catch(parseError => {
        // 如果响应不是JSON格式，使用状态码作为错误信息
        console.error('解析错误响应失败:', parseError)
        throw new Error(`HTTP error! status: ${response.status}`)
      })
    }
    return response.json()
  }).then(data => {
    console.log('获取机器人动作列表 API 响应数据:', data)
    return data
  }).catch(error => {
    console.error('获取机器人动作列表 API 请求失败:', error)
    throw error
  })
}

// 其他API接口已移除，等待重新对接

// 兼容性占位：旧版 API 名称，避免构建期引用错误
// 这些仅为占位，返回 rejected Promise 或简单的 no-op，以便逐步替换为新接口
export const dockApi = undefined as unknown as Record<string, any>
export const droneApi = undefined as unknown as Record<string, any>
export const missionApi = undefined as unknown as Record<string, any>
export const missionRecordApi = undefined as unknown as Record<string, any>
export const alertApi = undefined as unknown as Record<string, any>
export const roleApi = undefined as unknown as Record<string, any>
export const deviceApi = undefined as unknown as Record<string, any>
export const controlApi = undefined as unknown as Record<string, any>
export const drcApi = undefined as unknown as Record<string, any>
export const waylineApi = undefined as unknown as Record<string, any>
export const livestreamApi = undefined as unknown as Record<string, any>
