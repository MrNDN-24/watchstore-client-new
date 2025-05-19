import React, { useState, useEffect } from "react";
import { forgotpassword } from "../services/authService";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginwallpaper from "../assets/wallpaper-login.jpg";
import "../styles/Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(""); // Lỗi cho email
  const navigate = useNavigate();

  const handleInputChange = (input) => {
    if (input === "email") {
      setErrorEmail(""); // Xóa lỗi email khi nhập
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // Kiểm tra mật khẩu
    // Kiểm tra định dạng email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorEmail("Email không hợp lệ");
      hasError = true;
    }
    // Nếu có lỗi, dừng lại không gửi yêu cầu
    if (hasError) return;

    try {
      console.log("Email", email);
      const data = await forgotpassword(email);
      console.log("Forgot password", data.status);
      if (data.status === 200) {
        toast.success("Kiểm tra email của bạn để nhận link đổi mật khẩu");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
      //   await registerUser({ username, email, password, name, phone }); // Gửi username thay vì name
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
                  Quên mật khẩu
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
                    Nhập email:
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

                <div className="mt-12">
                  <button
                    type="submit"
                    className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none"
                  >
                    Quên mật khẩu
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

export default ForgotPassword;
