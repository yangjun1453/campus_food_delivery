import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state() {
    return {
      cartItems: [],
    };
  },
  getters: {
    totalPrice: (state) => {
      return state.cartItems
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);
    },

    totalQuantity: (state) => {
      return state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
  },
  actions: {
    addItemToCart(item) {
      const existingItem = this.cartItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.cartItems.push(item);
      }
    },
    removeItemFromCart(id) {
      this.cartItems = this.cartItems.filter((item) => item.id !== id);
    },
    increaseQuantity(id) {
      const item = this.cartItems.find((cartItem) => cartItem.id === id);
      if (item) {
        item.quantity++;
      }
    },
    decreaseQuantity(id) {
      const item = this.cartItems.find((cartItem) => cartItem.id === id);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },
    clearCart() {
      this.cartItems = [];
    },
  },
});
