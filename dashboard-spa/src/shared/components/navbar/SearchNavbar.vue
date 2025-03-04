<template>
  <div class="search-bar">
    <div class="field">
      <p class="control has-icons-left">
        <input
          type="text"
          class="input"
          placeholder="Pesquisar moeda (ex.: BTC)"
          v-model.trim="searchTerm"
          @input="onInput"
        />
        <span class="icon is-left">
          <i class="fas fa-search"></i>
        </span>
      </p>
    </div>
    <!-- Dropdown para exibir os resultados -->
    <div v-if="searchResults.length > 0" class="dropdown is-active">
      <div class="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <a
            v-for="(coin, index) in searchResults"
            :key="index"
            class="dropdown-item"
            @click="selectCoin(coin)"
          >
            {{ coin.symbol }} - {{ coin.fullName }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchNavbar',
  data() {
    return {
      searchTerm: "",
      searchResults: [],
      timeoutId: null,
    };
  },
  methods: {
    onInput() {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.fetchResults();
      }, 300);
    },
    async fetchResults() {
      if (!this.searchTerm) {
        this.searchResults = [];
        return;
      }
      try {
        const response = await axios.get("http://localhost:3002/coins", {
          params: { filter: this.searchTerm }
        });
        // Supondo que a resposta contenha { data: [...] }
        this.searchResults = response.data.data;
      } catch (error) {
        console.error("Erro ao buscar moedas:", error);
        this.searchResults = [];
      }
    },
    selectCoin(coin) {
      // Ao clicar em um item, atualiza o input com o objeto selecionado e emite o evento com o objeto completo.
      this.searchTerm = coin.symbol;
      this.searchResults = [];
      this.$emit("coin-selected", coin);
    },
  },
};
</script>

<style scoped>
.search-bar {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
}

.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}

/* Scrollbar styling for Webkit */
.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: #888;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
