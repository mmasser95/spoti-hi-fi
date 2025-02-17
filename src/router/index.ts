import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import { storeToRefs } from 'pinia';
import { useAuth } from '@/store/useAuth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import("@/views/Login.vue")
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const { isAuth } = useAuth()
  if (to.meta.requiresAuth && !isAuth)
    next('/login')
  else
    next()
})

export default router
