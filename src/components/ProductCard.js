import { React, useEffect, useState } from "react";
import "../styles/ProductCard.css";
import { Link } from "react-router-dom";
import { getProductImages } from "../services/homeService";
import Star from "./Star";

const ProductCard = ({ product }) => {
  const [images, setImages] = useState([]);
  const [primaryImage, setPrimaryImage] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const data = await getProductImages(product._id);
        setImages(data);
        const primary = data.find((image) => image.isPrimary === true);
        setPrimaryImage(primary);
      } catch (error) {
        console.error("Error fetching product images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductImages();
  }, []);

  return (
    <Link to={`/product/${product._id}`}>
      <div className="w-[220px] h-[440px] flex flex-col gap-2 p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg relative transition-colors duration-300">
        {product?.discount_price > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {Math.round(
              ((product.price - product.discount_price) / product.price) * 100
            )}
            %
          </div>
        )}

        <img
          className="hover:scale-110 transition-transform duration-300 w-[100%] h-[180px] object-cover rounded"
          src={primaryImage?.image_url}
          alt={product.name}
        />

        <div className="description text-black dark:text-white">
          <p className="text-lg font-semibold dark:text-white">
            {product.name}
          </p>

          {product?.discount_price > 0 ? (
            <div className="flex flex-col justify-between items-center mb-2">
              <span className="line-through text-sm font-semibold text-primary dark:text-gray-400 block">
                Giá: {product?.price.toLocaleString("vi-VN")} đ
              </span>
              <span className="text-lg font-bold text-red-700 dark:text-red-400">
                Giá KM: {product?.discount_price.toLocaleString("vi-VN")} đ
              </span>
            </div>
          ) : (
            <div className="flex flex-col justify-between items-center mb-2">
              <br />
              <span className="text-lg font-bold text-primary dark:text-white block">
                Giá: {product?.price.toLocaleString("vi-VN")} đ
              </span>
            </div>
          )}

          <Star stars={product.product_rating} />

          <p className="para text-sm mt-1 text-black dark:text-gray-200">
            {product.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
