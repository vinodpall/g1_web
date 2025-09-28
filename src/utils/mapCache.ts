// 地图缓存管理工具
import { navigationApi } from '@/api/services'
import { useUserStore } from '@/stores/user'

// 缓存接口定义
interface MapCacheItem {
  mapName: string
  data: ArrayBuffer
  timestamp: number
  size: number
}

// YAML文件缓存接口
interface YamlCacheItem {
  mapName: string
  yamlContent: string
  timestamp: number
}

// 地图原点信息接口
export interface MapOriginInfo {
  resolution: number  // 栅格图分辨率（米/像素）
  origin: [number, number, number]  // 原点坐标 [x, y, theta]
  width?: number      // 图像宽度
  height?: number     // 图像高度
}

interface MapCacheIndex {
  [mapName: string]: {
    timestamp: number
    size: number
    key: string // localStorage key
  }
}

class MapCacheManager {
  private readonly CACHE_PREFIX = 'map_cache_'
  private readonly YAML_CACHE_PREFIX = 'yaml_cache_'
  private readonly INDEX_KEY = 'map_cache_index'
  private readonly YAML_INDEX_KEY = 'yaml_cache_index'
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024 // 50MB 最大缓存大小
  private readonly MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000 // 7天过期时间

  /**
   * 获取缓存索引
   */
  private getCacheIndex(): MapCacheIndex {
    try {
      const indexData = localStorage.getItem(this.INDEX_KEY)
      return indexData ? JSON.parse(indexData) : {}
    } catch (error) {
      console.error('读取地图缓存索引失败:', error)
      return {}
    }
  }

  /**
   * 保存缓存索引
   */
  private saveCacheIndex(index: MapCacheIndex): void {
    try {
      localStorage.setItem(this.INDEX_KEY, JSON.stringify(index))
    } catch (error) {
      console.error('保存地图缓存索引失败:', error)
    }
  }

  /**
   * 生成缓存key
   */
  private getCacheKey(mapName: string): string {
    return `${this.CACHE_PREFIX}${mapName}`
  }

  /**
   * 检查地图是否在缓存中且未过期
   */
  isMapCached(mapName: string): boolean {
    const index = this.getCacheIndex()
    const cacheInfo = index[mapName]
    
    if (!cacheInfo) {
      return false
    }

    // 检查是否过期
    const now = Date.now()
    if (now - cacheInfo.timestamp > this.MAX_CACHE_AGE) {
      console.log(`地图 ${mapName} 缓存已过期，将重新下载`)
      this.removeMapFromCache(mapName)
      return false
    }

    // 检查数据是否存在
    const cacheKey = this.getCacheKey(mapName)
    const data = localStorage.getItem(cacheKey)
    if (!data) {
      console.log(`地图 ${mapName} 缓存数据丢失，将重新下载`)
      this.removeMapFromCache(mapName)
      return false
    }

    return true
  }

  /**
   * 从缓存获取地图数据
   */
  getCachedMap(mapName: string): ArrayBuffer | null {
    if (!this.isMapCached(mapName)) {
      return null
    }

    try {
      const cacheKey = this.getCacheKey(mapName)
      const base64Data = localStorage.getItem(cacheKey)
      if (!base64Data) {
        return null
      }

      // 将base64转换为ArrayBuffer
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      console.log(`从缓存获取地图 ${mapName}，大小:`, bytes.byteLength, 'bytes')
      return bytes.buffer
    } catch (error) {
      console.error(`读取缓存地图 ${mapName} 失败:`, error)
      this.removeMapFromCache(mapName)
      return null
    }
  }

  /**
   * 将地图数据保存到缓存
   */
  cacheMap(mapName: string, data: ArrayBuffer): boolean {
    try {
      // 清理过期缓存
      this.cleanExpiredCache()

      // 检查缓存大小
      const currentSize = this.getCurrentCacheSize()
      const newDataSize = data.byteLength

      if (currentSize + newDataSize > this.MAX_CACHE_SIZE) {
        console.warn('缓存空间不足，清理旧缓存')
        this.cleanOldCache(newDataSize)
      }

      // 将ArrayBuffer转换为base64存储
      const bytes = new Uint8Array(data)
      let binaryString = ''
      for (let i = 0; i < bytes.byteLength; i++) {
        binaryString += String.fromCharCode(bytes[i])
      }
      const base64Data = btoa(binaryString)

      // 保存数据
      const cacheKey = this.getCacheKey(mapName)
      localStorage.setItem(cacheKey, base64Data)

      // 更新索引
      const index = this.getCacheIndex()
      index[mapName] = {
        timestamp: Date.now(),
        size: data.byteLength,
        key: cacheKey
      }
      this.saveCacheIndex(index)

      console.log(`地图 ${mapName} 已缓存，大小:`, data.byteLength, 'bytes')
      return true
    } catch (error) {
      console.error(`缓存地图 ${mapName} 失败:`, error)
      return false
    }
  }

  /**
   * 从缓存中移除地图
   */
  removeMapFromCache(mapName: string): void {
    const index = this.getCacheIndex()
    const cacheInfo = index[mapName]
    
    if (cacheInfo) {
      // 删除数据
      localStorage.removeItem(cacheInfo.key)
      
      // 更新索引
      delete index[mapName]
      this.saveCacheIndex(index)
      
      console.log(`已移除缓存地图: ${mapName}`)
    }
  }

  /**
   * 获取当前缓存总大小
   */
  private getCurrentCacheSize(): number {
    const index = this.getCacheIndex()
    return Object.values(index).reduce((total, item) => total + item.size, 0)
  }

  /**
   * 清理过期缓存
   */
  private cleanExpiredCache(): void {
    const index = this.getCacheIndex()
    const now = Date.now()
    let cleaned = false

    for (const [mapName, cacheInfo] of Object.entries(index)) {
      if (now - cacheInfo.timestamp > this.MAX_CACHE_AGE) {
        localStorage.removeItem(cacheInfo.key)
        delete index[mapName]
        cleaned = true
        console.log(`清理过期缓存地图: ${mapName}`)
      }
    }

    if (cleaned) {
      this.saveCacheIndex(index)
    }
  }

  /**
   * 清理旧缓存以腾出空间
   */
  private cleanOldCache(requiredSpace: number): void {
    const index = this.getCacheIndex()
    const entries = Object.entries(index).sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    let freedSpace = 0
    let cleaned = false

    for (const [mapName, cacheInfo] of entries) {
      if (freedSpace >= requiredSpace) {
        break
      }

      localStorage.removeItem(cacheInfo.key)
      delete index[mapName]
      freedSpace += cacheInfo.size
      cleaned = true
      console.log(`清理旧缓存地图: ${mapName}，释放空间:`, cacheInfo.size, 'bytes')
    }

    if (cleaned) {
      this.saveCacheIndex(index)
    }
  }

  /**
   * 清空所有缓存
   */
  clearAllCache(): void {
    const index = this.getCacheIndex()
    
    for (const [mapName, cacheInfo] of Object.entries(index)) {
      localStorage.removeItem(cacheInfo.key)
    }
    
    localStorage.removeItem(this.INDEX_KEY)
    console.log('已清空所有地图缓存')
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): { totalSize: number, mapCount: number, maps: string[] } {
    const index = this.getCacheIndex()
    const maps = Object.keys(index)
    const totalSize = this.getCurrentCacheSize()
    
    return {
      totalSize,
      mapCount: maps.length,
      maps
    }
  }

  // ============= YAML缓存管理方法 =============

  /**
   * 获取YAML缓存索引
   */
  private getYamlCacheIndex(): { [mapName: string]: { timestamp: number } } {
    try {
      const indexData = localStorage.getItem(this.YAML_INDEX_KEY)
      return indexData ? JSON.parse(indexData) : {}
    } catch (error) {
      console.error('读取YAML缓存索引失败:', error)
      return {}
    }
  }

  /**
   * 保存YAML缓存索引
   */
  private saveYamlCacheIndex(index: { [mapName: string]: { timestamp: number } }): void {
    try {
      localStorage.setItem(this.YAML_INDEX_KEY, JSON.stringify(index))
    } catch (error) {
      console.error('保存YAML缓存索引失败:', error)
    }
  }

  /**
   * 获取YAML缓存键
   */
  private getYamlCacheKey(mapName: string): string {
    return `${this.YAML_CACHE_PREFIX}${mapName}`
  }

  /**
   * 检查YAML文件是否在缓存中且未过期
   */
  isYamlCached(mapName: string): boolean {
    const index = this.getYamlCacheIndex()
    const cacheInfo = index[mapName]
    
    if (!cacheInfo) {
      return false
    }

    // 检查是否过期
    const now = Date.now()
    if (now - cacheInfo.timestamp > this.MAX_CACHE_AGE) {
      console.log(`YAML ${mapName} 缓存已过期，将重新下载`)
      this.removeYamlFromCache(mapName)
      return false
    }

    // 检查数据是否存在
    const cacheKey = this.getYamlCacheKey(mapName)
    const data = localStorage.getItem(cacheKey)
    if (!data) {
      console.log(`YAML ${mapName} 缓存数据丢失，将重新下载`)
      this.removeYamlFromCache(mapName)
      return false
    }

    return true
  }

  /**
   * 从缓存获取YAML数据
   */
  getCachedYaml(mapName: string): string | null {
    if (!this.isYamlCached(mapName)) {
      return null
    }

    try {
      const cacheKey = this.getYamlCacheKey(mapName)
      const yamlContent = localStorage.getItem(cacheKey)
      return yamlContent
    } catch (error) {
      console.error('读取YAML缓存失败:', error)
      this.removeYamlFromCache(mapName)
      return null
    }
  }

  /**
   * 缓存YAML数据
   */
  cacheYaml(mapName: string, yamlContent: string): void {
    try {
      const cacheKey = this.getYamlCacheKey(mapName)
      const now = Date.now()

      // 保存YAML内容
      localStorage.setItem(cacheKey, yamlContent)

      // 更新索引
      const index = this.getYamlCacheIndex()
      index[mapName] = {
        timestamp: now
      }
      this.saveYamlCacheIndex(index)

      console.log(`YAML ${mapName} 已缓存`)
    } catch (error) {
      console.error('缓存YAML失败:', error)
    }
  }

  /**
   * 从缓存中移除YAML
   */
  removeYamlFromCache(mapName: string): void {
    try {
      const cacheKey = this.getYamlCacheKey(mapName)
      localStorage.removeItem(cacheKey)

      // 更新索引
      const index = this.getYamlCacheIndex()
      delete index[mapName]
      this.saveYamlCacheIndex(index)

      console.log(`YAML ${mapName} 已从缓存中移除`)
    } catch (error) {
      console.error('移除YAML缓存失败:', error)
    }
  }

  /**
   * 解析YAML文件获取地图原点信息
   */
  parseMapOrigin(yamlContent: string): MapOriginInfo | null {
    try {
      const lines = yamlContent.split('\n')
      let resolution = 0.05 // 默认分辨率
      let origin = [0, 0, 0] // 默认原点

      for (const line of lines) {
        const trimmedLine = line.trim()
        
        if (trimmedLine.startsWith('resolution:')) {
          resolution = parseFloat(trimmedLine.split(':')[1].trim())
        }
        
        if (trimmedLine.startsWith('origin:')) {
          // 解析origin: [x, y, theta]格式
          const originStr = trimmedLine.substring(7).trim()
          const match = originStr.match(/\[([^\]]+)\]/)
          if (match) {
            const values = match[1].split(',').map(v => parseFloat(v.trim()))
            if (values.length >= 3) {
              origin = [values[0], values[1], values[2]]
            }
          }
        }
      }

      return {
        resolution,
        origin: origin as [number, number, number]
      }
    } catch (error) {
      console.error('解析YAML文件失败:', error)
      return null
    }
  }
}

// 导出单例实例
export const mapCache = new MapCacheManager()

/**
 * 下载并缓存地图
 */
export async function downloadAndCacheMap(sn: string, mapName: string, file: string = 'gridMap.pgm'): Promise<ArrayBuffer> {
  // 检查缓存
  if (mapCache.isMapCached(mapName)) {
    console.log(`使用缓存地图: ${mapName}`)
    const cachedData = mapCache.getCachedMap(mapName)
    if (cachedData) {
      return cachedData
    }
  }

  // 从服务器下载
  console.log(`下载地图: ${mapName}`)
  const userStore = useUserStore()
  const token = userStore.token
  
  if (!token) {
    throw new Error('未找到认证token')
  }

  try {
    const mapData = await navigationApi.downloadMap(token, { sn, map_name: mapName, file })
    
    // 缓存下载的数据
    mapCache.cacheMap(mapName, mapData)
    
    return mapData
  } catch (error) {
    console.error(`下载地图 ${mapName} 失败:`, error)
    throw error
  }
}

/**
 * 下载并缓存YAML文件
 */
export async function downloadAndCacheYaml(sn: string, mapName: string): Promise<string> {
  // 检查缓存
  if (mapCache.isYamlCached(mapName)) {
    console.log(`使用缓存YAML: ${mapName}`)
    const cachedYaml = mapCache.getCachedYaml(mapName)
    if (cachedYaml) {
      return cachedYaml
    }
  }

  // 从服务器下载
  console.log(`下载YAML: ${mapName}`)
  const userStore = useUserStore()
  const token = userStore.token
  
  if (!token) {
    throw new Error('未找到认证token')
  }

  try {
    // 下载gridMap.yaml文件
    const yamlData = await navigationApi.downloadMap(token, { sn, map_name: mapName, file: 'gridMap.yaml' })
    
    // 将ArrayBuffer转换为字符串
    const yamlContent = new TextDecoder('utf-8').decode(yamlData)
    
    // 缓存下载的YAML数据
    mapCache.cacheYaml(mapName, yamlContent)
    
    return yamlContent
  } catch (error) {
    console.error(`下载YAML ${mapName} 失败:`, error)
    throw error
  }
}

/**
 * 获取地图原点信息
 */
export async function getMapOriginInfo(sn: string, mapName: string): Promise<MapOriginInfo | null> {
  try {
    const yamlContent = await downloadAndCacheYaml(sn, mapName)
    return mapCache.parseMapOrigin(yamlContent)
  } catch (error) {
    console.error(`获取地图原点信息失败:`, error)
    return null
  }
}

/**
 * 坐标转换：将世界坐标转换为像素坐标
 */
export function worldToPixel(
  worldX: number, 
  worldY: number, 
  originInfo: MapOriginInfo,
  imageWidth: number,
  imageHeight: number
): { x: number, y: number } {
  const { resolution, origin } = originInfo
  
  // 计算相对于原点的偏移
  const relativeX = worldX - origin[0]
  const relativeY = worldY - origin[1]
  
  // 转换为像素坐标
  const pixelX = Math.round(relativeX / resolution)
  const pixelY = Math.round(imageHeight - (relativeY / resolution)) // Y轴翻转
  
  return { x: pixelX, y: pixelY }
}