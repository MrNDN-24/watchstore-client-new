import React, { useState, useEffect } from "react";
import { registerUser, resetPassword } from "../services/authService";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginwallpaper from "../assets/wallpaper-login.jpg";
import "../styles/Auth.css";

const ResetPassword = () => {
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(""); // Lỗi cho mật khẩu
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(""); // Lỗi cho mật khẩu
  const navigate = useNavigate();

  const handleInputChange = (input) => {
    if (input === "password") {
      setErrorPassword(""); // Xóa lỗi mật khẩu khi nhập
    } else if (input === "confirmpassword") {
      setErrorConfirmPassword("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // Kiểm tra mật khẩu
    if (password.length < 6) {
      setErrorPassword("Mật khẩu phải có ít nhất 6 ký tự");
      hasError = true;
    }

    if (confirmPassword !== password) {
      setErrorConfirmPassword("Mật khẩu không khớp");
      hasError = true;
    }

    // Nếu có lỗi, dừng lại không gửi yêu cầu
    if (hasError) return;

    try {
      console.log("ID", id, token);
      const data = await resetPassword(id, token, password);
      console.log(data.status);
      if (data.status === "Success") {
        toast.success("Người dùng đã thay đổi mật khẩu thành công");
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
    console.log("ID", id, token);
    toast.info("Chào mừng bạn đến với trang đặt lại mật khẩu!");
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
                  Đặt lại mật khẩu
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
                <div className="mt-8">
                  <label className="text-gray-800 text-xs block mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type={"password"}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder="Nhập mật khẩu mới"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        handleInputChange("password"); // Reset lỗi khi nhập
                      }}
                      onFocus={() => handleInputChange("password")} // Reset lỗi khi focus vào trường
                    />
                  </div>
                  {errorPassword && <p className="error">{errorPassword}</p>}{" "}
                </div>
                <div className="mt-8">
                  <label className="text-gray-800 text-xs block mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="confirmpassword"
                      type={"password"}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder="Xác nhận mật khẩu"
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        handleInputChange("confirmpassword"); // Reset lỗi khi nhập
                      }}
                      onFocus={() => handleInputChange("confirmpassword")} // Reset lỗi khi focus vào trường
                    />
                  </div>
                  {errorConfirmPassword && (
                    <p className="error">{errorConfirmPassword}</p>
                  )}{" "}
                </div>

                <div className="mt-12">
                  <button
                    type="submit"
                    className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none"
                  >
                    Đặt lại mật khẩu
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

export default ResetPassword;
