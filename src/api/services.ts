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
        return response.json().then(errorData => {
          console.error('点位名称API错误响应:', errorData)
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
        return response.json().then(errorData => {
          console.error('创建点位名称API错误响应:', errorData)
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
        return response.json().then(errorData => {
          console.error('讲解对象API错误响应:', errorData)
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
        return response.json().then(errorData => {
          console.error('创建讲解对象API错误响应:', errorData)
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
        return response.json().then(errorData => {
          console.error('讲解词API错误响应:', errorData)
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
        return response.json().then(errorData => {
          console.error('创建讲解词API错误响应:', errorData)
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
        return response.json().then(errorData => {
          console.error('更新讲解词API错误响应:', errorData)
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
        return response.json().then(errorData => {
          console.error('删除讲解词API错误响应:', errorData)
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
        return response.json().then(errorData => {
          console.error('展厅API错误响应:', errorData)
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
        return response.json().then(errorData => {
          console.error('展区API错误响应:', errorData)
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
        return response.json().then(errorData => {
          console.error('创建展区API错误响应:', errorData)
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
        return response.json().then(errorData => {
          console.error('删除展区API错误响应:', errorData)
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
  }
}

// 导航SLAM相关接口
export const navigationApi = {
  // 展厅地图录制接口
  slamControl: (token: string, slamData: { sn: string, map_name: string, action: number, data_name: string }) => {
    const url = `${API_BASE_URL}/navigation/recording`
    
    console.log('navigationApi.slamControl 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('SLAM数据:', slamData)
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(slamData)
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
  generateMap: (token: string, mapData: { sn: string, map_name: string, action: number, data_name: string }) => {
    const url = `${API_BASE_URL}/navigation/slam`
    
    console.log('navigationApi.generateMap 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    console.log('地图生成数据:', mapData)
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mapData)
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
  getDataPackages: (token: string) => {
    const url = `${API_BASE_URL}/v1/navigation/data/list`
    
    console.log('navigationApi.getDataPackages 被调用')
    console.log('请求URL:', url)
    console.log('请求token:', token ? '存在' : '不存在')
    
    return fetch(url, {
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

// 其他API接口已移除，等待重新对接