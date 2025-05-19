import { React, useEffect, useState } from "react";
import "../styles/ProductCard.css";
import { useNavigate } from "react-router-dom";
import { getProductImages } from "../services/homeService";

const SearchItem = ({ product, setSearchValue }) => {
  const navigate = useNavigate();
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
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductImages();
  }, [product._id]);

  const handleNavigate = () => {
    navigate(`/product/${product._id}`);
    setSearchValue("");
    console.log("Set search Value Empty");
  };

  return (
    <div
      onClick={handleNavigate}
      className="flex items-center p-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
    >
      <div className="flex-shrink-0 w-16 h-16">
        <img
          src={primaryImage?.image_url}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {product.discount_price > 0 ? (
            <>
              <span className="text-red-600 font-medium">
                {product.discount_price.toLocaleString()}đ
              </span>
              <span className="text-gray-500 text-sm line-through">
                {product.price.toLocaleString()}đ
              </span>
            </>
          ) : (
            <span className="text-red-600 font-medium">
              {product.price.toLocaleString()}đ
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
