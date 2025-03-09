<template>
  <div class="dashboard-container">
    <!-- Navbar com a SearchBar integrada -->
    <Navbar @coin-selected="onCoinSelected" />
    <section class="section">
      <div class="container">
        <!-- Renderiza os cards para cada moeda selecionada -->
        <div class="cards-wrapper">
          <CryptoCardComponent
            v-for="(coin, index) in selectedCoins"
            :key="index"
            :coin="coin"
            :symbol="coin.symbol"
          />
        </div>
        <div v-if="selectedCoins.length === 0">
          <p>Selecione uma moeda na barra de pesquisa para ver suas informações.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CryptoCardComponent from './components/CryptoCardComponent.vue';
import axios from 'axios';
import Navbar from '../shared/components/navbar/Navbar.vue';

export default {
  name: 'Dashboard',
  components: {
    CryptoCardComponent,
    Navbar
  },
  data() {
    return {
      selectedCoins: [],
      token: "", // JWT token, se necessário
    };
  },
  mounted() {
    // Exemplo: obter o token armazenado em localStorage
    this.token = localStorage.getItem('token') || "";
    this.fetchDashboardCoins();
  },
  methods: {
    // Método para chamar o endpoint /coins/dashboard da sua dashboard-api
    async fetchDashboardCoins() {
      try {
        const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
        const response = await axios.get('http://localhost:3002/coins/dashboard', { headers });
        // Supondo que a resposta esteja encapsulada em { success, message, data }
        this.selectedCoins = response.data.data;
      } catch (error) {
        console.error("Erro ao buscar as moedas do dashboard:", error);
        alert("Erro ao buscar as moedas do dashboard. Tente novamente.");
      }
    },
    async onCoinSelected(selected) {
      try {
        const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
        const response = await axios.get(`http://localhost:3002/coins/add/${selected.symbol}`, { headers });
        const coinData = response.data;

        // Se já existir a moeda, atualize-a; caso contrário, adicione-a
        const index = this.selectedCoins.findIndex(coin => coin.symbol === coinData.symbol);
        if (index !== -1) {
          this.selectedCoins[index] = coinData;
        } else {
          this.selectedCoins.push(coinData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da moeda:', error);
        // Verifica se o erro possui uma mensagem específica sobre a falta de par com USD.
        const errorMessage = error.response?.data?.message || error.response?.data?.Message || '';
        if (errorMessage.includes('does not exist for this coin pair')) {
          alert("Esta moeda não possui par de exchange com USD.");
        } else {
          alert("Erro ao buscar dados da moeda. Por favor, tente novamente.");
        }
      }
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.section {
  flex: 1;
}

.cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>
