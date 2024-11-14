import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/products'
  },
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('../views/ProductList.vue')
  },
  {
    path: '/products/create',
    name: 'ProductCreate',
    component: () => import('../views/ProductEdit.vue')
  },
  {
    path: '/products/:id/edit',
    name: 'ProductEdit',
    component: () => import('../views/ProductEdit.vue')
  },
  // 添加一个通配符路由，处理 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/products'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 