import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Feedback from '../views/Feedback.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: Feedback
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
