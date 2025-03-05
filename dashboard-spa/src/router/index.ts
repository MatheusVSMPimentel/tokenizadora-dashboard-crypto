import { createRouter, createWebHistory } from 'vue-router'
import LoggedDashboard from '../logged-dashboard/LoggedDashboard.vue'
import LoginPage from '../login-dashboard/page/LoginPage.vue'
import LoginForm from '../login-dashboard/components/LoginForm.vue'
import RegisterForm from '../login-dashboard/components/RegisterForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/auth/login"
    },
    {
      path: "/auth",
      component: LoginPage, // Layout de autenticação
      children: [
        {
          path: "login",      // URL: /auth/login
          name: "login",
          component: LoginForm
        },
        {
          path: "register",   // URL: /auth/register
          name: "register",
          component: RegisterForm
        }
      ]
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: LoggedDashboard
    }

  ],
})

export default router
