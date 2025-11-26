import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar/NavBar";

function App() {

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh", width: "100%" }}>

        {/* HEADER DA APLICAÇÃO */}
        <NavBar />

        {/* ÁREA PRINCIPAL */}
        <Content style={{ padding: 24 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Content>

      </Layout>
    </BrowserRouter>
  );
}

export default App
