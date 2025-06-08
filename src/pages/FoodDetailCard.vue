<template>
  <div class="container">
    <div class="content">
      <!-- 头部 -->
      <div class="header">
        <div class="header__icon" @click="toHome">
          <img src="/img/svg/上一步_back.svg" alt="返回" />
        </div>
        <div class="header__title">食物细节</div>
        <div class="header__icon" @click="toCart">
          <img src="/img/svg/购物车1_shopping-cart-one.svg" alt="购物车" />
        </div>
      </div>

      <!-- 图片 -->
      <div class="img-box">
        <img :src="food.imgUrl" alt="食品图片" class="img-box__food" />
      </div>

      <!-- 商品信息 -->
      <div class="product-info">
        <div class="product-info__title">
          <h2>{{ food.title }}</h2>
        </div>
        <div class="product-info__favorite">
          <img src="/img/svg/喜欢_like.svg" alt="收藏" />
        </div>
      </div>

      <!-- 描述 -->
      <p class="description">{{ food.delivery }}</p>

      <!-- 价格区域 -->
      <div class="price-section">
        <h2 class="price-section__value">¥{{ food.price }}</h2>
        <p class="price-section__feature">{{ food.shopName }}</p>
      </div>

      <!-- 操作区域 -->
      <div class="actions">
        <div class="quantity-control">
          <div class="quantity-control__button" @click="decreaseQuantity">
            -
          </div>
          <div class="quantity-control__value">{{ quantity }}</div>
          <div class="quantity-control__button" @click="increaseQuantity">
            +
          </div>
        </div>
        <div class="add-to-cart" @click="addToCart">
          <img src="/img/svg/购物车1_shopping-cart-one.svg" alt="购物车" />
          <p>加入购物车</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "../store/cart";
import apiClient from "../request.js";

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();

const food = ref({});
const quantity = ref(1);

// 导航方法
const toHome = () => router.push("/home");
const toCart = () => router.push("/cart");

// 获取商品详情
const foodId = ref(parseInt(route.params.id));
onBeforeMount(async () => {
  try {
    const response = await apiClient.get(`/api/items/${foodId.value}`);
    if (response.data && response.data.item) {
      food.value = {
        id: response.data.item.item_id,
        imgUrl:
          response.data.item.img_url ||
          "https://i.postimg.cc/7Z7P025v/rice.jpg",
        title: response.data.item.name,
        price: response.data.item.price.toString(),
        delivery: response.data.item.description,
        shopName: response.data.item.shopName || "未知店铺",
        merchant_id: response.data.item.merchant_id,
      };
    } else {
      throw new Error("商品数据格式错误");
    }
  } catch (error) {
    console.error("获取商品详情失败:", error);
    // 兜底数据
    food.value = {
      id: foodId.value,
      imgUrl: "https://i.postimg.cc/7Z7P025v/rice.jpg",
      title: "未知商品",
      price: "0",
      delivery: "暂无描述",
      shopName: "未知店铺",
    };
  }
});

// 数量控制
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};
const increaseQuantity = () => {
  quantity.value++;
};

// 加入购物车
const addToCart = () => {
  const cartItem = {
    ...food.value,
    quantity: quantity.value,
  };
  cartStore.addItemToCart(cartItem);
  console.log("商品已加入购物车:", cartItem);
};
</script>

<style scoped>
/* 样式保持不变 */
.content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__icon {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 10px;
  border: 1px solid #f0f0f0;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.06);
}

.header__title {
  font-size: 18px;
}

.img-box {
  display: flex;
  justify-content: center;
  width: 100%;
}

.img-box__food {
  width: 300px;
  height: 300px;
  border-radius: 50%;
}

.product-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-info__title {
  width: 50%;
}

.product-info__favorite {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 10px;
  border: 1px solid #f0f0f0;
}

.description {
  color: #868e96;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.price-section__value {
  font-size: 24px;
}

.price-section__feature {
  font-size: 14px;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.quantity-control {
  display: flex;
  width: 40%;
  gap: 10px;
  border-radius: 20px;
  background-color: #f8f9fa;
  padding: 10px;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.06);
}

.quantity-control__button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #adb5bd;
}

.quantity-control__value {
  font-size: 16px;
}

.add-to-cart {
  display: flex;
  width: 40%;
  gap: 10px;
  border-radius: 20px;
  background-color: #f8f9fa;
  padding: 10px;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;
}

.add-to-cart:active {
  transform: scale(0.95);
}

.add-to-cart img {
  width: 20px;
  height: 20px;
}

.add-to-cart p {
  font-size: 14px;
}
</style>
