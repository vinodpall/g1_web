# 环境配置说明

本项目支持内网和外网环境的动态切换，通过统一的配置文件管理所有API和视频流地址。

## 配置文件结构

### 主要配置文件
- `src/config/environment.ts` - 环境配置主文件
- `src/api/config.ts` - API配置（已更新为使用环境配置）
- `src/config/vision.ts` - WebSocket配置（已更新为使用环境配置）



## 环境类型

### 内网环境 (intranet)
- API域名: `http://192.168.111.49:8000`
- WebSocket: `ws://192.168.111.49:8000`
- WebRTC: `webrtc://192.168.111.49:8000`
- RTMP: `rtmp://192.168.111.49:8000`

### 外网环境 (internet)
- API域名: `http://10.10.1.3:8000`
- WebSocket: `ws://10.10.1.3:8000`
- WebRTC: `webrtc://10.10.1.3:8000`
- RTMP: `rtmp://10.10.1.3:8000`

## 使用方法

### 1. 环境变量配置
在项目根目录创建 `.env` 文件：
```bash
# 设置默认环境
VITE_APP_ENVIRONMENT=intranet
```

### 2. 环境配置方式
通过修改 `.env` 文件中的 `VITE_APP_ENVIRONMENT` 变量来切换环境。

### 3. 代码中使用配置
```typescript
import { config, getCurrentEnvironment, setEnvironment } from '../config/environment'

// 获取当前配置
const apiDomain = config.api.domain
const wsUrl = config.websocket.fullUrl
const webrtcDomain = config.video.webrtcDomain

// 获取当前环境类型
const env = getCurrentEnvironment()

// 切换环境
setEnvironment('internet')
```



## 配置项说明

### API配置
```typescript
api: {
  baseUrl: string    // API基础路径
  domain: string     // API域名
}
```

### WebSocket配置
```typescript
websocket: {
  host: string       // WebSocket主机
  port: number       // WebSocket端口
  fullUrl: string    // 完整WebSocket URL
}
```

### 视频流配置
```typescript
video: {
  webrtcDomain: string  // WebRTC域名
  rtmpDomain: string    // RTMP域名
}
```

### 服务配置
```typescript
services: {
  vision: string      // 视觉服务地址
  livestream: string  // 直播流服务地址
}
```

## 外网环境配置

当前外网环境已配置为 `10.10.1.3:8000`，如需修改：

1. 修改 `src/config/environment.ts` 中的 `internetConfig`：
```typescript
const internetConfig: EnvironmentConfig = {
  api: {
    baseUrl: '/api/v1',
    domain: 'http://your-actual-domain.com'  // 替换为实际域名
  },
  // ... 其他配置
}
```

2. 确保外网服务器支持HTTP和WS协议

3. 配置正确的CORS策略

## 调试功能

在开发环境下，可以使用以下函数查看当前配置：
```typescript
import { logEnvironmentConfig } from '../config/environment'

// 在控制台打印当前配置
logEnvironmentConfig()
```

## 注意事项

1. **环境切换后需要重新加载**：某些功能（如WebSocket连接、视频流）在环境切换后可能需要重新初始化。

2. **外网环境配置**：使用外网环境前，请确保：
   - 服务器支持HTTP/WS
   - 域名已正确配置
   - CORS策略允许跨域请求

3. **环境配置**：通过 `.env` 文件中的 `VITE_APP_ENVIRONMENT` 变量设置环境，重启开发服务器后生效。

## 扩展配置

如需添加新的配置项，可以：

1. 在 `EnvironmentConfig` 接口中添加新字段
2. 在 `intranetConfig` 和 `internetConfig` 中添加对应配置
3. 在相关组件中使用新配置

```typescript
// 示例：添加新的服务配置
interface EnvironmentConfig {
  // ... 现有配置
  newService: {
    url: string
    apiKey: string
  }
}
``` 