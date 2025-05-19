import { React, useEffect, useState } from "react";
import ProductOrder from "./ProductOrder";
import { getOrder, cancelOrder } from "../services/orderService"; // Import hàm cancelOrder
import { toast, ToastContainer } from "react-toastify";

const OrderCard = (order) => {
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isCancelling, setCancelling] = useState(false); // State để quản lý trạng thái hủy đơn hàng

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Order delivery", order);
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
    if (isCancelling) return; // Ngăn chặn khi đang xử lý hủy
    setCancelling(true);

    try {
      await cancelOrder(order.order._id); // Gọi API để hủy đơn hàng
      toast.error("Đơn hàng đã được hủy thành công!");
      // Cập nhật trạng thái sau khi hủy
      window.location.reload(); // Tải lại trang hoặc cập nhật danh sách đơn hàng
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
          <div className="text-sm text-gray-500">
            Ngày đặt hàng:{" "}
            {new Date(order.order.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
          <div className="text-sm text-gray-600 font-medium">
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

        {/* Tính tổng tiền */}
        <div className="mt-4 text-right font-semibold text-lg">
          <span>Tổng tiền: </span>
          <span>{order?.order.total_price} đ</span>
        </div>

        {/* Nút Hủy đơn hàng */}
        {order.order.deliveryStatus === "Chờ xử lý" && (
          <div className="mt-4 text-right">
            <button
              onClick={handleCancelOrder}
              className={`px-4 py-2 rounded-lg text-white ${
                isCancelling
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
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
