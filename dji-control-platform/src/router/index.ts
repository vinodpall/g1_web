import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

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
          component: () => import('../views/DeviceManage.vue'),
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

// 路由守卫
router.beforeEach((to, _from, next) => {
  console.log('路由跳转:', to.path)
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      console.log('未找到认证信息，跳转到登录页')
      next('/login')
      return
    }
    
    // 验证token是否有效（可选：可以在这里添加token过期检查）
    try {
      const userData = JSON.parse(user)
      if (!userData || !userData.workspace_id) {
        console.log('用户数据无效，跳转到登录页')
        next('/login')
        return
      }
    } catch (error) {
      console.log('用户数据解析失败，跳转到登录页')
      next('/login')
      return
    }
  }
  
  next()
})

export default router