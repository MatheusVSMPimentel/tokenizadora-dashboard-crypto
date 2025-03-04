<template>
  <div class="card">
    <img :src="coin.imageUrl" alt="Logo da moeda" class="card-img" />
    <h2 class="card-title">{{ coin.name }}</h2>
    <p class="card-symbol">Símbolo: {{ coin.symbol }}</p>
    <p class="card-price">Preço: {{ coin.price }}</p>
    <p class="card-change">
      Variação:
      <span :class="{'positive': coin.percentualChange >= 0, 'negative': coin.percentualChange < 0}">
        {{ coin.percentualChange.toFixed(2) }}%
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
    coin: {
      type: Object,
      required: true,
    },
  },
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
