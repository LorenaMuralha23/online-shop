import { Card, Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../Interfaces/Interfaces";

const { Title, Text } = Typography;

export default function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = (values: { email: string; password: string }) => {
        const { email, password } = values;

        const users = JSON.parse(localStorage.getItem("users") || "[]");

        const user = users.find(
            (u: User) => u.email === email && u.password === password
        );

        if (!user) {
            message.error("E-mail ou senha incorretos.");
            return;
        }

        const loggedUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        localStorage.setItem("loggedUser", JSON.stringify(loggedUser));

        message.success("Login realizado com sucesso!");

        navigate("/");
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

            <Card style={{ width: 380, padding: 20 }}>
                <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>
                    Login
                </Title>

                <Form layout="vertical" onFinish={handleLogin}>
                    <Form.Item label="E-mail" name="email" rules={[{ required: true }]}>
                        <Input placeholder="Digite seu e-mail" />
                    </Form.Item>

                    <Form.Item label="Senha" name="password" rules={[{ required: true }]}>
                        <Input.Password placeholder="Digite sua senha" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Entrar
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: "center", marginTop: 10 }}>
                    <Text>Não tem conta? </Text>
                    <Link to="/register">Criar cadastro</Link>
                </div>
            </Card>
        </div>
    );
}
