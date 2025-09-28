// 地图缓存功能测试
import { mapCache } from './mapCache'

// 测试地图缓存功能
export function testMapCache() {
  console.log('=== 地图缓存功能测试 ===')
  
  // 获取缓存统计
  const stats = mapCache.getCacheStats()
  console.log('缓存统计:', stats)
  
  // 测试一个示例地图名称
  const testMapName = 'hall1'
  console.log(`检查地图 ${testMapName} 是否已缓存:`, mapCache.isMapCached(testMapName))
  
  // 如果有缓存，显示缓存的地图列表
  if (stats.mapCount > 0) {
    console.log('已缓存的地图:', stats.maps)
    console.log('总缓存大小:', (stats.totalSize / 1024 / 1024).toFixed(2), 'MB')
  }
}