import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../services/userService";
import { toast, ToastContainer } from "react-toastify";
import SidebarMenu from "./SidebarMenu";
import { updateAddress } from "../services/addressService";

const AddressForm = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setUserAddress(userData.address_id);
      } else {
        navigate("/login");
      }
    };
    getUserData();
  }, [navigate, isChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditProfile = () => setIsEditing(true);

  const handleSave = async () => {
    const address = await updateAddress(userAddress);
    toast.success("Cập nhật thông tin thành công");
    setIsEditing(false);
    setIsChange(!isChange);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSave();
  };

  const handleCancel = () => setIsEditing(false);

  const renderField = (label, name, value, type = "text") => {
    if (isEditing) {
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}:
          </label>
          {type === "textarea" ? (
            <textarea
              name={name}
              value={value}
              onChange={handleChange}
              className="w-full min-h-[100px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />
          ) : (
            <input
              type="text"
              name={name}
              value={value}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />
          )}
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}:
        </span>
        <span className="text-gray-600 dark:text-gray-200">{value}</span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <SidebarMenu />

      <div className="mt-20 w-full max-w-4xl mx-auto p-4">
        <ToastContainer />
        {userAddress || isEditing ? (
          <div className="mt-[-64px] mx-4 relative bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg">
            <h1 className="text-xl font-semibold text-center py-4">
              Quản lý địa chỉ
            </h1>
            <div className="p-6">
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

              <div className="flex gap-2 mt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white"
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
                    className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    Chỉnh sửa Địa chỉ
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-[-64px] mx-4 relative bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-xl font-semibold">
              Bạn chưa có địa chỉ mặc định
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-4">
              Vui lòng thêm địa chỉ để quản lý thông tin của bạn.
            </p>
            <button
              onClick={handleEditProfile}
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
