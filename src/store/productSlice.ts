import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../pages/Interfaces/Interfaces";

interface ProductsState {
  list: Product[];
}

function getUserKey() {
  const stored = localStorage.getItem("loggedUser");
  if (!stored) return null;

  const user = JSON.parse(stored);
  return `products_${user.email}`;
}

const initialState: ProductsState = {
  list: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.list = action.payload;

      const key = getUserKey();
      if (key) {
        const userProducts = state.list.filter(p => p.id > 1000);
        localStorage.setItem(key, JSON.stringify(userProducts));
      }
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      state.list.push(action.payload);

      const key = getUserKey();
      if (key) {
        const userProducts = state.list.filter(p => p.id > 1000);
        localStorage.setItem(key, JSON.stringify(userProducts));
      }
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.list.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;

      const key = getUserKey();
      if (key) {
        const userProducts = state.list.filter(p => p.id > 1000);
        localStorage.setItem(key, JSON.stringify(userProducts));
      }
    },

    deleteProduct: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(p => p.id !== action.payload);

      const key = getUserKey();
      if (key) {
        const userProducts = state.list.filter(p => p.id > 1000);
        localStorage.setItem(key, JSON.stringify(userProducts));
      }
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
