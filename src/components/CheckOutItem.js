import { React, useEffect, useState } from "react";
import { getProductImages } from "../services/homeService";

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
        const data = await getProductImages(product.product._id);
        setImages(data);
        const primary = data.find((image) => image.isPrimary === true);
        setPrimaryImage(primary);
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
      <div className="flex flex-col rounded-lg bg-white dark:bg-gray-800 sm:flex-row border border-gray-200 dark:border-gray-700">
        <img
          className="m-2 h-24 w-28 rounded-md border object-cover object-center border-gray-300 dark:border-gray-600"
          src={primaryImage?.image_url}
          alt=""
        />
        <div className="flex w-full flex-col px-4 py-4">
          <span className="font-semibold text-gray-900 dark:text-white">
            {product.product.name}
          </span>
          <p className="text-lg font-semibold text-left text-gray-800 dark:text-gray-200">
            {amount.toLocaleString("vi-VN")} đ
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckOutItem;
