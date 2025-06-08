<template>
  <div class="home-container">
    <!-- 头部：搜索栏和购物车入口 -->
    <div class="header">
      <SearchBar @search="handleSearch" />
      <div class="cart-icon" @click="goToCart">
        <img src="/img/svg/购物车1_shopping-cart-one.svg" alt="购物车" />
        <span v-if="totalQuantity > 0" class="cart-badge">{{
          totalQuantity
        }}</span>
      </div>
    </div>

    <!-- 横幅 -->
    <Banner />

    <!-- 个性化推荐 -->

    <!-- 所有商品（之前是热门餐品） -->
    <section class="popular-products">
      <h2>所有商品</h2>
      <div v-if="filteredProducts.length > 0" class="product-box">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.item_id"
          :product="product"
          @click="goToDetail(product.item_id)"
        />
      </div>
      <div v-else class="no-data">暂无商品</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user.js";
import { useCartStore } from "../store/cart.js";
import apiClient from "../request.js";
import ProductCard from "../components/ProductCard.vue";
import Banner from "../components/Banner.vue";
import SearchBar from "../components/SearchBar.vue";

const router = useRouter();

const cartStore = useCartStore();

const { totalQuantity } = storeToRefs(cartStore);

const popularProducts = ref([]);
const searchQuery = ref(""); // 用于存储搜索关键词

onMounted(async () => {
  // 获取所有商品（使用 /api/popular-items）
  try {
    const response = await apiClient.get("/api/popular-items");
    popularProducts.value = response.data.items.map((item) => ({
      item_id: item.item_id,
      imgUrl: item.img_url || "https://i.postimg.cc/7Z7P025v/rice.jpg",
      title: item.name,
      price: item.price.toString(),
      delivery: item.description,
      shopName: item.shopName,
    }));
  } catch (error) {
    console.error("获取所有商品失败:", error);
    popularProducts.value = [
      {
        item_id: 1,
        imgUrl: "https://i.postimg.cc/7Z7P025v/rice.jpg",
        title: "米饭",
        price: "8",
        delivery: "白米饭，基础主食",
        shopName: "校园小炒",
      },
      {
        item_id: 2,
        imgUrl: "https://i.postimg.cc/pdT03Dz4/Whole-Wheat-Bread.jpg",
        title: "全麦面包",
        price: "12",
        delivery: "健康全麦面包",
        shopName: "校园小炒",
      },
    ];
  }
});

// 计算过滤后的商品（基于搜索关键词）
const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return popularProducts.value;
  }
  const query = searchQuery.value.toLowerCase();
  return popularProducts.value.filter(
    (product) =>
      product.title.toLowerCase().includes(query) ||
      product.shopName.toLowerCase().includes(query) ||
      product.delivery.toLowerCase().includes(query)
  );
});

// 处理搜索事件
const handleSearch = (query) => {
  searchQuery.value = query;
};

const goToDetail = (id) => {
  router.push({ name: "foodDetail", params: { id } });
};

const goToCart = () => {
  router.push("/cart");
};
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 12px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.cart-icon {
  position: relative;
  cursor: pointer;
  padding: 10px;
}

.cart-icon img {
  width: 24px;
  height: 24px;
}

.cart-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff5722;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

h2 {
  font-size: 1.4rem;
  color: #333333;
  margin: 20px 0 10px;
}

.product-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 13px;
}

.no-data {
  text-align: center;
  color: #999999;
  padding: 20px;
}

.recommendations,
.popular-products {
  margin-bottom: 20px;
}

.slide {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  height: 300px;
}
</style>
