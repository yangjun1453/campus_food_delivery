<!--<template>-->
<!--  <div class="order-container">-->
<!--    <BackButton :path="'/profile'" />-->
<!--    <h2 class="order-title">我的外卖订单</h2>-->

<!--    <div class="order-list">-->
<!--      <div v-for="(order, index) in orders" :key="index" class="order-item">-->
<!--        <div class="order-header">-->
<!--          <p class="order-id">订单编号: {{ order.order_id }}</p>-->
<!--          <p class="order-status" :class="statusClass(order.status)">-->
<!--            {{ orderStatusText(order.status) }}-->
<!--          </p>-->
<!--        </div>-->

<!--        <div class="order-details">-->
<!--          <p class="order-restaurant">{{ order.restaurant }}</p>-->
<!--          <p class="order-items">-->
<!--            {{-->
<!--              order.items-->
<!--                .map((item) => `${item.name} x${item.quantity}`)-->
<!--                .join(", ")-->
<!--            }}-->
<!--          </p>-->
<!--          <p class="order-total">总计: ¥{{ order.total_price.toFixed(2) }}</p>-->
<!--        </div>-->

<!--        <div class="order-footer">-->
<!--          <p class="order-time">{{ formatTime(order.created_at) }}</p>-->
<!--          <nut-button-->
<!--            v-if="order.status === 'pending'"-->
<!--            type="success"-->
<!--            size="small"-->
<!--            @click="completeOrder(order.order_id)"-->
<!--          >-->
<!--            确认完成-->
<!--          </nut-button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, onMounted } from "vue";-->
<!--import apiClient from "../request.js";-->
<!--import BackButton from "../components/BackButton.vue";-->

<!--const orders = ref([]);-->

<!--const fetchOrders = async () => {-->
<!--  try {-->
<!--    const response = await apiClient.get("/api/orders");-->
<!--    orders.value = response.data.orders.map((order) => ({-->
<!--      order_id: order.order_id,-->
<!--      user_id: order.user_id,-->
<!--      restaurant: order.restaurant,-->
<!--      total_price: parseFloat(order.total_price),-->
<!--      status: order.status,-->
<!--      created_at: order.created_at,-->
<!--      items: order.items.map((item) => ({-->
<!--        name: item.name,-->
<!--        quantity: item.quantity,-->
<!--      })),-->
<!--    }));-->
<!--  } catch (error) {-->
<!--    console.error("获取订单失败:", error);-->
<!--    orders.value = [-->
<!--      {-->
<!--        order_id: 1001,-->
<!--        user_id: 1,-->
<!--        restaurant: "校园小炒",-->
<!--        total_price: 56.8,-->
<!--        status: "completed",-->
<!--        created_at: "2023-10-01T14:30:00",-->
<!--        items: [{ name: "米饭", quantity: 1 }],-->
<!--      },-->
<!--    ];-->
<!--  }-->
<!--};-->

<!--onMounted(fetchOrders);-->

<!--// 确认订单完成-->
<!--const completeOrder = async (orderId) => {-->
<!--  try {-->
<!--    await apiClient.put(`/api/orders/${orderId}/status`, {-->
<!--      status: "completed",-->
<!--    });-->
<!--    alert("订单已标记为已完成");-->
<!--    await fetchOrders(); // 刷新订单列表-->
<!--  } catch (error) {-->
<!--    console.error("更新订单状态失败:", error);-->
<!--    alert("更新失败，请重试");-->
<!--  }-->
<!--};-->

<!--// 时间格式化-->
<!--const formatTime = (time) => {-->
<!--  const date = new Date(time);-->
<!--  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(-->
<!--    date.getHours()-->
<!--  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;-->
<!--};-->

<!--// 状态文本映射-->
<!--const orderStatusText = (status) => {-->
<!--  switch (status) {-->
<!--    case "pending":-->
<!--      return "待处理";-->
<!--    case "processing":-->
<!--      return "配送中";-->
<!--    case "completed":-->
<!--      return "已完成";-->
<!--    case "cancelled":-->
<!--      return "已取消";-->
<!--    default:-->
<!--      return "未知状态";-->
<!--  }-->
<!--};-->

<!--// 状态样式类-->
<!--const statusClass = (status) => {-->
<!--  if (status === "completed") return "completed";-->
<!--  if (status === "processing") return "in-progress";-->
<!--  if (status === "cancelled") return "cancelled";-->
<!--  return "pending";-->
<!--};-->
<!--</script>-->
<template>
  <div class="order-container">
    <BackButton :path="'/profile'" />
    <h2 class="order-title">我的外卖订单</h2>

    <div class="order-list">
      <div v-for="(order, index) in orders" :key="index" class="order-item">
        <div class="order-header">
          <p class="order-id">订单编号: {{ order.order_id }}</p>
          <p class="order-status" :class="statusClass(order.status)">
            {{ orderStatusText(order.status) }}
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
          <p class="order-total">总计: ¥{{ order.total_price.toFixed(2) }}</p>
        </div>

        <div class="order-footer">
          <p class="order-time">{{ formatTime(order.created_at) }}</p>
          <nut-button
            v-if="order.status === 'picked_up'"
            type="success"
            size="small"
            @click="completeOrder(order.order_id)"
          >
            确认收货
          </nut-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "../request.js";
import BackButton from "../components/BackButton.vue";

const orders = ref([]);

const fetchOrders = async () => {
  try {
    const response = await apiClient.get("/api/orders");
    orders.value = response.data.orders.map((order) => ({
      order_id: order.order_id,
      user_id: order.user_id,
      restaurant: order.restaurant,
      total_price: parseFloat(order.total_price),
      status: order.status,

      created_at: order.created_at,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
    }));
  } catch (error) {
    console.error("获取订单失败:", error);
    orders.value = [
      {
        order_id: 1001,
        user_id: 1,
        restaurant: "校园小炒",
        total_price: 56.8,
        status: "completed",
        created_at: "2023-10-01T14:30:00",
        items: [{ name: "米饭", quantity: 1 }],
      },
    ];
  }
};

onMounted(fetchOrders);

const completeOrder = async (orderId) => {
  try {
    await apiClient.put(`/api/orders/${orderId}/status`, {
      status: "completed",
    });
    alert("订单已标记为已完成");
    await fetchOrders();
  } catch (error) {
    console.error("更新订单状态失败:", error);
    alert("更新失败，请重试");
  }
};

const formatTime = (time) => {
  const date = new Date(time);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const orderStatusText = (status) => {
  switch (status) {
    case "pending":
      return "待商家接单";
    case "processing":
      return "商家已接单";
    case "ready":
      return "商家备餐完毕";
    case "completed":
      return "已完成";
    case "picked_up":
      return "配送中";
    case "cancelled":
      return "已取消";
    default:
      return "未知状态";
  }
};

const statusClass = (status) => {
  if (status === "completed") return "completed";
  if (status === "processing") return "in-progress";
  if (status === "ready") return "ready";
  if (status === "cancelled") return "cancelled";
  return "pending";
};
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
