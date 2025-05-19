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
      }, 2000); // Đợi 2 giây (10000 milliseconds)
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.");
    }
  };

  const isDisabled = product.isDelete || !product.isActive;

  return (
    <div className="w-full">
      {/* <ToastContainer /> */}
      <div
        className={`flex flex-item w-full ${isDisabled ? "opacity-50" : ""}`}
      >
        <div className="w-full space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0 border-b border-gray-30 md:mb-4">
          <a className="shrink-0 md:order-1">
            <img
              className="h-20 w-20 dark:hidden mt-4"
              src={primaryImage?.image_url}
              alt="image"
            />
          </a>

          <div className="flex items-center justify-between md:order-3 md:justify-end">
            <div className="flex flex-col items-center">
              <input
                type="text"
                className="w-12 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                value={quantity}
                readOnly
              />
            </div>
            <div className="text-end md:order-4 md:w-32">
              <p className="text-base font-bold text-gray-900 dark:text-white">
                Giá: {amount}đ
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
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
