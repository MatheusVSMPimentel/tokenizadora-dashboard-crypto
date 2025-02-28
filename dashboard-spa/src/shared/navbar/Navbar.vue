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
      <div class="navbar-end">
        <a class="navbar-item" href="#">Home</a>
        <a class="navbar-item" href="#">Profile</a>
        <a class="navbar-item" href="#">Logout</a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    toggleMenu() {
      this.isActive = !this.isActive;
    }
  }
}
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid #ddd;
}
</style>
