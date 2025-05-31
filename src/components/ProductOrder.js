import { React, useEffect, useState } from "react";
import { getProductImages } from "../services/homeService";
import CommentPopup from "./CommentPopup";
import { addReview } from "../services/reviewService";
import { toast, ToastContainer } from "react-toastify";

const ProductOrder = ({
  order_id,
  product,
  quantity,
  deliveryStatus,
  isReviewed,
}) => {
  const [amount, setAmount] = useState(() => {
    return (
      quantity *
      (product?.discount_price > 0 ? product.discount_price : product.price)
    );
  });
  const [images, setImages] = useState([]);
  const [primaryImage, setPrimaryImage] = useState();
  const [isLoading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const data = await getProductImages(product._id);
        setImages(data);
        const primary = data.find((image) => image.isPrimary === true);
        setPrimaryImage(primary);
        setSubmitted(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductImages();
  }, [submitted]);

  const handleSubmit = async (data) => {
    try {
      const review = await addReview(
        order_id,
        data.rating,
        data.comment,
        product._id
      );
      toast.success("Đánh giá đã được gửi thành công!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.");
    }
  };

  const isDisabled = product.isDelete || !product.isActive;

  return (
    <div className="w-full">
      {/* Nếu muốn toast hiện ở đây thì mở comment */}
      {/* <ToastContainer /> */}
      <div
        className={`flex flex-item w-full ${
          isDisabled ? "opacity-50" : ""
        } border-b border-gray-200 dark:border-gray-700 pb-4 mb-4`}
      >
        <div className="w-full space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
          <a className="shrink-0 md:order-1">
            <img
              className="h-20 w-20 rounded-lg object-cover bg-white dark:bg-gray-800 dark:shadow-md mt-4"
              src={primaryImage?.image_url}
              alt={product.name || "image"}
              // có thể thêm fallback khi chưa có ảnh
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/fallback-image.png";
              }}
            />
          </a>

          <div className="flex items-center justify-between md:order-3 md:justify-end gap-4">
            <div className="flex flex-col items-center">
              <input
                type="text"
                className="w-12 shrink-0 border border-gray-300 rounded-md bg-transparent text-center text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                value={quantity}
                readOnly
              />
            </div>
            <div className="text-end md:order-4 md:w-32">
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {amount?.toLocaleString("vi-VN")} VND
              </p>
            </div>
          </div>

          <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
            <a
              href={`/product/${product._id}`}
              className={`text-base font-medium text-gray-900 hover:underline dark:text-white ${
                isDisabled ? "pointer-events-none" : ""
              }`}
            >
              {product.name}
            </a>
          </div>

          {deliveryStatus === "Đã giao" && !isReviewed && !isDisabled && (
            <div className="flex justify-end mt-4 md:mt-0">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={() => setIsOpen(true)}
              >
                Viết đánh giá
              </button>
              <CommentPopup
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                productName={product.name}
                onSubmit={handleSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductOrder;
