# 环境配置设置说明

## 问题描述
之前视频总是访问内网地址，不管环境变量如何设置，这是因为：
1. 缺少 `.env` 文件（被全局忽略）
2. `vite.config.ts` 中硬编码了代理地址
3. 环境配置没有在应用启动时被验证

## 解决方案

### 方法1：使用 npm 脚本（推荐）
```bash
# 启动内网环境
npm run dev:intranet

# 启动外网环境  
npm run dev:internet

# 构建内网版本
npm run build:intranet

# 构建外网版本
npm run build:internet
```

### 方法2：手动设置环境变量
```bash
# Windows PowerShell
$env:VITE_APP_ENVIRONMENT="internet"; npm run dev

# Windows CMD
set VITE_APP_ENVIRONMENT=internet && npm run dev

# Linux/Mac
export VITE_APP_ENVIRONMENT=internet && npm run dev
```

### 方法3：创建 .env.local 文件
在项目根目录创建 `.env.local` 文件（不会被git忽略）：
```bash
VITE_APP_ENVIRONMENT=internet
```

## 环境配置验证

启动应用后，浏览器控制台会显示：
```
🔧 Vite配置 - 当前环境: internet
🔧 Vite配置 - 使用外网代理: http://10.10.1.3:8000
🔧 当前环境配置:
- 环境类型: internet
- API域名: http://10.10.1.3:8000
- WebSocket地址: ws://10.10.1.3:8000
- WebRTC域名: webrtc://10.10.1.3:8000
- 环境变量 VITE_APP_ENVIRONMENT: internet
```

## 配置项说明

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

## 注意事项

1. **重启开发服务器**：修改环境变量后需要重启开发服务器
2. **清除缓存**：如果仍有问题，清除浏览器缓存和localStorage
3. **检查网络**：确保目标服务器可以访问
4. **端口配置**：确保服务器端口配置正确

## 故障排除

### 问题：环境变量不生效
- 检查是否使用了正确的启动命令
- 确认环境变量名称正确（VITE_APP_ENVIRONMENT）
- 重启开发服务器

### 问题：视频仍使用内网地址
- 检查浏览器控制台的环境配置输出
- 确认 `config.video.webrtcDomain` 是否正确
- 清除localStorage中的视频流缓存

### 问题：API请求失败
- 检查vite代理配置是否正确
- 确认目标服务器是否可访问
- 检查网络连接和防火墙设置 