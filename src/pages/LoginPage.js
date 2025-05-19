import React, { useState, useEffect } from "react";
import {
  loginUser,
  loginUserWithGoogle,
  loginWithFacebook,
} from "../services/authService";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { toast, ToastContainer } from "react-toastify";
import loginwallpaper from "../assets/wallpaper-login.jpg";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Auth.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [username, setUsername] = useState(""); // Đổi name thành username
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (input) => {
    if (input === "username") {
      setErrorUsername(""); // Đổi name thành username
    } else if (input === "password") {
      setErrorPassword("");
    }
  };

  const handleFocus = (input) => {
    handleInputChange(input); // Reset lỗi khi focus vào trường nhập
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    console.log("Handle submit");

    // Kiểm tra dữ liệu nhập

    if (!username.trim()) {
      // Đổi name thành username

      setErrorUsername("Tên đăng nhập không được để trống.");
      hasError = true;
      console.log("Error flag", hasError);
    }
    if (!password.trim()) {
      setErrorPassword("Mật khẩu không được để trống.");
      hasError = true;
      console.log("Error flag", hasError);
    }

    // Nếu có lỗi, dừng lại không gửi yêu cầu
    if (hasError) return;

    try {
      const user = await loginUser({ username, password }); // Đổi name thành username

      toast.success("Đăng nhập thành công");

      localStorage.setItem("token", user.token);
      navigate("/homepage");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message); // Hiển thị lỗi từ server
      } else if (error.message) {
        toast.error(error.message); // Hiển thị message của lỗi (nếu có)
      } else {
        toast.error("Đăng nhập không thành công!"); // Lỗi mặc định
      }
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const user = await loginUserWithGoogle(response.credential);
      toast.success("Đăng nhập thành công với Google");
      localStorage.setItem("token", user.token);
      navigate("/homepage");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message); // Hiển thị lỗi từ server
      } else if (error.message) {
        toast.error(error.message); // Hiển thị message của lỗi (nếu có)
      } else {
        toast.error("Đăng nhập không thành công!"); // Lỗi mặc định
      }
    }
  };

  const handleGoogleLoginFailure = () => {
    toast.error("Đăng nhập Google thất bại");
  };

  //FB Login
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1352120546044531",
        cookie: true,
        xfbml: true,
        version: "v2.7",
      });
    };

    // Load Facebook SDK script
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);
  const handleFacebookLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          // Gửi accessToken này về backend để đăng nhập
          loginWithFacebook(accessToken)
            .then((data) => {
              console.log("Đăng nhập FB thành công", data);
              if (data.token) {
                localStorage.setItem("token", data.token); // <-- Thêm dòng này
                navigate("/homepage");
              } else {
                console.error("Không có token trả về từ backend!");
              }
            })
            .catch((error) => {
              console.error("Lỗi đăng nhập FB", error);
            });
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  useEffect(() => {
    toast.info("Chào mừng bạn đến với trang đăng nhập!");
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
                  Đăng nhập
                </h3>
                <p className="text-sm mt-4 text-gray-800">
                  Chưa có tài khoản{" "}
                  <a
                    href="/register"
                    className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                  >
                    Đăng ký tài khoản
                  </a>
                </p>
              </div>

              <form onSubmit={handleSubmit}>
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
                      onFocus={() => handleFocus("username")} // Đổi name thành username
                    />
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-2"
                      viewBox="0 0 682.667 682.667"
                    >
                      <defs>
                        <clipPath id="a" clipPathUnits="userSpaceOnUse">
                          <path
                            d="M0 512h512V0H0Z"
                            data-original="#000000"
                          ></path>
                        </clipPath>
                      </defs>
                      <g
                        clipPath="url(#a)"
                        transform="matrix(1.33 0 0 -1.33 0 682.667)"
                      >
                        <path
                          fill="none"
                          strokeMiterlimit="10"
                          strokeWidth="40"
                          d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                          data-original="#000000"
                        ></path>
                        <path
                          d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                          data-original="#000000"
                        ></path>
                      </g>
                    </svg> */}
                  </div>
                  {errorUsername && <p className="error">{errorUsername}</p>}{" "}
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
                      onFocus={() => handleFocus("password")} // Reset lỗi khi focus vào trường
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
                    Đăng nhập
                  </button>
                </div>
              </form>

              <p className="text-gray-800 text-sm block mb-2">
                Hoặc đăng nhập bằng
              </p>

              <div className="google-login-container">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                  useOneTap={false}
                  render={(renderProps) => (
                    <button
                      className="google-login-button"
                      onClick={renderProps.onClick}
                    >
                      <i className="fab fa-google"></i> Đăng nhập với Google
                    </button>
                  )}
                />
              </div>
              <div className="facebook-login-container mt-4">
                <button
                  className="facebook-login-button bg-blue-600 text-white px-4 py-2 rounded-md w-full"
                  onClick={handleFacebookLogin}
                >
                  <i className="fab fa-facebook mr-2"></i> Đăng nhập với
                  Facebook
                </button>
              </div>
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

export default LoginPage;
