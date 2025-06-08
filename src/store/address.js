// stores/address.js
import { defineStore } from "pinia";
import apiClient from "../request.js"; // 你的 axios 实例

export const useAddressStore = defineStore("address", {
  state: () => ({
    addresses: [],        // 地址列表
    loading: false,       // 加载状态
    error: null,          // 错误信息
    selectedAddressId: null, // 当前选中的地址ID
  }),
  actions: {
    // 获取地址列表
    async fetchAddresses() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiClient.get("/api/addresses");
        this.addresses = res.data || [];
      } catch (err) {
        this.error = err.response?.data?.message || "获取地址失败";
      } finally {
        this.loading = false;
      }
    },

    // 添加新地址
    async addAddress(newAddress) {
      this.loading = true;
      this.error = null;
      try {
        await apiClient.post("/api/addresses", newAddress);
        await this.fetchAddresses(); // 重新获取最新列表
      } catch (err) {
        this.error = err.response?.data?.message || "添加地址失败";
      } finally {
        this.loading = false;
      }
    },

    // 更新地址
    async updateAddress(addressId, updates) {
      this.loading = true;
      this.error = null;
      try {
        await apiClient.put(`/api/addresses/${addressId}`, updates);
        await this.fetchAddresses();
      } catch (err) {
        this.error = err.response?.data?.message || "更新地址失败";
      } finally {
        this.loading = false;
      }
    },

    // 删除地址
    async deleteAddress(addressId) {
      this.loading = true;
      this.error = null;
      try {
        await apiClient.delete(`/api/addresses/${addressId}`);
        this.addresses = this.addresses.filter(a => a.address_id !== addressId);
      } catch (err) {
        this.error = err.response?.data?.message || "删除地址失败";
      } finally {
        this.loading = false;
      }
    },

    // 设置当前选中地址
    setSelectedAddress(addressId) {
      this.selectedAddressId = addressId;
    },
  },
});
