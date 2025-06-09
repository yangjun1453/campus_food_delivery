<template>
  <div class="container">
    <div style="text-align: center; margin-bottom: 100px">
      <h1>登录</h1>
    </div>
    <div class="text">
      <p v-if="errorMessage" style="color: red; text-align: center">
        {{ errorMessage }}
      </p>
      <!-- 成功消息 -->
      <p v-if="successMessage" style="color: green; text-align: center">
        {{ successMessage }}
      </p>
    </div>
    <nut-form class="form">
      <nut-form-item label="用户名">
        <nut-input
          v-model="formData.username"
          placeholder="请输入用户名"
          type="text"
        />
      </nut-form-item>
      <nut-form-item label="密码">
        <nut-input
          v-model="formData.password"
          placeholder="请输入密码"
          type="password"
        />
      </nut-form-item>
    </nut-form>
    <p class="nav-text">
      没有账号？点击<router-link to="/register">注册</router-link>
    </p>
    <nut-button type="default" class="btn" @click="onLoginBtnClick"
      >登录</nut-button
    >
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user.js";

const formData = reactive({
  username: "",
  password: "",
});
const userStore = useUserStore();
const errorMessage = ref("");
const router = useRouter();
const successMessage = ref("");

const onLoginBtnClick = async () => {
  try {
    await userStore.login(formData.username, formData.password);
    successMessage.value = "登录成功！正在跳转...";
    errorMessage.value = "";
    
    // 根据用户角色跳转到对应页面
    setTimeout(() => {
      if (userStore.isAdmin()) {
        router.push("/admin");
      } else if (userStore.isMerchant()) {
        router.push("/merchant");
      } else {
        router.push("/profile");
      }
    }, 2000);
  } catch (err) {
    errorMessage.value = err.message || "登录失败，请检查用户名或密码";
    successMessage.value = "";
  }
};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn {
  width: 200px;
  margin: 0 auto;
}

.form {
  margin: 0 20px;
}

.text {
  text-align: center;
}
.nav-text {
  align-self: flex-end;
  margin-right: 20px;
}
</style>
