<template>
  <div class="login-form">
    <div class="field">
      <label class="label">Email</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="email"
          placeholder="Digite seu email"
          v-model.trim="email"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <label class="label">Senha</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="password"
          placeholder="Digite sua senha"
          v-model.trim="password"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button
          class="button is-primary is-fullwidth"
          @click="login"
          :disabled="loading"
        >
          <span v-if="!loading">Login</span>
          <span v-else class="spinner"></span>
        </button>
      </div>
    </div>
    <p v-if="errorMessage" class="has-text-danger has-text-centered">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    async login() {
      this.errorMessage = "";
      this.loading = true;
      try {
        const response = await axios.post(
          "http://localhost:3001/auth/login",
          {
            email: this.email,
            password: this.password,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        // Supondo que o token venha em response.data.token
        const token = response.data.access_token;
        localStorage.setItem("token", token);
        // Emite o evento de login bem-sucedido para que o componente pai possa redirecionar
        this.$emit("login-success", token);
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        this.errorMessage =
          (error.response && error.response.data && error.response.data.message) ||
          "Erro ao fazer login. Tente novamente.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  width: 100%;
}
.button[disabled] {
  opacity: 0.7;
}
/* Exemplo simples para spinner (você pode customizá-lo) */
.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
