import { createRouter, createWebHistory } from 'vue-router'
import LoggedDashboard from '../logged-dashboard/LoggedDashboard.vue'
import LoginPage from '../login-dashboard/page/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginPage,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: LoggedDashboard
    }

  ],
})

export default router
