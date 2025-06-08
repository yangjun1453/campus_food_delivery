<template>
    
  <div class="admin-page">
    <h1>管理员</h1>

    <nut-tabs v-model="value">
      <nut-tab-pane title="用户管理" pane-key="1">
        <nut-table :columns="columns" :data="data" ></nut-table>
      </nut-tab-pane>
      <nut-tab-pane title="Tab 2" pane-key="2"> Content 2 </nut-tab-pane>
      <nut-tab-pane title="Tab 3" pane-key="3"> Content 3 </nut-tab-pane>
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
  </div>
</template>

<script setup>
import { ref, h, onMounted } from "vue";
import BackButton from "../components/BackButton.vue";
import apiClient from "../request";
const roleMap = {
  user: "普通用户",
  merchant: "商家",
  delivery: "配送员",
};

const columns = ref([
  { title: "姓名", key: "username" },
  { title: "身份", key: "role" },
  { title: "操作", key: "render" },
]);

const data = ref([]);
const editUserDialogVisible = ref(false);
const selectedUser = ref({ username: "", email: "" });

// 获取用户数据
const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/api/users");
    data.value = response.data.map((user) => ({
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
});
</script>

<style scoped>
h1{
    margin-bottom: 10px;
}
.admin-page {
  text-align: center;
  padding: 20px;
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

.actions {
  display: flex;
  justify-content: space-between;
}

</style>
