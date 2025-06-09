<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1>管理员</h1>
      <button class="logout-btn" @click="handleLogout">
        <img src="/img/svg/退出_logout.svg" alt="退出" class="logout-icon" />
        退出登录
      </button>
    </div>

    <nut-tabs v-model="value">
      <nut-tab-pane title="用户管理" pane-key="1">
        <nut-table :columns="userColumns" :data="userData"></nut-table>
      </nut-tab-pane>
      <nut-tab-pane title="待审核用户" pane-key="2">
        <nut-table :columns="pendingColumns" :data="pendingData">
          <template #certifications="{ row }">
            <div v-if="row.certifications && row.certifications.length > 0">
              <img
                v-for="(cert, index) in row.certifications"
                :key="index"
                :src="cert"
                class="cert-image"
                @click="previewImage(cert)"
              />
            </div>
            <span v-else>无凭证</span>
          </template>
        </nut-table>
      </nut-tab-pane>
    </nut-tabs>

    <!-- 编辑对话框 -->
    <nut-popup
      v-model:visible="editUserDialogVisible"
      position="center"
      closeable
    >
      <div class="edit-dialog">
        <h2>编辑用户</h2>
        <div>
          <label>用户名：</label>
          <input v-model="selectedUser.username" />
        </div>
        <div>
          <label>邮箱：</label>
          <input v-model="selectedUser.email" />
        </div>
        <div class="actions">
          <button @click="submitEditUser">提交</button>
          <button @click="editUserDialogVisible = false">取消</button>
        </div>
      </div>
    </nut-popup>

    <!-- 审核对话框 -->
    <nut-popup
      v-model:visible="reviewDialogVisible"
      position="center"
      closeable
    >
      <div class="review-dialog">
        <h2>审核用户</h2>
        <div class="user-info">
          <p>用户名：{{ selectedUser.username }}</p>
          <p>角色：{{ roleMap[selectedUser.role] }}</p>
          <p>邮箱：{{ selectedUser.email }}</p>
          <template v-if="selectedUser.role === 'student'">
            <p>学号：{{ selectedUser.studentId }}</p>
            <p>学院：{{ selectedUser.department }}</p>
            <p>班级：{{ selectedUser.className }}</p>
          </template>
          <template v-if="selectedUser.role === 'staff'">
            <p>工号：{{ selectedUser.staffId }}</p>
          </template>
          <!-- <template v-if="selectedUser.role === 'merchant'">
            <p>商家名称：{{ selectedUser.merchantName }}</p>
            <p>联系方式：{{ selectedUser.contactInfo }}</p>
          </template> -->
          <!-- <template v-if="selectedUser.role === 'delivery'">
            <p>联系方式：{{ selectedUser.contactInfo }}</p>
          </template> -->
        </div>
        <div v-if="selectedUser.certifications?.length" class="certifications">
          <h3>上传的凭证</h3>
          <div class="cert-preview">
            <div
              v-for="(cert, index) in selectedUser.certifications"
              :key="index"
              class="cert-container"
            >
              <img
                :src="cert"
                @click="previewImage(cert)"
                :alt="`凭证${index + 1}`"
              />
              <div class="cert-overlay" @click="previewImage(cert)">
                <span>点击查看</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-cert">
          <p>未上传凭证</p>
        </div>
        <div v-if="isRejecting">
          <label>拒绝原因：</label>
          <textarea
            v-model="rejectReason"
            placeholder="请输入拒绝原因"
          ></textarea>
        </div>
        <div class="actions">
          <button class="approve-btn" @click="approveUser">通过</button>
          <button
            class="reject-btn"
            @click="isRejecting ? rejectUser() : showRejectReason()"
          >
            {{ isRejecting ? "确认拒绝" : "拒绝" }}
          </button>
          <button @click="reviewDialogVisible = false">取消</button>
        </div>
      </div>
    </nut-popup>

    <!-- 图片预览 -->
    <nut-image-preview v-model:show="showPreview" :images="[previewUrl]" />
  </div>
</template>

<script setup>
import { ref, h, onMounted } from "vue";
import apiClient from "../request";
import { useUserStore } from "../store/user.js";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const value = ref("1");

// 处理退出登录
const handleLogout = async () => {
  try {
    userStore.logout(); // 调用store中的logout方法
    router.push("/login"); // 跳转到登录页
  } catch (error) {
    console.error("退出登录失败:", error);
  }
};

const roleMap = {
  student: "学生",
  staff: "教职工",
  merchant: "商家",
  delivery: "外卖员",
};

// 已审核用户表格列配置
const userColumns = ref([
  { title: "用户名", key: "username" },
  { title: "身份", key: "role" },
  
  { title: "操作", key: "render" },
]);

// 待审核用户表格列配置
const pendingColumns = ref([
  { title: "用户名", key: "username" },
  { title: "身份", key: "role" },

  { title: "操作", key: "render" },
]);

const userData = ref([]);
const pendingData = ref([]);
const editUserDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const selectedUser = ref({});
const rejectReason = ref("");
const isRejecting = ref(false);
const showPreview = ref(false);
const previewUrl = ref("");

// 获取已审核用户数据
const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/api/users");
    userData.value = response.data.map((user) => ({
      ...user,
      role: roleMap[user.role] || user.role,
      render: () => [
        h("button", { onClick: () => openEditUserDialog(user) }, "编辑"),
        h("button", { onClick: () => deleteUser(user.id) }, "删除"),
      ],
    }));
  } catch (error) {
    console.error("获取用户数据失败:", error);
  }
};

// 获取待审核用户数据
const fetchPendingUsers = async () => {
  try {
    const response = await apiClient.get("/api/admin/pending-users");
    // 前端聚合
    const userMap = {};
    response.data.forEach(user => {
      const id = user.user_id;
      if (!userMap[id]) {
        userMap[id] = { ...user, certifications: [] };
      }
      if (user.certificate_url) {
        userMap[id].certifications.push(user.certificate_url);
      }
    });
    pendingData.value = Object.values(userMap).map(user => ({
      ...user,
      role: roleMap[user.role] || user.role,
      render: () => [
        h("button", { onClick: () => openReviewDialog(user) }, "审核"),
      ],
    }));
  } catch (error) {
    console.error("获取待审核用户失败:", error);
  }
};

// 打开审核对话框
const openReviewDialog = async (user) => {
  selectedUser.value = user;
  isRejecting.value = false;
  rejectReason.value = "";
  reviewDialogVisible.value = true;

  // 获取证件图片
  const res = await apiClient.get(`/api/user/certifications/${user.user_id}`);
  // 拼接完整图片地址
  const baseURL = apiClient.defaults.baseURL || "http://localhost:3000";
  selectedUser.value.certifications = (res.data.certifications || []).map(cert =>
    cert.startsWith("http") ? cert : baseURL.replace(/\/$/, "") + cert
  );
};

// 显示拒绝原因输入
const showRejectReason = () => {
  isRejecting.value = true;
};

// 审核通过
const approveUser = async () => {
  try {
    await apiClient.post(
      `/api/admin/review-user/${selectedUser.value.user_id}`,
      {
        status: "approved",
      }
    );
    reviewDialogVisible.value = false;
    await Promise.all([fetchUsers(), fetchPendingUsers()]);
  } catch (error) {
    console.error("审核失败:", error);
  }
};

// 拒绝用户
const rejectUser = async () => {
  if (!rejectReason.value) {
    alert("请输入拒绝原因");
    return;
  }
  try {
    await apiClient.post(
      `/api/admin/review-user/${selectedUser.value.user_id}`,
      {
        status: "rejected",
        rejectReason: rejectReason.value,
      }
    );
    reviewDialogVisible.value = false;
    await Promise.all([fetchUsers(), fetchPendingUsers()]);
  } catch (error) {
    console.error("审核失败:", error);
  }
};

// 预览图片
const previewImage = (url) => {
  previewUrl.value = url;
  showPreview.value = true;
};

// 删除用户
const deleteUser = async (userId) => {
  try {
    await apiClient.delete(`/api/users/${userId}`);
    alert("用户删除成功");
    fetchUsers();
  } catch (error) {
    console.error("删除用户失败:", error);
    alert("删除失败，请稍后再试");
  }
};

// 打开编辑对话框
const openEditUserDialog = (user) => {
  selectedUser.value = {
    id: user.id,
    username: user.username,
    email: user.email || "", // 防止后端未返回 email 报错
  };
  editUserDialogVisible.value = true;
};

// 提交编辑表单
const submitEditUser = async () => {
  try {
    await apiClient.put(`/api/users/${selectedUser.value.id}`, {
      username: selectedUser.value.username,
      email: selectedUser.value.email,
    });
    alert("用户信息更新成功");
    editUserDialogVisible.value = false;
    fetchUsers();
  } catch (error) {
    console.error("更新用户信息失败:", error);
    alert("更新失败，请稍后再试");
  }
};

onMounted(() => {
  fetchUsers();
  fetchPendingUsers();
});
</script>

<style scoped>
.admin-page {
  text-align: center;
  padding: 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

h1 {
  margin-bottom: 10px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

.logout-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.review-dialog {
  padding: 20px;
  background: white;
  border-radius: 8px;
  min-width: 400px;
}

.user-info {
  text-align: left;
  margin: 15px 0;
}

.user-info p {
  margin: 8px 0;
}

.certifications {
  margin: 15px 0;
}

.cert-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 10px;
  padding: 10px;
}

.cert-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.cert-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cert-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cert-overlay span {
  color: white;
  font-size: 14px;
}

.cert-container:hover img {
  transform: scale(1.1);
}

.cert-container:hover .cert-overlay {
  opacity: 1;
}

.cert-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.cert-image:hover {
  transform: scale(1.1);
}

textarea {
  width: 100%;
  min-height: 100px;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.approve-btn {
  background-color: #4caf50;
  color: white;
}

.reject-btn {
  background-color: #f44336;
  color: white;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-dialog {
  padding: 20px;
  background: white;
  border-radius: 8px;
  min-width: 300px;
}

.edit-dialog h2 {
  margin-bottom: 15px;
}

.edit-dialog div {
  margin-bottom: 10px;
}

.edit-dialog input {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
}

.no-cert {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 15px 0;
}

.no-cert p {
  color: #666;
  margin: 0;
}
</style>
