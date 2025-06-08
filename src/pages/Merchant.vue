<template>
  <div class="merchant-container">
    <h1>商家后台</h1>
    <div class="header">
      <p>欢迎回来，{{ userInfo.username }}！</p>
      <button class="logout" @click="handleLogout">退出登录</button>
    </div>

    <nut-tabs v-model="value" type="smile">
      <nut-tab-pane title="添加商品" pane-key="1">
        <!-- 添加商品表单 -->
        <form @submit.prevent="addItem" class="add-form" v-if="showAddForm">
          <input v-model="newItem.name" placeholder="商品名称" required />
          <textarea
            v-model="newItem.description"
            placeholder="商品描述"
          ></textarea>
          <input
            v-model.number="newItem.price"
            type="number"
            step="0.01"
            placeholder="价格"
            required
          />
          <input
            v-model.number="newItem.calories"
            type="number"
            placeholder="热量 (卡路里)"
          />
          <input
            v-model.number="newItem.protein"
            type="number"
            step="0.01"
            placeholder="蛋白质 (克)"
          />
          <input
            v-model.number="newItem.fat"
            type="number"
            step="0.01"
            placeholder="脂肪 (克)"
          />
          <input
            v-model.number="newItem.carbs"
            type="number"
            step="0.01"
            placeholder="碳水化合物 (克)"
          />
          <input v-model="newItem.category" placeholder="类别 (如主食、饮品)" />
          <button type="submit">添加商品</button>
        </form>
        <button @click="showAddForm = !showAddForm">
          {{ showAddForm ? "收起添加商品表单" : "添加商品" }}
        </button>
      </nut-tab-pane>
      <nut-tab-pane title="编辑商品" pane-key="2">
        <!-- 商品列表 -->
        <ul>
          <li v-for="item in items" :key="item.item_id">
            <span>{{ item.name }} - ¥{{ item.price }}</span>
            <div>
              <button @click="editItem(item)">编辑</button>
              <button class="delete" @click="deleteItem(item.item_id)">
                删除
              </button>
            </div>
          </li>
        </ul>
      </nut-tab-pane>
      <nut-tab-pane title="订单管理" pane-key="3">
        <div>
          <h2>订单管理</h2>
          <div v-if="orders.length === 0">暂无订单</div>
          <!-- <ul v-else>
            <li
              v-for="order in orders"
              :key="order.order_id"
              class="order-item"
            >
              <p><strong>订单号:</strong> {{ order.order_id }}</p>
              <p><strong>用户ID:</strong> {{ order.user_id }}</p>
              <p><strong>状态:</strong> {{ order.status }}</p>
              <p><strong>总价:</strong> ¥{{ order.total_price }}</p>
              <p><strong>下单时间:</strong> {{ order.created_at }}</p>
              <p><strong>地址ID:</strong> {{ order.address_id }}</p>
              <div>
                
                
              </div>
            </li>

            
          </ul> -->

          <div v-else v-for="order in orders" class="order-item">
            <p><strong>订单号:</strong> {{ order.order_id }}</p>
            <p><strong>用户ID:</strong> {{ order.user_id }}</p>
            <p>
              <strong>状态:</strong> {{ translateOrderStatus(order.status) }}
            </p>
            <p><strong>总价:</strong> {{ order.total_price }}</p>
            <p>
              <strong>下单时间:</strong>
              {{ new Date(order.created_at).toLocaleString() }}
            </p>

            <button
              @click="cancelOrder(order.order_id)"
              style="margin-right: 20px"
            >
              取消订单
            </button>
            <button @click="notifyPickup(order.order_id)">通知取餐</button>
          </div>
        </div>
      </nut-tab-pane>
    </nut-tabs>

    <!-- 编辑商品弹窗 -->
    <div v-if="isEditing" class="edit-modal">
      <h2>编辑商品</h2>
      <form @submit.prevent="saveEdit">
        <input v-model="editingItem.name" placeholder="商品名称" required />
        <textarea
          v-model="editingItem.description"
          placeholder="商品描述"
        ></textarea>
        <input
          v-model.number="editingItem.price"
          type="number"
          step="0.01"
          placeholder="价格"
          required
        />
        <input
          v-model.number="editingItem.calories"
          type="number"
          placeholder="热量 (卡路里)"
        />
        <input
          v-model.number="editingItem.protein"
          type="number"
          step="0.01"
          placeholder="蛋白质 (克)"
        />
        <input
          v-model.number="editingItem.fat"
          type="number"
          step="0.01"
          placeholder="脂肪 (克)"
        />
        <input
          v-model.number="editingItem.carbs"
          type="number"
          step="0.01"
          placeholder="碳水化合物 (克)"
        />
        <input
          v-model="editingItem.category"
          placeholder="类别 (如主食、饮品)"
        />
        <button type="submit">保存</button>
        <button type="button" @click="cancelEdit">取消</button>
      </form>
    </div>

    <!-- 添加商品按钮 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useOrdersStore } from "../store/order.js";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user.js";
import { useItemsStore } from "../store/items.js";

const value = ref("1");
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const router = useRouter();
const ordersStore = useOrdersStore();
const orders = ref([]);
import apiClient from "../request.js";
onMounted(() => {
  if (userInfo.value.merchantId) {
    ordersStore.fetchOrders(userInfo.value.merchantId).then(() => {
      orders.value = ordersStore.orders;
    });
  }
});
const itemsStore = useItemsStore();
const { items } = storeToRefs(itemsStore);
const showAddForm = ref(false);
// 新增商品表单数据
const newItem = ref({
  name: "",
  description: "",
  price: 0,
  calories: null,
  protein: null,
  fat: null,
  carbs: null,
  category: "",
});

// 编辑商品相关状态
const isEditing = ref(false);
const editingItem = ref({});

// 页面加载时获取商品列表
onMounted(() => {
  itemsStore.fetchItems(userInfo.value.merchantId);
});

// 添加商品
const addItem = () => {
  if (!userInfo.value.merchantId) {
    console.error("merchantId is undefined, cannot add item");
    return;
  }
  itemsStore.addItem(newItem.value, userInfo.value.merchantId);
  newItem.value = {
    name: "",
    description: "",
    price: 0,
    calories: null,
    protein: null,
    fat: null,
    carbs: null,
    category: "",
  };
};

// 编辑商品
const editItem = (item) => {
  isEditing.value = true;
  editingItem.value = { ...item }; // 深拷贝商品信息
};
const translateOrderStatus = (status) => {
  const statusMap = {
    pending: "待处理",
    processing: "处理中",
    completed: "已完成",
    cancelled: "已取消",
    ready: "餐品已备好",
    picked_up: "外卖员已拿走",
  };
  return statusMap[status] || "未知状态";
};

// 保存编辑
const saveEdit = () => {
  itemsStore.editItem(
    editingItem.value.item_id,
    editingItem.value,
    userInfo.value.merchantId
  );
  isEditing.value = false;
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
};

// 删除商品
const deleteItem = (itemId) => {
  itemsStore.deleteItem(itemId, userInfo.value.merchantId);
};

// 退出登录
const handleLogout = () => {
  userStore.logout();
  router.push("/login");
};
const cancelOrder = async (orderId) => {
  try {
    await ordersStore.updateOrderStatus(orderId, "cancelled");
    // 更新后自动响应，Pinia 会重新渲染
  } catch (error) {
    console.error("取消订单失败", error);
  }
};

const notifyPickup = async (orderId) => {
  try {
    const res = await apiClient.put(`/api/orders/${orderId}/status`, {
      status: "ready", // 这里改为 'ready'
    });
    if (res.data.message) {
      alert("已通知外卖员取餐");
      await ordersStore.fetchOrders(userInfo.value.merchantId);
      orders.value = ordersStore.orders;
    }
  } catch (error) {
    console.error("通知失败:", error);
    alert("通知失败");
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.merchant-container {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
}

p {
  font-size: 1rem;
  color: #666666;
  text-align: center;
  margin-bottom: 10px;
}

button {
  padding: 8px 16px;
  font-size: 0.9rem;
  color: #ffffff;
  background-color: #1e88e5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #1565c0;
}

button.logout {
  background-color: #c62828;
  margin-bottom: 20px;
}

button.logout:hover {
  background-color: #b71c1c;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

li {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

li:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

li span {
  font-size: 1rem;
  color: #333333;
}

li button {
  margin-left: 10px;
  background-color: #2e7d32;
}

li button:hover {
  background-color: #1b5e20;
}

li button.delete {
  background-color: #c62828;
}

li button.delete:hover {
  background-color: #b71c1c;
}

.add-form,
.edit-modal form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input,
textarea {
  padding: 8px;
  font-size: 0.9rem;
  border: 1px solid #dddddd;
  border-radius: 4px;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

input:focus,
textarea:focus {
  border-color: #1e88e5;
  box-shadow: 0 0 5px rgba(30, 136, 229, 0.3);
}

.edit-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.edit-modal h2 {
  font-size: 1.25rem;
  color: #333333;
  margin-bottom: 15px;
}

.edit-modal button {
  background-color: #2e7d32;
}

.edit-modal button:hover {
  background-color: #1b5e20;
}

.edit-modal button[type="button"] {
  background-color: #999999;
}

.edit-modal button[type="button"]:hover {
  background-color: #666666;
}

.order-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  font-size: 0.95rem;
  color: #333;
}

.order-item:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.order-item p {
  margin: 6px 0;
  text-align: left;
}

.order-item p strong {
  color: #1e88e5;
  width: 80px;
  display: inline-block;
}

.order-item > div {
  margin-top: 10px;
  /* 这里可以放按钮或者其他操作区 */
}
</style>
