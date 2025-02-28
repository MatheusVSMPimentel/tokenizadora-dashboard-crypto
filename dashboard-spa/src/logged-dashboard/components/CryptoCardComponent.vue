<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <slot></slot>
      </div>
    </div>
    <footer class="card-footer" v-if="footerLinks && footerLinks.length">
      <a v-for="(link, index) in footerLinks" :key="index" :href="link.url" class="card-footer-item">
        {{ link.label }}
      </a>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'CryptoCardComponent',
  props: {
    title: {
      type: String,
      required: true
    },
    footerLinks: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
</style>
