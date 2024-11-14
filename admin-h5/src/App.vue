<template>
  <a-config-provider>
    <div class="app">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </a-config-provider>
</template>

<style>
body {
  margin: 0;
  background-color: #f5f5f5;
}

.app {
  min-height: 100vh;
  padding: 24px;
}
</style> 