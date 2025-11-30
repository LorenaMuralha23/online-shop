import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../pages/interfaces/Interfaces";

interface ProductsState {
  list: Product[];
}

const initialState: ProductsState = {
  list: JSON.parse(localStorage.getItem("products") || "[]"),
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.list = action.payload;
      localStorage.setItem("products", JSON.stringify(state.list));
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      state.list.push(action.payload);
      localStorage.setItem("products", JSON.stringify(state.list));
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.list.findIndex(p => p.id === action.payload.id);
      state.list[index] = action.payload;
      localStorage.setItem("products", JSON.stringify(state.list));
    },

    deleteProduct: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(p => p.id !== action.payload);
      localStorage.setItem("products", JSON.stringify(state.list));
    }
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;
