import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import { FaBell, FaClock, FaCalendarAlt } from "react-icons/fa";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notifyService";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.userId || decoded.id || decoded._id;
        setUserId(id);

        // Kết nối đến socket server
        const socketInstance = io(
          `${process.env.REACT_APP_SOCKET_URL || "http://localhost:5000"}`
        );

        // const socketInstance = io("http://localhost:5000");
        socketInstance.emit("join", id);
        setSocket(socketInstance);

        return () => socketInstance.disconnect();
      } catch (err) {
        console.error("Token không hợp lệ:", err);
      }
    }
  }, []);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await getNotifications(userId);
      setNotifications(res.data);
      const unread = res.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Lỗi khi đánh dấu là đã đọc", err);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await markAllAsRead(userId);
      fetchNotifications();
    } catch (err) {
      console.error("Lỗi khi đánh dấu tất cả là đã đọc", err);
    }
  };

  const toggleDropdown = () => {
    setOpen(!open);
    // Không gọi markAllAsRead ở đây!
  };

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new-notification", (newNotify) => {
      if (newNotify.user_id !== userId) return;
      setNotifications((prev) => {
        const updatedList = [newNotify, ...prev];
        const unread = updatedList.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
        return updatedList;
      });
    });

    return () => {
      socket.off("new-notification");
    };
  }, [socket, userId]);

  return (
    <div className="relative inline-block">
      <div className="relative cursor-pointer" onClick={toggleDropdown}>
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 font-semibold border-b text-gray-700 text-base flex justify-between items-center">
            <span>Thông báo</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-red-500 hover:underline"
              >
                Đánh dấu tất cả là đã đọc
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">
              Không có thông báo nào
            </div>
          ) : (
            notifications.map((notify) => {
              const created = new Date(notify.createdAt);
              const time = created.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const date = created.toLocaleDateString();
              return (
                <div
                  key={notify._id}
                  className={`px-4 py-3 border-b text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out ${
                    !notify.isRead
                      ? "bg-red-50 dark:bg-gray-800 font-semibold"
                      : "bg-white dark:bg-gray-900"
                  }`}
                  onClick={() => handleMarkAsRead(notify._id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!notify.isRead && (
                      <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                    )}
                    <span className="text-gray-800 dark:text-gray-200">
                      {notify.message}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 gap-4">
                    <div className="flex items-center gap-1">
                      <FaClock />
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt />
                      <span>{date}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
