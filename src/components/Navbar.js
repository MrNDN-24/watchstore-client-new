import React from "react";
import "../styles/Navbar.css";
import logo from "../assets/WatchThis_transparent-.png";
import profile_icon from "../assets/profile_icon.png";
import cart_icon from "../assets/cart_icon.png";
import { getProducts } from "../services/productService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Link, Navigate } from "react-router-dom";
import SearchItem from "./SearchItem";
import { useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { getNotifications } from "../services/notifyService"; // bạn tạo hàm này
import { io } from "socket.io-client"; // nếu dùng realtime
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { id: 1, text: "Home" },
    { id: 2, text: "Sản phẩm" },
    { id: 3, text: "About" },
    { id: 4, text: "Voucher" },
  ];

  const [notifications, setNotifications] = useState([]);
  const [showNotify, setShowNotify] = useState(false);
  let userId = null;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.id || decoded._id; // tuỳ bạn lưu trong backend
    } catch (err) {
      console.error("Token không hợp lệ:", err);
    }
  }

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchTest, setSearchTest] = useState("");
  const { getCartItemCount } = useCart();
  const { cartItems } = useCart();

  const totalCartItems = new Set(cartItems.map((item) => item._id)).size;

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications(userId); // tạo hàm service gọi API
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy thông báo:", err);
    }
  };

  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setSearchValue(value);
    setShowResults(true);
    console.log("show result", showResults);
    if (value) {
      setIsLoading(true);
      try {
        const filters = { name: searchValue };
        console.log("Search value:", value);
        const data = await getProducts(1, 5, filters);
        console.log("Product Search:", data.data.content);
        setSearchResults(data?.data.content || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSeeMore = () => {
    console.log("Navigate product");
    navigate("/product");
    // setShowResults(false);
  };

  useEffect(() => {
    fetchNotifications();
    console.log("User ID: ", userId);
    const socket = io("http://localhost:5000");
    socket.emit("join", userId);

    socket.on("new-notification", (notify) => {
      setNotifications((prev) => [notify, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <nav>
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
      </div>
      {/* Thay đổi class ở đây để làm thanh search dài hơn */}
      <div className="flex justify-center flex-1 max-w-md">
        <div className="relative hidden md:block w-full mx-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search icon</span>
          </div>
          <input
            type="text"
            id="search-navbar"
            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
          />
          {isLoading ? (
            <p className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-2 p-4 text-center text-sm text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
              Đang tìm kiếm...
            </p>
          ) : searchResults.length > 0 && searchValue ? (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-2 dark:bg-gray-700 dark:border-gray-600">
              <ul className="divide-y divide-gray-200">
                {searchResults.slice(0, 5).map((result) => (
                  <SearchItem
                    key={result._id}
                    product={result}
                    setSearchValue={setSearchValue}
                  />
                ))}
              </ul>
              <button
                onClick={handleSeeMore}
                className="block justify-center text-center py-3 text-black-500 font-medium hover:underline w-full item-center"
              >
                Xem thêm
              </button>
            </div>
          ) : (
            searchValue && (
              <p className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-2 p-4 text-center text-sm text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                Không tìm thấy kết quả.
              </p>
            )
          )}
        </div>
      </div>
      <ul className="hidden md:flex">
        {navItems.map((item) => (
          <li
            key={item.id}
            className="p-4 hover:bg-[#c0c0c0] rounded-xl m-2 cursor-pointer duration-300 hover:text-black"
            onClick={() => {
              switch (item.id) {
                case 1:
                  navigate("/homepage");
                  break;
                case 2:
                  navigate("/product");
                  break;
                case 3:
                  navigate("/about");
                  break;
                case 4:
                  navigate("/voucher");
                  break;
                default:
                  break;
              }
            }}
          >
            {item.text}
          </li>
        ))}
      </ul>
      <div className="flex md:order-2">
        <button
          type="button"
          data-collapse-toggle="navbar-search"
          aria-controls="navbar-search"
          aria-expanded="false"
          className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search</span>
        </button>
        <div className="icons">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <FaBell
                className="text-xl cursor-pointer"
                onClick={() => setShowNotify(!showNotify)}
              />
              {notifications.some((n) => !n.isRead) && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  !
                </span>
              )}

              {showNotify && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b font-semibold text-gray-700">
                    Thông báo
                  </div>
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n._id}
                        className={`px-4 py-2 text-sm border-b cursor-pointer hover:bg-gray-100 ${
                          !n.isRead ? "font-bold" : "text-gray-500"
                        }`}
                      >
                        <p>{n.title}</p>
                        <p className="text-xs text-gray-400">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500">
                      Không có thông báo
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <img
                src={cart_icon}
                className="w-5 cursor-pointer"
                alt=""
                onClick={() => navigate("/cart")}
              />
              {cartItems.length > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-red-500 text-white 
                           rounded-full text-xs w-4 h-4 flex items-center 
                           justify-center"
                >
                  {cartItems.length}
                </span>
              )}
            </div>

            <div className="group relative">
              <img
                className="w-5 cursor-pointer"
                src={profile_icon}
                alt="Profile Icon"
              />
              <div className="absolute hidden group-hover:block right-0 pt-4 dropdown-menu bg-white shadow-lg rounded">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-state-100 text-gray-500 rounded">
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={() => navigate("/api/profile")}
                  >
                    Tài khoản
                  </p>
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
