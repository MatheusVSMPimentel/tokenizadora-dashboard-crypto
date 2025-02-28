<template>
  <aside class="menu sidebar">
    <p class="menu-label">
      General
    </p>
    <ul class="menu-list">
      <li><a class="is-active" @click="navigate('dashboard')">Dashboard</a></li>
      <li><a @click="navigate('customers')">Customers</a></li>
      <li><a @click="navigate('reports')">Reports</a></li>
    </ul>
    <p class="menu-label">
      Administration
    </p>
    <ul class="menu-list">
      <li><a @click="navigate('team-settings')">Team Settings</a></li>
      <li><a @click="navigate('manage-team')">Manage Your Team</a></li>
      <li><a @click="navigate('invitations')">Invitations</a></li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  methods: {
    navigate(page) {
      // Implementar navegação conforme necessário; pode ser com Vue Router
      console.log(`Navigate to ${page}`);
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 1rem;
  border-right: 1px solid #ddd;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
}
</style>
