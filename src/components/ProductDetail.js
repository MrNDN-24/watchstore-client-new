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

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [images, setImages] = useState([]);
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const [filter, setFilter] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        console.log("Product detail :", data.product);
        if (data.product.brand_id) {
          // Cập nhật filter với brand_ids là mảng chứa brand_id
          setFilter({
            brand_ids: [data.product.brand_id], // Chuyển brand_id thành mảng
          });
        }
        const images_list = await getProductImages(data.product._id);
        // console.log("images_list", images_list);
        setImages(images_list);
        setSelectedImage(0);
        // console.log("Image list", images_list);
        // const primary = images_list.find((image) => image.isPrimary === true);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        // console.log("Anh dai dien product:", selectedImage);
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

      // toast.success("Thêm vào giỏ hàng thành công!");
      // Có thể dispatch action để update global state nếu bạn dùng Redux
      // dispatch(updateCartSuccess(result.data));
    } catch (error) {
      console.error(error.message || "Có lỗi xảy ra!");
      toast.error("Cập nhật giỏ hàng thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="container mx-auto mt-8 p-4 max-w-full w-[1200px]">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <Link to="/homepage" className="hover:text-gray-700">
                Trang chủ
              </Link>
              <span className="mx-2">&gt;</span>
              <span>{product?.product.name}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-1">
                <div className="md:flex-1 px-4">
                  {/* Main Square Image Display */}
                  <div className="aspect-square rounded-lg bg-gray-100 mb-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`w-full aspect-square rounded-lg bg-gray-100 mb-4 flex items-center justify-center ${
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
                  <div className="flex -mx-2 mb-4 overflow-x-auto ">
                    {images.map((image, index) => (
                      <div key={index} className="flex-shrink-0 w-24 px-2">
                        {" "}
                        {/* Điều chỉnh kích thước cố định */}
                        <button
                          onClick={() => setSelectedImage(index)}
                          className={`focus:outline-none w-full aspect-square rounded-lg bg-gray-100 flex items-center justify-center ${
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
                <p className="text-gray-700 mt-2">
                  {product.product.description}
                </p>
                <div className="mb-4">
                  {product?.product.discount_price > 0 ? (
                    <div>
                      <span className="text-2xl text-red-500 font-bold mr-2">
                        {" "}
                        {product?.product.discount_price.toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </span>
                      <span className="text-gray-500 line-through">
                        {product?.product.price.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl  font-bold mr-2">
                      {" "}
                      {product?.product.price.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                  {/* <span className="text-2xl font-bold mr-2">$349.99</span>
                <span className="text-gray-500 line-through">$399.99</span> */}
                </div>
                <Star stars={product?.product.product_rating} />
                <div className="mt-4 mb-4 flex-col">
                  <div className="flex justify-between items-left mt-4 mb-4 border-b border-gray-300 pb-1">
                    <span className="text-lg font-semibold text-primary">
                      Thương hiệu:
                    </span>
                    <span className="text-primary text-gray-700">
                      {product?.product.brand_id.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-left mt-4 mb-4 border-b border-gray-300 pb-1">
                    <span className="text-lg font-semibold text-primary">
                      Giới tính:
                    </span>
                    <span className="text-primary text-gray-700">
                      {product.product.gender}
                    </span>
                  </div>
                  <div className="flex justify-between items-left mt-4 mb-4 border-b border-gray-300 pb-1">
                    <span className="text-lg font-semibold text-primary">
                      Kiểu dây đeo :
                    </span>
                    <span className="text-primary text-gray-700">
                      {product.product.strapType}
                    </span>
                  </div>
                  <div className="flex justify-between items-left mt-4 mb-4 border-b border-gray-300 pb-1">
                    <span className="text-lg font-semibold text-primary">
                      Mặt đồng hồ:
                    </span>
                    <span className="text-primary text-gray-700">
                      {product.product.dialShape}
                    </span>
                  </div>
                  <div className="flex justify-between items-left mt-4 mb-4 border-b border-gray-300 pb-1">
                    <span className="text-lg font-semibold text-primary">
                      Chất liệu kính:
                    </span>
                    <span className="text-primary text-gray-700">
                      {product.product.glassType}
                    </span>
                  </div>
                  <div className="flex justify-between items-left mt-4 mb-4 border-b border-gray-300 pb-1">
                    <span className="text-lg font-semibold text-primary">
                      Loại mặt số:
                    </span>
                    <span className="text-primary text-gray-700">
                      {product.product.dialPattern}
                    </span>
                  </div>
                  <div className="flex justify-between items-left mt-4 mb-4 border-b border-gray-300 pb-1">
                    <span className="text-lg font-semibold text-primary">
                      Màu sắc:
                    </span>
                    <span className="text-primary text-gray-700">
                      {product.product.dialColor}
                    </span>
                  </div>
                  <div className="flex justify-between items-left mt-4 mb-4 border-b border-gray-300 pb-1">
                    <span className="text-lg font-semibold text-primary">
                      Độ chống nước:
                    </span>
                    <span className="text-primary text-gray-700">
                      {product.product.waterResistance}
                    </span>
                  </div>
                  <div className="flex justify-between items-left mt-4 mb-4 border-b border-gray-300 pb-1">
                    <span className="text-lg font-semibold text-primary">
                      Xuất xứ:{" "}
                    </span>
                    <span className="text-primary text-gray-700">
                      {product.product.origin}
                    </span>
                  </div>
                </div>
                {/* <p className="text-gray-700 mt-2">
              In Stock: {product.product.stock}
            </p> */}
                <div className="mt-4">
                  <label htmlFor="quantity" className="text-gray-700">
                    Số lượng:
                  </label>
                  <select
                    id="quantity"
                    className="bg-white border border-gray-300 p-2 rounded-md mt-2 ml-2"
                    onChange={(e) => setQty(e.target.value)}
                  >
                    {[...Array(product.product.stock).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {product?.product.stock > 0 ? (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-yellow-600 w-full"
                    onClick={handleUpdateCart}
                  >
                    Thêm vào giỏ hàng
                  </button>
                ) : (
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-yellow-600 w-full">
                    Hết hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* <!-- Reviews --> */}
        <ProductReview product_id={id} />
        {/* <ProductList
          limit={5}
          filter={{ brand_ids: [product?.product.brand_id] }}
        /> */}
        <h2 id="reviews-heading" className="py-10 font-extrabold">
          Sản phẩm liên quan
        </h2>
        <ProductList limit={4} filter={filter} />
      </div>
    </div>
  );
};

export default ProductDetail;
