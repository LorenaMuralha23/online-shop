import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Button,
  Tooltip,
  Drawer,
  Form,
  Input,
  Modal,
  theme,
  message,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";

import {
  addClient,
  updateClient,
  deleteClient,
  setClients,
} from "../../store/clientsSlice";

import {
  capitalizeFirstLetter,
  formatDate,
  generatePastDate,
  randomStatus,
} from "../../utils/clientUtils";

import type { Client } from "../Interfaces/Interfaces";

const { Title } = Typography;

interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    suite: string;
    city: string;
  };
}

export default function ClientsPage() {
  const { token } = theme.useToken();
  const dispatch = useDispatch<AppDispatch>();

  const clients = useSelector((state: RootState) => state.clients.list);

  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [current, setCurrent] = useState<Client | null>(null);

  const [formEdit] = Form.useForm();
  const [formCreate] = Form.useForm();

  useEffect(() => {
    if (clients.length === 0) {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
        .then((apiUsers: ApiUser[]) => {
          const formatted: Client[] = apiUsers.map((u: ApiUser) => ({
            id: u.id,
            firstName: capitalizeFirstLetter(u.name.split(" ")[0]),
            lastName: capitalizeFirstLetter(u.name.split(" ").slice(1).join(" ")),
            email: u.email.toLowerCase(),
            createdAt: generatePastDate(),
            address: `${u.address.street}, ${u.address.suite} - ${u.address.city}`,
            phone: u.phone,
            status: randomStatus(),
          }));

          dispatch(setClients(formatted));
        });
    }
  }, []);

  const openEditDrawer = (client: Client) => {
    setCurrent(client);
    formEdit.setFieldsValue(client);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    formEdit.validateFields().then(values => {
      const updated: Client = { ...current!, ...values };
      dispatch(updateClient(updated));
      message.success("Cliente atualizado com sucesso!");
      setEditOpen(false);
    });
  };

  const openDeleteConfirm = (id: number) => {
    setDeleteId(id);
  };

  const handleDelete = () => {
    dispatch(deleteClient(deleteId!));
    message.success("Cliente excluído!");
    setDeleteId(null);
  };

  const handleCreateSave = () => {
    formCreate.validateFields().then(values => {
      const newClient: Client = {
        id: Date.now(),
        createdAt: generatePastDate(),
        status: randomStatus(),
        ...values,
      };

      dispatch(addClient(newClient));
      message.success("Cliente criado!");
      setCreateOpen(false);
      formCreate.resetFields();
    });
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      sorter: (a: Client, b: Client) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: (a: Client, b: Client) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => formatDate(date),
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a: Client, b: Client) => a.status.localeCompare(b.status),
      render: (status: string) =>
        status === "activated" ? (
          <Tag color="green">ACTIVATED</Tag>
        ) : (
          <Tag color="red">DEACTIVATED</Tag>
        ),
    },
    {
      title: "Actions",
      render: (_: Client, record: Client) => (
        <>
          <Tooltip title="Edit">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditDrawer(record)}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              size="small"
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => openDeleteConfirm(record.id)}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: token.paddingXL }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: token.marginLG }}>
        <Title level={3}>List of Users</Title>

        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          New Client
        </Button>
      </div>

      <Table bordered columns={columns} dataSource={clients} rowKey="id" />

      <Drawer
        title="Edit User"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        width={400}
        extra={<Button type="primary" onClick={handleEditSave}>Save</Button>}
      >
        <Form layout="vertical" form={formEdit}>
          <Form.Item label="Status" name="status"><Input disabled /></Form.Item>
          <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Drawer>

      <Modal
        open={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
        title="Confirm Delete"
      >
        Tem certeza que deseja excluir este cliente?
      </Modal>

      <Modal
        title="New Client"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={handleCreateSave}
      >
        <Form layout="vertical" form={formCreate}>
          <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
