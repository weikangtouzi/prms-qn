import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Feedback from '../views/Feedback.vue'
import Success from '../views/Success.vue'
// import Feedback from '../views/Demo.vue'

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
    path: '/success',
    name: 'Success',
    component: Success
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: Feedback
  }
]

const router = createRouter({
  // history: createWebHashHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes
})

export default router
