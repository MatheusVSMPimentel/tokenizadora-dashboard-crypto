<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
        <strong>Dashboard</strong>
      </a>
      <a role="button" class="navbar-burger" @click="toggleMenu" :class="{ 'is-active': isActive }" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': isActive }">
      <div class="navbar-start">
        <!-- Renderiza a SearchBar somente se searchVisible for true -->
        <SearchBar v-if="searchVisible" @coin-selected="$emit('coin-selected', $event)" />
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
import SearchBar from './SearchNavbar.vue';

export default {
  name: 'Navbar',
  components: { SearchBar },
  data() {
    return {
      isActive: true,
      searchVisible: true, // Controla se a search bar deve ser exibida
    };
  },
  methods: {
    toggleMenu() {
      this.isActive = !this.isActive;
    }
  },
  mounted() {
    // Condição para exibir a search bar.
    // Por exemplo, você pode definir que ela só apareça em determinadas rotas ou estados.
    // Aqui vamos exibi-la sempre (ajuste conforme necessário):
    this.searchVisible = true;
  }
};
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid #ddd;
}
</style>
