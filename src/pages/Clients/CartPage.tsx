import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  List,
  Button,
  Typography,
  Image,
  Divider,
  message,
  Card,
} from "antd";

import type { RootState, AppDispatch } from "../../store";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  checkout,
  clearCart
} from "../../store/cartSlice";
import type { CartItem } from "../../store/cartSlice";

const { Title } = Typography;

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = localStorage.getItem("loggedUser");
  const cart = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    if (!user) {
      message.warning("Você deve estar logado para acessar ao carrinho.");
      navigate("/login");
    }
  }, [user]);

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Your Cart</Title>
      <Divider />

      {cart.length === 0 ? (
        <Card style={{ padding: 32, textAlign: "center" }}>
          <Title level={4}>Your cart is empty</Title>
          <Button type="primary" onClick={() => navigate("/products")}>
            Go to Products
          </Button>
        </Card>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={cart}
            renderItem={(item: CartItem) => (
              <List.Item
                actions={[
                  <Button
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    disabled={item.quantity === 1}
                  >
                    -
                  </Button>,

                  <strong>{item.quantity}</strong>,

                  <Button
                    onClick={() => dispatch(increaseQuantity(item.id))}
                    type="default"
                  >
                    +
                  </Button>,

                  <Button
                    danger
                    type="text"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Image
                      src={item.image}
                      width={80}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  }
                  title={<strong>{item.title}</strong>}
                  description={`Preço Unidade: US$ ${item.price}`}
                />
              </List.Item>
            )}
          />

          <Divider />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingInline: 12,
            }}
          >
            <Title level={4}>Total:</Title>
            <Title level={4}>US$ {total.toFixed(2)}</Title>
          </div>

          <Button
            type="primary"
            block
            size="large"
            onClick={() => {
              dispatch(checkout());
              message.success("Compra finalizada com sucesso!");
            }}
          >
            Finalizar Compra
          </Button>

          <Button
            danger
            block
            style={{ marginTop: 10 }}
            onClick={() => {
              dispatch(clearCart());
              message.info("Carrinho limpo!");
            }}
          >
            Limpar Carrinho
          </Button>

        </>
      )}
    </div>
  );
}
