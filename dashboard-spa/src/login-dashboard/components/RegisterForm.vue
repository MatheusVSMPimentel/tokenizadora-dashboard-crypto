<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Cadastro</p>
    </header>
    <div class="card-content">
      <div class="field">
        <label class="label">Nome</label>
        <div class="control has-icons-left">
          <input class="input" type="text" placeholder="Digite seu nome" v-model.trim="name" />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">Email</label>
        <div class="control has-icons-left">
          <input class="input" type="email" placeholder="Digite seu email" v-model.trim="email" />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">Data de Nascimento</label>
        <div class="control has-icons-left">
          <input class="input" type="date" v-model="birthday" />
          <span class="icon is-small is-left">
            <i class="fas fa-calendar-alt"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">Senha</label>
        <div class="control has-icons-left">
          <input class="input" type="password" placeholder="Digite sua senha" v-model.trim="password" />
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">Confirmação de Senha</label>
        <div class="control has-icons-left">
          <input class="input" type="password" placeholder="Confirme sua senha" v-model.trim="confirmPassword" />
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary is-fullwidth" @click="register" :disabled="loading">
            <span v-if="!loading">Cadastrar</span>
            <span v-else class="spinner"></span>
          </button>
        </div>
      </div>
      <p v-if="errorMessage" class="has-text-danger has-text-centered">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "RegisterForm",
  data() {
    return {
      name: "",
      email: "",
      birthday: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      loading: false
    };
  },
  methods: {
    async register() {
      this.errorMessage = "";
      this.loading = true;
      try {
        const response = await axios.post(
          "http://localhost:3001/users/",
          {
            name: this.name,
            email: this.email,
            birthday: this.birthday,
            password: this.password,
            confirmPassword: this.confirmPassword
          },
          { headers: { "Content-Type": "application/json" } }
        );
        this.$emit("register-success", response.data);
      } catch (error) {
        console.error("Erro ao realizar cadastro:", error);
        this.errorMessage =
          (error.response && error.response.data && error.response.data.message) ||
          "Erro ao realizar cadastro. Tente novamente.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
