import { defineStore } from "pinia";
import apiClient from "../request.js";

export const useItemsStore = defineStore("items", {
  state: () => ({
    items: [], // 商品列表
  }),
  actions: {
    // 获取商家的商品列表
    async fetchItems(merchantId) {
      try {
        console.log("Fetching items with merchantId:", merchantId);
        const response = await apiClient.get(
          `/api/merchant/items?merchant_id=${merchantId}`
        );
        this.items = response.data.items || [];
        console.log("Fetched items:", this.items);
      } catch (error) {
        console.error(
          "获取商品列表失败:",
          error.response?.data || error.message
        );
        // 不清空 items，保留现有数据
      }
    },

    // 添加商品
    async addItem(newItem, merchantId) {
      try {
        const payload = { ...newItem, merchant_id: merchantId };
        console.log("Sending payload to backend:", payload);
        await apiClient.post("/api/merchant/items", payload);
        await this.fetchItems(merchantId);
        console.log("Items after add:", this.items);
      } catch (error) {
        console.error("添加商品失败:", error);
      }
    },

    // 编辑商品
    async editItem(itemId, updatedItem, merchantId) {
      try {
        console.log("Editing item:", { itemId, updatedItem, merchantId });
        await apiClient.put(`/api/merchant/items/${itemId}`, updatedItem);
        await this.fetchItems(merchantId);
        console.log("Items after edit:", this.items);
      } catch (error) {
        console.error("编辑商品失败:", error);
      }
    },

    // 删除商品
    async deleteItem(itemId, merchantId) {
      try {
        await apiClient.delete(`/api/merchant/items/${itemId}`);
        await this.fetchItems(merchantId); // 刷新商品列表
      } catch (error) {
        console.error("删除商品失败:", error);
      }
    },
  },
});
