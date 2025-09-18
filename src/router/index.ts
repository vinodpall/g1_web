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
      path: '/permission-denied',
      name: 'PermissionDenied',
      component: () => import('../views/PermissionDenied.vue'),
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
            permission: 'device_management.log.view'
          }
        },
        {
          path: 'users',
          name: 'UserManage',
          component: () => import('../views/UserManage.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'system_management.view'
          }
        },
        {
          path: 'introduce',
          name: 'IntroduceManage',
          component: () => import('../views/UserManage.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'system_management.view'
          }
        }
      ]
    }
  ]
})

// 路由守卫 - 已禁用所有权限验证
router.beforeEach((to, _from, next) => {
  console.log('路由守卫已禁用，允许访问所有页面:', to.path)
  next()
})

export default router