import { useEffect, useState } from "react";
import { Typography, Spin, List, theme } from "antd";
import ProductItem from "../components/Products/ProductItem";
import type { Product } from "./Interfaces/Interfaces";

const { Title } = Typography;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { token } = theme.useToken();

  useEffect(() => {
    const loadProducts = async () => {
      const apiProducts: Product[] = await fetch(
        "https://fakestoreapi.com/products"
      ).then((res) => res.json());

      const localProducts: Product[] = JSON.parse(
        localStorage.getItem("products") || "[]"
      );

      const combined = [...apiProducts, ...localProducts];

      setProducts(combined);
      setLoading(false);
    };

    loadProducts();
  }, []);

  return (
    <div style={{ padding: token.paddingXL, textAlign: "center" }}>
      <Title level={2}>Welcome to the Shop</Title>

      <Title level={4} style={{ marginTop: token.marginSM }}>
        Top 5 Products
      </Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 5,
          }}
          dataSource={products.slice(0, 5)}
          renderItem={(p) => (
            <List.Item>
              <ProductItem product={p} showViewButton />
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
