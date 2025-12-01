import { useState } from "react";
import { Card, Image, Rate, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import default_image from "../../assets/default_image.png";
import type { Product } from "../../pages/Interfaces/Interfaces";

interface ProductItemProps {
  product: Product;
  showViewButton?: boolean;
}

export default function ProductItem({ product, showViewButton }: ProductItemProps) {
  const [visible, setVisible] = useState(false);

  const openPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(true);
  };

  return (
    <>
      <Card
        hoverable
        style={{ width: "100%" }}
        bodyStyle={{ padding: 14 }}
        actions={
          showViewButton
            ? [
              <Button
                key="view"
                type="text"
                icon={<EyeOutlined />}
                onClick={openPreview}
              />,
            ]
            : undefined
        }
      >
        <Image
          src={product.image}
          fallback={default_image}
          preview={false}
          height={150}
          style={{ width: "100%", objectFit: "contain", marginBottom: 12 }}
        />

        <h4 style={{ minHeight: 40 }}>{product.title}</h4>

        <Rate disabled value={product.rating.rate} allowHalf />
        <span style={{ marginLeft: 6 }}>({product.rating.count})</span>

        <p style={{ marginTop: 8 }}>
          {product.description.substring(0, 50)}...
        </p>

        <p style={{ fontWeight: "bold" }}>US$ {product.price}</p>
      </Card>

      <Image
        src={product.image}
        fallback={default_image}
        preview={{
          visible,
          src: product.image,
          onVisibleChange: (v) => setVisible(v),
        }}
        style={{ display: "none" }} />
    </>
  );
}
