import { Card, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface LoggedUser {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<LoggedUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedUser");

    if (!stored) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(stored));
  }, [navigate]);

  if (!user) return null; // evita piscar tela

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: "0 20px",
      }}
    >
      <Card
        bordered
        style={{
          padding: 24,
          borderRadius: 12,
        }}
      >
        <Title level={3} style={{ marginBottom: 20, textAlign: "center" }}>
          Meu Perfil
        </Title>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Nome:</Text>
          <br />
          <Text>{user.firstName}</Text>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Sobrenome:</Text>
          <br />
          <Text>{user.lastName}</Text>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>E-mail:</Text>
          <br />
          <Text>{user.email}</Text>
        </div>
      </Card>
    </div>
  );
}
