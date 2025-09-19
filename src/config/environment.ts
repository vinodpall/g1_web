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
    host: '172.16.100.100',
    port: 8000,
    fullUrl: 'ws://172.16.100.100:8000'
  },
  video: {
    webrtcDomain: 'webrtc://172.16.100.100:8000',
    rtmpDomain: 'rtmp://172.16.100.100:8000'
  },
  services: {
    vision: 'http://172.16.100.100:8000',
    livestream: 'http://172.16.100.100:8000'
  }
}

// 外网环境配置
const internetConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'http://10.10.1.3:8000/api/v1',
    domain: 'http://10.10.1.3:8000/api/v1'
  },
  websocket: {
    host: '10.10.1.3',
    port: 8000,
    fullUrl: 'ws://10.10.1.3:8000'
  },
  video: {
    webrtcDomain: 'webrtc://10.10.1.3:8000',
    rtmpDomain: 'rtmp://10.10.1.3:8000'
  },
  services: {
    vision: 'http://10.10.1.3:8000',
    livestream: 'http://10.10.1.3:8000'
  }
}

// 获取当前环境类型
export function getCurrentEnvironment(): Environment {
  // 优先使用构建时注入的常量，其次使用 Vite 环境变量
  let envFromDefine: string | undefined
  try {
    // __APP_ENVIRONMENT__ 由 vite.config.ts 的 define 注入
    // @ts-ignore
    envFromDefine = typeof __APP_ENVIRONMENT__ !== 'undefined' ? __APP_ENVIRONMENT__ : undefined
  } catch (_err) {
    envFromDefine = undefined
  }

  const envFromVar = (import.meta.env && (import.meta.env as any).VITE_APP_ENVIRONMENT) as string | undefined
  const resolved = envFromDefine || envFromVar || Environment.INTRANET

  console.log('🔧 环境检测:')
  console.log('- __APP_ENVIRONMENT__:', envFromDefine)
  console.log('- VITE_APP_ENVIRONMENT:', envFromVar)
  console.log('- 最终环境:', resolved)

  if (resolved === Environment.INTERNET) return Environment.INTERNET
  return Environment.INTRANET
}

// 获取当前环境配置
export function getCurrentConfig(): EnvironmentConfig {
  const currentEnv = getCurrentEnvironment()
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