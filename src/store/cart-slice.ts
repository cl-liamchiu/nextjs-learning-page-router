import { createSlice } from "@reduxjs/toolkit";

type Cart = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};
type CartState = { items: Cart[] };

const initialState: CartState = { items: [] };

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }
      state.items.push({
        ...action.payload,
        quantity: 1,
      });
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
  },
});

export const { addToCart, removeFromCart, setQuantity } = CartSlice.actions;
export default CartSlice.reducer;
