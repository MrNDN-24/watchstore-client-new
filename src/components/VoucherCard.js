import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatExpirationDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Không xác định";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const VoucherCard = ({ discount }) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(discount.code);
    toast.success("Đã sao chép mã giảm giá!");
  };

  useEffect(() => {
    console.log("Discount card", discount);
  }, []);

  return (
    <div className="bg-white border-2 border-black text-black p-6 rounded-lg shadow-lg w-full max-w-sm">
      {/* Hình ảnh chương trình */}
      {discount.programImage && (
        <img
          src={discount.programImage}
          alt={discount.programName}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
      )}

      {/* Tên chương trình */}
      <div className="text-3xl font-bold mb-2">
        {discount.programName || "Mã giảm giá!"}
      </div>

      {/* Mô tả chương trình */}
      {discount.description && (
        <p className="text-base text-gray-800 mb-4">{discount.description}</p>
      )}
      <div className="bg-gray-100 border border-black rounded-lg px-4 py-2 flex items-center justify-between">
        <span className="text-xl font-semibold">{discount.code}</span>
        <button
          className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={handleCopyCode}
        >
          Sao chép
        </button>
      </div>

      <div className="text-sm mt-4">
        <p>
          Ngày bắt đầu:{" "}
          <span className="font-semibold">
            {formatExpirationDate(discount.startDate)}
          </span>
        </p>
        <p>
          Hạn sử dụng:{" "}
          <span className="font-semibold">
            {formatExpirationDate(discount.expirationDate)}
          </span>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default VoucherCard;
