# 智能灯杆检测平台

基于 Vue 3 + TypeScript + Vite 构建的智能灯杆检测平台，集成无人机控制和监控功能。

## 项目架构

### 技术栈
- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI组件**: Bootstrap 5
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP客户端**: Fetch API

### 项目结构
```
dji-control-platform/
├── src/
│   ├── api/           # API接口定义
│   ├── components/    # Vue组件
│   ├── composables/   # 组合式函数
│   ├── directives/    # 自定义指令
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── types/         # TypeScript类型定义
│   ├── utils/         # 工具函数
│   ├── views/         # 页面组件
│   └── assets/        # 静态资源
├── public/            # 公共资源
└── api_test_page.html # API测试页面（重要参考文档）
```

## API参考文档

### 重要说明
项目根目录下的 `api_test_page.html` 是完整的后台API测试页面，包含了所有无人机控制API的调用逻辑、参数格式和错误处理方式。当需要在Vue项目中使用相关API时，请参考此文件中的实现。

### 主要API模块
1. **设备管理API** - 设备列表、状态查询
2. **直播推流API** - RTMP/WebRTC直播控制
3. **相机控制API** - 拍照、录像、云台控制
4. **DRC控制API** - 无人机飞行控制
5. **航线任务API** - 航线文件上传、任务创建执行
6. **媒体管理API** - 文件上传下载、存储管理
7. **HMS健康监控API** - 设备健康状态监控
8. **权限控制API** - 飞行控制权管理

### API调用模式
所有API调用都遵循以下模式：
```javascript
// 基础请求函数
async function apiRequest(endpoint, method = 'GET', data = null) {
    const apiUrl = 'http://your-api-server:8000';
    const token = 'your-auth-token';
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    const config = { method, headers };
    if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${apiUrl}${endpoint}`, config);
    return await response.json();
}
```

## 开发指南

### 环境要求
- Node.js >= 16
- npm >= 8

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 功能模块

### 1. 设备管理
- 设备列表查询
- 设备状态监控
- 设备类型管理

### 2. 直播控制
- 多协议推流（RTMP/WebRTC）
- 实时清晰度切换
- 镜头类型切换
- 视频播放器集成

### 3. 相机控制
- 拍照/录像控制
- 云台方向控制
- 精确角度设置
- Look At坐标控制

### 4. 飞行控制
- DRC模式控制
- 杆量控制
- 简化飞行控制
- 紧急停止

### 5. 航线任务
- 航线文件上传
- 任务创建执行
- 实时状态监控
- 媒体文件管理

### 6. 健康监控
- HMS告警监控
- 环境数据监控
- 实时状态显示

## 注意事项

1. **API认证**: 所有API调用需要有效的认证Token
2. **错误处理**: 参考测试页面中的错误处理逻辑
3. **实时数据**: 使用WebSocket连接获取实时状态数据
4. **权限控制**: 飞行控制需要先获取相应权限
5. **设备兼容性**: 不同设备类型支持的功能可能不同

## 更新日志

### 2024-01-XX
- 初始化项目架构
- 集成API测试页面作为参考文档
- 建立基础开发环境

---

**重要提醒**: 在开发过程中，请始终参考 `api_test_page.html` 中的API调用逻辑，确保与后台API的正确对接。
