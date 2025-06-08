<template>
  <div class="main" @click="goTo(props.path)">
    <img src="/img/svg/上一步_back.svg" alt="返回" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps(["path"]);
const goTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.main {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 10px;
  border: 1px solid #f0f0f0;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.06);
}
</style>
