<script setup>
defineProps(["product"]);
</script>

<template>
  <nut-card
    class="main"
    :img-url="product.imgUrl"
    :title="product.title"
    :price="product.price"
    :vip-price="product.vipPrice"
    :shop-desc="product.shopDesc"
    :delivery="product.delivery"
    :shop-name="product.shopName"
  >
    <template #shop-tag>
      <div>{{ product.delivery }}</div>
    </template>
    <template #price>
      <span>{{ product.price }}</span>
    </template>
    <template #origin>
      <img
        class="card-tag"
        src="https://img11.360buyimg.com/jdphoto/s58x28_jfs/t9451/359/415622649/15318/b0943e5d/59a78495N3bd2a9f8.png"
        alt=""
      />
    </template>
  </nut-card>
</template>

<style scoped>
.card-tag {
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
  margin-left: 2px;
  height: 14px;
}
</style>
