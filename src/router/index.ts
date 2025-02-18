import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import { storeToRefs } from 'pinia';
import { useAuth } from '@/store/useAuth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import("@/views/Login.vue"),
    name: "Login"
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
      },
      {
        path: 'tab4',
        component: () => import('@/views/Tab4Page.vue'),
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

router.beforeEach(async (to, from, next) => {
  const store = useAuth()
  const { isAuth } = storeToRefs(store)
  const { loadUserData } = store
  if (!isAuth.value)
    await loadUserData()

  if (!!isAuth.value && to.name === "Login") {
    next('/tabs')
    return
  }
  if (to.meta.requiresAuth && !isAuth.value)
    next('/login')
  else
    next()
})

export default router
