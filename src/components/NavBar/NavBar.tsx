import { Layout, Input, Space } from "antd";
import { ShoppingCartOutlined, LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Header } = Layout;
const { Search } = Input;

export default function Navbar() {
  return (
    <Header
      style={{
        background: "#e4f2ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: 40,
        height: 70,
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
            alt="logo"
            height={28}
            style={{ marginRight: 8 }}
          />
          <span style={{ color: "#ff6600" }}>Online</span>
          <span style={{ color: "#0077cc", marginLeft: 5 }}>Shop</span>
        </Link>

        <Link
          to="/"
          style={{
            fontSize: 16,
            color: "#000",
          }}
        >
          Home
        </Link>
      </Space>

      {/* SEARCH */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Search
          placeholder="Search..."
          style={{ maxWidth: 450 }}
          enterButton
        />
      </div>

      {/* LOGIN + CART */}
      <Space size="large" align="center">
        <Link to="/login" style={{ fontSize: 15 }}>
          <LoginOutlined style={{ marginRight: 5 }} />
          Login
        </Link>

        <Link to="/cart" style={{ fontSize: 15 }}>
          <ShoppingCartOutlined style={{ marginRight: 5 }} />
          Cart
        </Link>
      </Space>
    </Header>
  );
}
