import { Image, Typography, Rate, Button, Flex, theme, message } from "antd";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../pages/interfaces/Interfaces";

const { Title, Text, Paragraph } = Typography;

interface Props {
  product: Product;
}

export default function ProductItem({ product }: Props) {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  // Verificar usuário logado
  const user = JSON.parse(localStorage.getItem("loggedUser") || "null");

  // Handle Buy
  const handleBuy = () => {
    if (!user) {
      message.error("Você precisa estar logado para comprar.");
      navigate("/login");
      return;
    }

    message.success("Produto adicionado ao carrinho!");
  };

  return (
    <div
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        padding: token.paddingLG,
        boxShadow: token.boxShadowSecondary,
        width: "100%",
        maxWidth: 320,
        minHeight: 380,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* IMAGEM */}
      <Flex justify="center" style={{ marginBottom: token.marginMD }}>
        <Image
          src={product.image}
          fallback="https://via.placeholder.com/150?text=No+Image"
          height={120}
          preview={false}
          style={{ objectFit: "contain" }}
        />
      </Flex>

      {/* TÍTULO */}
      <Title
        level={5}
        ellipsis
        style={{ marginBottom: token.marginXS }}
      >
        {product.title}
      </Title>

      {/* RATING */}
      <Flex align="center" gap={4} style={{ marginBottom: token.marginXS }}>
        <Rate disabled value={product.rating.rate} allowHalf style={{ fontSize: 14 }} />
        <Text type="secondary">({product.rating.count})</Text>
      </Flex>

      {/* DESCRIÇÃO */}
      <Paragraph
        type="secondary"
        ellipsis={{ rows: 2 }}
        style={{ marginBottom: token.marginXS }}
      >
        {product.description}
      </Paragraph>

      {/* PREÇO */}
      <Text strong style={{ marginBottom: token.marginSM }}>
        Price: US$ {product.price}
      </Text>

      {/* BOTÃO BUY */}
      <Button type="primary" block onClick={handleBuy}>
        Buy
      </Button>
    </div>
  );
}
