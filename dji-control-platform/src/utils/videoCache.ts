/**
 * 视频流缓存管理工具
 * 统一管理所有视频相关的缓存操作
 */

export interface VideoStream {
  type: 'dock' | 'drone_visible' | 'drone_infrared'
  url: string
  switchable_video_types: string[]
  device_sn: string
  camera_index: string
  video_index: string
  ai_enabled?: boolean
}

/**
 * 获取所有视频流信息
 */
export const getVideoStreams = (): VideoStream[] => {
  try {
    const videoStreamsStr = localStorage.getItem('video_streams')
    if (videoStreamsStr) {
      return JSON.parse(videoStreamsStr)
    }
  } catch (error) {
    console.error('解析video_streams缓存失败:', error)
  }
  return []
}

/**
 * 设置视频流信息
 */
export const setVideoStreams = (streams: VideoStream[]): void => {
  localStorage.setItem('video_streams', JSON.stringify(streams))
}

/**
 * 获取指定类型的视频流
 */
export const getVideoStream = (type: VideoStream['type']): VideoStream | null => {
  const streams = getVideoStreams()
  return streams.find(stream => stream.type === type) || null
}

/**
 * 获取指定类型的视频流URL
 */
export const getVideoStreamUrl = (type: VideoStream['type']): string | null => {
  const stream = getVideoStream(type)
  return stream?.url || null
}

/**
 * 更新指定类型的视频流
 */
export const updateVideoStream = (type: VideoStream['type'], updates: Partial<VideoStream>): void => {
  const streams = getVideoStreams()
  const index = streams.findIndex(stream => stream.type === type)
  
  if (index >= 0) {
    streams[index] = { ...streams[index], ...updates }
  } else {
    streams.push({ ...updates, type } as VideoStream)
  }
  
  setVideoStreams(streams)
}

/**
 * 获取默认视频类型
 */
export const getDefaultVideoType = (): VideoStream['type'] | null => {
  return localStorage.getItem('default_video_type') as VideoStream['type'] | null
}

/**
 * 设置默认视频类型
 */
export const setDefaultVideoType = (type: VideoStream['type']): void => {
  localStorage.setItem('default_video_type', type)
}

/**
 * 清理旧的重复缓存字段
 */
export const cleanupOldVideoCache = (): void => {
  const oldFields = [
    'video_stream_url',
    'drone_video_stream_url', 
    'dock_video_stream_url',
    'current_video_type'
  ]
  
  oldFields.forEach(field => {
    if (localStorage.getItem(field)) {
      localStorage.removeItem(field)
      console.log(`已清理旧缓存字段: ${field}`)
    }
  })
}

/**
 * 检查是否有可用的视频流
 */
export const hasVideoStreams = (): boolean => {
  const streams = getVideoStreams()
  return streams.length > 0
}

/**
 * 获取可用的视频类型列表
 */
export const getAvailableVideoTypes = (): VideoStream['type'][] => {
  const streams = getVideoStreams()
  return streams.map(stream => stream.type)
}

 