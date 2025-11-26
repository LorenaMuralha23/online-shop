import { Card, Form, Input, Button, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        paddingTop: 40,
      }}
    >
      {/* BOTÃO DE VOLTAR PARA HOME */}
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <Button type="default" onClick={() => navigate("/")}>
          ← Voltar para Home
        </Button>
      </div>

      <Card style={{ width: 380, padding: 20 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>
          Login
        </Title>

        <Form layout="vertical">
          {/* EMAIL */}
          <Form.Item label="E-mail" name="email" rules={[{ required: true }]}>
            <Input placeholder="Digite seu e-mail" />
          </Form.Item>

          {/* SENHA */}
          <Form.Item label="Senha" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Digite sua senha" />
          </Form.Item>

          {/* BOTÃO LOGIN */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Entrar
            </Button>
          </Form.Item>
        </Form>

        {/* LINK PARA CADASTRO */}
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <Text>Não tem conta? </Text>
          <Link to="/register">Criar cadastro</Link>
        </div>
      </Card>
    </div>
  );
}
