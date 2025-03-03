<template>
  <div class="dashboard-container">
    <Sidebar />
    <div class="main-content">
      <!-- Navbar com SearchBar embutida -->
      <Navbar @coin-selected="handleCoinSelected" />
      <section class="section">
        <div class="container">
          <!-- Exibe os cards para as moedas selecionadas -->
          <div v-if="selectedCoins && selectedCoins.length > 0">
            <div class="columns is-multiline">
              <div class="column is-one-quarter" v-for="(coin, index) in selectedCoins" :key="index">
                <CardComponent :title="coin.symbol">
                  <div class="content">
                    <figure class="image is-128x128">
                      <img :src="'https://www.cryptocompare.com'+coin.imageUrl" alt="Logo da moeda" />
                    </figure>
                    <p>{{ coin.fullName }}</p>
                  </div>
                </CardComponent>
              </div>
            </div>
          </div>
          <div v-else>
            <p>Selecione uma moeda na barra de pesquisa para ver suas informações.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import CryptoCardComponent from './components/CryptoCardComponent.vue';
import Navbar from '../shared/components/navbar/Navbar.vue';

export default {
  name: 'Dashboard',
  components: {
    CryptoCardComponent,
    Navbar
  },
  data() {
    return {
      selectedCoins: []
    };
  },
  methods: {
    handleCoinSelected(coin) {
      // Verifica se a moeda já foi selecionada.
      if (!this.selectedCoins.some(c => c.symbol === coin.symbol)) {
        this.selectedCoins.push(coin);
      }
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 1rem;
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
