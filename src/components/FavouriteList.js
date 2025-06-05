import React, { useEffect, useState } from "react";
import { getFavourites, removeFavourite } from "../services/favouriteService";
import ProductCard from "../components/ProductCard";

const FavouriteList = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    try {
      const res = await getFavourites();
      console.log("Danh sách yêu thích:", res.data);

      if (res && Array.isArray(res.data)) {
        // Nếu API trả về mảng lồng, dùng flat()
        const flatten = res.data.flat(); // Nếu không cần, có thể bỏ dòng này

        // Đảm bảo mỗi sản phẩm có đủ field tối thiểu để tránh lỗi render
        const cleanedData = flatten.map((product) => ({
          price: 0,
          discount_price: 0,
          product_rating: 0,
          description: "Không có mô tả",
          ...product,
        }));

        setFavourites(cleanedData);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const res = await removeFavourite(productId);
      if (res && res.success) {
        fetchFavourites();
      } else {
        console.error("Xóa sản phẩm thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi xóa khỏi danh sách yêu thích:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 dark:text-gray-300 text-gray-700">
        Đang tải danh sách yêu thích...
      </div>
    );
  }

  if (favourites.length === 0) {
    return (
      <div className="dark:bg-gray-900 bg-white min-h-[80vh] flex items-center justify-center">
        <div className="text-center py-8 dark:text-gray-300 text-gray-700">
          Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        <h1 className="text-2xl font-bold mb-6 dark:text-white text-gray-900">
          Danh sách yêu thích
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favourites.map((product) => (
            <div
              key={product._id}
              className="flex flex-col items-center dark:bg-gray-800 bg-gray-100 p-4 rounded shadow"
            >
              <ProductCard product={product} />
              <button
                onClick={() => handleRemove(product._id)}
                className="mt-2 text-gray-700 dark:text-gray-300 text-sm px-4 py-1 rounded hover:underline hover:cursor-pointer flex items-center gap-1"
              >
                <span className="font-bold">✕</span> Xóa sản phẩm
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavouriteList;
