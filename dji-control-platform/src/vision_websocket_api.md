# 视觉数据WebSocket API文档

## 概述

视觉数据WebSocket提供实时推送算法检测结果、设备属性等数据，用于前端WebRTC视频流叠加显示检测框和设备信息。

## WebSocket接口

### 1. 视觉数据流WebSocket

**端点**: `ws://[host]/api/v1/vision-stream/devices/{device_sn}/vision/stream`

**连接流程**:
1. 建立WebSocket连接
2. 发送认证消息
3. 接收实时视觉数据推送

### 2. 控制模块WebSocket (用于接收报警事件)

**端点**: `ws://[host]/api/v1/control/devices/{device_sn}/control/ws`

此接口会接收视觉报警事件推送。

## 消息协议

### 客户端消息

#### 1. 认证消息 (必需)
```json
{
    "type": "auth",
    "token": "your_jwt_token"
}
```

#### 2. 心跳消息
```json
{
    "type": "ping"
}
```

#### 3. 配置更新
```json
{
    "type": "config",
    "data": {
        "push_interval": 100  // 推送间隔(毫秒), 范围: 50-1000
    }
}
```

#### 4. 订阅算法
```json
{
    "type": "subscribe",
    "algorithms": [49, 50, 51]  // 算法ID列表
}
```

### 服务端消息

#### 1. 连接成功
```json
{
    "type": "connected",
    "device_sn": "device_001",
    "timestamp": 1709123456789
}
```

#### 2. 视觉数据推送（包含所有算法原始数据）
```json
{
    "type": "vision_data",
    "device_sn": "device_001",
    "timestamp": 1709123456789,
    "data": {
        "frame_number": 12345,
        "frame_time": 1709123456.123,
        "results": {
            "49": {  // 算法ID
                "algorithm_id": "49",
                "active": true,           // bState状态
                "state": true,            // 同bState
                "detections": [
                    {
                        "bbox": {
                            "x": 0.1,        // 归一化坐标 (0-1)
                            "y": 0.2,        // 归一化坐标 (0-1)
                            "width": 0.15,   // 归一化宽度 (0-1)
                            "height": 0.2    // 归一化高度 (0-1)
                        },
                        "confidence": 0.95,
                        "label": "person",
                        "raw_rect": [0.1, 0.2, 0.15, 0.2, 0.95]  // 原始rect数据
                    }
                ],
                "raw_data": {  // 完整的原始算法数据
                    "bState": true,
                    "lResults": {
                        "rect": [[0.1, 0.2, 0.15, 0.2, 0.95]],
                        "text": [["person"]]
                    }
                }
            },
            "50": {  // 即使bState=false也会推送
                "algorithm_id": "50",
                "active": false,
                "state": false,
                "detections": [],
                "raw_data": {
                    "bState": false,
                    "lResults": null
                }
            }
        },
        "raw_results": {  // 所有算法的原始Result数据
            "49": {
                "bState": true,
                "lResults": {
                    "rect": [[0.1, 0.2, 0.15, 0.2, 0.95]],
                    "text": [["person"]]
                }
            },
            "50": {
                "bState": false,
                "lResults": null
            }
        },
        "device_properties": {
            "position": {
                "latitude": 39.123456,
                "longitude": 116.123456,
                "height": 100.5
            },
            "attitude": {
                "pitch": 0,
                "roll": 0,
                "yaw": 180
            },
            "gimbal": {
                "pitch": -45,
                "roll": 0,
                "yaw": 0
            },
            "battery": 85,
            "velocity": {
                "x": 0,
                "y": 0,
                "z": 0
            }
        }
    }
}
```

#### 3. 视觉报警事件 (通过control WebSocket)
```json
{
    "type": "vision_alert",
    "device_sn": "device_001",
    "timestamp": 1709123456789,
    "cam_key": "cam_rtsp_device_001",
    "frame_number": 12345,
    "detections": [
        {
            "algorithm_id": "49",
            "algorithm_type": 49,
            "target_count": 2,
            "max_confidence": 0.95,
            "targets": [...]
        }
    ],
    "alert_type": "detection",
    "source": "vision_ai"
}
```

#### 4. 心跳响应
```json
{
    "type": "pong",
    "timestamp": 1709123456789
}
```

#### 5. 错误消息
```json
{
    "type": "error",
    "message": "错误描述"
}
```

## 使用示例

### JavaScript客户端示例

```javascript
class VisionStreamClient {
    constructor(deviceSn, token) {
        this.deviceSn = deviceSn;
        this.token = token;
        this.ws = null;
    }

    connect() {
        const wsUrl = `ws://localhost:8000/api/v1/vision-stream/devices/${this.deviceSn}/vision/stream`;
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            // 发送认证消息
            this.ws.send(JSON.stringify({
                type: 'auth',
                token: this.token
            }));
        };
        
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            switch(message.type) {
                case 'connected':
                    console.log('认证成功');
                    // 配置推送间隔
                    this.configurePushInterval(100);
                    break;
                    
                case 'vision_data':
                    this.handleVisionData(message.data);
                    break;
                    
                case 'heartbeat':
                    // 响应心跳
                    this.ws.send(JSON.stringify({ type: 'ping' }));
                    break;
                    
                case 'error':
                    console.error('错误:', message.message);
                    break;
            }
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket错误:', error);
        };
        
        this.ws.onclose = () => {
            console.log('WebSocket断开');
            // 可以实现重连逻辑
        };
    }
    
    configurePushInterval(intervalMs) {
        this.ws.send(JSON.stringify({
            type: 'config',
            data: {
                push_interval: intervalMs
            }
        }));
    }
    
    subscribeAlgorithms(algorithmIds) {
        this.ws.send(JSON.stringify({
            type: 'subscribe',
            algorithms: algorithmIds
        }));
    }
    
    handleVisionData(data) {
        // 处理视觉数据
        console.log('收到视觉数据:', data);
        
        // 处理所有算法数据（包括未激活的）
        for (const [algId, result] of Object.entries(data.results)) {
            console.log(`算法 ${algId}: 状态=${result.active}, 检测数=${result.detections.length}`);
            
            // 访问原始数据
            if (result.raw_data) {
                console.log(`算法 ${algId} 原始数据:`, result.raw_data);
            }
            
            // 绘制检测框（即使bState=false也可能有历史框）
            if (result.detections && result.detections.length > 0) {
                for (const detection of result.detections) {
                    // 使用原始rect数据获取更多信息
                    if (detection.raw_rect) {
                        console.log('原始检测框数据:', detection.raw_rect);
                    }
                    
                    // 根据算法状态选择不同的绘制样式
                    const style = result.active ? 'solid' : 'dashed';
                    this.drawBoundingBox(detection.bbox, detection.label, detection.confidence, style);
                }
            }
        }
        
        // 访问所有算法的原始结果
        if (data.raw_results) {
            console.log('所有算法原始结果:', data.raw_results);
            // 可以用于调试或特殊处理
        }
        
        // 更新设备属性显示
        if (data.device_properties) {
            this.updateDeviceProperties(data.device_properties);
        }
    }
    
    drawBoundingBox(bbox, label, confidence, style = 'solid') {
        // 将归一化坐标转换为视频画布坐标
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        const x = bbox.x * videoWidth;
        const y = bbox.y * videoHeight;
        const width = bbox.width * videoWidth;
        const height = bbox.height * videoHeight;
        
        // 在canvas上绘制检测框
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = confidence > 0.8 ? '#00ff00' : '#ffff00';
        ctx.lineWidth = 2;
        
        // 设置线条样式
        if (style === 'dashed') {
            ctx.setLineDash([5, 5]);
        } else {
            ctx.setLineDash([]);
        }
        
        ctx.strokeRect(x, y, width, height);
        
        // 绘制标签
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x, y - 20, 100, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.fillText(`${label} ${(confidence * 100).toFixed(1)}%`, x + 2, y - 5);
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// 使用示例
const client = new VisionStreamClient('device_001', 'your_jwt_token');
client.connect();
```

## 注意事项

1. **坐标系统**: 所有检测框坐标都是归一化的(0-1)，需要根据实际视频分辨率进行转换。

2. **推送频率**: 默认100ms(10Hz)，可通过config消息调整，范围50-1000ms。

3. **认证**: 必须在连接后立即发送认证消息，否则连接会被关闭。

4. **心跳**: 服务端每30秒发送一次心跳，客户端应响应以保持连接。

5. **资源管理**: 当没有客户端连接时，服务端会自动停止该设备的Redis数据监控。

6. **错误处理**: 建议实现自动重连机制处理网络异常。