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
      <!-- 角色选择 -->
      <nut-form-item label="角色">
        
         <nut-radio-group v-model="formData.role" direction="horizontal">
    <nut-radio label="student">学生</nut-radio>
    <nut-radio label="staff">教职工</nut-radio>
    <nut-radio label="merchant">商家</nut-radio>
    <nut-radio label="delivery">外卖员</nut-radio>

  </nut-radio-group>
      </nut-form-item>

      <!-- 通用字段 -->
      <nut-form-item label="邮箱">
        <nut-input v-model="formData.email" placeholder="请输入邮箱" type="email" />
      </nut-form-item>
      <nut-form-item label="密码">
        <nut-input v-model="formData.password" placeholder="请输入密码（至少6位）" type="password" />
      </nut-form-item>

      <!-- 学生特有字段 -->
      <div v-if="formData.role === 'student'">
        <nut-form-item label="姓名">
          <nut-input v-model="formData.username" placeholder="请输入姓名" />
        </nut-form-item>
        <nut-form-item label="学号">
          <nut-input v-model="formData.studentId" placeholder="请输入学号" />
        </nut-form-item>
        <nut-form-item label="学院">
          <nut-input v-model="formData.department" placeholder="请输入学院" />
        </nut-form-item>
        <nut-form-item label="班级">
          <nut-input v-model="formData.className" placeholder="请输入班级" />
        </nut-form-item>
      </div>

      <!-- 教职工特有字段 -->
      <div v-if="formData.role === 'staff'">
        <nut-form-item label="姓名">
          <nut-input v-model="formData.username" placeholder="请输入姓名" />
        </nut-form-item>
        <nut-form-item label="工号">
          <nut-input v-model="formData.staffId" placeholder="请输入工号" />
        </nut-form-item>
        <nut-form-item label="凭证上传">
          <div class="upload-container">
            <input
              type="file"
              class="file-input"
              accept="image/*"
              @change="handleFileChange($event, 1)"              ref="staffFileInput"
            >
            <button class="upload-button" @click="triggerFileInput('staffFileInput')">选择工作证照片</button>
            <div v-if="fileList.length > 0" class="preview-container">
              <div v-for="(file, index) in fileList" :key="index" class="preview-item">
                <img :src="file.url" class="preview-image" />
                <button class="remove-button" @click="removeFile(index)">删除</button>
              </div>
            </div>
            <div class="upload-tip">请上传工作证照片（支持jpg、png格式，不超过5MB）</div>
          </div>
        </nut-form-item>
      </div>

      <!-- 商家特有字段 -->
      <div v-if="formData.role === 'merchant'">
        <nut-form-item label="用户名">
          <nut-input v-model="formData.username" placeholder="请输入用户名" />
        </nut-form-item>
        <nut-form-item label="商家名称">
          <nut-input v-model="formData.merchantName" placeholder="请输入商家名称" />
        </nut-form-item>
        <nut-form-item label="联系方式">
          <nut-input v-model="formData.contactInfo" placeholder="请输入联系方式" />
        </nut-form-item>
        <nut-form-item label="凭证上传">
          <div class="upload-container">
            <input
              type="file"
              class="file-input"
              accept="image/*"
              @change="handleFileChange($event, 2)"              ref="merchantFileInput"
              multiple
            >
            <button class="upload-button" @click="triggerFileInput('merchantFileInput')">选择营业执照和店铺照片</button>
            <div v-if="fileList.length > 0" class="preview-container">
              <div v-for="(file, index) in fileList" :key="index" class="preview-item">
                <img :src="file.url" class="preview-image" />
                <button class="remove-button" @click="removeFile(index)">删除</button>
              </div>
            </div>
            <div class="upload-tip">请上传营业执照和店铺照片（支持jpg、png格式，每张不超过5MB）</div>
          </div>
        </nut-form-item>
      </div>

      <!-- 外卖员特有字段 -->
      <div v-if="formData.role === 'delivery'">
        <nut-form-item label="用户名">
          <nut-input v-model="formData.username" placeholder="请输入用户名" />
        </nut-form-item>
        <nut-form-item label="联系方式">
          <nut-input v-model="formData.contactInfo" placeholder="请输入联系方式" />
        </nut-form-item>
        <nut-form-item label="凭证上传">
          <div class="upload-container">
            <input
              type="file"
              class="file-input"
              accept="image/*"
              @change="handleFileChange($event, 1)"              ref="deliveryFileInput"
            >
            <button class="upload-button" @click="triggerFileInput('deliveryFileInput')">选择工号牌照片</button>
            <div v-if="fileList.length > 0" class="preview-container">
              <div v-for="(file, index) in fileList" :key="index" class="preview-item">
                <img :src="file.url" class="preview-image" />
                <button class="remove-button" @click="removeFile(index)">删除</button>
              </div>
            </div>
            <div class="upload-tip">请上传工号牌照片（支持jpg、png格式，不超过5MB）</div>
          </div>
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

// 文件上传的refs
const staffFileInput = ref(null);
const merchantFileInput = ref(null);
const deliveryFileInput = ref(null);

const formData = ref({
  username: "",
  email: "",
  password: "",
  role: "student", // 默认角色为学生
  studentId: "", // 学号
  department: "", // 学院
  className: "", // 班级
  staffId: "", // 工号
  merchantName: "", // 商家名称
  contactInfo: "", // 联系方式
});

const fileList = ref([]); // 用于存储上传的文件
const uploadUrl = "http://localhost:3000/api/upload"; // 使用后端接口地址
const errorMessage = ref("");
const successMessage = ref("");
const router = useRouter();
const userStore = useUserStore();

// 触发文件选择
const triggerFileInput = (refName) => {
  const fileInputRefs = {
    staffFileInput,
    merchantFileInput,
    deliveryFileInput
  };
  fileInputRefs[refName].value.click();
};  // 处理文件更改
const handleFileChange = async (event, type) => {
  const files = Array.from(event.target.files);
  const maxSize = 5 * 1024 * 1024; // 5MB

  // 验证文件
  for (const file of files) {
    if (file.size > maxSize) {
      errorMessage.value = "文件大小不能超过5MB";
      return;
    }

    if (!file.type.startsWith('image/')) {
      errorMessage.value = "只能上传图片文件";
      return;
    }
  }

  // 清除之前的文件（如果是单文件上传）
  if (type === 1) {
    fileList.value = [];
  }

  errorMessage.value = "";
  successMessage.value = "";

  // 处理每个文件
  for (const file of files) {
    try {      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': userStore.getToken() ? `Bearer ${userStore.getToken()}` : '',
          // 不要设置 Content-Type，让浏览器自动设置正确的 multipart/form-data 以及 boundary
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      if (data.data && data.data.url) {
        // 创建本地预览URL
        const previewUrl = URL.createObjectURL(file);
        fileList.value.push({
          uid: Date.now() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: data.data.url,
          previewUrl: previewUrl
        });
        successMessage.value = "凭证上传成功";
      } else {
        throw new Error('服务器返回数据格式错误');
      }
    } catch (error) {
      console.error('上传失败:', error);
      errorMessage.value = `凭证上传失败: ${error.message || '请重试'}`;
    }
  }
};

// 移除文件
const removeFile = (index) => {
  const file = fileList.value[index];
  if (file.previewUrl) {
    URL.revokeObjectURL(file.previewUrl);
  }
  fileList.value.splice(index, 1);
};

// 实时校验密码
const isPasswordValid = () => {
  return formData.value.password.length >= 6;
};

// 实时校验邮箱
const isEmailValid = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(formData.value.email);
};

// 注册处理函数
const onRegister = async () => {
  try {
    // 基本字段验证
    if (!formData.value.email || !formData.value.password) {
      errorMessage.value = "请填写邮箱和密码";
      return;
    }

    if (!isPasswordValid()) {
      errorMessage.value = "密码不能少于6位";
      return;
    }

    if (!isEmailValid()) {
      errorMessage.value = "请输入有效的邮箱地址";
      return;
    }

    // 根据角色验证特定字段
    switch (formData.value.role) {
      case 'student':
        if (!formData.value.studentId || !formData.value.department || 
            !formData.value.className || !formData.value.username) {
          errorMessage.value = "请填写完整的学生信息";
          return;
        }
        break;
      case 'staff':
        if (!formData.value.staffId || !formData.value.username || fileList.value.length === 0) {
          errorMessage.value = "请填写完整的教职工信息并上传凭证";
          return;
        }
        break;
      case 'merchant':
        if (!formData.value.username || !formData.value.merchantName || 
            !formData.value.contactInfo || fileList.value.length < 2) {
          errorMessage.value = "请填写完整的商家信息并上传所需凭证";
          return;
        }
        break;
      case 'delivery':
        if (!formData.value.username || !formData.value.contactInfo || 
            fileList.value.length === 0) {
          errorMessage.value = "请填写完整的外卖员信息并上传凭证";
          return;
        }
        break;    }

    // 调用注册接口
    await userStore.register({
      ...formData.value,
      merchant_name: formData.value.merchantName,
      contact_info: formData.value.contactInfo,
      certifications: fileList.value.map(file => file.url)
    });

    successMessage.value = "注册成功！正在跳转到登录页面...";
    errorMessage.value = "";

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    errorMessage.value = error.message || "注册失败，请重试";
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

.upload-container {
  position: relative;
  display: inline-block;
}

.file-input {
  display: none;
}

.upload-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.preview-item {
  position: relative;
}

.preview-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.remove-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px;
  font-size: 14px;
}

.upload-tip {
  font-size: 14px;
  color: #666;
  padding: 8px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  text-align: center;
  margin-top: 4px;
}
</style>
