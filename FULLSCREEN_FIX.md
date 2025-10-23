# iPad 全屏模式下拉框定位问题修复说明

## 问题描述

在 iPad 等触摸设备上使用网页应用时，当进入全屏模式后，所有的下拉框（select）和日期选择器（date/datetime-local input）的弹出位置会出现错误，通常表现为：
- 下拉列表跑到屏幕上方
- 日期选择器显示位置偏移
- 选项列表无法正确对齐到输入框

而在非全屏模式下显示正常。

## 问题原因

这是因为在全屏模式下（使用 Fullscreen API），浏览器的视口参考坐标系发生了变化。原生的 HTML5 表单控件（select、input[type="date"] 等）的弹出层定位计算会基于新的全屏容器，但由于层叠上下文（stacking context）和定位参考的变化，导致弹出层位置计算错误。

## 解决方案

通过添加针对全屏模式的 CSS 规则来修复定位问题：

### 1. 提升表单控件的 z-index
在全屏模式下，给所有可能弹出选择器的表单控件设置较高的 z-index，确保它们的弹出层在正确的层级显示。

```css
:fullscreen input[type="date"],
:fullscreen input[type="datetime-local"],
:fullscreen select,
:-webkit-full-screen input[type="date"],
:-webkit-full-screen input[type="datetime-local"],
:-webkit-full-screen select {
  position: relative;
  z-index: 9999;
}
```

### 2. 创建新的层叠上下文
使用 `transform: translate3d(0, 0, 0)` 为对话框容器创建新的层叠上下文，确保内部元素的定位正确。

```css
:fullscreen .custom-dialog,
:-webkit-full-screen .custom-dialog {
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
}
```

### 3. 确保全屏容器可滚动
允许全屏容器在需要时滚动，以便弹出的选择器始终可见。

```css
:fullscreen {
  overflow: auto !important;
}
```

## 修改的文件

以下文件已添加全屏模式修复：

1. **src/style.css** - 全局样式修复
2. **src/views/Home.vue** - 首页组件修复
3. **src/views/Mission.vue** - 任务页面修复
4. **src/views/UserManage.vue** - 用户管理页面修复
5. **src/views/DeviceManage.vue** - 设备管理页面修复

## 浏览器兼容性

该修复方案支持以下浏览器：
- Safari (iOS) - 使用 `-webkit-full-screen` 前缀
- Chrome/Edge - 使用标准 `:fullscreen` 伪类
- Firefox - 使用 `-moz-full-screen` 前缀

## 测试建议

在 iPad 上测试以下场景：
1. 进入全屏模式
2. 打开包含日期选择器的对话框（如任务调度）
3. 点击日期/时间输入框
4. 验证日期选择器弹出位置正确
5. 测试所有下拉框（select）的显示是否正常

## 注意事项

- 该修复主要针对移动端触摸设备（特别是 iPad）
- 桌面浏览器一般不会出现此问题
- 如果未来添加新的日期选择器或下拉框，确保它们在全屏模式下也能正常工作

## 相关技术文档

- [Fullscreen API - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Fullscreen_API)
- [CSS ::fullscreen 伪类](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:fullscreen)
- [层叠上下文 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)
