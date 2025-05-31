import React, { useEffect, useState, useRef } from "react";
import userAvatarImg from "../assets/user_avatar.jpg";
import { useNavigate } from "react-router-dom";
import {
  fetchUserData,
  updateUser,
  uploadImage,
} from "../services/userService";
import { toast, ToastContainer } from "react-toastify";
import SidebarMenu from "../components/SidebarMenu";

const UserProfile = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [image, setImage] = useState();
  const [url, setUrl] = useState("");
  const hiddenFileInput = useRef(null);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setLoggedInUser(userData);
      } else {
        navigate("/login");
      }
    };
    getUserData();
  }, [navigate, isChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoggedInUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setPassword("");
    setConfirmPassword("");
  };

  const handleSave = async () => {
    if (password !== "" || confirmPassword !== "") {
      if (password !== confirmPassword) {
        toast.error("Mật khẩu không khớp. Vui lòng thử lại.");
        return;
      }
    }

    const updatedUserData = {
      ...loggedInUser,
      ...(password ? { password } : {}),
      ...(avatar ? { avatar } : {}),
    };

    toast.success("Cập nhật thông tin thành công");
    setIsEditing(false);
    setPassword("");
    setConfirmPassword("");
    await updateUser({ updatedUserData });
    setIsChange(!isChange);
    setImage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(loggedInUser.email)) {
      alert("Định dạng email không đúng.");
      return;
    }

    if (!loggedInUser.name) {
      alert("Họ tên không được để trống");
      return;
    }

    if (password !== "" && password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    await handleSave();
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const maxSize = Math.max(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (maxSize - img.width) / 2,
          (maxSize - img.height) / 2
        );
        setImage(file);
        await handleImageUpload(file);
      };
    };
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    const res = await uploadImage(formData);
    setAvatar(res.avatar);
    setLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPassword("");
    setConfirmPassword("");
    setImage();
  };

  const sidebarItems = [
    { label: "Thông tin cá nhân", href: "/api/profile", active: true },
    { label: "Địa chỉ", href: "/address" },
    { label: "Order", href: "/order" },
  ];

  const renderField = (label, name, value, type = "text") => {
    if (isEditing) {
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium dark:text-gray-200 text-gray-700">
            {label}:
          </label>
          {type === "textarea" ? (
            <textarea
              name={name}
              value={value}
              onChange={handleChange}
              className="w-full min-h-[100px] p-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-blue-500"
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-blue-500"
            />
          )}
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium dark:text-gray-200 text-gray-700">
          {label}:
        </span>
        <span className="dark:text-gray-300 text-gray-600">{value}</span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-900 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <SidebarMenu />

      <div className="w-full max-w-4xl mx-auto p-4">
        <ToastContainer />
        {loggedInUser && (
          <div className="mx-4 relative dark:bg-gray-800 bg-white rounded-lg shadow-lg">
            <h1 className="text-xl font-semibold text-center py-4 dark:text-white text-black">
              Thông tin người dùng
            </h1>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="relative">
                  {isEditing ? (
                    <div onClick={handleClick} style={{ cursor: "pointer" }}>
                      <img
                        src={
                          image
                            ? URL.createObjectURL(image)
                            : loggedInUser.avatar || userAvatarImg
                        }
                        alt="avatar"
                        className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700"
                      />
                    </div>
                  ) : (
                    <img
                      src={loggedInUser.avatar || userAvatarImg}
                      alt="avatar"
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700"
                    />
                  )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    ref={hiddenFileInput}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className="mt-6">
                {renderField("Họ tên", "name", loggedInUser.name)}
              </div>
              <div className="mt-6">
                {renderField("Email", "email", loggedInUser.email)}
              </div>
              <div className="mt-6">
                {renderField("Số điện thoại", "phone", loggedInUser.phone)}
              </div>

              {isEditing && (
                <>
                  <div className="flex flex-col gap-1 mt-6">
                    <label className="text-sm font-medium dark:text-gray-200 text-gray-700">
                      Mật khẩu mới:
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-6">
                    <label className="text-sm font-medium dark:text-gray-200 text-gray-700">
                      Xác thực mật khẩu:
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 mt-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`px-4 py-2 text-white rounded-lg ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {isLoading ? "Loading..." : "Lưu"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Chỉnh sửa Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
