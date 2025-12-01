import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const exists = state.items.find((i) => i.id === action.payload.id);

      if (exists) {
        exists.quantity += 1;
      } else {
        state.items.push(action.payload);
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    checkout: (state) => {
      const rawUser = localStorage.getItem("loggedUser");

      if (!rawUser) {
        console.error("Nenhum usuário logado — não é possível salvar compra.");
        return;
      }

      let user = null;
      try {
        user = JSON.parse(rawUser);
      } catch {
        console.error("Erro ao ler loggedUser — JSON inválido.");
        return;
      }

      if (!user?.email) {
        console.error(
          "Usuário sem email — chave para histórico não pode ser criada."
        );
        return;
      }

      const key = `purchases_${user.email}`;

      let previous: any[] = [];
      try {
        previous = JSON.parse(localStorage.getItem(key) || "[]");
        if (!Array.isArray(previous)) previous = [];
      } catch {
        console.warn("Histórico corrompido — recriando.");
        previous = [];
      }

      const newPurchase = {
        id: Date.now(),
        date: new Date().toLocaleDateString("pt-BR"),
        items: state.items.map((i) => ({
          id: i.id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
      };

      console.log(" Salvando compra: ", newPurchase);

      const updated = [...previous, newPurchase];

      localStorage.setItem(key, JSON.stringify(updated));

      // limpar carrinho
      state.items = [];
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  checkout,
} = cartSlice.actions;

export default cartSlice.reducer;
