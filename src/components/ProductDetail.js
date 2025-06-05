import { React, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById, getProductImages } from "../services/productService";
import ProductList from "./ProductList";
import Star from "../components/Star";
import ProductReview from "./ProductReview";
import { updateCart } from "../services/cartService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";
import {
  addFavourite,
  removeFavourite,
  getFavourites,
} from "../services/favouriteService";

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [images, setImages] = useState([]);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const [filter, setFilter] = useState({});
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProductById(id);
        setProduct(data);
        if (data.product.brand_id) {
          setFilter({
            brand_ids: [data.product.brand_id],
          });
        }
        const images_list = await getProductImages(data.product._id);
        setImages(images_list);
        setSelectedImage(0);

        // Kiểm tra xem sản phẩm đã được yêu thích chưa
        const favouritesData = await getFavourites();
        console.log("Favourites Data:", favouritesData);
        if (favouritesData && Array.isArray(favouritesData.data)) {
          const favFound =
            Array.isArray(favouritesData.data[0]) &&
            favouritesData.data[0].some(
              (fav) => fav._id && fav._id.toString() === id.toString()
            );

          console.log("Is Favourite:", favFound);
          setIsFavourite(favFound);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  const handleUpdateCart = async () => {
    try {
      setLoading(true);

      const result = await updateCart(id, qty);
      addToCart(product);
      if (result.success) {
        toast.success("Thêm vào giỏ hàng thành công!");
      }
    } catch (error) {
      console.error(error.message || "Có lỗi xảy ra!");
      toast.error("Cập nhật giỏ hàng thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavourite = async () => {
    try {
      if (!isFavourite) {
        console.log("Adding to favourites", id);
        const res = await addFavourite(id);
        console.log("Favourite response:", res);
        if (!res.success) {
          throw new Error(res.message || "Thêm yêu thích thất bại");
        }
        setIsFavourite(true);
        toast.success("Đã thêm vào danh sách yêu thích");
      } else {
        const res = await removeFavourite(id);
        setIsFavourite(false);
        toast.success("Đã xóa khỏi danh sách yêu thích");
      }
    } catch (error) {
      // Nếu lỗi axios, error.response có thể có thông tin lỗi từ server
      toast.error(
        error.response?.data?.message || error.message || "Lỗi không xác định"
      );
    }
  };

  if (isLoading || !product) {
    return (
      <div className="container mx-auto mt-8 p-4 max-w-full w-[1200px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <div className="container mx-auto mt-8 p-4 max-w-full w-[1200px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <Link
            to="/homepage"
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            Trang chủ
          </Link>
          <span className="mx-2">&gt;</span>
          <span>{product.product.name}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <div className="md:flex-1 px-4">
              {/* Main Square Image Display */}
              <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 mb-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`w-full aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 mb-4 flex items-center justify-center ${
                      selectedImage === index ? "block" : "hidden"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>

              {/* Square Thumbnails */}
              <div className="flex -mx-2 mb-4 overflow-x-auto">
                {images.map((image, index) => (
                  <div key={index} className="flex-shrink-0 w-24 px-2">
                    <button
                      onClick={() => setSelectedImage(index)}
                      className={`focus:outline-none w-full aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${
                        selectedImage === index
                          ? "ring-2 ring-indigo-300 ring-inset"
                          : ""
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-1">
            <h1 className="text-2xl font-semibold text-center">
              {product.product.name}
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              {product.product.description}
            </p>

            <div className="mb-4 mt-4">
              {product?.product.discount_price > 0 ? (
                <div>
                  <span className="text-2xl text-red-500 font-bold mr-2">
                    {product?.product.discount_price.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 line-through">
                    {product?.product.price.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold mr-2">
                  {product?.product.price.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>
            <Star stars={product?.product.product_rating} />
            <div className="mt-4 mb-4 flex-col">
              {[
                {
                  label: "Thương hiệu",
                  value: product?.product.brand_id.name,
                },
                { label: "Giới tính", value: product.product.gender },
                { label: "Kiểu dây đeo", value: product.product.strapType },
                { label: "Mặt đồng hồ", value: product.product.dialShape },
                {
                  label: "Chất liệu kính",
                  value: product.product.glassType,
                },
                {
                  label: "Loại mặt số",
                  value: product.product.dialPattern,
                },
                { label: "Màu sắc", value: product.product.dialColor },
                {
                  label: "Độ chống nước",
                  value: product.product.waterResistance,
                },
                { label: "Xuất xứ", value: product.product.origin },
              ].map(({ label, value }, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-left mt-4 mb-4 border-b border-gray-300 dark:border-gray-700 pb-1"
                >
                  <span className="text-lg font-semibold text-primary dark:text-indigo-400">
                    {label}:
                  </span>
                  <span className="text-primary text-gray-700 dark:text-gray-300">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label
                htmlFor="quantity"
                className="text-gray-700 dark:text-gray-300"
              >
                Số lượng:
              </label>
              <select
                id="quantity"
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-md mt-2 ml-2 text-gray-900 dark:text-gray-100"
                onChange={(e) => setQty(Number(e.target.value))}
                value={qty}
              >
                {[...Array(product.product.stock).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <button
                onClick={handleToggleFavourite}
                className={`flex-1 px-4 py-3 rounded-md text-lg font-semibold ${
                  isFavourite
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {isFavourite ? "Bỏ yêu thích ♥" : "Thêm vào yêu thích ♡"}
              </button>

              <button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md text-lg font-semibold"
                onClick={handleUpdateCart}
                disabled={isLoading}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        <ProductReview productId={id} />
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Sản phẩm tương tự</h3>
          <ProductList filter={filter} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
