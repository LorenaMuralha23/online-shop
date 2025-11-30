export interface Product {
  description: string;
  id: number;
  title: string;
  price: number;
  image: string;
  rating: { rate: number; count: number };
  category: string;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoggedUser {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  address: string;
  phone: string;
  status: "activated" | "deactivated";
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    suite: string;
    city: string;
  };
}

export interface NavbarProps {
  mode: "light" | "dark";
  setMode: (m: "light" | "dark") => void;
}

export interface CartItem {
  id: number;            // id do produto
  title: string;
  image: string;
  price: number;
  quantity: number;
}
