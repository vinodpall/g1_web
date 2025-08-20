# 视频缓存系统重构说明

## 🎯 重构目标

统一视频相关的缓存管理，消除重复的缓存字段，使用单一的 `video_streams` 缓存来管理所有视频流信息。

## 🔄 重构内容

### 1. 清理的重复缓存字段

以下字段已被清理，不再使用：
- `video_stream_url` - 与 `video_streams` 中的URL重复
- `drone_video_stream_url` - 与 `video_streams` 中的无人机URL重复
- `dock_video_stream_url` - 与 `video_streams` 中的机场URL重复
- `current_video_type` - 与 `video_streams` 中的类型信息重复

### 2. 保留的核心缓存字段

- **`video_streams`** - 主要的视频流信息缓存（数组格式）
- **`default_video_type`** - 默认视频类型（用于页面初始化）
- **`video_cache`** - 视频能力信息缓存
- **`cached_dock_sns`** - 缓存的机场SN列表
- **`cached_drone_sns`** - 缓存的无人机SN列表

### 3. 新的缓存结构

```typescript
// video_streams 缓存结构
[
  {
    type: 'dock',                    // 视频类型：机场
    url: 'webrtc://server/live/dock_stream',
    switchable_video_types: ['normal'],
    device_sn: 'DOCK_SN_001',
    camera_index: '0',
    video_index: '0',
    ai_enabled: false
  },
  {
    type: 'drone_visible',           // 视频类型：无人机可见光
    url: 'webrtc://server/live/drone_visible',
    switchable_video_types: ['wide', 'zoom'],
    device_sn: 'DRONE_SN_001',
    camera_index: '0',
    video_index: '0',
    ai_enabled: false
  },
  {
    type: 'drone_infrared',          // 视频类型：无人机红外
    url: 'webrtc://server/live/drone_infrared',
    switchable_video_types: ['ir'],
    device_sn: 'DRONE_SN_001',
    camera_index: '1',
    video_index: '0'
  }
]
```

## 🛠️ 新增工具函数

创建了 `src/utils/videoCache.ts` 文件，提供统一的缓存管理接口：

### 主要函数

- `getVideoStreams()` - 获取所有视频流信息
- `getVideoStream(type)` - 获取指定类型的视频流
- `getVideoStreamUrl(type)` - 获取指定类型的视频流URL
- `updateVideoStream(type, updates)` - 更新指定类型的视频流
- `getDefaultVideoType()` - 获取默认视频类型
- `setDefaultVideoType(type)` - 设置默认视频类型
- `cleanupOldVideoCache()` - 清理旧的重复缓存字段

## 📝 使用示例

### 获取机场视频流
```typescript
import { getVideoStream } from '@/utils/videoCache'

const dockStream = getVideoStream('dock')
if (dockStream) {
  videoStreamUrl.value = dockStream.url
}
```

### 更新无人机视频流
```typescript
import { updateVideoStream } from '@/utils/videoCache'

updateVideoStream('drone_visible', { 
  url: newUrl, 
  ai_enabled: true 
})
```

### 切换视频类型
```typescript
import { getVideoStream } from '@/utils/videoCache'

const switchGimbal = async (videoType: 'dock' | 'drone_visible' | 'drone_infrared') => {
  const targetStream = getVideoStream(videoType)
  if (targetStream) {
    videoStreamUrl.value = targetStream.url
    currentVideoType.value = videoType
  }
}
```

## 🔧 重构的文件

1. **`src/utils/videoCache.ts`** - 新增：视频缓存管理工具
2. **`src/composables/useApi.ts`** - 更新：登录时的缓存设置逻辑
3. **`src/views/Home.vue`** - 更新：使用新的缓存工具函数
4. **`src/views/DockControl.vue`** - 更新：使用新的缓存工具函数
5. **`src/views/DroneControl.vue`** - 更新：使用新的缓存工具函数

## ✅ 重构效果

1. **消除重复** - 不再有多个缓存字段存储相同信息
2. **统一管理** - 所有视频相关操作都通过 `video_streams` 进行
3. **类型安全** - 使用TypeScript接口确保数据结构一致性
4. **易于维护** - 集中化的缓存管理，便于后续功能扩展
5. **性能提升** - 减少localStorage的读写操作

## 🚀 后续优化建议

1. 考虑添加缓存版本控制，便于后续升级
2. 可以添加缓存过期机制，定期清理过期数据
3. 考虑添加缓存压缩，减少localStorage占用空间
4. 可以添加缓存同步机制，确保多标签页数据一致

## 📋 注意事项

1. 重构后，旧的缓存字段会在下次登录时自动清理
2. 如果遇到视频无法播放，请检查 `video_streams` 缓存是否正确
3. 建议在开发环境中清除localStorage，重新测试缓存逻辑 