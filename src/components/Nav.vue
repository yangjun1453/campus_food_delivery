<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const tabs = [
  {
    title: "首页",
    path: "/home",
    icon: {
      active: "./img/svg/首页_home红.svg",
      unactive: "./img/svg/首页_home.svg",
    },
  },
  {
    title: "推荐",
    path: "/recommendations",
    icon: {
      active: "./img/svg/全部_all-application红.svg",
      unactive: "./img/svg/全部_all-application.svg",
    },
  },
  {
    title: "购物车",
    path: "/cart",
    icon: {
      active: "./img/svg/购物车_shopping红.svg",
      unactive: "./img/svg/购物车_shopping.svg",
    },
  },
  {
    title: "个人中心",
    path: "/profile",
    icon: {
      active: "./img/svg/我的_me红.svg",
      unactive: "./img/svg/我的_me.svg",
    },
  },
];
const active = ref(0);

const tabSwitch = (item, index) => {
  const selectedTab = tabs[index];
  if (selectedTab) {
    router.push(selectedTab.path);
  }
};
</script>

<template>
  <nut-tabbar v-model="active" @tab-switch="tabSwitch">
    <nut-tabbar-item
      v-for="(tab, index) in tabs"
      :key="index"
      :tab-title="tab.title"
    >
      <template #icon="props">
        <img :src="props.active ? tab.icon.active : tab.icon.unactive" alt="" />
      </template>
    </nut-tabbar-item>
  </nut-tabbar>
</template>

<style scoped></style>
