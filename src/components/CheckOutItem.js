import { React, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getProductImages } from "../services/homeService";
import { useCart } from "../context/CartContext";
import { updateCart } from "../services/cartService";

const CheckOutItem = (product) => {
  const [quantity, setQuantity] = useState(product.quantity);
  const [amount, setAmount] = useState(() => {
    return (
      product.quantity *
      (product?.product.discount_price > 0
        ? product.product.discount_price
        : product.product.price)
    );
  });
  const [images, setImages] = useState([]);
  const [primaryImage, setPrimaryImage] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        console.log("product:", product.quantity);
        const data = await getProductImages(product.product._id);
        setImages(data);
        // console.log("Data product card:", data);

        const primary = data.find((image) => image.isPrimary === true);
        // console.log("Anh dai dien product:", primary);
        setPrimaryImage(primary);
        // console.log("primary image:", primary);
        // console.log(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductImages();
  }, [amount]);

  return (
    <div>
      {/* Product Item */}
      <div className="flex flex-col rounded-lg bg-white sm:flex-row">
        <img
          className="m-2 h-24 w-28 rounded-md border object-cover object-center"
          src={primaryImage?.image_url}
          alt=""
        />
        <div className="flex w-full flex-col px-4 py-4">
          <span className="font-semibold"> {product.product.name}</span>
          <p className="text-lg font-semibold text-left">
            {amount.toLocaleString("vi-VN")} đ
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckOutItem;
