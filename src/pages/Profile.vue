<template>
  <div>
    <div class="header">
      <nut-avatar size="large">
        <img :src="url" />
      </nut-avatar>
      <p class="header__title">{{ userStore.userInfo?.username }}</p>
      <p class="header__email">{{ userStore.userInfo?.email }}</p>
    </div>

    <div class="content">
      <!-- 我的订单 -->
      <SectionList label="我的订单" :items="orderItems" />

      <!-- 个人偏好设置 -->
      <SectionList
        label="个人偏好设置"
        :items="preferenceItems"
        :isLastItemRed="true"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import SectionList from "../components/SectionList.vue";
import { useUserStore } from "../store/user.js";
import router from "../router/index.js";

const userStore = useUserStore();

const url = "https://api.dicebear.com/6.x/avataaars/svg?seed=johndoe";

// 我的订单数据
const orderItems = reactive([
  { icon: "/img/svg/保存_save.svg", text: "全部订单", path: "/allOrders" },
  {
    icon: "/img/svg/继续_go-on.svg",
    text: "未完成订单",
    path: "/unfinishedOrders",
  },
]);
const handleLogout = () => {
  userStore.logout(); // 调用 Pinia Store 的登出方法
  router.push("/login"); // 跳转到登录页面
};
// 个人偏好设置数据
const preferenceItems = reactive([
  {
    icon: "/img/svg/追踪_trace.svg",
    text: "个人健康目标",
    path: "/healthGoals",
  },
  {
    icon: "/img/svg/面条_bowl.svg",
    text: "饮食偏好",
    path: "/foodPreferences",
  },
  {
    icon: "/img/svg/保存_save.svg",
    text: "地址管理",
    path: "/address",
  },
  {
    icon: "/img/svg/退出_logout.svg",
    text: "登出",
    onClick: handleLogout,
  },
]);
</script>
<style scoped>
/* Header */
.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
}

.header__title {
  font-size: 25px;
  font-weight: 400;
  margin-top: 15px;
  margin-bottom: 8px;
}

.header__email {
  color: #868e96;
  font-size: 12px;
}

.header__btn {
  margin-top: 15px;
}

/* Content */
.content {
  width: 90%;
  margin: 40px auto;
}
</style>
