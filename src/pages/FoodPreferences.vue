<template>
  <div class="health-goals-container">
    <BackButton :path="'/profile'" />
    <h2 class="title">饮食偏好</h2>

    <!-- 饮食偏好选项 -->
    <div class="goals-list">
      <div
        v-for="(goal, index) in goals"
        :key="index"
        class="goal-item"
        :class="{ active: goal.selected }"
        @click="toggleGoal(index)"
      >
        <div class="goal-icon">
          <img :src="goal.icon" alt="偏好图标" />
        </div>
        <div class="goal-info">
          <p class="goal-title">{{ goal.title }}</p>
          <p class="goal-description">{{ goal.description }}</p>
        </div>
      </div>
      <div class="btn-container">
        <nut-button type="info" class="btn" @click="savePreferences"
          >保存</nut-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user.js";
import BackButton from "../components/BackButton.vue";

const userStore = useUserStore();
const router = useRouter();

const goals = ref([
  {
    title: "素食",
    description: "避免食用肉类、鱼类和海鲜等动物性食材，主要以植物为基础",
    icon: "./img/svg/瘦身_thin.svg",
    selected: false,
    value: "vegetarian",
  },
  {
    title: "低碳水",
    description: "注重减少碳水化合物摄入，优先选择低糖、高纤维的食物",
    icon: "./img/svg/肌肉_muscle.svg",
    selected: false,
    value: "low-carb",
  },
  {
    title: "无麸质",
    description: "避免含有小麦、大麦、黑麦等麸质成分的食物",
    icon: "./img/svg/健康_health.svg",
    selected: false,
    value: "gluten-free",
  },
  {
    title: "无乳糖",
    description: "避免摄入含有乳糖的奶制品",
    icon: "./img/svg/健康_health.svg",
    selected: false,
    value: "lactose-free",
  },
  {
    title: "高蛋白",
    description: "注重增加优质蛋白质的摄入，如肉类、鱼类、蛋类和豆类",
    icon: "./img/svg/健康_health.svg",
    selected: false,
    value: "high-protein",
  },
]);

// 初始化时从 userStore 加载已保存的偏好
onMounted(() => {
  userStore.initialize(); // 确保初始化
  if (!userStore.userInfo || !localStorage.getItem("token")) {
    router.push("/login"); // 未登录则跳转到登录页
  } else {
    const savedPreferences = userStore.userInfo?.preferences;
    if (savedPreferences) {
      const preferencesArray = JSON.parse(savedPreferences);
      goals.value.forEach((goal) => {
        goal.selected = preferencesArray.includes(goal.value);
      });
    }
  }
});

// 切换偏好选中状态（多选）
const toggleGoal = (index) => {
  goals.value[index].selected = !goals.value[index].selected;
};

// 保存饮食偏好
const savePreferences = async () => {
  const selectedPreferences = goals.value
    .filter((goal) => goal.selected)
    .map((goal) => goal.value);
  try {
    await userStore.updateUserInfo({
      preferences: JSON.stringify(selectedPreferences),
    });
    router.push("/profile"); // 保存成功后返回个人资料页
  } catch (error) {
    console.error("保存饮食偏好失败:", error);
  }
};
</script>

<style scoped>
/* 容器样式 */
.health-goals-container {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;

  max-width: 400px;
  margin: 0 auto;
}

/* 标题样式 */
.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 16px;
}

/* 目标列表样式 */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 单个目标项样式 */
.goal-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: transform 0.2s ease, background-color 0.2s ease;
  cursor: pointer;
}

.goal-item:hover {
  transform: scale(1.02);
  background-color: #eaeaea;
}

.goal-item.active {
  background-color: #e3f2fd;
  border: 1px solid #1e88e5;
}

/* 图标样式 */
.goal-icon img {
  width: 35px;
  height: 35px;
  margin-right: 20px;
}

/* 目标信息样式 */
.goal-info {
  flex: 1;
}

.goal-title {
  font-size: 1rem;
  font-weight: bold;
  color: #333333;
  margin: 0;
}

.goal-description {
  font-size: 0.875rem;
  color: #666666;
  margin: 4px 0 0;
}
.btn-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.btn {
  width: 150px;
}
</style>
