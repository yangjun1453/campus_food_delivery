<template>
  <div class="health-goals-container">
    <BackButton :path="'/profile'" />
    <h2 class="title">个人健康目标</h2>

    <!-- 健康目标选项 -->
    <div class="goals-list">
      <div
        v-for="(goal, index) in goals"
        :key="index"
        class="goal-item"
        :class="{ active: goal.selected }"
        @click="selectGoal(index)"
      >
        <div class="goal-icon">
          <img :src="goal.icon" alt="目标图标" />
        </div>
        <div class="goal-info">
          <p class="goal-title">{{ goal.title }}</p>
          <p class="goal-description">{{ goal.description }}</p>
        </div>
      </div>
      <div class="btn-container">
        <nut-button type="info" class="btn" @click="saveHealthGoal"
          >提交</nut-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user.js";
import BackButton from "../components/BackButton.vue";

const userStore = useUserStore();
const router = useRouter();

// 定义健康目标数据，映射到数据库的 health_goal
const goals = ref([
  {
    title: "减重",
    description: "选择低热量、高纤维的食物有助于减重",
    icon: "./img/svg/瘦身_thin.svg",
    selected: false,
    value: "weight_loss",
  },
  {
    title: "增肌",
    description: "选择高蛋白、适量碳水化合物的食物",
    icon: "./img/svg/肌肉_muscle.svg",
    selected: false,
    value: "muscle_gain",
  },
  {
    title: "维持",
    description: "维持体重需要均衡饮食和适量热量摄入",
    icon: "./img/svg/健康_health.svg",
    selected: false,
    value: "maintain",
  },
]);

// 初始化时从 userStore 加载已保存的目标
onMounted(() => {
  const currentGoal = userStore.userInfo?.health_goal;
  if (currentGoal) {
    const index = goals.value.findIndex((goal) => goal.value === currentGoal);
    if (index !== -1) goals.value[index].selected = true;
  }
});

// 选择目标（单选）
const selectGoal = (index) => {
  goals.value.forEach((goal, i) => {
    goal.selected = i === index; // 只选中当前点击的
  });
};

// 保存健康目标
const saveHealthGoal = async () => {
  const selectedGoal = goals.value.find((goal) => goal.selected);
  const healthGoal = selectedGoal ? selectedGoal.value : null;
  try {
    await userStore.updateUserInfo({ health_goal: healthGoal });
    router.push("/profile"); // 保存成功后返回个人资料页
  } catch (error) {
    console.error("保存健康目标失败:", error);
  }
};
</script>

<style scoped>
/* 容器样式 */
.health-goals-container {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
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
