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
      meta: { requiresAuth: true, role: "student" },
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
    {
      path: "/admin",
      component: Admin,
      meta: { requiresAuth: true, role: "admin" },
    },
  ],
});

// 先导出路由实例
export default router;

// 然后再导入其他依赖
import { useUserStore } from "../store/user.js";
import UnfinishedOrders from "../pages/UnfinishedOrders.vue";
import Recommendations from "../pages/Recommendations.vue";
import Addresses from "../pages/Addresses.vue";
import Admin from "../pages/Admin.vue";

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  userStore.initialize();

  // 管理员只能访问 /admin 和 /login
  if (
    userStore.token &&
    userStore.isAdmin() &&
    to.path !== "/admin" &&
    to.path !== "/login"
  ) {
    next("/admin");
    return;
  }

  // 商家只能访问 /merchant 和 /login
  if (
    userStore.token &&
    userStore.isMerchant() &&
    to.path !== "/merchant" &&
    to.path !== "/login"
  ) {
    next("/merchant");
    return;
  }

  // 外卖员只能访问 /delivery 和 /login
  if (
    userStore.token &&
    userStore.isDelivery() &&
    to.path !== "/delivery" &&
    to.path !== "/login"
  ) {
    next("/delivery");
    return;
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!userStore.token) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
      return;
    }
    if (to.meta.role) {
      const requiredRole = to.meta.role;
      let hasPermission = false;
      switch (requiredRole) {
        case "admin":
          hasPermission = userStore.isAdmin();
          break;
        case "merchant":
          hasPermission = userStore.isMerchant();
          break;
        case "student":
          hasPermission = userStore.isUser();
          break;
        case "delivery":
          hasPermission = userStore.isDelivery();
          break;
      }
      if (!hasPermission) {
        next("/home");
        return;
      }
    }
  }

  if (to.path === "/login" && userStore.token) {
    if (userStore.isAdmin()) {
      next("/admin");
    } else if (userStore.isMerchant()) {
      next("/merchant");
    } else {
      next("/profile");
    }
    return;
  }

  next();
});
