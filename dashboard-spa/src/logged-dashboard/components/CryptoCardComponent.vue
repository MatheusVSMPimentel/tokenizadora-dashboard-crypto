<template>
  <div class="card">
    <img :src="coin.imageUrl" alt="Logo da moeda" class="card-img" />
    <h2 class="card-title">{{ coin.name }}</h2>
    <p class="card-symbol">Símbolo: {{ coin.symbol }}</p>
    <p class="card-price">Preço: {{ coin.price }}</p>
    <p class="card-change">
      Variação:
      <span :class="{'positive': coin.percentualChange >= 0, 'negative': coin.percentualChange < 0}">
        {{ coin.percentualChange !== undefined ? coin.percentualChange.toFixed(2) : '0.00' }}%
      </span>
    </p>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  name: "CryptoCard",
  props: {
    // Força que o símbolo seja passado e define um valor default (vazio) para evitar erros
    symbol: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      socket: null,
      coin: {
        name: "Desconhecido",
        symbol: this.symbol,
        price: 0,
        percentualChange: 0,
        imageUrl: "", // placeholder se não houver imagem
      },
    };
  },
  setup(props) {
    onBeforeUnmount(() => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    });
    return {};
  },
  computed: {
    // Retorna o símbolo em maiúsculas, mas só se houver valor; caso contrário, retorna uma string vazia.
    symbolUpper() {
      return this.symbol ? this.symbol.toUpperCase() : '';
    },
  },
  mounted() {
    // Se o símbolo não estiver definido, não se conecta.
    if (!this.symbolUpper) {
      console.error("Não foi definido um símbolo válido para a moeda.");
      return;
    }
    this.socket = io("http://localhost:3002");
    this.socket.emit("subscribe-to-crypto", { symbol: this.symbolUpper });
    this.socket.on("crypto-update", (data) => {
      if (data && data.symbol === this.symbolUpper) {
        this.coin = data; // Atualiza os dados do card
      }
    });
    this.socket.on("connect_error", (err) => {
      console.error("Erro de conexão:", err);
    });
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    next();
  }
};
</script>


<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  max-width: 300px;
  margin: 16px auto;
  text-align: center;
}

.card-img {
  width: 128px;
  height: 128px;
  object-fit: contain;
}

.positive {
  color: green;
}

.negative {
  color: red;
}
</style>
