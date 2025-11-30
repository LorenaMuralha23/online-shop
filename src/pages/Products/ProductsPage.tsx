import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Image,
  Button,
  Rate,
  Drawer,
  Form,
  Input,
  Popconfirm,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  deleteProduct,
  setProducts,
  updateProduct
} from "../../store/productSlice";
import type { Product } from "../interfaces/Interfaces";
import { addToCart } from "../../store/cartSlice";

const { Title } = Typography;

// --- FORM TYPES ---
interface ProductFormValues {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

// --- FAKESTORE API TYPE ---
interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.list);

  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState<Product | null>(null);
  const [formEdit] = Form.useForm<ProductFormValues>();

  // ============================================================
  // 1. LOAD API + LOCALSTORAGE PRODUCTS
  // ============================================================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        // 1️⃣ Buscar API
        const res = await fetch("https://fakestoreapi.com/products");
        const apiProducts: ApiProduct[] = await res.json();

        const formattedApi: Product[] = apiProducts.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          description: p.description,
          category: p.category,
          image: p.image,
          rating: p.rating ?? { rate: 0, count: 0 },
        }));

        // 2️⃣ Buscar os produtos criados pelo usuário
        const localProducts: Product[] = JSON.parse(
          localStorage.getItem("products") || "[]"
        );

        // 3️⃣ Combinar tudo
        const combined = [...formattedApi, ...localProducts];

        dispatch(setProducts(combined));
      } catch (err) {
        console.error(err);
        message.error("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [dispatch]);

  // ============================================================
  // 2. EDIT PRODUCT (DRAWER)
  // ============================================================
  const openEditDrawer = (product: Product) => {
    setCurrent(product);

    formEdit.setFieldsValue({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    });

    setEditOpen(true);
  };

  const handleEditSave = () => {
    formEdit.validateFields().then((values) => {
      if (!current) return;

      const updated: Product = {
        ...current,
        ...values,
        price: Number(values.price),
      };

      dispatch(updateProduct(updated));
      message.success("Produto atualizado com sucesso!");
      setEditOpen(false);
    });
  };

  // ============================================================
  // 3. DELETE PRODUCT (Popconfirm)
  // ============================================================
  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id));
    message.success("Produto removido!");
  };

  // ============================================================
  // 4. ONLY USER PRODUCTS ARE EDITABLE (ID > 1000)
  // FakeStore API IDs vão de 1 a 20
  // IDs de produtos criados pelo usuário = Date.now() (bem maior)
  // ============================================================
  const isUserProduct = (id: number) => id > 1000;

  // ============================================================
  // 5. RENDER
  // ============================================================
  return (
    <div style={{ padding: 24 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Title level={3}>List of Products</Title>
      </div>

      {/* LOADING */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((p) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
              <Card
                hoverable
                bodyStyle={{ padding: 16 }}
                actions={
                  isUserProduct(p.id)
                    ? [
                      <Button
                        key="edit"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEditDrawer(p)}
                      />,
                      <Popconfirm
                        key="delete"
                        title="Excluir produto?"
                        okText="Sim"
                        cancelText="Cancelar"
                        onConfirm={() => handleDelete(p.id)}
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>,
                    ]
                    : undefined
                }
              >
                <Image
                  src={p.image}
                  height={150}
                  preview={false}
                  style={{
                    objectFit: "contain",
                    marginBottom: 12,
                    width: "100%",
                  }}
                />

                <h4 style={{ minHeight: 40 }}>{p.title}</h4>

                <Rate
                  disabled
                  value={p.rating.rate}
                  allowHalf
                  style={{ fontSize: 14 }}
                />

                <span style={{ marginLeft: 8, color: "#555" }}>
                  ({p.rating.count})
                </span>

                <p style={{ minHeight: 50, marginTop: 8 }}>
                  {p.description.substring(0, 60)}...
                </p>

                <p style={{ fontWeight: "bold" }}>Price: US$ {p.price}</p>

                {/* ⭐ BUY aparece apenas em produtos que NÃO são do usuário */}
                {!isUserProduct(p.id) && (
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      dispatch(
                        addToCart({
                          id: p.id,
                          title: p.title,
                          image: p.image,
                          price: p.price,
                          quantity: 1,
                        })
                      );
                      message.success(`${p.title} adicionado ao carrinho!`);
                    }}
                  >
                    Buy
                  </Button>
                )}
              </Card>

            </Col>
          ))}
        </Row>
      )}

      {/* DRAWER DE EDIÇÃO */}
      <Drawer
        title="Edit Product"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        width={420}
        extra={
          <Button type="primary" onClick={handleEditSave}>
            Save
          </Button>
        }
      >
        <Form<ProductFormValues> layout="vertical" form={formEdit}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <Input type="number" min={0} step="0.01" />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true, message: "Image URL is required" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
