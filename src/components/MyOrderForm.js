import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import { getOrder } from "../services/orderService";
import SidebarMenu from "../components/SidebarMenu";

const MyOrderForm = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState("Chờ xử lý");
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const data = await getOrder(deliveryStatus);
      setOrders(data?.orders);
    };
    getUserData();
  }, [navigate, deliveryStatus]);

  const handleButtonClick = (status) => {
    setDeliveryStatus(status);
    setSelectedStatus(status);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 ">
      {/* Sidebar */}
      <SidebarMenu />

      <div className="w-full max-w-4xl mx-auto p-4 mt-100">
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Đơn hàng của tôi
            </h1>
            <div className="flex justify-between mb-6 space-x-2">
              <button
                onClick={() => handleButtonClick("Chờ xử lý")}
                className={`flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 ${
                  deliveryStatus === "Chờ xử lý" ? "underline" : ""
                }`}
              >
                Chưa xác nhận
              </button>
              <button
                onClick={() => handleButtonClick("Đã xác nhận")}
                className={`flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ${
                  deliveryStatus === "Đã xác nhận" ? "underline" : ""
                }`}
              >
                Chờ giao hàng
              </button>
              <button
                onClick={() => handleButtonClick("Đang vận chuyển")}
                className={`flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                  deliveryStatus === "Đang vận chuyển" ? "underline" : ""
                }`}
              >
                Đang giao hàng
              </button>
              <button
                onClick={() => handleButtonClick("Đã giao")}
                className={`flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ${
                  deliveryStatus === "Đã giao" ? "underline" : ""
                }`}
              >
                Giao thành công
              </button>
              <button
                onClick={() => handleButtonClick("Đã hủy")}
                className={`flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 ${
                  deliveryStatus === "Đã hủy" ? "underline" : ""
                }`}
              >
                Đã bị hủy
              </button>
            </div>

            <div className="text-gray-800 dark:text-gray-300">
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <label>Không có đơn hàng phù hợp</label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrderForm;
