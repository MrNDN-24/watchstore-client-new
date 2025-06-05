import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import logo from "../assets/WatchThis_transparent-.png";
import { MdShoppingCart, MdAccountCircle, MdFavorite } from "react-icons/md";
import { getProducts } from "../services/productService";
import { getFavourites } from "../services/favouriteService";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import SearchItem from "./SearchItem";
import NotificationBell from "./NotificationBell";
import FavouriteIcon from "./FavouriteIcon";
import { Moon, Sun } from "lucide-react"; // thêm icon chuyển theme

const Navbar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [showMenu, setShowMenu] = useState(false);

  const [favouriteCount, setFavouriteCount] = useState(0);

  // Theme toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { id: 1, text: "Home" },
    { id: 2, text: "Sản phẩm" },
    { id: 3, text: "About" },
    { id: 4, text: "Voucher" },
    { id: 5, text: "Blog" },
  ];

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getCartItemCount, cartItems } = useCart();

  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setSearchValue(value);
    if (value) {
      setIsLoading(true);
      try {
        const filters = { name: value };
        const data = await getProducts(1, 5, filters);
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
    navigate("/product");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-menu-wrapper")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="nav-logo">
        <img src={logo} alt="Logo" className="h-8" />
      </div>

      <div className="flex-1 mx-4 max-w-md hidden md:block">
        <div className="relative">
          <input
            type="text"
            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 
            focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
          />
          {isLoading ? (
            <p className="absolute z-10 w-full bg-white dark:bg-gray-700 p-2 rounded mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
              Đang tìm kiếm...
            </p>
          ) : searchResults.length > 0 && searchValue ? (
            <div className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-2">
              <ul className="divide-y divide-gray-200">
                {searchResults.map((result) => (
                  <SearchItem
                    key={result._id}
                    product={result}
                    setSearchValue={setSearchValue}
                  />
                ))}
              </ul>
              <button
                onClick={handleSeeMore}
                className="block text-center py-2 text-sm font-medium w-full hover:underline"
              >
                Xem thêm
              </button>
            </div>
          ) : (
            searchValue && (
              <p className="absolute z-10 w-full bg-white dark:bg-gray-700 p-2 rounded mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                Không tìm thấy kết quả.
              </p>
            )
          )}
        </div>
      </div>

      <ul className="hidden md:flex gap-4">
        {navItems.map((item) => (
          <li
            key={item.id}
            className="cursor-pointer hover:text-blue-500"
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
                case 5:
                  navigate("/blog");
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

      <div className="flex items-center gap-4">
        {/* Nút chuyển theme */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification */}
        <NotificationBell />

        {/* Favourite icon */}
        <FavouriteIcon />

        {/* Cart icon */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <MdShoppingCart className="w-6 h-6 text-black dark:text-white" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              {cartItems.length}
            </span>
          )}
        </div>

        {/* Profile icon (Click Toggle) */}
        <div className="relative profile-menu-wrapper">
          <MdAccountCircle
            className="w-6 h-6 text-black dark:text-white cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="absolute right-0 mt-2 w-36 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 px-4">
              <p
                className="cursor-pointer text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => {
                  setShowMenu(false);
                  navigate("/api/profile");
                }}
              >
                Tài khoản
              </p>
              <p
                className="cursor-pointer text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mt-2"
                onClick={() => {
                  setShowMenu(false);
                  handleLogout();
                }}
              >
                Đăng xuất
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
