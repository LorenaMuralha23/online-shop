import { Layout, Input, Space, Button } from "antd";
import { ShoppingCartOutlined, LoginOutlined, UserOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { NavbarProps } from "../../pages/interfaces/Interfaces";

const { Header } = Layout;
const { Search } = Input;

interface LoggedUser {
  firstName: string;
  lastName: string;
  email: string;
}

export default function Navbar({ mode, setMode }: NavbarProps) {
  const [user] = useState<LoggedUser | null>(() => {
    const stored = localStorage.getItem("loggedUser");
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <Header
      style={{
        background: "#e4f2ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: 40,
        height: 70,
        width: "100%",
      }}
    >
      {/* LOGO + LINKS PRINCIPAIS */}
      <Space size="large" align="center">
        <Link to="/" style={{ fontSize: 24, fontWeight: 700, color: "#ff6600" }}>
          Online <span style={{ color: "#0077cc" }}>Shop</span>
        </Link>

        <Link to="/" style={{ fontSize: 16, color: "#000" }}>
          Home
        </Link>

        <Link to="/products" style={{ fontSize: 16, color: "#000" }}>
          Products
        </Link>

        {/* 🔵 CLIENTS SÓ APARECE SE O USUÁRIO ESTIVER LOGADO */}
        {user && (
          <Link to="/clients" style={{ fontSize: 16, color: "#000" }}>
            Clients
          </Link>
        )}
      </Space>

      {/* SEARCH */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Search placeholder="Find Product" enterButton style={{ maxWidth: 450 }} />
      </div>

      {/* LOGIN OU USUÁRIO */}
      <Space size="large" align="center">
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UserOutlined />
            <span style={{ fontSize: 15, fontWeight: 500 }}>
              {user.firstName.toUpperCase()}
            </span>
          </div>
        ) : (
          <Link to="/login" style={{ fontSize: 15 }}>
            <LoginOutlined style={{ marginRight: 5 }} />
            Login
          </Link>
        )}

        <Button
          type="text"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          icon={
            mode === "light"
              ? <MoonOutlined style={{ fontSize: 18 }} />
              : <SunOutlined style={{ fontSize: 18, color: "#fadb14" }} />
          }
        />

        <Link to="/cart" style={{ fontSize: 15 }}>
          <ShoppingCartOutlined style={{ marginRight: 5 }} />
          Cart
        </Link>
      </Space>
    </Header>
  );
}
