import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../services/userService";
import { toast, ToastContainer } from "react-toastify";

import { updateAddress } from "../services/addressService";

const AddressForm = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      // console.log("Ham lay user profile");
      const userData = await fetchUserData();

      if (userData) {
        console.log("Address", userData);
        setUserAddress(userData.address_id);
      } else {
        navigate("/login"); // Chuyển đến trang đăng nhập nếu không có token hợp lệ
      }
    };
    getUserData();
  }, [navigate, isChange]);
  // console.log("Day la logged user", loggedInUser);

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // const updatedUserAddress = loggedInUser.address_id;
    const address = await updateAddress(userAddress);
    console.log("update data", address);
    toast.success("Cập nhật thông tin thành công");
    setIsEditing(false);

    // console.log("user", user);
    setIsChange(!isChange);
    // Ở đây bạn có thể thêm logic để lưu thông tin vào backend
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nếu có lỗi, dừng lại không gửi yêu cầu

    // Nếu không có lỗi, gọi hàm lưu thông tin
    await handleSave();
  };

  const handleCancel = async (event) => {
    setIsEditing(false);
  };
  const sidebarItems = [
    { label: "Thông tin cá nhân", href: "/api/profile" },
    { label: "Địa chỉ", href: "/address", active: true },
    { label: "Order", href: "/order" },
  ];

  const renderField = (label, name, value, type = "text") => {
    if (isEditing) {
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{label}:</label>
          {type === "textarea" ? (
            <textarea
              name={name}
              value={value}
              onChange={handleChange}
              className="w-full min-h-[100px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <input
              type="text"
              name={name}
              value={value}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">{label}:</span>
        <span className="text-gray-600">{value}</span>
      </div>
    );
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

      <div className="mt-20 w-full max-w-4xl mx-auto p-4 mt-100 ">
        <ToastContainer />
        {userAddress || isEditing ? (
          /* Profile Info */
          <div className="mt-[-64px] mx-4 relative bg-white rounded-lg shadow-lg">
            <h1 className="text-xl font-semibold text-center text-black py-4">
              Quản lý địa chỉ
            </h1>
            <div className="p-6">
              {/* Bio */}
              <div className="mt-6">
                {renderField(
                  "Địa chỉ",
                  "addressLine",
                  userAddress?.addressLine
                )}
              </div>
              <div className="mt-6">
                {renderField("Phường", "ward", userAddress?.ward)}
              </div>
              <div className="mt-6">
                {renderField("Quận/ huyện", "district", userAddress?.district)}
              </div>
              <div className="mt-6">
                {renderField("Tỉnh/Thành phố", "city", userAddress?.city)}
              </div>
              {/* Action Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-600"
                    >
                      Hủy
                    </button>

                    <button
                      onClick={handleSubmit}
                      className={`px-4 py-2 text-white rounded-lg ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Lưu"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditProfile}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Chỉnh sửa Địa chỉ
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Message when no address exists */
          <div className="mt-[-64px] mx-4 relative bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-xl font-semibold text-black">
              Bạn chưa có địa chỉ mặc định
            </h1>
            <p className="text-gray-500 mt-4">
              Vui lòng thêm địa chỉ để quản lý thông tin của bạn.
            </p>
            <button
              onClick={handleEditProfile} // Gọi một hàm thêm địa chỉ nếu có
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Thêm địa chỉ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
