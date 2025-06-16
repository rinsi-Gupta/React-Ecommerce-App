import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage or set empty array
const initialState = JSON.parse(localStorage.getItem('cart')) ?? [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      state.push(action.payload);
    },
    deleteFromCart(state, action) {
      return state.filter(item => item.id !== action.payload.id);
    },
    incrementQuantity(state, action) {
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    },
    decrementQuantity(state, action) {
      return state.map(item =>
        item.id === action.payload.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    },
    // ✅ Add this to clear the entire cart
    clearCart() {
      return [];
    }
  }
});

// Export actions
export const {
  addToCart,
  deleteFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart  // 👈 Important for use after successful payment
} = cartSlice.actions;

export default cartSlice.reducer;
