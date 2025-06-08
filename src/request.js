import axios from "axios";
import { useUserStore } from "./store/user.js";
const apiClient = axios.create({
  baseURL: "http://localhost:3000", // 后端 API 的地址
  timeout: 5000, // 请求超时时间
});
apiClient.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.getToken(); // 获取当前 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 将 token 添加到请求头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default apiClient;
