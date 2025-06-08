<script setup>
import { ref } from "vue";

const val = ref("");
const search = (text) => {
  console.log("search", text);
};
</script>

<template>
  <nut-searchbar v-model="val" @search="search"></nut-searchbar>
</template>

<style scoped></style>
