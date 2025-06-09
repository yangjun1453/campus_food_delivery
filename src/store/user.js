import apiClient from "../request.js";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state() {
    return {
      // userInfo: {
      //   userId: null,
      //   username: "",
      //   role: "",
      //   email: "",
      //   merchantId: null,
      //   health_goal: null,
      //   preferences: null,
      // },
      // token: null,
      userInfo: null, // 未登录时初始化为 null
      token: null,
    };
  },
  actions: {
    initialize() {
      const storedUserInfo = localStorage.getItem("userInfo");
      const storedToken = localStorage.getItem("token");
      if (storedUserInfo) {
        this.userInfo = JSON.parse(storedUserInfo);
      } else {
        this.userInfo = null; // 确保未登录时为 null
      }
      if (storedToken) {
        this.token = storedToken;
      } else {
        this.token = null;
      }
      console.log("Initialized userInfo:", this.userInfo); // 调试
    },
    async login(username, password) {
      try {
        const response = await apiClient.post("/api/login", { username, password });
        const user = response.data.user;
        this.userInfo = {
          userId: user.userId,
          username: user.username,
          role: user.role,
          email: user.email,
          merchantId: user.merchantId || null,
          health_goal: user.health_goal || null,
          preferences: user.preferences || null,
        };
        this.token = response.data.token;
        localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        localStorage.setItem("token", response.data.token);
        console.log("Logged in userInfo:", this.userInfo);
        console.log("Logged in token:", this.token); // 调试
        return response.data.token;
      } catch (error) {
        throw new Error(error.response?.data?.message || "登录失败，请重试");
      }
    },    async register(userData) {
      try {
        const response = await apiClient.post("/api/register", userData);
        const user = response.data.user;
        this.userInfo = {
          userId: user.userId,
          username: user.username,
          role: user.role,
          email: user.email,
          merchantId: response.data.merchantId || null,
        };
        localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        console.log("Registered userInfo:", this.userInfo); // 调试
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "注册失败，请重试");
      }
    },
    logout() {
      this.userInfo = {
        userId: null,
        username: "",
        role: "",
        email: "",
        merchantId: null,
      };
      this.token = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
    getToken() {
      return this.token;
    },    isMerchant() {
      return this.userInfo?.role === "merchant";
    },
    isUser() {
      return this.userInfo?.role === "student" || this.userInfo?.role === "staff";
    },
    isDelivery() {
      return this.userInfo?.role === "delivery";
    },
    isAdmin() {
      return this.userInfo?.role === "admin";
    },
    // 新增更新用户信息的方法
    async updateUserInfo(updates) {
      try {
        const response = await apiClient.put("/api/user/update", updates);
        // 更新本地 userInfo
        this.userInfo = { ...this.userInfo, ...response.data.user };
        localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        console.log("Updated userInfo:", this.userInfo);
      } catch (error) {
        throw new Error(error.response?.data?.message || "更新用户信息失败");
      }
    },
  },
});
