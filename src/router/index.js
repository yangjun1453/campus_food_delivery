import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Profile from "../pages/Profile.vue";
import FoodDetailCard from "../pages/FoodDetailCard.vue";
import Merchant from "../pages/Merchant.vue";
import Cart from "../pages/Cart.vue";
import FoodPreferences from "../pages/FoodPreferences.vue";
import HealthGoals from "../pages/HealthGoals.vue";
import AllOrder from "../pages/AllOrder.vue";
import Delivery from "../pages/Delivery.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      component: Home,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/recommendations",
      component: Recommendations,
    },
    {
      path: "/profile",
      component: Profile,
      meta: { requiresAuth: true, role: "user" },
    },
    {
      path: "/merchant",
      component: Merchant,
      meta: { requiresAuth: true, role: "merchant" },
    },
    {
      path: "/delivery",
      component: Delivery,
      meta: {
        requiresAuth: true,
        role: "delivery",
      },
    },
    {
      path: "/food/:id",
      component: FoodDetailCard,
      name: "foodDetail",
    },
    {
      path: "/cart",
      component: Cart,
    },
    {
      path: "/foodPreferences",
      component: FoodPreferences,
      meta: { requiresAuth: true },
    },
    {
      path: "/healthGoals",
      component: HealthGoals,
      meta: { requiresAuth: true },
    },
    {
      path: "/allOrders",
      component: AllOrder,
      meta: { requiresAuth: true },
    },
    {
      path: "/unfinishedOrders",
      component: UnfinishedOrders,
      meta: { requiresAuth: true },
    },
    {
      path: "/address",
      component: Addresses,
    },
  ],
});

export default router;

import { useUserStore } from "../store/user.js";
import UnfinishedOrders from "../pages/UnfinishedOrders.vue";
import Recommendations from "../pages/Recommendations.vue";
import Addresses from "../pages/Addresses.vue";
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  console.log("Navigating to:", to.path);
  console.log("User info:", userStore.userInfo);

  if (to.meta.requiresAuth) {
    if (!userStore.userInfo || Object.keys(userStore.userInfo).length === 0) {
      console.log("未登录，重定向到 /login");
      next("/login");
    } else if (to.meta.role && to.meta.role !== userStore.userInfo.role) {
      console.log("角色不匹配，检查重定向");
      if (userStore.isMerchant()) {
        next("/merchant");
      } else if (userStore.isUser()) {
        next("/profile");
      } else if (userStore.isDelivery) {
        next("/delivery");
      } else {
        console.log("未知角色，重定向到 /login");
        next("/login"); // 未匹配任何角色时跳转登录
      }
    } else {
      console.log("允许访问");
      next();
    }
  } else {
    console.log("无需权限，直接放行");
    next();
  }
});
