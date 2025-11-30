import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./clientsSlice"
import productsReducer from "./productSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    products: productsReducer,
    cart: cartReducer,  
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
