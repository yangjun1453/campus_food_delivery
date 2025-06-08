<template>
  <div class="address-list-container">
    <button class="btn add-btn" @click="addNewAddress">+ 新建地址</button>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>新建地址</h3>
        <form @submit.prevent="submitNewAddress">
          <input
            v-model="newAddress.receiver_name"
            placeholder="收件人姓名"
            required
          />
          <input v-model="newAddress.phone" placeholder="手机号" required />
          <input v-model="newAddress.address" placeholder="详细地址" required />
          <button type="submit">保存</button>
          <button type="button" @click="closeModal">取消</button>
        </form>
      </div>
    </div>
    <div class="address-list">
      <div
        v-for="item in data"
        :key="item.address_id"
        :class="[
          'address-item',
          selectedId === item.address_id ? 'selected' : '',
        ]"
        @click="clickItem(item)"
      >
        <div class="address-info">
          <div class="name-phone">
            <span class="receiver-name">{{ item.receiver_name }}</span>
            <span class="phone">{{ item.phone }}</span>
          </div>
          <div class="address-text">{{ item.address }}</div>
        </div>
        <div class="actions">
          <button class="btn del-btn" @click.stop="delClick(item)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAddressStore } from "../store/address.js";

const showModal = ref(false);
const addressStore = useAddressStore();
const data = ref([]);
const selectedId = ref(null);

const newAddress = ref({
  receiver_name: "",
  phone: "",
  address: "",
});

const resetNewAddress = () => {
  newAddress.value.receiver_name = "";
  newAddress.value.phone = "";
  newAddress.value.address = "";
};

const addNewAddress = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetNewAddress();
};

const submitNewAddress = async () => {
  try {
    await addressStore.addAddress(newAddress.value);
    await addressStore.fetchAddresses();
    data.value = addressStore.addresses;
    closeModal();
  } catch (error) {
    alert("新增地址失败，请重试");
  }
};

const clickItem = (item) => {
  selectedId.value = item.address_id;
  addressStore.setSelectedAddress(item.address_id);
};

const delClick = async (item) => {
  if (confirm("确定要删除这个地址吗？")) {
    await addressStore.deleteAddress(item.address_id);
    await addressStore.fetchAddresses();
    data.value = addressStore.addresses;
    if (selectedId.value === item.address_id) {
      selectedId.value = null;
    }
  }
};

const editClick = (item) => {
  console.log("点击编辑：", item);
};

onMounted(async () => {
  await addressStore.fetchAddresses();
  data.value = addressStore.addresses;
});
</script>

<style scoped>
.address-list-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}

.add-btn {
  margin-bottom: 16px;
  padding: 8px 16px;
  background-color: #3399ff;
  border: none;
  color: white;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #287ecc;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.address-item.selected {
  background-color: #f0f8ff;
  border-color: #3399ff;
}

.address-info {
  flex: 1;
  user-select: none;
}

.name-phone {
  font-weight: 600;
  margin-bottom: 6px;
  display: flex;
  gap: 12px;
}

.receiver-name {
  color: #333;
}

.phone {
  color: #666;
  font-size: 0.9rem;
}

.address-text {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.3;
}

.actions {
  display: flex;
  gap: 8px;
  margin-left: 16px;
}

.btn {
  border: none;
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
}

.edit-btn:hover {
  background-color: #45a049;
}

.del-btn {
  background-color: #f44336;
  color: white;
}

.del-btn:hover {
  background-color: #d32f2f;
}
</style>
