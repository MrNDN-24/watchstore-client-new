import React, { useEffect, useState, useRef } from "react";
import userAvatarImg from "../assets/user_avatar.jpg";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../services/userService";
import { toast, ToastContainer } from "react-toastify";
import { updateUser } from "../services/userService";

import { uploadImage } from "../services/userService";
import OrderCard from "../components/OrderCard";
import { getOrder } from "../services/orderService";

const MyOrderForm = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState("Chờ xử lý");
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // Trạng thái của nút được chọn

  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      // console.log("Ham lay user profile");
      const data = await getOrder(deliveryStatus);
      console.log("Ham lay order", data?.orders);
      setOrders(data?.orders);
    };
    getUserData();
  }, [navigate, deliveryStatus]);
  // console.log("Day la logged user", loggedInUser)

  const sidebarItems = [
    { label: "Thông tin cá nhân", href: "/api/profile" },
    { label: "Địa chỉ", href: "/address" },
    { label: "Order", href: "/order", active: true },
  ];

  const handleButtonClick = (status) => {
    setDeliveryStatus(status);
    setSelectedStatus(status); // Cập nhật trạng thái khi nút được nhấn
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col h-full bg-white">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">Quản lý tài khoản</h2>
        </div>
        <nav className="flex-1 h-full bg-white">
          <ul className="space-y-2 px-3">
            {sidebarItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-5 h-5 mr-3" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="w-full max-w-4xl mx-auto p-4 mt-100 ">
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
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

            <div>
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <label>Không có đơn hàng phù hợp</label> // Thông báo nếu orders không phải mảng hoặc mảng trống
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrderForm;
