import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard/home'
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
            requiresAuth: true
          }
        },
        {
          path: 'drone-control',
          name: 'DroneControl',
          component: () => import('../views/DroneControl.vue'),
          meta: { 
            requiresAuth: true
          }
        },
        {
          path: 'dock-control',
          name: 'DockControl',
          component: () => import('../views/DockControl.vue'),
          meta: { 
            requiresAuth: true
          }
        },
        {
          path: 'mission',
          name: 'Mission',
          component: () => import('../views/Mission.vue'),
          meta: { 
            requiresAuth: true
          }
        },
        {
          path: 'mission-logs',
          name: 'MissionLogs',
          component: () => import('../views/MissionLogs.vue'),
          meta: { 
            requiresAuth: true
          }
        },
        {
          path: 'mission-records',
          name: 'MissionRecords',
          component: () => import('../views/MissionRecords.vue'),
          meta: { 
            requiresAuth: true
          }
        },
        {
          path: 'device-manage',
          name: 'DeviceManage',
          component: () => import('../views/DeviceManage.vue'),
          meta: { 
            requiresAuth: true
          }
        },
        {
          path: 'alarm-log',
          name: 'AlarmLog',
          component: () => import('../views/AlarmLog.vue'),
          meta: { 
            requiresAuth: true
          }
        },
        {
          path: 'users',
          name: 'UserManage',
          component: () => import('../views/UserManage.vue'),
          meta: { 
            requiresAuth: true
          }
        },
        {
          path: 'roles',
          name: 'RoleManage',
          component: () => import('../views/RoleManage.vue'),
          meta: { 
            requiresAuth: true
          }
        }
      ]
    }
  ]
})

// 简化的路由守卫
router.beforeEach((to, from, next) => {
  console.log('路由跳转:', to.path)
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    const isLoggedIn = true // 临时设置为true
    
    if (!isLoggedIn) {
      next('/login')
      return
    }
  }
  
  next()
})

export default router