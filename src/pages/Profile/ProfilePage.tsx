import { Card, Typography, Avatar, List, Divider, Empty } from "antd";
import { useEffect, useState } from "react";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface LoggedUser {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string; // caso você use fotos de perfil futuramente
}

interface PurchaseItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface PurchaseRecord {
  id: number;
  date: string;
  items: PurchaseItem[];
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [history, setHistory] = useState<PurchaseRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("loggedUser");
    if (!stored) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    // sempre recarrega o histórico ao abrir a página
    const key = `purchases_${parsedUser.email}`;
    const savedHistory = JSON.parse(localStorage.getItem(key) || "[]");
    setHistory(savedHistory);

  }, []);

  if (!user) return null;

  return (
    <div
      style={{
        maxWidth: 700,
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
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar
            size={100}
            src={user.avatar}
            icon={!user.avatar && <UserOutlined />}
          />
          <Title level={3} style={{ marginTop: 16 }}>
            {user.firstName} {user.lastName}
          </Title>
        </div>

        <Divider />

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

        <Divider />

        <Title level={4}>
          <ShoppingCartOutlined /> Histórico de Compras
        </Title>

        {history.length === 0 ? (
          <Empty description="Nenhuma compra realizada ainda" style={{ marginTop: 20 }} />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={history}
            renderItem={(purchase) => (
              <Card
                key={purchase.id}
                style={{ marginBottom: 20, borderRadius: 10 }}
              >
                <Text strong>Data da compra:</Text>{" "}
                <Text>{purchase.date}</Text>

                <List
                  dataSource={purchase.items}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: 60, height: 60, objectFit: "contain" }}
                          />
                        }
                        title={item.title}
                        description={`Quantidade: ${item.quantity}`}
                      />
                      <Text strong>US$ {item.price.toFixed(2)}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          />
        )}
      </Card>
    </div>
  );
}
