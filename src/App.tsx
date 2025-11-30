import { useState, useEffect } from "react";
import { Layout, ConfigProvider, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LogIn/LogInPage";
import Navbar from "./components/NavBar/NavBar";
import RegisterPage from "./pages/Register/RegisterPage";
import ProductsPage from "./pages/Products/ProductsPage";
import ClientsPage from "./pages/Clients/ClientsPage";

function AppContent() {
  const location = useLocation();

  // rotas onde a navbar NÃO deve aparecer
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  // ===========================
  //   THEME STATE (light/dark)
  // ===========================
  const [mode, setMode] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  // salva no localStorage ao trocar
  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        {/* Passamos o tema para a Navbar */}
        {!hideNavbar && <Navbar mode={mode} setMode={setMode} />}

        <Content style={{ padding: hideNavbar ? 0 : 24 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/clients" element={<ClientsPage />} />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
