import { createRouter, createWebHistory } from 'vue-router'
import LoggedDashboard from '../logged-dashboard/LoggedDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: LoggedDashboard
    }
  ],
})

export default router
