<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
        <strong>Dashboard</strong>
      </a>
      <a
        role="button"
        class="navbar-burger"
        @click="toggleMenu"
        :class="{ 'is-active': isActive }"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': isActive }">
      <div class="navbar-start">
        <!-- Barra de pesquisa integrada na Navbar -->
        <div class="navbar-item">
          <div class="field">
            <p class="control has-icons-left">
              <input
                class="input"
                type="text"
                placeholder="Pesquisar moeda..."
                v-model="searchTerm"
                @input="onInput"
              />
              <span class="icon is-left">
                <!-- Certifique-se de ter configurado o FontAwesome ou substitua por um SVG -->
                <i class="fas fa-search"></i>
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <a class="navbar-item" href="#">Home</a>
        <a class="navbar-item" href="#">Profile</a>
        <a class="navbar-item" href="#">Logout</a>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchNavbar',
  data() {
    return {
      isActive: false,
      searchTerm: '',
      timeoutId: null
    };
  },
  methods: {
    toggleMenu() {
      this.isActive = !this.isActive;
    },
    onInput() {
      // Debounce: espera 300ms após a última digitação para disparar a busca
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.search();
      }, 300);
    },
    async search() {
      // Se o input estiver vazio, emite uma lista vazia
      if (this.searchTerm.trim() === '') {
        this.$emit('search-results', []);
        return;
      }
      try {
        const response = await axios.get('http://localhost:3002/coins', {
          params: { filter: this.searchTerm }
        });
        // Espera que o endpoint retorne um objeto padrão { success, message, data, count }.
        this.$emit('search-results', response.data.data);
      } catch (error) {
        console.error('Erro ao buscar moedas:', error);
        this.$emit('search-results', []);
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid #ddd;
}
</style>
