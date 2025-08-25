# 权限映射说明

## 后端权限列表适配情况

根据后端提供的完整权限列表，前端权限系统已进行相应适配。

### 已适配的权限

#### 首页权限 (home.*)
- `home.view` - 首页-页面查看
- `home.task.issue` - 首页-下发任务
- `home.task.cancel` - 首页-取消任务
- `home.wayline.pause` - 首页-航线暂停
- `home.wayline.resume` - 首页-航线恢复
- `home.drone.return` - 首页-一键返航
- `home.drone.cancel_return` - 首页-取消返航
- `home.drone.emergency_stop` - 首页-急停

#### 无人机控制权限 (drone_control.*)
- `drone_control.view` - 无人机控制-页面查看
- `drone_control.wayline.pause` - 无人机控制-航线暂停
- `drone_control.wayline.stop` - 无人机控制-航线停止
- `drone_control.remote_debug` - 无人机控制-远程调试
- `drone_control.drone.control` - 无人机控制-无人机控制
- `drone_control.gimbal.control` - 无人机控制-云台控制

#### 机场控制权限 (dock_control.*)
- `dock_control.view` - 机场控制-页面查看
- `dock_control.remote_debug` - 机场控制-远程调试

#### 航线管理权限 (wayline_management.*)
- `wayline_management.view` - 航线管理-页面查看
- `wayline_management.folder.delete` - 航线管理-删除文件夹
- `wayline_management.wayline.delete` - 航线管理-删除航线
- `wayline_management.wayline.create` - 航线管理-新增航线
- `wayline_management.task.issue` - 航线管理-下发任务
- `wayline_management.waypoint.delete` - 航线管理-删除航点

#### 任务记录权限 (task_records.*)
- `task_records.view` - 任务记录-页面查看

#### 任务日志权限 (task_logs.*)
- `task_logs.view` - 任务日志-页面查看

#### 设备管理权限 (device_management.*)
- `device_management.view` - 设备管理-页面查看
- `device_management.device.create` - 设备管理-添加设备
- `device_management.device.delete` - 设备管理-删除设备

### 路由权限配置

| 页面路径 | 权限代码 | 说明 |
|---------|---------|------|
| `/dashboard/home` | `home.view` | 首页 |
| `/dashboard/drone-control` | `drone_control.view` | 无人机控制 |
| `/dashboard/dock-control` | `dock_control.view` | 机场控制 |
| `/dashboard/mission` | `wayline_management.view` | 航线管理 |
| `/dashboard/mission-logs` | `task_logs.view` | 任务日志 |
| `/dashboard/mission-records` | `task_records.view` | 任务记录 |
| `/dashboard/device-manage` | `device_management.view` | 设备管理 |
| `/dashboard/users` | `device_management.view` | 用户管理（临时使用设备管理权限） |
| `/dashboard/roles` | `device_management.view` | 角色管理（临时使用设备管理权限） |

### 按钮权限配置

#### 用户管理页面
- 新增用户：`device_management.device.create`
- 编辑用户：`device_management.device.create`
- 删除用户：`device_management.device.delete`

#### 角色管理页面
- 新增角色：`device_management.device.create`
- 权限分配：`device_management.device.create`
- 编辑角色：`device_management.device.create`
- 删除角色：`device_management.device.delete`

### 注意事项

1. **缺失权限**：后端权限列表中缺少系统管理和角色管理的专门权限，目前临时使用设备管理权限代替。

2. **权限代码格式**：后端使用点号分隔的权限代码格式（如 `home.view`），前端已相应调整。

3. **权限映射**：前端权限映射表已更新，确保与后端权限代码一致。

4. **报警日志权限**：后端权限列表中未包含报警日志相关权限，如需添加请在后端补充。

### 建议

1. 建议在后端添加以下权限：
   - 系统管理相关权限（用户管理）
   - 角色管理相关权限
   - 报警日志相关权限

2. 权限代码建议保持一致性，使用点号分隔的格式。

3. 前端权限检查逻辑已完善，支持页面级和按钮级权限控制。
