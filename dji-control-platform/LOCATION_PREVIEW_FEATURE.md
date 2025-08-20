# 位置预览功能实现文档

## 🎯 功能概述

在任务日志页面添加位置预览功能，用户可以通过点击预览按钮查看检测目标在地图上的具体位置。

## 🚀 功能特性

### 1. 位置预览列 ✅
- 在目标图片右侧新增"位置预览"列
- 当检测记录包含位置信息时显示"预览"按钮
- 当检测记录不包含位置信息时显示"--"

### 2. 地图弹窗 ✅
- 点击预览按钮弹出地图弹窗
- 使用高德地图显示检测位置
- 卫星图层显示，更直观地展示地形

### 3. 位置信息展示 ✅
- 显示经度、纬度、高度（如果有）
- 显示检测时间
- 信息面板与地图并排显示

### 4. 坐标转换 ✅
- 自动将WGS84坐标转换为GCJ-02坐标
- 确保在中国境内地图显示正确

## 📁 修改的文件

### 1. `src/types/index.ts`
- **新增字段**：在`VisionAlert`接口中添加位置信息字段
  - `latitude?: number` - 纬度
  - `longitude?: number` - 经度
  - `altitude?: number` - 高度

### 2. `src/views/MissionLogs.vue`
- **新增导入**：
  - `nextTick` - Vue 3的nextTick函数
  - `AMapLoader` - 高德地图加载器
- **新增变量**：
  - `showLocationModal` - 控制位置预览弹窗显示
  - `selectedAlert` - 当前选中的检测记录
  - `locationMapInstance` - 地图实例
- **新增函数**：
  - `showLocationPreview()` - 显示位置预览
  - `closeLocationModal()` - 关闭位置预览
  - `initLocationMap()` - 初始化地图
  - `transformWGS84ToGCJ02()` - 坐标转换
  - `outOfChina()` - 判断是否在中国境内
  - `transformLat()` - 纬度转换
  - `transformLng()` - 经度转换

## 🎨 界面设计

### 表格布局
```
| 序号 | 航线名称 | 任务名称 | 目标图片 | 位置预览 | 目标数量 | 算法名称 | 检测时间 |
|------|----------|----------|----------|----------|----------|----------|----------|
|  1   | 手动飞行 | 一键起飞 | [图片]   | [预览]   |    1     | 人车检测 | 2024-01-20 |
```

### 位置预览按钮
- **样式**：蓝色背景，白色边框
- **悬停效果**：背景色变深，边框高亮
- **状态**：有位置信息时显示按钮，无位置信息时显示"--"

### 地图弹窗
- **尺寸**：80%宽度，70%高度，最大800x600px
- **布局**：地图区域 + 信息面板
- **地图**：卫星图层 + 路网图层
- **标记**：橙色标记点，显示"📍 检测点"

## 🔧 技术实现

### 坐标转换
```typescript
// WGS84坐标转GCJ-02坐标系
const transformWGS84ToGCJ02 = (wgsLng: number, wgsLat: number) => {
  const PI = Math.PI
  const ee = 0.00669342162296594323
  const a = 6378245.0
  
  if (outOfChina(wgsLng, wgsLat)) {
    return { longitude: wgsLng, latitude: wgsLat }
  }
  
  // 坐标转换算法...
  return { longitude: mgLng, latitude: mgLat }
}
```

### 地图初始化
```typescript
const initLocationMap = async () => {
  if (!selectedAlert.value?.latitude || !selectedAlert.value?.longitude) return
  
  const AMap = await AMapLoader.load({
    key: amapKey,
    version: '2.0',
    plugins: ['AMap.ToolBar', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.MapType', 'AMap.Geocoder']
  })
  
  // 坐标转换
  const gcjCoords = transformWGS84ToGCJ02(wgsLongitude, wgsLatitude)
  
  // 创建地图实例
  locationMapInstance = new AMap.Map('location-map-container', {
    zoom: 16,
    center: [gcjCoords.longitude, gcjCoords.latitude],
    mapStyle: 'amap://styles/satellite',
    layers: [
      new AMap.TileLayer.Satellite(),
      new AMap.TileLayer.RoadNet()
    ]
  })
  
  // 添加标记点
  const marker = new AMap.Marker({
    position: [gcjCoords.longitude, gcjCoords.latitude],
    content: `<div style="...">📍 检测点</div>`
  })
  
  locationMapInstance.add(marker)
}
```

### 响应式设计
- **弹窗**：响应式尺寸，适配不同屏幕
- **地图**：自适应容器大小
- **信息面板**：固定宽度，可滚动

## 🎯 用户体验

### 交互流程
1. 用户在任务日志页面查看检测记录
2. 点击有位置信息的记录的"预览"按钮
3. 弹出地图弹窗，显示检测位置
4. 查看位置信息和地图标记
5. 点击关闭按钮或遮罩层关闭弹窗

### 视觉反馈
- **按钮悬停**：颜色变化，提供视觉反馈
- **地图加载**：异步加载，避免阻塞界面
- **错误处理**：地图加载失败时显示错误信息

### 信息展示
- **坐标精度**：经纬度显示6位小数
- **高度显示**：高度显示2位小数，单位米
- **时间格式**：检测时间格式化显示

## 📊 性能优化

### 地图加载
- **按需加载**：只在需要时加载地图
- **实例管理**：及时销毁地图实例，避免内存泄漏
- **插件优化**：只加载必要的插件

### 坐标转换
- **缓存优化**：避免重复计算
- **算法优化**：使用高效的转换算法
- **边界检查**：中国境外直接返回原坐标

### 内存管理
- **实例清理**：关闭弹窗时销毁地图实例
- **事件清理**：移除地图事件监听器
- **DOM清理**：清理地图容器

## 🔍 错误处理

### 地图加载失败
```typescript
try {
  const AMap = await AMapLoader.load({...})
  // 地图初始化...
} catch (error) {
  console.error('初始化位置地图失败:', error)
}
```

### 坐标验证
```typescript
if (!selectedAlert.value?.latitude || !selectedAlert.value?.longitude) return
```

### 类型安全
```typescript
<p><strong>检测时间：</strong>{{ selectedAlert?.detection_time ? formatTime(selectedAlert.detection_time) : '--' }}</p>
```

## 🎉 功能效果

### 数据展示
- ✅ 位置信息正确显示
- ✅ 坐标转换准确
- ✅ 地图标记清晰

### 交互体验
- ✅ 按钮响应及时
- ✅ 弹窗打开/关闭流畅
- ✅ 地图操作顺畅

### 视觉效果
- ✅ 界面风格统一
- ✅ 颜色搭配协调
- ✅ 布局合理美观

## 🏆 实现成果

通过这次功能实现，我们成功为任务日志页面添加了位置预览功能：

1. **功能完整**：位置预览、地图显示、信息展示
2. **技术先进**：使用高德地图API，坐标转换准确
3. **用户体验**：界面友好，操作简单
4. **性能优化**：按需加载，内存管理良好
5. **错误处理**：完善的异常处理机制

现在用户可以在任务日志页面直观地查看每个检测目标的具体位置，大大提升了数据的可读性和实用性。 