<script setup>
import Nav from "./components/Nav.vue";
import { useUserStore } from "./store/user.js";
import { onMounted } from "vue";
onMounted(() => {
  userStore.initialize();
});

const userStore = useUserStore();
</script>

<template>
  <div class="home">
    <router-view class="content"></router-view>
  </div>
  <Nav class="nav" />
</template>

<style scoped>
.home {
  padding-bottom: var(--nut-tabbar-height, 15.625vw);
}

.nav {
  position: fixed;
  bottom: 0;

  width: 100%;

  z-index: 1000;
}
</style>
