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
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import default_image from "../../assets/default_image.jpeg";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  deleteProduct,
  setProducts,
  updateProduct,
  addProduct,
} from "../../store/productSlice";

import type { Product } from "../interfaces/Interfaces";
import { addToCart } from "../../store/cartSlice";

const { Title } = Typography;

// ===============================
// FORM TYPES
// ===============================
interface ProductFormValues {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

// ===============================
// API TYPE
// ===============================
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

  // SEARCH TEXT
  const [searchText, setSearchText] = useState("");

  // EDIT
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState<Product | null>(null);
  const [formEdit] = Form.useForm<ProductFormValues>();

  // CREATE
  const [createOpen, setCreateOpen] = useState(false);
  const [formCreate] = Form.useForm<ProductFormValues>();

  const isLogged = localStorage.getItem("loggedUser");

  // ===============================
  // LOAD PRODUCTS — EXECUTA SOMENTE UMA VEZ
  // ===============================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

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

        const storedUser = localStorage.getItem("loggedUser");
        let localProducts: Product[] = [];

        if (storedUser) {
          const user = JSON.parse(storedUser);
          const key = `products_${user.email}`;
          localProducts = JSON.parse(localStorage.getItem(key) || "[]");
        }


        // 🔥 REMOVER DUPLICADOS DE ID
        const all = [...formattedApi, ...localProducts];
        const unique = Array.from(new Map(all.map((p) => [p.id, p])).values());

        dispatch(setProducts(unique));
      } catch {
        message.error("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []); // <-- NUNCA mais usar [dispatch], isso trava e duplica tudo

  // ===============================
  // EDIT PRODUCT
  // ===============================
  const openEditDrawer = (product: Product) => {
    setCurrent(product);
    formEdit.setFieldsValue({ ...product });
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
      message.success("Produto atualizado!");
      setEditOpen(false);
    });
  };

  // ===============================
  // DELETE PRODUCT
  // ===============================
  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id));
    message.success("Produto removido!");
  };

  // ===============================
  // CREATE PRODUCT
  // ===============================
  const handleCreateProduct = () => {
    formCreate.validateFields().then((values) => {
      const newProduct: Product = {
        id: Date.now(), // ID único
        title: values.title,
        description: values.description,
        price: Number(values.price),
        category: values.category,
        image: values.image,
        rating: { rate: 0, count: 0 },
      };

      dispatch(addProduct(newProduct));
      message.success("Produto criado!");

      formCreate.resetFields();
      setCreateOpen(false);
    });
  };

  const isUserProduct = (id: number) => id > 1000;

  // ===============================
  // FILTER SEARCH
  // ===============================
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // ===============================
  // RENDER
  // ===============================
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

        {isLogged && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            New Product
          </Button>
        )}
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search product..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          maxWidth: 350,
          marginBottom: 20,
          padding: 6,
        }}
      />

      {/* LIST */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProducts.map((p) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
              <Card
                hoverable
                style={{ width: "100%" }}
                bodyStyle={{ padding: 16 }}
                actions={
                  isUserProduct(p.id)
                    ? [
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEditDrawer(p)}
                      />,
                      <Popconfirm
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
                  fallback={default_image}
                  height={150}
                  preview={false}
                  style={{ objectFit: "contain", marginBottom: 12 }}
                />

                <h4>{p.title}</h4>

                <Rate disabled value={p.rating.rate} allowHalf />
                <span> ({p.rating.count})</span>

                <p>{p.description.substring(0, 60)}...</p>

                <p style={{ fontWeight: "bold" }}>US$ {p.price}</p>

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
                      message.success("Adicionado ao carrinho!");
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

      {/* EDIT DRAWER */}
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
        <Form form={formEdit} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="image" label="Image URL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Drawer>

      {/* CREATE MODAL */}
      <Modal
        title="New Product"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={handleCreateProduct}
        okText="Save"
        cancelText="Cancel"
        width={500}
      >
        <Form form={formCreate} layout="vertical">
          {formCreate.getFieldValue("image") && (
            <Image
              src={formCreate.getFieldValue("image")}
              fallback={default_image}
              height={120}
              style={{ marginBottom: 16 }}
            />
          )}

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
            <select
              style={{
                width: "100%",
                height: 32,
                border: "1px solid #d9d9d9",
                borderRadius: 6,
                paddingInline: 8,
              }}
            >
              <option value="" disabled selected>
                Select a category
              </option>
              <option value="electronics">Electronics</option>
              <option value="jewelery">Jewelery</option>
              <option value="men clothing">Men Clothing</option>
              <option value="women clothing">Women Clothing</option>
            </select>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <Input type="number" min={0} step="0.01" prefix="$" />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true, message: "Image is required" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
