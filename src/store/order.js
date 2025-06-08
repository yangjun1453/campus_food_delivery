import { defineStore } from "pinia";
import axios from "axios";
import apiClient from "../request.js"
export const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: [],
  }),
  actions: {
  async fetchOrders() {
  try {
    const res = await apiClient.get("/api/orders/merchant");
    if (res.data.success) {
      this.orders = res.data.orders;
    } else {
      this.orders = [];
      console.error("获取订单失败:", res.data.message);
    }
  } catch (error) {
    console.error("请求订单接口失败:", error);
    this.orders = [];
  }
},async updateOrderStatus(orderId, newStatus) {
      try {
        const res = await apiClient.put(`/api/orders/${orderId}/status`, {
          status: newStatus,
        });

        if (res.data.success) {
          // 本地同步更新状态
          const order = this.orders.find((o) => o.order_id === orderId);
          if (order) {
            order.status = newStatus;
          }
        } else {
          console.error("修改订单状态失败:", res.data.message);
        }
      } catch (error) {
        console.error("请求更新订单状态失败:", error);
      }
    },


  },
});
