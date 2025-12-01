import { useEffect, useState } from "react";
import {
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
  Flex,
  theme,
  Col,
  Row,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import default_image from "../../assets/default_image.png";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  deleteProduct,
  setProducts,
  updateProduct,
  addProduct,
} from "../../store/productSlice";

import type { Product } from "../Interfaces/Interfaces";
import { addToCart } from "../../store/cartSlice";

const { Title, Text } = Typography;


interface ProductFormValues {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}


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

  const [, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState<Product | null>(null);
  const [formEdit] = Form.useForm<ProductFormValues>();

  const [createOpen, setCreateOpen] = useState(false);
  const [formCreate] = Form.useForm<ProductFormValues>();

  const isLogged = localStorage.getItem("loggedUser");

  const { token } = theme.useToken();

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
  }, []);

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

  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id));
    message.success("Produto removido!");
  };

  const handleCreateProduct = () => {
    formCreate.validateFields().then((values) => {
      const newProduct: Product = {
        id: Date.now(),
        title: values.title,
        description: values.description,
        price: Number(values.price),
        category: values.category,
        image: values.image,
        rating: { rate: 0, count: 0 },
      };

      dispatch(addProduct(newProduct));
      message.success("Produto cadastrado com sucesso!");

      formCreate.resetFields();
      setCreateOpen(false);
    });
  };

  const isUserProduct = (id: number) => id > 1000;

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
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
      </Flex>

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

      <Row gutter={[24, 24]}>
        {filteredProducts.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                border: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgContainer,
                display: "flex",
                flexDirection: "column",
                height: 420, 
              }}
            >
              <Image
                src={p.image}
                fallback={default_image}
                height={160}
                preview={false}
                style={{ objectFit: "contain", marginBottom: 16 }}
              />

              <Title
                level={5}
                style={{ height: 52, overflow: "hidden", marginBottom: 8 }}
              >
                {p.title}
              </Title>

              <div style={{ marginBottom: 8 }}>
                <Rate disabled value={p.rating.rate} allowHalf />
                <Text> ({p.rating.count})</Text>
              </div>

              <Text style={{ height: 48, overflow: "hidden", display: "block" }}>
                {p.description.substring(0, 85)}...
              </Text>

              <Text strong style={{ marginTop: 8 }}>
                US$ {p.price}
              </Text>

              <Flex style={{ marginTop: "auto", gap: 8 }}>
                {isUserProduct(p.id) ? (
                  <>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => openEditDrawer(p)}
                    />
                    <Popconfirm
                      title="Excluir produto?"
                      okText="Sim"
                      cancelText="Cancelar"
                      onConfirm={() => handleDelete(p.id)}
                    >
                      <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </>
                ) : (
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
              </Flex>
            </div>
          </Col>
        ))}
      </Row>


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

      <Modal
        title="New Product"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={handleCreateProduct}
        okText="Save"
        cancelText="Cancel"
        width={500}
        maskClosable={false}
        keyboard={false}
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
            rules={[{ required: true }]}
          >
            <Input />
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
            rules={[{ required: true }]}
          >
            <Input type="number" min={0} step="0.01" prefix="$" />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
