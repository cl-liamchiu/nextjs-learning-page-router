import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type Product = { id: number; title: string; price: number; thumbnail: string };
type ProductsState = { items: Product[]; loading: boolean; error?: string };

const initialState: ProductsState = { items: [], loading: false };

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    return data.products as Product[];
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      console.error("Failed to fetch products:", action.error);
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default productsSlice.reducer;
