import { Card, Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import type { RegisterFormValues } from "../Interfaces/Interfaces";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = (values: RegisterFormValues) => {
    const { firstName, lastName, email, password } = values;

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const emailExists = existingUsers.some((u: RegisterFormValues) => u.email === email);

    if (emailExists) {
      message.error("Já existe um usuário com este e-mail.");
      return;
    }

    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password,
    };

    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    message.success("Cadastro realizado com sucesso!");

    navigate("/login");
  };

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
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <Button type="default" onClick={() => navigate("/")}>
          ← Voltar para Home
        </Button>
      </div>

      <Card style={{ width: 420, padding: 20 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>
          Criar Cadastro
        </Title>

        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label="Nome"
            name="firstName"
            rules={[{ required: true, message: "Digite seu nome" }]}
          >
            <Input placeholder="Nome" />
          </Form.Item>

          <Form.Item
            label="Sobrenome"
            name="lastName"
            rules={[{ required: true, message: "Digite seu sobrenome" }]}
          >
            <Input placeholder="Sobrenome" />
          </Form.Item>

          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: "Digite seu e-mail" },
              { type: "email", message: "Digite um e-mail válido" },
            ]}
          >
            <Input placeholder="exemplo@email.com" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: "Digite uma senha" }]}
          >
            <Input.Password placeholder="Sua senha" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Cadastrar
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 10 }}>
          <Text>Já possui conta? </Text>
          <Link to="/login">Entrar</Link>
        </div>
      </Card>
    </div>
  );
}
