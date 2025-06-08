<template>
  <div class="order-container">
    <BackButton :path="'/login'" />
    <h2 class="order-title">可抢外卖订单</h2>

    <nut-tabs v-model="value" style="margin-bottom: 20px">
      <nut-tab-pane title="未配送" pane-key="1">
        <div class="order-list">
          <div
            v-for="(order, index) in pendingOrders"
            :key="order.order_id"
            class="order-item"
          >
            <div class="order-header">
              <p class="order-id">订单编号: {{ order.order_id }}</p>
              <p
                class="order-status"
                :class="statusClass(order.delivery_status)"
              >
                {{ deliveryStatusText(order.delivery_status) }}
              </p>
            </div>

            <div class="order-details">
              <p class="order-restaurant">{{ order.restaurant }}</p>
              <p class="order-items">
                {{
                  order.items
                    .map((item) => `${item.name} x${item.quantity}`)
                    .join(", ")
                }}
              </p>
              <p class="order-total">
                总计: ¥{{ order.total_price.toFixed(2) }}
              </p>
            </div>

            <div class="order-footer">
              <p class="order-time">{{ formatTime(order.created_at) }}</p>
              <nut-button
                type="primary"
                size="small"
                @click="grabOrder(order.order_id)"
              >
                抢单
              </nut-button>
            </div>
          </div>

          <p
            v-if="pendingOrders.length === 0"
            style="text-align: center; color: #999"
          >
            暂无未配送订单
          </p>
        </div>
      </nut-tab-pane>

      <nut-tab-pane title="配送中" pane-key="2">
        <div class="order-list">
          <div
            v-for="(order, index) in processingOrders"
            :key="order.order_id"
            class="order-item"
          >
            <div class="order-header">
              <p class="order-id">订单编号: {{ order.order_id }}</p>
            </div>

            <div class="order-details">
              <p class="order-restaurant">{{ order.restaurant }}</p>
              <p class="order-items">
                {{
                  order.items
                    .map((item) => `${item.name} x${item.quantity}`)
                    .join(", ")
                }}
              </p>
              <p class="order-total">
                总计: ¥{{ order.total_price.toFixed(2) }}
              </p>
            </div>

            <div class="order-footer">
              <p class="order-time">{{ formatTime(order.created_at) }}</p>
            </div>
          </div>

          <p
            v-if="processingOrders.length === 0"
            style="text-align: center; color: #999"
          >
            暂无配送中订单
          </p>
        </div>
      </nut-tab-pane>
    </nut-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "../request.js";

const pendingOrders = ref([]);
const processingOrders = ref([]);
const value = ref("1");

const formatTime = (time) => {
  const date = new Date(time);
  return date.toLocaleString();
};

// 拉取未配送订单
const fetchPendingOrders = async () => {
  try {
    const response = await apiClient.get("/api/orders/unassigned");
    pendingOrders.value = response.data.orders.map((order) => ({
      order_id: order.order_id,
      restaurant: order.restaurant || "未知餐厅",
      total_price: parseFloat(order.total_price),
      delivery_status: order.delivery_status || "pending",
      created_at: order.created_at,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
    }));
  } catch (error) {
    console.error("获取可抢订单失败:", error);
    pendingOrders.value = [];
  }
};

// 拉取配送中订单
const fetchProcessingOrders = async () => {
  try {
    const response = await apiClient.get("/api/orders/delivery-person");
    processingOrders.value = response.data.orders.map((order) => ({
      order_id: order.order_id,
      restaurant: order.restaurant || "未知餐厅",
      total_price: parseFloat(order.total_price),
      delivery_status: order.delivery_status,
      created_at: order.created_at,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
    }));
  } catch (error) {
    console.error("获取配送中订单失败:", error);
    processingOrders.value = [];
  }
};

// 抢单功能（只有未配送订单可抢）
const grabOrder = async (orderId) => {
  try {
    await apiClient.post(`/api/orders/${orderId}/assign`);
    alert("抢单成功！");
    // 刷新两个列表
    await fetchPendingOrders();
    await fetchProcessingOrders();
  } catch (error) {
    console.error("抢单失败:", error);
    alert("抢单失败，请重试");
  }
};

// 状态文字显示
const deliveryStatusText = (status) => {
  switch (status) {
    case "pending":
      return "未配送";
    case "processing":
      return "已分配";
    case "picked_up":
      return "已取货";
    case "delivered":
      return "已送达";
    default:
      return "未知状态";
  }
};

// 状态对应的样式类
const statusClass = (status) => {
  if (status === "delivered") return "completed";
  if (status === "picked_up") return "in-progress";
  if (status === "processing") return "processing";
  if (status === "pending") return "pending";
  return "";
};

// 挂载时拉取订单
onMounted(() => {
  fetchPendingOrders();
  fetchProcessingOrders();
});
</script>

<style scoped>
.order-container {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
}

.order-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-id {
  font-size: 1rem;
  color: #666666;
}

.order-status {
  font-size: 0.9rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
}

.completed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.in-progress {
  background-color: #fff3e0;
  color: #ef6c00;
}

.cancelled {
  background-color: #ffebee;
  color: #c62828;
}

.pending {
  background-color: #e3f2fd;
  color: #1e88e5;
}

.order-details {
  margin-bottom: 8px;
}

.order-restaurant {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333333;
}

.order-items {
  font-size: 0.9rem;
  color: #666666;
  margin: 4px 0;
}

.order-total {
  font-size: 1rem;
  color: #333333;
  font-weight: bold;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #999999;
}
</style>
