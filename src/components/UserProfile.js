import React, { useEffect, useState, useRef } from "react";
import userAvatarImg from "../assets/user_avatar.jpg";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../services/userService";
import { toast, ToastContainer } from "react-toastify";
import { updateUser } from "../services/userService";

import { uploadImage } from "../services/userService";

const UserProfile = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      // console.log("Ham lay user profile");
      const userData = await fetchUserData();

      if (userData) {
        // console.log(userData);
        setLoggedInUser(userData);
      } else {
        navigate("/login"); // Chuyển đến trang đăng nhập nếu không có token hợp lệ
      }
    };
    getUserData();
  }, [navigate, isChange]);
  // console.log("Day la logged user", loggedInUser);

  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState(""); // Thêm state cho New Password
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoggedInUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditProfile = () => {
    setIsEditing(true);
    setPassword(""); // Đặt giá trị mật khẩu mới là rỗng
    setConfirmPassword(""); // Đặt giá trị xác nhận mật khẩu là rỗng
  };

  const handleSave = async () => {
    if (password !== "" || confirmPassword !== "") {
      if (password !== confirmPassword) {
        toast.error("Mật khẩu không khớp. Vui lòng thử lại.");
        return;
      }
    }
    console.log("image url update", url);

    const updatedUserData = {
      ...loggedInUser,
      ...(password ? { password } : {}),
      ...(avatar ? { avatar } : {}),
    };
    console.log("update data", updatedUserData);
    toast.success("Cập nhật thông tin thành công");
    setIsEditing(false);
    setPassword("");
    setConfirmPassword("");
    console.log("update user infor:", updatedUserData);
    const user = await updateUser({ updatedUserData });
    // console.log("user", user);
    setIsChange(!isChange);
    setImage();
    // Ở đây bạn có thể thêm logic để lưu thông tin vào backend
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra định dạng email
    if (!/\S+@\S+\.\S+/.test(loggedInUser.email)) {
      alert("Định dạng email không đúng. Vui lòng thử lại.");
      return;
    }

    if (!loggedInUser.name) {
      alert("Họ tên không được để trống");
      return;
    }

    // Kiểm tra mật khẩu
    if (password !== "" && password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    // Nếu có lỗi, dừng lại không gửi yêu cầu

    // Nếu không có lỗi, gọi hàm lưu thông tin
    await handleSave();
  };

  const [image, setImage] = useState();
  const [url, setUrl] = useState("");

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
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
        // console.log("File", img.src);
        setImage(file);
        // console.log("Image", image);
        await handleImageUpload(file);
      };
    };
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    const res = await uploadImage(formData);
    console.log("Res.avatar :", res.avatar);
    setAvatar(res.avatar);
    setLoading(false);
  };

  const handleCancel = async (event) => {
    setIsEditing(false);
    setPassword(""); // Đặt giá trị mật khẩu mới là rỗng
    setConfirmPassword(""); // Đặt giá trị xác nhận mật khẩu là rỗng
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
        {loggedInUser && (
          /* Profile Info */
          <div className="mt-[-64px] mx-4 relative bg-white rounded-lg shadow-lg">
            <h1 className="text-xl font-semibold text-center text-black py-4">
              Thông tin người dùng
            </h1>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                {/* Avatar */}
                <div className="relative">
                  {isEditing ? (
                    <div onClick={handleClick} style={{ cursor: "pointer" }}>
                      {image ? (
                        <img
                          src={URL.createObjectURL(image)}
                          alt="upload image"
                          className="w-32 h-32 rounded-full border-4 border-white"
                        />
                      ) : (
                        <img
                          src={loggedInUser.avatar || userAvatarImg}
                          alt="upload image"
                          className="w-32 h-32 rounded-full border-4 border-white"
                        />
                      )}
                    </div>
                  ) : (
                    <img
                      src={loggedInUser.avatar || userAvatarImg}
                      alt="upload image"
                      className="w-32 h-32 rounded-full border-4 border-white"
                    />
                  )}

                  <input
                    id="w-32 h-32 rounded-full border-4 border-white"
                    type="file"
                    onChange={handleImageChange}
                    ref={hiddenFileInput}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
              {/* Bio */}
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
                    <label className="text-sm font-medium text-gray-700">
                      Mật khẩu mới:
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-6">
                    <label className="text-sm font-medium text-gray-700">
                      Xác thực mật khẩu:
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
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
