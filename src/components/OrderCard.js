import { React, useEffect, useState } from "react";
import ProductOrder from "./ProductOrder";
import { getOrder, cancelOrder } from "../services/orderService";
import { toast, ToastContainer } from "react-toastify";

const OrderCard = (order) => {
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isCancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ProductList = Array.isArray(order.order.products)
          ? order.order.products
          : [order.order.products];
        setProducts(ProductList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [order.order.products]);

  const handleCancelOrder = async () => {
    if (isCancelling) return;
    setCancelling(true);

    try {
      await cancelOrder(order.order._id);
      toast.error("Đơn hàng đã được hủy thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-300">
            Ngày đặt hàng:{" "}
            {new Date(order.order.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-200 font-medium">
            Mã đơn hàng: {order.order._id}
          </div>
        </div>

        {products.map((product) => (
          <div key={product._id} className="flex items-center gap-4 w-full">
            <ProductOrder
              order_id={order.order._id}
              product={product.product_id}
              quantity={product.quantity}
              deliveryStatus={order.order.deliveryStatus}
              isReviewed={product.isReviewed}
            />
          </div>
        ))}

        <div className="mt-4 text-right font-semibold text-lg text-gray-800 dark:text-gray-100">
          <span>Tổng tiền: </span>
          <span>{order?.order.total_price?.toLocaleString("vi-VN")} VND</span>
        </div>

        {order.order.deliveryStatus === "Chờ xử lý" && (
          <div className="mt-4 text-right">
            <button
              onClick={handleCancelOrder}
              className={`px-4 py-2 rounded-lg text-white ${
                isCancelling
                  ? "bg-gray-500 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              }`}
              disabled={isCancelling}
            >
              {isCancelling ? "Đang xử lý..." : "Hủy đơn hàng"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
