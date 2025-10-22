// 环境配置文件
// 支持内网/外网环境切换

// 环境类型常量
export const Environment = {
  INTRANET: 'intranet',  // 内网环境
  INTERNET: 'internet'   // 外网环境
} as const

export type Environment = typeof Environment[keyof typeof Environment]

// 环境配置接口
export interface EnvironmentConfig {
  // API配置
  api: {
    baseUrl: string
    domain: string
  }
  
  // WebSocket配置
  websocket: {
    host: string
    port: number
    fullUrl: string
  }
  
  // 视频流配置
  video: {
    webrtcDomain: string
    rtmpDomain: string
  }
  
  // 其他服务配置
  services: {
    vision: string
    livestream: string
  }
}

// 内网环境配置
const intranetConfig: EnvironmentConfig = {
  api: {
    baseUrl: '/api/v1',
    domain: '/api/v1' // 同域部署，使用相对路径
  },
  websocket: {
    host: '172.16.8.233',
    port: 8000,
    fullUrl: 'ws://172.16.8.233:8000'
  },
  video: {
    webrtcDomain: 'webrtc://172.16.8.233:8000',
    rtmpDomain: 'rtmp://172.16.8.233:8000'
  },
  services: {
    vision: 'http://172.16.8.233:8000',
    livestream: 'http://172.16.8.233:8000'
  }
}

// 外网环境配置
const internetConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'http://10.10.1.40:8000/api/v1',
    domain: 'http://10.10.1.40:8000/api/v1'
  },
  websocket: {
    host: '10.10.1.40',
    port: 8000,
    fullUrl: 'ws://10.10.1.40:8000'
  },
  video: {
    webrtcDomain: 'webrtc://10.10.1.40:8000',
    rtmpDomain: 'rtmp://10.10.1.40:8000'
  },
  services: {
    vision: 'http://10.10.1.40:8000',
    livestream: 'http://10.10.1.40:8000'
  }
}

// 获取当前环境类型
export function getCurrentEnvironment(): Environment {
  const isProd = import.meta.env.PROD
  const envFromVar = (import.meta.env && (import.meta.env as any).VITE_APP_ENVIRONMENT) as string | undefined
  
  // 生产环境（打包后）：优先使用运行时动态检测，支持根据访问地址自动切换
  if (isProd && typeof window !== 'undefined') {
    const hostname = window.location.hostname
    
    // 判断逻辑：
    // 1. 如果访问的是 172.16.x.x 或 localhost，使用内网配置
    // 2. 如果访问的是 10.10.x.x 或其他地址，使用外网配置
    
    const isIntranet = 
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('192.168.')
    
    const detectedEnv = isIntranet ? Environment.INTRANET : Environment.INTERNET
    
    console.log('🔧 环境检测 (生产环境-自动检测):')
    console.log('- 访问 hostname:', hostname)
    console.log('- 检测为:', detectedEnv === Environment.INTRANET ? '内网' : '外网')
    console.log('- WebSocket 地址:', detectedEnv === Environment.INTRANET ? 'ws://172.16.8.233:8000' : 'ws://10.10.1.40:8000')
    
    return detectedEnv
  }
  
  // 开发环境：优先使用环境变量配置，方便手动切换
  if (envFromVar) {
    console.log('🔧 环境检测 (开发环境-环境变量):')
    console.log('- VITE_APP_ENVIRONMENT:', envFromVar)
    console.log('- 使用环境:', envFromVar === Environment.INTERNET ? '外网' : '内网')
    console.log('- WebSocket 地址:', envFromVar === Environment.INTERNET ? 'ws://10.10.1.40:8000' : 'ws://172.16.8.233:8000')
    return envFromVar === Environment.INTERNET ? Environment.INTERNET : Environment.INTRANET
  }
  
  // 开发环境但没有环境变量：使用运行时动态检测
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    
    const isIntranet = 
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('192.168.')
    
    const detectedEnv = isIntranet ? Environment.INTRANET : Environment.INTERNET
    
    console.log('🔧 环境检测 (开发环境-hostname):')
    console.log('- 访问 hostname:', hostname)
    console.log('- 检测为:', detectedEnv === Environment.INTRANET ? '内网' : '外网')
    console.log('- WebSocket 地址:', detectedEnv === Environment.INTRANET ? 'ws://172.16.8.233:8000' : 'ws://10.10.1.40:8000')
    
    return detectedEnv
  }
  
  // 构建时或 SSR 环境：使用构建时配置作为后备
  let envFromDefine: string | undefined
  try {
    // __APP_ENVIRONMENT__ 由 vite.config.ts 的 define 注入
    // @ts-ignore
    envFromDefine = typeof __APP_ENVIRONMENT__ !== 'undefined' ? __APP_ENVIRONMENT__ : undefined
  } catch (_err) {
    envFromDefine = undefined
  }

  const resolved = envFromDefine || Environment.INTRANET

  console.log('🔧 环境检测 (构建时后备):')
  console.log('- __APP_ENVIRONMENT__:', envFromDefine)
  console.log('- 最终环境:', resolved)

  if (resolved === Environment.INTERNET) return Environment.INTERNET
  return Environment.INTRANET
}

// 获取当前环境配置
export function getCurrentConfig(): EnvironmentConfig {
  const currentEnv = getCurrentEnvironment()
  const isProd = import.meta.env.PROD
  
  // 生产环境使用动态域名配置（同域部署）
  if (isProd && typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host // 包含端口号
    const origin = window.location.origin
    
    return {
      api: {
        baseUrl: '/api/v1',
        domain: origin
      },
      websocket: {
        host: window.location.hostname,
        port: parseInt(window.location.port) || (window.location.protocol === 'https:' ? 443 : 80),
        fullUrl: `${protocol}//${host}`
      },
      video: {
        webrtcDomain: `webrtc://${host}`,
        rtmpDomain: `rtmp://${host}`
      },
      services: {
        vision: origin,
        livestream: origin
      }
    }
  }
  
  // 开发环境根据环境类型选择配置
  return currentEnv === Environment.INTRANET ? intranetConfig : internetConfig
}

// 设置环境类型（通过环境变量）
export function setEnvironment(env: Environment): void {
  console.log(`当前环境: ${env}`)
  console.log('如需切换环境，请修改 .env 文件中的 VITE_APP_ENVIRONMENT 变量')
}

// 导出当前配置的便捷访问
export const config = getCurrentConfig()

// 导出环境类型
export const currentEnvironment = getCurrentEnvironment()

// 强制刷新环境配置（用于登录时确保配置正确）
export function refreshEnvironmentConfig(): EnvironmentConfig {
  console.log('🔄 强制刷新环境配置...')
  console.log('- 环境变量 VITE_APP_ENVIRONMENT:', import.meta.env.VITE_APP_ENVIRONMENT)
  
  // 重新获取配置
  const newConfig = getCurrentConfig()
  
  console.log('🔄 刷新后的配置:')
  console.log('- 环境类型:', getCurrentEnvironment())
  console.log('- API域名:', newConfig.api.domain)
  console.log('- WebRTC域名:', newConfig.video.webrtcDomain)
  
  return newConfig
}

// 调试函数
export function logEnvironmentConfig(): void {
  console.log('🔧 当前环境配置:')
  console.log('- 环境类型:', currentEnvironment)
  console.log('- API域名:', config.api.domain)
  console.log('- WebSocket地址:', config.websocket.fullUrl)
  console.log('- WebRTC域名:', config.video.webrtcDomain)
  console.log('- 生产环境:', import.meta.env.PROD ? '是' : '否')
  console.log('- 当前域名:', typeof window !== 'undefined' ? window.location.origin : 'N/A')
  try {
    // @ts-ignore
    console.log('- 构建常量 __APP_ENVIRONMENT__:', typeof __APP_ENVIRONMENT__ !== 'undefined' ? __APP_ENVIRONMENT__ : 'undefined')
  } catch (_) {}
  console.log('- 环境变量 VITE_APP_ENVIRONMENT:', import.meta.env.VITE_APP_ENVIRONMENT)
}

// 导出所有配置供外部使用
export {
  intranetConfig,
  internetConfig
} 