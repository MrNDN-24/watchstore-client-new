import { React, useEffect, useState } from "react";
import "../styles/ProductCard.css";
import { Link, Navigate } from "react-router-dom";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Link to={`/product/${product._id}`}>
      <div className="w-[220px] h-[440px] flex flex-col gap-2 p-4 border rounded-lg relative">
        {product?.discount_price > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {Math.round(
              ((product.price - product.discount_price) / product.price) * 100
            )}
            %
          </div>
        )}
        <img
          className="hover:scale-110 w-[100%] h-[180px] object-cover"
          src={primaryImage?.image_url}
          alt=""
        />
        <div className="description">
          <p className="text-lg font-semibold">{product.name}</p>
          {product?.discount_price > 0 ? (
            <div className="flex flex-col justify-between items-center mb-2">
              <span
                className={`line-through text-sm font-semibold text-primary block`}
              >
                Giá : {product?.price.toLocaleString("vi-VN")} đ
              </span>
              <span className="text-lg font-bold text-red-700">
                Giá KM : {product?.discount_price.toLocaleString("vi-VN")} đ
              </span>
            </div>
          ) : (
            <div className="flex flex-col justify-between items-center mb-2">
              <br />
              <span className={`text-lg font-bold text-primary block`}>
                Giá : {product?.price.toLocaleString("vi-VN")} đ
              </span>
            </div>
          )}
          <Star stars={product.product_rating} />
          <p className="para">{product.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
