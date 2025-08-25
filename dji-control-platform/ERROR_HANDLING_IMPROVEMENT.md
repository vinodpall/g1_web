# 错误处理改进说明

## 问题描述

之前在一键起飞和一键返航等操作中，当API返回错误格式为 `{"detail":"无飞行控制权"}` 时，错误处理代码使用 `error.message || error` 会显示 "object" 而不是具体的错误信息。

## 解决方案

### 1. 创建通用错误解析函数

在 `src/utils/errorCodes.ts` 中添加了 `parseErrorMessage` 函数：

```typescript
/**
 * 解析错误对象，提取可读的错误信息
 * 支持多种错误格式：
 * - {detail: "错误信息"}
 * - {message: "错误信息"}
 * - {error: "错误信息"}
 * - 字符串错误
 * - Error对象
 */
export function parseErrorMessage(error: any): string {
  if (!error) return '未知错误'
  
  // 如果是字符串，直接返回
  if (typeof error === 'string') {
    return error
  }
  
  // 如果是Error对象，返回message
  if (error instanceof Error) {
    return error.message
  }
  
  // 如果是对象，尝试提取错误信息
  if (typeof error === 'object') {
    // 优先使用detail字段（API错误常用）
    if (error.detail && typeof error.detail === 'string') {
      return error.detail
    }
    
    // 使用message字段
    if (error.message && typeof error.message === 'string') {
      return error.message
    }
    
    // 使用error字段
    if (error.error && typeof error.error === 'string') {
      return error.error
    }
    
    // 使用msg字段
    if (error.msg && typeof error.msg === 'string') {
      return error.msg
    }
    
    // 如果是响应对象，尝试从response.data中提取
    if (error.response && error.response.data) {
      const responseError = parseErrorMessage(error.response.data)
      if (responseError !== '未知错误') {
        return responseError
      }
    }
    
    // 如果都没有，返回对象的字符串表示
    try {
      const errorStr = JSON.stringify(error)
      return errorStr.length > 100 ? errorStr.substring(0, 100) + '...' : errorStr
    } catch {
      return '未知错误'
    }
  }
  
  return '未知错误'
}
```

### 2. 修复所有错误处理

#### 修复的文件

1. **src/views/DroneControl.vue**
   - 一键起飞错误处理
   - 一键返航错误处理
   - 变焦控制错误处理
   - 控制权操作错误处理
   - 云台控制错误处理
   - DRC模式错误处理
   - 拍照录像错误处理

2. **src/views/Home.vue**
   - 一键返航错误处理

#### 修复前
```typescript
} catch (error: any) {
  alert(`一键返航失败: ${error.message || error}`)
}
```

#### 修复后
```typescript
} catch (error: any) {
  const errorMsg = parseErrorMessage(error)
  alert(`一键返航失败: ${errorMsg}`)
}
```

## 支持的错误格式

### 1. API错误格式
```json
{"detail": "无飞行控制权"}
```
**解析结果**: "无飞行控制权"

### 2. 标准错误格式
```json
{"message": "操作失败"}
```
**解析结果**: "操作失败"

### 3. 其他错误格式
```json
{"error": "网络异常"}
{"msg": "权限不足"}
```
**解析结果**: 对应的错误信息

### 4. 字符串错误
```javascript
"直接错误信息"
```
**解析结果**: "直接错误信息"

### 5. Error对象
```javascript
new Error("标准错误")
```
**解析结果**: "标准错误"

### 6. 复杂响应对象
```javascript
{
  response: {
    data: {
      detail: "嵌套错误信息"
    }
  }
}
```
**解析结果**: "嵌套错误信息"

## 改进效果

### 修复前
- 错误信息显示: "一键返航失败: [object Object]"
- 用户无法了解具体错误原因

### 修复后
- 错误信息显示: "一键返航失败: 无飞行控制权"
- 用户能够清楚了解错误原因

## 使用示例

```typescript
import { parseErrorMessage } from '../utils/errorCodes'

try {
  // API调用
  const result = await api.someOperation()
} catch (error: any) {
  const errorMsg = parseErrorMessage(error)
  alert(`操作失败: ${errorMsg}`)
}
```

## 注意事项

1. **导入函数**: 在使用错误处理的组件中需要导入 `parseErrorMessage` 函数
2. **错误类型**: 函数支持多种错误格式，会自动选择最合适的错误信息
3. **长度限制**: 如果错误信息过长，会自动截断并添加省略号
4. **向后兼容**: 修复后的代码仍然支持原有的错误格式

## 测试建议

1. **测试API错误**: 模拟返回 `{"detail":"无飞行控制权"}` 格式的错误
2. **测试网络错误**: 模拟网络连接失败的情况
3. **测试权限错误**: 模拟权限不足的情况
4. **测试各种格式**: 确保所有错误格式都能正确解析

## 相关文件

- `src/utils/errorCodes.ts` - 错误解析函数
- `src/views/DroneControl.vue` - 无人机控制页面
- `src/views/Home.vue` - 首页
