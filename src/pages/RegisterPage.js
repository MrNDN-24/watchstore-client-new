import React, { useState, useEffect } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginwallpaper from "../assets/wallpaper-login.jpg";
import "../styles/Auth.css";

const RegisterPage = () => {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [username, setUsername] = useState(""); // Thay đổi từ name thành username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState(""); // Lỗi cho tên đăng nhập
  const [errorEmail, setErrorEmail] = useState(""); // Lỗi cho email
  const [errorPassword, setErrorPassword] = useState(""); // Lỗi cho mật khẩu
  const [errorName, setErrorName] = useState(""); // Lỗi cho họ và tên
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(""); // Lỗi cho SĐT
  const navigate = useNavigate();

  const handleInputChange = (input) => {

    if (input === "username") {
      setErrorUsername(""); // Xóa lỗi tên khi nhập
    } else if (input === "email") {

      setErrorEmail(""); // Xóa lỗi email khi nhập
    } else if (input === "password") {
      setErrorPassword(""); // Xóa lỗi mật khẩu khi nhập
    } else if (input === "name") {
      setErrorUsername(""); // Xóa lỗi họ và tên khi nhập
    } else if (input === "phone") {
      setErrorPhoneNumber(""); // Xóa lỗi SĐT nhập
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;


    if (!name.trim()) {
      setErrorName("Họ và tên không được để trống");
      hasError = true;
    }

    // Kiểm tra độ dài tên đăng nhập
    if (username.length < 3) {
      setErrorUsername("Tên đăng nhập phải có ít nhất 3 ký tự");
      hasError = true;
    }

    // Kiểm tra định dạng email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorEmail("Email không hợp lệ");
      hasError = true;
    }

    if (phone.length < 10) {
      setErrorPhoneNumber("Số điện thoại phải có ít nhất 10 số");
      hasError = true;
    }

    // Kiểm tra mật khẩu
    if (password.length < 6) {
      setErrorPassword("Mật khẩu phải có ít nhất 6 ký tự");
      hasError = true;
    }

    // Nếu có lỗi, dừng lại không gửi yêu cầu
    if (hasError) return;

    try {

      await registerUser({ username, email, password, name, phone }); // Gửi username thay vì name
      toast.success("Người dùng đã đăng ký thành công");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const apiErrors = err.response?.data?.errors || {};
      if (typeof apiErrors === "string") {
        toast.error(apiErrors); // Hiển thị thông báo lỗi chung nếu có
      }
    }
  };

  useEffect(() => {
    toast.info("Chào mừng bạn đến với trang đăng ký!");
  }, []);

  return (

    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="min-h-screen flex flex-col items-center justify-center font-sans">
        <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="md:max-w-md w-full px-4 py-4">
            <div>
              <div className="mb-12">
                <h3 className="text-center text-gray-800 text-3xl font-extrabold">
                  Đăng ký
                </h3>
                <p className="text-sm mt-4 text-gray-800">
                  Đã có tài khoản{" "}
                  <a
                    href="/login"
                    className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                  >
                    Đăng nhập
                  </a>
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div>
                  <label className="text-gray-800 text-xs block mb-2">
                    Họ và tên
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="name"
                      type="text"
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder="Nhập họ và tên"
                      value={name} // Đổi name thành username
                      onChange={(e) => {
                        setName(e.target.value); // Đổi name thành username
                        handleInputChange("name"); // Đổi name thành username
                      }}
                      onFocus={() => handleInputChange("name")} // Đổi name thành username
                    />
                  </div>
                  {errorName && <p className="error">{errorName}</p>}{" "}
                </div>
                <div>
                  <label className="text-gray-800 text-xs block mb-2">
                    Tên đăng nhập
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="username"
                      type="text"
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder="Nhập tên đăng nhập"
                      value={username} // Đổi name thành username
                      onChange={(e) => {
                        setUsername(e.target.value); // Đổi name thành username
                        handleInputChange("username"); // Đổi name thành username
                      }}
                      onFocus={() => handleInputChange("username")} // Đổi name thành username
                    />
                  </div>
                  {errorUsername && <p className="error">{errorUsername}</p>}{" "}
                </div>

                <div>
                  <label className="text-gray-800 text-xs block mb-2">
                    Số điện thoại
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="phone"
                      type="text"
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder="Nhập số điện thoại"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        handleInputChange("phone");
                      }}
                      onFocus={() => handleInputChange("phone")}
                    />
                  </div>
                  {errorPhoneNumber && (
                    <p className="error">{errorPhoneNumber}</p>
                  )}{" "}
                </div>

                <div>
                  <label className="text-gray-800 text-xs block mb-2">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="email"
                      type="text"
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder="Nhập Email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        handleInputChange("email");
                      }}
                      onFocus={() => handleInputChange("email")}
                    />
                  </div>
                  {errorEmail && <p className="error">{errorEmail}</p>}{" "}
                </div>

                <div className="mt-8">
                  <label className="text-gray-800 text-xs block mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder="Nhập mật khẩu"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        handleInputChange("password"); // Reset lỗi khi nhập
                      }}
                      onFocus={() => handleInputChange("password")} // Reset lỗi khi focus vào trường
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                      viewBox="0 0 128 128"
                      onClick={togglePasswordVisibility}
                    >
                      <path
                        d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                        data-original="#000000"
                      ></path>
                    </svg>
                    {errorPassword && <p className="error">{errorPassword}</p>}{" "}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                  <div>
                    <a
                      href="/forgotpassword"
                      className="text-black-600 font-semibold text-sm hover:underline"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    type="submit"
                    className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none"
                  >
                    Đăng ký
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="md:h-full bg-white rounded-xl lg:p-12 p-8">
            <img
              src={loginwallpaper}
              className="w-full h-full object-contain"
              alt="login-image"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
