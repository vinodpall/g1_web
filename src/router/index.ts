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
          path: 'mission',
          name: 'Mission',
          component: () => import('../views/Mission.vue'),
          meta: { 
            requiresAuth: true,
            permission: 'wayline_management.view'
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
    // 路由守卫已禁用，允许访问所有页面
  next()
})

export default router