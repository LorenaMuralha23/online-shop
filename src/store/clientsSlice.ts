import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Client } from "../pages/interfaces/Interfaces";


interface ClientsState {
  list: Client[];
}

const initialState: ClientsState = {
  list: JSON.parse(localStorage.getItem("clients") || "[]"),
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.list = action.payload;
      localStorage.setItem("clients", JSON.stringify(state.list));
    },

    addClient: (state, action: PayloadAction<Client>) => {
      state.list.push(action.payload);
      localStorage.setItem("clients", JSON.stringify(state.list));
    },

    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.list.findIndex(c => c.id === action.payload.id);
      state.list[index] = action.payload;
      localStorage.setItem("clients", JSON.stringify(state.list));
    },

    deleteClient: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(c => c.id !== action.payload);
      localStorage.setItem("clients", JSON.stringify(state.list));
    }
  }
});

export const { setClients, addClient, updateClient, deleteClient } = clientsSlice.actions;
export default clientsSlice.reducer;
