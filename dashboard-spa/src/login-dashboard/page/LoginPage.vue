<template>
  <section class="hero is-fullheight is-light">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-4">
            <!-- Exibe o componente filho conforme a rota -->
            <router-view
            @login-success="handleLoginSuccess"
            @register-success="handleRegisterSuccess" />
            <!-- Botão de navegação para alternar entre login e cadastro -->
            <div class="has-text-centered mt-4">
              <router-link
                v-if="$route.name === 'login'"
                to="/auth/register"
                class="button is-text"
              >
                Ainda não tem conta? Cadastre-se
              </router-link>
              <router-link
                v-else-if="$route.name === 'register'"
                to="/auth/login"
                class="button is-text"
              >
                Já possui conta? Faça login
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";
import RegisterForm from "../components/RegisterForm.vue";

export default {
  name: "LoginPage",
  components: {
    LoginForm,
    RegisterForm,
  },
  methods: {
    handleLoginSuccess(token) {
      this.$router.push("/dashboard");
    },
    handleRegisterSuccess(data) {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
</style>
