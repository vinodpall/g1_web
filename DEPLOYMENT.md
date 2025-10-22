# 生产环境部署说明

## 配置概述

本项目已配置为支持**同域部署**（域内访问），前端和后端API部署在同一个工控机上时，会自动使用相对路径和当前域名进行访问。

## 配置说明

### 生产环境（打包后部署）

在生产环境中，系统会自动使用**当前访问域名**作为所有服务的基础地址，无需手动配置IP地址。

**自动配置项：**

1. **API接口**
   - 使用相对路径：`/api/v1`
   - 实际访问地址：`http://你的域名/api/v1`

2. **WebSocket连接**
   - 自动使用当前域名和协议
   - HTTP访问时使用：`ws://你的域名`
   - HTTPS访问时使用：`wss://你的域名`

3. **视频流服务**
   - WebRTC：`webrtc://你的域名`
   - RTMP：`rtmp://你的域名`

4. **其他服务**
   - Vision服务：`http://你的域名`
   - Livestream服务：`http://你的域名`

### 开发环境

开发环境仍然使用 `env.config.js` 或 `.env` 文件中配置的环境类型（内网/外网）。

- **内网环境**：使用 `172.16.8.233:8000`
- **外网环境**：使用 `10.10.1.40:8000`

## 部署步骤

### 1. 构建生产版本

```bash
npm run build
```

### 2. 部署到工控机

将 `dist` 目录下的所有文件部署到工控机的Web服务器（如Nginx）。

### 3. Nginx配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 或者使用IP地址
    
    # 前端静态文件
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://127.0.0.1:8000;  # 后端API地址
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket代理
    location /ws {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. 验证部署

访问你的工控机地址（如 `http://192.168.1.100` 或 `http://your-domain.com`），系统会自动：

- API请求发送到：`http://192.168.1.100/api/v1`
- WebSocket连接到：`ws://192.168.1.100`
- 所有服务使用同一域名

## 优势

✅ **自动适配**：无论部署到哪个IP地址或域名，都能自动使用正确的配置  
✅ **同域访问**：前后端在同一域下，避免跨域问题  
✅ **简化部署**：无需修改配置文件，直接部署即可  
✅ **支持HTTPS**：自动检测协议，HTTP/HTTPS均可  

## 技术实现

修改文件：`src/config/environment.ts`

在生产环境中，`getCurrentConfig()` 函数会动态检测当前访问地址：

```typescript
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
    // ... 其他服务配置
  }
}
```

## 常见问题

### Q: 如何确认配置是否正确？

打开浏览器控制台，查看启动日志：

```
🔧 API客户端配置:
- 环境: 生产环境
- API_BASE_URL: /api/v1
- API_DOMAIN: http://你的域名
- 当前域名: http://你的域名
```

### Q: WebSocket连接失败？

1. 检查后端WebSocket服务是否启动
2. 检查Nginx是否正确配置了WebSocket代理
3. 查看浏览器控制台的WebSocket连接地址是否正确

### Q: API请求404？

1. 确认Nginx的 `/api/` location 配置正确
2. 确认后端API服务正在运行在配置的端口上
3. 检查 `proxy_pass` 地址是否正确

## 联系支持

如有问题，请联系技术支持。
