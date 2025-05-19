import { React, useEffect, useState } from "react";
import { getProductImages } from "../services/homeService";
import { useCart } from "../context/CartContext";
import { updateCart, deleteProductFromCart } from "../services/cartService";
import { toast, ToastContainer } from "react-toastify";

const CartItem = (product) => {
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

  const { updateCartAmount } = useCart();

  useEffect(() => {
    updateCartAmount(product.product._id, amount); // Cập nhật amount vào context
    handleUpdateCart();
    const fetchProductImages = async () => {
      try {
        // console.log("product quantity:", product.quantity);
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

  const handleIncrement = () => {
    console.log("Số lượng tối đa:", product.product.stock);

    setQuantity((prev) => {
      // Kiểm tra nếu số lượng hiện tại nhỏ hơn stock
      if (prev < product.product.stock) {
        const newQuantity = prev + 1;

        // Cập nhật tổng số tiền
        setAmount(
          newQuantity *
            (product?.product.discount_price > 0
              ? product.product.discount_price
              : product.product.price)
        );

        // Gọi callback để kích hoạt reload nếu có
        if (product.onReload) {
          product.onReload();
        }

        return newQuantity;
      }

      // Nếu đạt giới hạn stock, giữ nguyên số lượng hiện tại
      toast.error("Đã đạt số lượng giới hạn");
      return prev;
    });
  };

  const handleDecrement = () => {
    setQuantity((prev) => {
      const newQuantity = prev > 1 ? prev - 1 : 1;
      setAmount(
        newQuantity *
          (product?.product.discount_price > 0
            ? product.product.discount_price
            : product.product.price)
      );
      updateCartAmount(product.product._id, amount); // Cập nhật amount vào context

      if (product.onReload) {
        product.onReload(); // Gọi callback để kích hoạt reload
      }

      return newQuantity;
    });
  };

  const handleUpdateCart = async () => {
    try {
      setLoading(true);

      const result = await updateCart(product.product._id, quantity);
      if (product.onReload) {
        product.onReload(); // Gọi callback để kích hoạt reload
        // console.log("On reload");
      }
      // toast.success("Thêm vào giỏ hàng thành công!");
      // Có thể dispatch action để update global state nếu bạn dùng Redux
      // dispatch(updateCartSuccess(result.data));
    } catch (error) {
      console.error(error.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (product_id) => {
    try {
      const result = await deleteProductFromCart(product_id);
      // console.log("Product delete:", product_id);
      console.log("Delete result", result);
      if (result.success) {
        toast.success("Xoá sản phẩm thành công");
      } else {
        toast.error("Lỗi khi xóa sản phẩm");
      }

      // if (product.onReload) {
      //   product.onReload(); // Gọi callback để kích hoạt reload
      //   console.log("On reload");
      // }
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2000ms = 2 giây
    } catch (error) {
      console.error(error.message || "Có lỗi xảy ra!");
    }
  };

  const isDisabled =
    product?.product.isDelete ||
    !product?.product.isActive ||
    product?.product.stock === 0;

  return (
    <div className="flex flex-item w-full">
      <ToastContainer />
      <div className="w-full space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0 border-b border-gray-30 md:mb-4">
        <a className="shrink-0 md:order-1 relative">
          {/* Nếu sản phẩm hết hàng, hiển thị nhãn hết hàng */}
          {product.product.stock === 0 && (
            <span className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded-br-lg">
              Hết hàng
            </span>
          )}
          <img
            className="h-20 w-20 dark:hidden mt-4"
            src={primaryImage?.image_url}
            alt="image"
          />
        </a>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center">
            <button
              onClick={handleDecrement}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 text-black"
              disabled={isDisabled}
            >
              -
            </button>
            <input
              type="text"
              className="w-12 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
              value={quantity}
              readOnly
            />
            <button
              onClick={handleIncrement}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 text-black"
              disabled={isDisabled}
            >
              +
            </button>
          </div>
          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {amount?.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <a
            href={`/product/${product?.product._id}`}
            className={`text-base font-medium text-gray-900 hover:underline dark:text-white ${
              isDisabled ? "pointer-events-none" : ""
            }`}
          >
            {product?.product.name}
          </a>

          <div className="flex items-center gap-4">
            <button
              // type="button"
              className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
              onClick={() => handleRemoveProduct(product?.product._id)}
            >
              <svg
                className="me-1.5 h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
