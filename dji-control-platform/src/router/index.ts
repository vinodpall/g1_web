import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Layout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/Home.vue')
        },
        {
          path: 'control',
          name: 'DroneControl',
          component: () => import('@/views/DroneControl.vue')
        },
        {
          path: 'mission',
          name: 'Mission',
          component: () => import('@/views/Mission.vue')
        },
        {
          path: 'mission-records',
          name: 'MissionRecords',
          component: () => import('@/views/MissionRecords.vue')
        },
        {
          path: 'mission-logs',
          name: 'MissionLogs',
          component: () => import('@/views/MissionLogs.vue')
        },
        {
          path: 'device-manage',
          name: 'DeviceManage',
          component: () => import('@/views/DeviceManage.vue')
        },
        {
          path: 'alerts',
          name: 'Alerts',
          component: () => import('@/views/Alerts.vue')
        },
        {
          path: 'users',
          name: 'UserManage',
          component: () => import('@/views/UserManage.vue')
        },
        {
          path: 'roles',
          name: 'RoleManage',
          component: () => import('@/views/RoleManage.vue')
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path === '/login') {
    next()
  } else if (!token) {
    next('/login')
  } else {
    next()
  }
})

export default router