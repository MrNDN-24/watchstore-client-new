import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // Chỉnh sửa import đúng
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { getFavourites } from "../services/favouriteService";

const FavouriteIcon = () => {
  const [favouriteCount, setFavouriteCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Lấy userId từ token khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      // Cố gắng lấy userId từ các trường có thể có
      const id = decoded.userId || decoded.id || decoded._id;
      if (id) {
        setUserId(id);

        // Khởi tạo socket
        const socketInstance = io("http://localhost:5000");
        socketInstance.emit("join", id);
        setSocket(socketInstance);

        return () => {
          socketInstance.emit("leave", id); // Nếu backend hỗ trợ event này
          socketInstance.disconnect();
        };
      }
    } catch (err) {
      console.error("Token không hợp lệ:", err);
    }
  }, []);

  // Hàm load dữ liệu yêu thích
  const loadFavourites = async () => {
    try {
      const response = await getFavourites();

      // Kiểm tra dữ liệu trả về và flatten nếu cần
      let favouritesData = response?.data || [];
      if (
        Array.isArray(favouritesData) &&
        favouritesData.length > 0 &&
        Array.isArray(favouritesData[0])
      ) {
        // Nếu là mảng lồng, flatten thành mảng 1 chiều
        favouritesData = favouritesData.flat();
      }

      setFavouriteCount(favouritesData.length);
    } catch (err) {
      console.error("Không thể lấy danh sách yêu thích:", err);
    }
  };

  // Gọi API sau khi userId đã có
  useEffect(() => {
    if (userId) {
      loadFavourites();
    }
  }, [userId]);

  // Lắng nghe socket update
  useEffect(() => {
    if (!socket || !userId) return;

    const handleUpdate = (data) => {
      if (data?.userId === userId) {
        loadFavourites();
      }
    };

    socket.on("favourite:update", handleUpdate);

    return () => {
      socket.off("favourite:update", handleUpdate);
    };
  }, [socket, userId]);

  const handleClick = () => {
    navigate("/favourite");
  };

  return (
    <div className="relative inline-block cursor-pointer" onClick={handleClick}>
      <FaHeart className="text-xl" />
      {favouriteCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
          {favouriteCount}
        </span>
      )}
    </div>
  );
};

export default FavouriteIcon;
