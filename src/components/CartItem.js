import { useEffect, useState } from "react";
import { getProductImages } from "../services/homeService";
import { updateCart } from "../services/cartService";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateCartAmount, removeFromCart } from "../redux/slices/cartSlice";

const CartItem = (product) => {
  const dispatch = useDispatch();
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

  // Cập nhật tổng tiền và ảnh sản phẩm khi load component
  useEffect(() => {
    dispatch(
      updateCartAmount({
        productId: product.product._id,
        quantity,
        amount,
      })
    );

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
  }, []);

  // Cập nhật số lượng và tổng tiền khi thay đổi quantity
  useEffect(() => {
    const updateQuantity = async () => {
      try {
        await updateCart(product.product._id, quantity);
      } catch (error) {
        console.error(error.message || "Có lỗi xảy ra!");
      }
    };

    const newAmount =
      quantity *
      (product?.product.discount_price > 0
        ? product.product.discount_price
        : product.product.price);

    setAmount(newAmount);

    dispatch(
      updateCartAmount({
        productId: product.product._id,
        quantity,
        amount: newAmount,
      })
    );

    updateQuantity();
  }, [quantity]);

  const handleIncrement = () => {
    if (quantity < product.product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error("Đã đạt số lượng giới hạn");
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleRemoveProduct = async (product_id) => {
    try {
      const resultAction = await dispatch(removeFromCart(product_id));
      if (removeFromCart.fulfilled.match(resultAction)) {
        toast.success("Xoá sản phẩm thành công");
      } else {
        toast.error("Lỗi khi xóa sản phẩm");
      }
    } catch (error) {
      console.error("Xảy ra lỗi:", error);
      toast.error("Có lỗi xảy ra!");
    }
  };

  const isDisabled =
    product?.product.isDelete ||
    !product?.product.isActive ||
    product?.product.stock === 0;

  return (
    <div className="flex flex-item w-full relative">
      <ToastContainer />
      {product.product.stock === 0 && (
        <span className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded-br-lg z-20">
          Hết hàng
        </span>
      )}

      <div
        className={`w-full space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0 border-b border-gray-300 dark:border-gray-700 md:mb-4 ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <a className="shrink-0 md:order-1 relative inline-block">
          <img
            className="h-20 w-20 mt-4 rounded-md object-cover dark:brightness-90"
            src={primaryImage?.image_url}
            alt="image"
          />
        </a>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center">
            <button
              onClick={handleDecrement}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 text-black dark:text-white"
              disabled={isDisabled}
            >
              -
            </button>
            <input
              type="text"
              className="w-12 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-0"
              value={quantity}
              readOnly
              disabled={isDisabled}
            />
            <button
              onClick={handleIncrement}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 text-black dark:text-white"
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
            className={`text-base font-medium hover:underline ${
              isDisabled
                ? "pointer-events-none text-gray-400 dark:text-gray-600"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {product?.product.name}
          </a>

          <div className="flex items-center gap-4">
            <button
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
