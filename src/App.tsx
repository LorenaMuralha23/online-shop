import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LogIn/LogInPage";
import Navbar from "./components/NavBar/NavBar";
import RegisterPage from "./pages/Register/RegisterPage";

function AppContent() {
  const location = useLocation();

  // rotas onde a navbar NÃO deve aparecer
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!hideNavbar && <Navbar />}

      <Content style={{ padding: hideNavbar ? 0 : 24 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App
