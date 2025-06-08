<template>
  <div class="cart">
    <div class="cart-header">
      <h2>购物车</h2>
    </div>

    <div v-if="cartItems.length > 0" class="cart-items">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.imgUrl" alt="Item Image" class="cart-item-image" />
        <div class="cart-item-info">
          <h3>{{ item.title }}</h3>
          <div class="cart-item-controls">
            <button
              @click="decreaseQuantity(item.id)"
              class="cart-item-decrease"
            >
              -
            </button>
            <span class="cart-item-quantity">{{ item.quantity }}</span>
            <button
              @click="increaseQuantity(item.id)"
              class="cart-item-increase"
            >
              +
            </button>
          </div>
        </div>
        <div class="cart-item-price">¥{{ item.price }}</div>
        <button class="delete-btn" @click="removeItemFromCart(item.id)">
          删除
        </button>
      </div>
    </div>

    <div v-else class="cart-empty">购物车是空的</div>

    <!-- 地址选择区域 -->
    <div v-if="cartItems.length > 0" class="address-selection">
      <h3>选择收货地址</h3>
      <ul>
        <li
          v-for="address in addressStore.addresses"
          :key="address.address_id"
          :class="{ selected: selectedAddressId === address.address_id }"
          @click="selectedAddressId = address.address_id"
        >
          {{ address.detail || address.address }}
        </li>
      </ul>
      <div v-if="error" class="error">{{ error }}</div>
    </div>

    <div v-if="cartItems.length > 0" class="cart-footer">
      <div class="cart-total">
        <span>总计: </span>
        <span class="total-price">¥{{ totalPrice }}</span>
      </div>
      <button class="checkout-btn" @click="checkout">结算</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../store/cart.js";
import { useAddressStore } from "../store/address.js";
import apiClient from "../request.js";

const cartStore = useCartStore();
const addressStore = useAddressStore();
const router = useRouter();

const selectedAddressId = ref(null);
const error = ref(null);

const cartItems = cartStore.cartItems;
const totalPrice = cartStore.totalPrice;

const removeItemFromCart = (id) => {
  cartStore.removeItemFromCart(id);
};

const increaseQuantity = (id) => {
  cartStore.increaseQuantity(id);
};

const decreaseQuantity = (id) => {
  cartStore.decreaseQuantity(id);
};

const checkout = async () => {
  error.value = null;
  if (!selectedAddressId.value) {
    error.value = "请先选择收货地址";
    return;
  }
  if (cartItems.length === 0) {
    error.value = "购物车为空";
    return;
  }

  // 模拟支付过程
  const paymentSuccess = await simulatePayment();
  if (!paymentSuccess) {
    alert("支付失败，请重试");
    return;
  }

  try {
    const orderData = {
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      total_price: parseFloat(totalPrice),
      address_id: selectedAddressId.value,
      merchant_id: cartItems[0].merchant_id,
    };

    const response = await apiClient.post("/api/orders", orderData);
    console.log("订单提交成功:", response.data);

    cartStore.clearCart();
    router.push("/allOrders");
  } catch (err) {
    console.error("结算失败:", err);
    error.value = err.response?.data?.message || "订单提交失败，请重试";
  }
};

const simulatePayment = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
};

onMounted(async () => {
  await addressStore.fetchAddresses();
  // 默认选中第一个地址
  if (addressStore.addresses.length > 0) {
    selectedAddressId.value = addressStore.addresses[0].address_id;
  }
});
</script>

<style scoped>
.cart {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  padding: 20px;
}

.cart-header {
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.cart-header h2 {
  font-size: 18px;
  font-weight: bold;
}

.cart-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.cart-item-image {
  width: 100px;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
}

.cart-item-info {
  flex: 1;
  margin-left: 10px;
}

.cart-item-info h3 {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.cart-item-decrease,
.cart-item-increase {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 5px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
}

.cart-item-quantity {
  margin: 0 10px;
  font-size: 14px;
  color: #333;
}

.delete-btn {
  background: #e74c3c;
  border: none;
  color: white;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.cart-empty {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin: 40px 0;
}

.address-selection {
  margin-bottom: 20px;
}

.address-selection h3 {
  margin-bottom: 10px;
  font-weight: 600;
}

.address-selection ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.address-selection li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.address-selection li:last-child {
  border-bottom: none;
}

.address-selection li.selected {
  background-color: #def;
  border-left: 4px solid #007bff;
}

.error {
  color: red;
  margin-top: 8px;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.cart-total {
  font-size: 16px;
  font-weight: bold;
}

.checkout-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.checkout-btn:hover {
  background-color: #218838;
}
</style>
