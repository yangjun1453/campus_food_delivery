<template>
  <div class="container">
    <div style="text-align: center; margin-bottom: 100px">
      <h1>注册</h1>
    </div>
    <div class="text">
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
    </div>

    <nut-form class="form">
      <nut-form-item label="邮箱">
        <nut-input
          v-model="formData.email"
          placeholder="请输入邮箱"
          type="email"
        />
      </nut-form-item>
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
      <nut-form-item label="角色">
        <nut-radio-group v-model="formData.role">
          <nut-radio label="user">普通用户</nut-radio>
          <nut-radio label="merchant">商家</nut-radio>
          <nut-radio label="delivery">外卖员</nut-radio>
        </nut-radio-group>
      </nut-form-item>

      <!-- 商家相关信息 -->
      <div>
        <nut-form-item label="商家名称" v-if="formData.role === 'merchant'">
          <nut-input
            v-model="formData.merchant_name"
            placeholder="请输入商家名称"
            type="text"
          />
        </nut-form-item>
        <nut-form-item
          label="联系方式"
          v-if="formData.role === 'merchant' || formData.role === 'delivery'"
        >
          <nut-input
            v-model="formData.contact_info"
            placeholder="请输入联系方式"
            type="text"
          />
        </nut-form-item>
      </div>
    </nut-form>

    <nut-button type="default" class="btn" @click="onRegister">注册</nut-button>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user.js";

const formData = ref({
  username: "",
  email: "",
  password: "",
  role: "user", // 默认角色为普通用户
  merchant_name: "", // 商家名称
  contact_info: "", // 联系方式
});

const errorMessage = ref("");
const successMessage = ref("");
const router = useRouter();
const userStore = useUserStore();

// 实时校验密码
const isPasswordValid = () => {
  return formData.value.password.length >= 6;
};

// 实时校验邮箱
const isEmailValid = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(formData.value.email);
};

const onRegister = async () => {
  try {
    // 确保必填字段都有值
    if (
      !formData.value.username ||
      !formData.value.password ||
      !formData.value.email ||
      !formData.value.role
    ) {
      errorMessage.value = "请填写所有必填字段";
      return;
    }

    if (!isPasswordValid()) {
      errorMessage.value = "密码不能少于 6 位";
      return;
    }

    if (!isEmailValid()) {
      errorMessage.value = "请输入有效的邮箱地址";
      return;
    }

    // 如果是商家，确保商家名称和联系方式已填写
    if (formData.value.role === "merchant") {
      if (!formData.value.merchant_name || !formData.value.contact_info) {
        errorMessage.value = "请填写商家名称和联系方式";
        return;
      }
    }
    // 如果是外卖员，确保填写联系方式
    if (formData.value.role === "delivery" && !formData.value.contact_info) {
      errorMessage.value = "请填写联系方式";
      return;
    }
    // 调用注册接口
    await userStore.register(
      formData.value.username,
      formData.value.password,
      formData.value.email,
      formData.value.role,
      formData.value.merchant_name,
      formData.value.contact_info
    );

    successMessage.value = "注册成功！请登录";
    errorMessage.value = "";

    // 延迟 2 秒后跳转到登录页面
    setTimeout(() => {
      router.push("/login");
    }, 2000); // 2000 毫秒 = 2 秒
  } catch (error) {
    errorMessage.value = error.message;
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
</style>
