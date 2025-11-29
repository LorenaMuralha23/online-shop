import { useEffect, useState } from "react";
import {
  List,
  Input,
  Typography,
  Spin,
  theme,
  Button,
  Modal,
  Form,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ProductItem from "../../components/Products/ProductItem";
import type { Product, LoggedUser } from "../interfaces/Interfaces";

const { Title } = Typography;
const { Search } = Input;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [user] = useState<LoggedUser | null>(() => {
    const stored = localStorage.getItem("loggedUser");
    return stored ? JSON.parse(stored) : null;
  });

  const { token } = theme.useToken();
  const navigate = useNavigate();

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
      setFiltered(combined);
      setLoading(false);
    };

    loadProducts();
  }, []);

  // ========================
  // FILTRO DE BUSCA
  // ========================
  const handleSearch = (value: string) => {
    const query = value.toLowerCase();

    const result = products.filter((p) =>
      p.title.toLowerCase().includes(query)
    );

    setFiltered(result);
  };

  // ========================
  // ABRIR/FECHAR MODAL
  // ========================
  const openModal = () => {
    if (!user) {
      message.error("Você precisa estar logado para adicionar produtos.");
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // ========================
  // SALVAR NOVO PRODUTO
  // ========================
  const handleSave = (values: any) => {
    if (!user) {
      message.error("Usuário não autenticado.");
      return;
    }

    const localProducts: Product[] = JSON.parse(
      localStorage.getItem("products") || "[]"
    );

    const newProduct: Product = {
      id: Date.now(),
      title: values.title,
      price: Number(values.price),
      image: values.image,
      description: values.description,
      category: values.category,
      rating: { rate: 0, count: 0 },
    };

    const updated = [...localProducts, newProduct];
    localStorage.setItem("products", JSON.stringify(updated));

    message.success("Produto cadastrado com sucesso!");

    setProducts((prev) => [...prev, newProduct]);
    setFiltered((prev) => [...prev, newProduct]);

    closeModal();
  };

  // ========================
  // COMPONENTE DO MODAL
  // ========================
  const NewProductModal = () => (
    <Modal
      title="New Product"
      open={isModalOpen}
      onCancel={closeModal}
      okText="Save"
      cancelText="Cancel"
      onOk={() => form.submit()}
      width={500}
      maskClosable={false}
      keyboard={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true }]}
        >
          <Input placeholder="Product title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true }]}
        >
          <select
            style={{
              width: "100%",
              padding: 8,
              borderRadius: token.borderRadiusLG,
              border: `1px solid ${token.colorBorder}`,
            }}
          >
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelery</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
          </select>
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true }]}
        >
          <Input type="number" min={0} prefix="$" />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          rules={[{ required: true }]}
        >
          <Input placeholder="URL image" />
        </Form.Item>
      </Form>
    </Modal>
  );

  // ========================
  // RENDER PAGE
  // ========================
  return (
    <div style={{ padding: token.paddingXL }}>
      {/* TÍTULO + BOTÃO NEW PRODUCT (só se logado) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: token.marginMD,
        }}
      >
        <Title level={3}>List of Products</Title>

        {user && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openModal}
          >
            New Product
          </Button>
        )}
      </div>

      {/* CAMPO DE BUSCA */}
      <Search
        placeholder="Search product by name..."
        allowClear
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          marginBottom: token.marginLG,
          maxWidth: 400,
        }}
      />

      {/* LISTAGEM */}
      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
          }}
          dataSource={filtered}
          renderItem={(p) => (
            <List.Item>
              <ProductItem product={p} />
            </List.Item>
          )}
        />
      )}

      {NewProductModal()}
    </div>
  );
}
