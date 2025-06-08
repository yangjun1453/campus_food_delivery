<template>
  <div class="list">
    <!-- 标题 -->
    <p class="list__label">{{ label }}</p>

    <!-- 列表 -->
    <div class="list__content">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="list__item"
        @click="handleItemClick(item)"
      >
        <!-- 左侧内容 -->
        <div class="list__left">
          <div
            class="list__icon"
            :class="{
              'is-last-red-box': isLastItemRed && index === items.length - 1,
            }"
          >
            <img :src="item.icon" alt="" />
          </div>
          <span
            class="list__text"
            :class="{
              'is-last-red-text': isLastItemRed && index === items.length - 1,
            }"
            >{{ item.text }}</span
          >
        </div>

        <!-- 右侧箭头 -->
        <img src="/img/svg/箭头右_arrow-right.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义 Props
defineProps(["label", "items", "isLastItemRed"]);
import { useRouter } from "vue-router";

const router = useRouter();

const handleItemClick = (item) => {
  // 如果存在自定义的 onClick 方法，则优先调用它
  if (item.onClick) {
    item.onClick();
  } else if (item.path) {
    // 如果存在 path，则跳转到指定路径
    router.push(item.path);
  }
};
</script>

<style scoped>
/* Section List */

.list {
  margin-bottom: 20px;
}

.list__label {
  color: #868e96;
  margin-left: 15px;
  margin-bottom: 10px;
  font-size: 12px;
}

.list__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 2px solid #f1f3f5;
  border-radius: 20px;
  width: 100%;
  padding: 13px;
  background-color: #f1f3f5;
}

.list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 12px;
}

.list__item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.list__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.list__icon {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 5px;
  border-radius: 8px;
  background-color: white;
}

.list__text {
  font-size: 14px;
}

.is-last-red-text {
  color: #c92a2a;
}

.is-last-red-box {
  background-color: #ffe3e3;
}
</style>
