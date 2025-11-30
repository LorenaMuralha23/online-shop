import {
  Layout,
  Input,
  Space,
  Button,
  Drawer,
  Menu,
} from "antd";
import {
  ShoppingCartOutlined,
  LoginOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const { Header } = Layout;
const { Search } = Input;

interface LoggedUser {
  firstName: string;
  lastName: string;
  email: string;
}

interface NavbarProps {
  mode: "light" | "dark";
  setMode: (m: "light" | "dark") => void;
}

export default function Navbar({ mode, setMode }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Usuário logado
  const [user] = useState<LoggedUser | null>(() => {
    const stored = localStorage.getItem("loggedUser");
    return stored ? JSON.parse(stored) : null;
  });

  // Controle da busca
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q") || "";
  const [search, setSearch] = useState(initialQuery);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const value = p.get("q") || "";

    if (value !== search) {
      setSearch(value);
    }
  }, [location.search]);

  const applySearch = (value: string) => {
    const trimmed = value.trim();

    if (!location.pathname.startsWith("/products")) {
      navigate(trimmed ? `/products?q=${trimmed}` : "/products");
      return;
    }

    const newParams = new URLSearchParams(location.search);
    if (trimmed) {
      newParams.set("q", trimmed);
    } else {
      newParams.delete("q");
    }


    navigate({
      pathname: "/products",
      search: newParams.toString(),
    });
  };

  return (
    <>
      {/* 🟦 DESKTOP NAVBAR */}
      <Header
        style={{
          background: "#e4f2ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 20,
          height: 70,
          width: "100%",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {/* LOGO + LINKS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 25,
          }}
        >
          {/* Hamburguer - mobile */}
          <Button
            type="text"
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
            icon={<MenuOutlined style={{ fontSize: 22 }} />}
            style={{
              display: "none",
            }}
          />

          {/* Logo */}
          <Link
            to="/"
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#ff6600",
              whiteSpace: "nowrap",
            }}
          >
            Online <span style={{ color: "#0077cc" }}>Shop</span>
          </Link>

          {/* MENU - Desktop */}
          <div className="desktop-menu" style={{ display: "flex", gap: 20 }}>
            <Link to="/" style={{ fontSize: 16 }}>Home</Link>
            <Link to="/products" style={{ fontSize: 16 }}>Products</Link>

            {user && (
              <Link to="/clients" style={{ fontSize: 16 }}>
                Clients
              </Link>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Search
            placeholder="Find Product"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={applySearch}
            style={{ maxWidth: 450 }}
          />
        </div>

        {/* USER / THEME / CART */}
        <Space
          size="large"
          className="desktop-menu"
          style={{ display: "flex", alignItems: "center" }}
        >
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <UserOutlined />
              {user.firstName.toUpperCase()}
            </div>
          ) : (
            <Link to="/login" style={{ fontSize: 15 }}>
              <LoginOutlined /> Login
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
            <ShoppingCartOutlined /> Cart
          </Link>
        </Space>
      </Header>

      {/* 🟪 MOBILE DRAWER */}
      <Drawer
        title="Menu"
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Menu mode="inline" selectable={false}>
          <Menu.Item onClick={() => navigate("/")}>Home</Menu.Item>
          <Menu.Item onClick={() => navigate("/products")}>Products</Menu.Item>

          {user && (
            <Menu.Item onClick={() => navigate("/clients")}>Clients</Menu.Item>
          )}

          {!user ? (
            <Menu.Item onClick={() => navigate("/login")}>
              <LoginOutlined /> Login
            </Menu.Item>
          ) : (
            <Menu.Item>
              <UserOutlined /> {user.firstName.toUpperCase()}
            </Menu.Item>
          )}

          <Menu.Item
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
          >
            {mode === "light" ? <MoonOutlined /> : <SunOutlined />} Theme
          </Menu.Item>

          <Menu.Item onClick={() => navigate("/cart")}>
            <ShoppingCartOutlined /> Cart
          </Menu.Item>
        </Menu>
      </Drawer>

      {/* CSS RESPONSIVO */}
      <style>
        {`
          @media (max-width: 900px) {
            .desktop-menu {
              display: none !important;
            }
            .mobile-menu {
              display: block !important;
            }
          }
        `}
      </style>
    </>
  );
}
