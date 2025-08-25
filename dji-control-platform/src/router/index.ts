import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { usePermissionStore } from '../stores/permission'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Layout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'DashboardHome',
          redirect: '/dashboard/home'
        },
        {
          path: 'home',
          name: 'Home',
          component: () => import('../views/Home.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'home.view'
          }
        },
        {
          path: 'drone-control',
          name: 'DroneControl',
          component: () => import('../views/DroneControl.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'drone_control.view'
          }
        },
        {
          path: 'dock-control',
          name: 'DockControl',
          component: () => import('../views/DockControl.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'dock_control.view'
          }
        },
        {
          path: 'mission',
          name: 'Mission',
          component: () => import('../views/Mission.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'wayline_management.view'
          }
        },
        {
          path: 'mission-logs',
          name: 'MissionLogs',
          component: () => import('../views/MissionLogs.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'task_logs.view'
          }
        },
        {
          path: 'mission-records',
          name: 'MissionRecords',
          component: () => import('../views/MissionRecords.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'task_records.view'
          }
        },
        {
          path: 'device-manage',
          name: 'DeviceManage',
          component: () => import('../views/DeviceManage.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'device_management.view'
          }
        },
        {
          path: 'alarm-log',
          name: 'AlarmLog',
          component: () => import('../views/AlarmLog.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'alarm_log:view'
          }
        },
        {
          path: 'users',
          name: 'UserManage',
          component: () => import('../views/UserManage.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'device_management.view'
          }
        },
        {
          path: 'roles',
          name: 'RoleManage',
          component: () => import('../views/RoleManage.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'device_management.view'
          }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      next('/login')
      return
    }
    
    // 验证token是否有效（可选：可以在这里添加token过期检查）
    try {
      const userData = JSON.parse(user)
      if (!userData || !userData.workspace_id) {
        next('/login')
        return
      }
    } catch (error) {
      next('/login')
      return
    }
    
    // 检查页面权限
    if (to.meta.permission) {
      const permissionStore = usePermissionStore()
      const hasPermission = permissionStore.hasPermission(to.meta.permission as string)
      
      if (!hasPermission) {
        // 如果没有权限，检查是否正在访问首页
        if (to.path === '/dashboard/home') {
          // 如果连首页都没有权限，可能是权限还没有初始化完成，允许访问
          console.warn(`用户没有访问 ${to.path} 的权限，需要权限: ${to.meta.permission}，但允许访问首页`)
          next()
          return
        } else {
          // 其他页面没有权限，重定向到首页
          console.warn(`用户没有访问 ${to.path} 的权限，需要权限: ${to.meta.permission}`)
          next('/dashboard/home')
          return
        }
      }
    }
  }
  
  next()
})

export default router