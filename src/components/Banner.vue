<script setup>
import { ref } from "vue";
const list = ref([
  "https://i.postimg.cc/25ct5HCC/Cola.jpg",
  "https://i.postimg.cc/vT6tbhZ2/Lactose-Free-Strawberry-Milkshake.jpg",
  "https://i.postimg.cc/d1hxZ80r/Milk.jpg",
  "https://i.postimg.cc/59ZZvkL0/Chocolate-Cake.jpg",
]);
</script>

<template>
  <nut-swiper
    :init-page="2"
    :auto-play="3000"
    pagination-visible
    pagination-color="#426543"
    pagination-unselected-color="#808080"
  >
    <nut-swiper-item
      v-for="(item, index) in list"
      :key="index"
      style="height: 150px"
    >
      <img
        :src="item"
        alt=""
        style="height: 100%; width: 100%"
        draggable="false"
      />
    </nut-swiper-item>
  </nut-swiper>
</template>

<style scoped></style>
