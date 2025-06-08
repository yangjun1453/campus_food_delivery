<template>
  <div class="recommendations-container">
    <BackButton :path="'/home'" />
    <h2 class="recommendations-title">推荐餐品</h2>

    <div v-if="loading" class="loading">
      <!-- <nut-loading type="circular" /> -->
    </div>

    <div v-else-if="recommendedItems.length > 0" class="recommendations-list">
      <div
        v-for="(item, index) in recommendedItems"
        :key="index"
        class="recommendation-item"
      >
        <img
          :src="item.imgUrl"
          alt="meal"
          class="item-image"
          @error="handleImageError"
        />
        <div class="item-details">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-description">{{ item.description }}</p>
          <p class="item-nutrition">
            热量: {{ item.calories }} 千卡 | 蛋白质: {{ item.protein }}g | 脂肪:
            {{ item.fat }}g | 碳水: {{ item.carbs }}g
          </p>
          <p class="item-price">¥{{ formatPrice(item.price) }}</p>
          <!-- 使用格式化函数 -->
          <nut-button
            type="primary"
            size="small"
            @click="viewDetail(item.item_id)"
          >
            查看详情
          </nut-button>
        </div>
      </div>
    </div>

    <div v-else-if="!isLoggedIn" class="no-items">
      请先登录以查看个性化推荐
      <nut-button type="info" size="small" @click="goToLogin">
        去登录
      </nut-button>
    </div>

    <div v-else class="no-items">
      暂无推荐餐品，请设置健康目标和饮食偏好
      <nut-button type="info" size="small" @click="goToSettings">
        去设置
      </nut-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user.js";
import apiClient from "../request.js";
import BackButton from "../components/BackButton.vue";

const router = useRouter();
const userStore = useUserStore();
const recommendedItems = ref([]);
const loading = ref(true);
const isLoggedIn = ref(!!userStore.userInfo);

const fetchRecommendations = async () => {
  try {
    const response = await apiClient.get("/api/recommendations");
    console.log("Recommended items:", response.data.items); // 打印返回数据
    recommendedItems.value = response.data.items.map((item) => ({
      item_id: item.item_id,
      name: item.name,
      description: item.description || "暂无描述",
      price: Number(item.price) || 0,
      calories: item.calories || 0,
      protein: item.protein || 0,
      fat: item.fat || 0,
      carbs: item.carbs || 0,
      imgUrl: item.img_url || "https://i.postimg.cc/7Z7P025v/rice.jpg",
      shopName: item.shopName || "未知店铺",
    }));
  } catch (error) {
    console.error("获取推荐餐品失败:", error);
    recommendedItems.value = [];
  } finally {
    loading.value = false;
  }
};

// 格式化价格
const formatPrice = (price) => {
  return Number(price).toFixed(2); // 确保是数字并保留两位小数
};

const viewDetail = (id) => {
  router.push({ name: "foodDetail", params: { id } });
};

const goToSettings = () => {
  router.push("/healthGoals");
};

const goToLogin = () => {
  router.push("/login");
};

const handleImageError = (event) => {
  event.target.src = "https://i.postimg.cc/7Z7P025v/rice.jpg";
};

onMounted(() => {
  isLoggedIn.value = !!userStore.userInfo;
  if (isLoggedIn.value) {
    fetchRecommendations();
  } else {
    loading.value = false;
  }
});
</script>

<style scoped>
.recommendations-container {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
}

.recommendations-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-item {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recommendation-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333333;
}

.item-description {
  font-size: 0.9rem;
  color: #666666;
  margin: 4px 0;
}

.item-nutrition {
  font-size: 0.85rem;
  color: #888888;
  margin: 4px 0;
}

.item-price {
  font-size: 1rem;
  color: #ff5722;
  font-weight: bold;
  margin: 4px 0;
}

.no-items {
  text-align: center;
  color: #999999;
  padding: 20px;
}

.no-items button {
  margin-top: 10px;
}
</style>
