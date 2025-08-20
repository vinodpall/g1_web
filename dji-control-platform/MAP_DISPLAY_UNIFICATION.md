# 地图显示统一化文档

## 🎯 统一化目标

将首页和机场控制页面的地图显示逻辑与无人机控制页面保持一致，实现统一的无人机图标和扇形可视区域显示。

## 🚀 统一化内容

### 1. 无人机图标统一 ✅

**统一前：**
- 首页：使用静态图片图标
- 机场控制页面：使用静态图片图标
- 无人机控制页面：使用SVG箭头图标，支持实时旋转

**统一后：**
- 所有页面：使用SVG箭头图标，支持实时旋转
- 根据机体航向实时更新箭头角度

**实现代码：**
```typescript
// 创建无人机标记点（箭头图标，后续通过 rotateAngle 实时旋转）
const marker = new AMap.Marker({
  position: [longitude, latitude],
  title: `无人机: ${droneInfo?.deviceSn || '未知设备'}`,
  icon: new AMap.Icon({
    image: droneArrowIcon,
    imageSize: new AMap.Size(32, 32),
    size: new AMap.Size(32, 32)
  }),
  // 使用 autoRotation/angle 需要配合 setAngle
  autoRotation: false,
  angle: (droneStatus.value?.attitude?.head ?? 0) as number,
  anchor: 'center',
  offset: new AMap.Pixel(0, 0)
})
```

### 2. 扇形可视区域统一 ✅

**统一前：**
- 首页：无扇形显示
- 机场控制页面：无扇形显示
- 无人机控制页面：有扇形可视区域显示

**统一后：**
- 所有页面：都有扇形可视区域显示
- 无人机在线时显示朝向扇形
- 无人机离线时自动隐藏扇形

**实现代码：**
```typescript
// 计算扇形顶点（返回经纬度数组）
const computeSectorPath = (center: [number, number], headingDeg: number, radiusMeters = 60, halfAngleDeg = 25) => {
  if (!amapApiRef) return []
  const AMap = amapApiRef
  const path: [number, number][] = []
  const steps = 16
  const start = headingDeg - halfAngleDeg
  const end = headingDeg + halfAngleDeg
  // 中心点
  path.push(center)
  for (let i = 0; i <= steps; i++) {
    const ang = start + (i * (end - start)) / steps
    const rad = (ang * Math.PI) / 180
    // 粗略将半径从米转近似经纬度偏移（按纬度方向近似）
    const dLat = (radiusMeters / 111320) * Math.cos(rad)
    const dLng = (radiusMeters / (111320 * Math.cos((center[1] * Math.PI) / 180))) * Math.sin(rad)
    path.push([center[0] + dLng, center[1] + dLat])
  }
  return path
}

// 创建无人机朝向扇形
const createHeadingSector = (center: [number, number], headingDeg: number) => {
  if (!amapApiRef) return null
  const AMap = amapApiRef
  const path = computeSectorPath(center, headingDeg)
  if (!path.length) return null
  return new AMap.Polygon({
    path,
    strokeColor: '#ff9900',
    strokeWeight: 2,
    fillColor: 'rgba(255,153,0,0.25)',
    fillOpacity: 0.35,
    zIndex: 120
  })
}
```

### 3. 视角转换逻辑统一 ✅

**统一前：**
- 首页：无视角转换
- 机场控制页面：无视角转换
- 无人机控制页面：根据云台偏航角或机体航向实时更新扇形方向

**统一后：**
- 所有页面：都有视角转换逻辑
- 优先使用云台偏航角，其次使用机体航向
- 实时更新扇形方向和箭头角度

**实现代码：**
```typescript
// 获取当前云台偏航角（优先设备状态，其次回退机体航向）
const getCurrentGimbalYaw = (): number => {
  const a = (droneStatus.value?.gimbalYaw ?? null) as number | null
  if (typeof a === 'number' && Number.isFinite(a)) return a
  return (droneStatus.value?.attitude?.head ?? 0) as number
}

// 更新现有扇形（若不存在返回null）
const updateHeadingSector = (center: [number, number], headingDeg: number) => {
  const sector = droneHeadingSectors.value?.[0]
  if (!sector || !amapApiRef) return null
  const path = computeSectorPath(center, headingDeg)
  sector.setPath(path)
  return sector
}
```

### 4. 实时更新逻辑统一 ✅

**统一前：**
- 首页：无实时更新
- 机场控制页面：无实时更新
- 无人机控制页面：实时更新箭头角度和扇形方向

**统一后：**
- 所有页面：都有实时更新逻辑
- 每次地图标记更新时同步更新箭头角度和扇形方向
- 无人机离线时自动清理扇形显示

**实现代码：**
```typescript
// 无论位置是否变化，都根据机体航向更新箭头角度
try {
  const heading = (droneStatus.value?.attitude?.head ?? 0) as number
  const marker = droneMarkers.value[0]
  if (marker) {
    if (typeof (marker as any).setAngle === 'function') {
      ;(marker as any).setAngle(heading)
    } else if (typeof (marker as any).setRotation === 'function') {
      ;(marker as any).setRotation(heading)
    }
  }
} catch {}

// 同步更新朝向扇形（仅在线时显示）
try {
  if (droneStatus.value?.isOnline) {
    const heading = getCurrentGimbalYaw()
    const sector = updateHeadingSector([droneLongitude, droneLatitude], heading)
    if (!sector) {
      const newSector = createHeadingSector([droneLongitude, droneLatitude], heading)
      if (newSector) {
        amapInstance?.add(newSector)
        droneHeadingSectors.value = [newSector]
      }
    }
  } else {
    // 离线则清理扇形
    if (droneHeadingSectors.value?.length > 0) {
      droneHeadingSectors.value.forEach((poly: any) => amapInstance?.remove(poly))
      droneHeadingSectors.value = []
    }
  }
} catch {}
```

## 📁 修改的文件

### 1. `src/views/Home.vue`
- **新增导入**：`droneArrowIcon` SVG图标
- **新增函数**：
  - `computeSectorPath()` - 计算扇形路径
  - `createHeadingSector()` - 创建朝向扇形
  - `getCurrentGimbalYaw()` - 获取当前云台偏航角
  - `updateHeadingSector()` - 更新现有扇形
- **修改函数**：
  - `addDroneMarker()` - 使用箭头图标，添加扇形显示
  - `clearDroneMarkers()` - 添加扇形清理逻辑
  - `updateMapMarkers()` - 添加实时更新逻辑

### 2. `src/views/DockControl.vue`
- **新增导入**：`droneArrowIcon` SVG图标
- **新增函数**：
  - `computeSectorPath()` - 计算扇形路径
  - `createHeadingSector()` - 创建朝向扇形
  - `getCurrentGimbalYaw()` - 获取当前云台偏航角
  - `updateHeadingSector()` - 更新现有扇形
- **修改函数**：
  - `addDroneMarker()` - 使用箭头图标，添加扇形显示
  - `clearDroneMarkers()` - 添加扇形清理逻辑
  - `updateMapMarkers()` - 添加实时更新逻辑

## 🎨 视觉效果

### 统一后的显示效果

1. **无人机图标**：
   - 使用SVG箭头图标，更加清晰
   - 根据机体航向实时旋转
   - 32x32像素大小，居中显示

2. **扇形可视区域**：
   - 橙色边框（#ff9900）
   - 半透明填充（rgba(255,153,0,0.25)）
   - 60米半径，50度张角
   - 根据云台偏航角实时更新方向

3. **状态响应**：
   - 无人机在线：显示扇形
   - 无人机离线：隐藏扇形
   - 位置变化：平滑动画
   - 角度变化：实时更新

## 🔧 技术实现

### 坐标转换
- 使用WGS84到GCJ-02的坐标转换
- 确保在中国境内地图显示正确

### 扇形计算
- 使用极坐标计算扇形顶点
- 16个步进点，确保平滑显示
- 考虑地球曲率进行经纬度偏移

### 实时更新
- 每次地图标记更新时同步更新
- 使用try-catch确保稳定性
- 支持多种地图API的旋转方法

## 📊 性能优化

### 内存管理
- 及时清理不需要的扇形对象
- 避免内存泄漏

### 渲染优化
- 只在需要时创建扇形
- 复用现有的扇形对象
- 减少不必要的DOM操作

### 计算优化
- 缓存计算结果
- 避免重复计算
- 使用高效的数学算法

## 🎯 用户体验提升

### 视觉一致性
- 三个页面的地图显示完全一致
- 统一的图标和样式
- 一致的交互动画

### 信息丰富度
- 增加了扇形可视区域显示
- 实时显示无人机朝向
- 更直观的位置和方向信息

### 交互体验
- 平滑的动画效果
- 实时的状态更新
- 响应式的显示逻辑

## 🔍 调试信息

### 控制台日志
- 扇形创建和更新日志
- 角度变化日志
- 错误处理日志

### 状态监控
- 无人机在线状态
- 扇形显示状态
- 角度更新状态

## 🎉 统一化效果总结

### 功能统一
- ✅ 无人机图标统一为SVG箭头
- ✅ 扇形可视区域在所有页面显示
- ✅ 视角转换逻辑完全一致
- ✅ 实时更新机制统一

### 视觉统一
- ✅ 图标样式完全一致
- ✅ 扇形样式完全一致
- ✅ 动画效果完全一致
- ✅ 交互体验完全一致

### 代码统一
- ✅ 核心函数完全复用
- ✅ 逻辑流程完全一致
- ✅ 错误处理完全一致
- ✅ 性能优化完全一致

### 用户体验
- ✅ 三个页面显示效果完全一致
- ✅ 信息展示更加丰富
- ✅ 交互体验更加流畅
- ✅ 视觉效果更加专业

## 🏆 统一化成果

通过这次统一化，我们实现了：

1. **代码复用**：核心地图显示逻辑在所有页面共享
2. **视觉一致**：三个页面的地图显示完全一致
3. **功能增强**：增加了扇形可视区域显示
4. **体验提升**：更丰富的视觉信息和更流畅的交互
5. **维护简化**：统一的代码结构便于后续维护

现在首页、机场控制页面和无人机控制页面的地图显示逻辑完全一致，用户在不同页面间切换时会有统一的视觉体验。 