import { Layout, Input, Space, Dropdown, type MenuProps } from "antd";
import {
  ShoppingCartOutlined,
  LoginOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const { Header } = Layout;
const { Search } = Input;

interface LoggedUser {
  firstName: string;
  lastName: string;
  email: string;
}

export default function Navbar() {
  const navigate = useNavigate();

  // Carrega o usuário logado 1x sem warnings
  const [user, setUser] = useState<LoggedUser | null>(() => {
    const storedUser = localStorage.getItem("loggedUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Logout
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("loggedUser");
      setUser(null);
      navigate("/login");
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

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
      {/* LOGO + HOME */}
      <Space size="large" align="center">
        <Link
          to="/"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#ff6600",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/833/833314.png"
            height={28}
            style={{ marginRight: 8 }}
          />
          <span style={{ color: "#ff6600" }}>Online</span>
          <span style={{ color: "#0077cc", marginLeft: 5 }}>Shop</span>
        </Link>

        <Link to="/" style={{ fontSize: 16, color: "#000" }}>
          Home
        </Link>

        <Link to="/products" style={{ fontSize: 16, color: "#000" }}>
          Products
        </Link>
      </Space>

      {/* SEARCH */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Search placeholder="Find Product" enterButton style={{ maxWidth: 450 }} />
      </div>

      {/* LOGIN OU USUÁRIO LOGADO */}
      <Space size="large" align="center">
        {user ? (
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            placement="bottomRight"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                paddingInline: 4,
              }}
            >
              <UserOutlined />
              <span style={{ fontSize: 15, fontWeight: 500 }}>
                {user.firstName.toUpperCase()}
              </span>
            </div>
          </Dropdown>
        ) : (
          <Link to="/login" style={{ fontSize: 15 }}>
            <LoginOutlined style={{ marginRight: 5 }} />
            Login
          </Link>
        )}

        {/* CART */}
        <Link to="/cart" style={{ fontSize: 15 }}>
          <ShoppingCartOutlined style={{ marginRight: 5 }} />
          Cart
        </Link>
      </Space>
    </Header>
  );
}
