<template>
  <section class="hero is-fullheight is-light">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-4">
            <div class="card">
              <div class="card-content">
                <h1 class="title has-text-centered">Login</h1>
                <LoginForm @login-success="handleLoginSuccess" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import LoginForm from '../components/LoginForm.vue'; // Ajuste o caminho conforme a estrutura do seu projeto
export default {
  name: "LoginPage",
  components: {
    LoginForm,
  },
  methods: {
    handleLoginSuccess(token) {
      // Após o login bem-sucedido, você pode redirecionar ou executar outra lógica
      // Por exemplo, usando o Vue Router:
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style scoped>
/* Você pode adicionar estilos personalizados aqui se necessário */
</style>
