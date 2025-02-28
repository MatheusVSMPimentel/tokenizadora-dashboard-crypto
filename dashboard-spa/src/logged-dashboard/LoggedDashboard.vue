<template>
  <div class="dashboard-container">
    <!-- Componentes na sidebar e conteúdo principal -->
    <Sidebar />
    <div class="main-content">
      <SearchNavbar @search-results="updateResults" />
      <section class="section">
        <div class="container">
          <CryptoCardComponent title="Card Title" :footerLinks="cardFooterLinks">
            Esta é uma área de conteúdo dentro do card. Exiba dados, gráficos ou estatísticas aqui.
          </CryptoCardComponent>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import CryptoCardComponent from './components/CryptoCardComponent.vue';
import SearchNavbar from './components/SearchNavbar.vue';

export default {
  name: 'Dashboard',
  components: {
    Sidebar,
    SearchNavbar,
    CryptoCardComponent
  },
  data() {
    return {
      results: [],
      cardFooterLinks: [
        { label: 'Save', url: '#' },
        { label: 'Edit', url: '#' },
        { label: 'Delete', url: '#' }
      ]
    };
  },
  methods: {
    updateResults(data) {
      this.results = data;
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
