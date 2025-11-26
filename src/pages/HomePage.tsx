import { useEffect, useMemo, useState } from "react";
import { Card, Typography, Spin, Image, Row, Col, notification } from "antd";
import { EyeFilled } from "@ant-design/icons";
import type { Product } from "./interfaces/Interfaces";

const { Title } = Typography;

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Buscar produtos da Fake Store API
    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetch("https://fakestoreapi.com/products");
                const data = await res.json();
                setProducts(data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                notification.error({
                    message: "Erro ao carregar produtos",
                    description: "Não foi possível carregar os dados da API.",
                    title: undefined
                });
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    const topFive = useMemo(() => products.slice(0, 5), [products]);

    const handleEyeClick = () => {
        notification.error({
            message: "Ação não permitida",
            description: "O botão de detalhes não está implementado nesta etapa.",
            title: undefined
        });
    };

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Welcome to the Shop</Title>

            <Title level={4} style={{ marginTop: 20 }}>
                Top 5 Products
            </Title>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    {topFive.map((p) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
                            <Card
                                hoverable
                                style={{ width: "100%" }}
                                bodyStyle={{ padding: 16 }}
                            >
                                {/* IMAGEM */}
                                <Image
                                    src={p.image}
                                    height={180}
                                    style={{ objectFit: "contain", marginBottom: 12 }}
                                    preview={true}
                                />

                                {/* TÍTULO */}
                                <h4 style={{ fontSize: 15, marginBottom: 6 }}>{p.title}</h4>

                                {/* DESCRIÇÃO RESUMIDA */}
                                <p style={{ color: "#666", fontSize: 13, minHeight: 40 }}>
                                    {p.description?.substring(0, 60)}...
                                </p>

                                {/* ÍCONE CENTRALIZADO */}
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                                    <EyeFilled
                                        style={{ fontSize: 20, cursor: "pointer" }}
                                        onClick={handleEyeClick}
                                    />
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
