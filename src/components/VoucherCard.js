import React, { useEffect, useState } from "react";
import Modal from "react-modal";
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
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyCode = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click vào card
    navigator.clipboard.writeText(discount.code);
    toast.success("Đã sao chép mã giảm giá!");
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    console.log("Discount card", discount);
  }, []);

  return (
    <>
      <div
        onClick={openModal}
        className="cursor-pointer bg-white border-2 border-black text-black p-6 rounded-lg shadow-lg w-full max-w-sm hover:shadow-xl transition-shadow"
      >
        <img
          src={
            discount.programImage && discount.programImage.trim() !== ""
              ? discount.programImage
              : "/default-voucher.jpg"
          }
          alt={discount.programName || "Chương trình khuyến mãi"}
          className="w-full h-40 object-cover rounded-md mb-4"
        />

        <div className="text-3xl font-bold mb-2">
          {discount.programName || "Mã giảm giá!"}
        </div>
        <p className="text-base text-gray-800 mb-4">
          Giảm {discount.discountValue?.toLocaleString("vi-VN")} VND trên đơn
          hàng
        </p>

        <div className="bg-gray-100 border border-black rounded-lg px-4 py-2 flex items-center justify-between">
          <span className="text-xl font-semibold">{discount.code}</span>
          <button
            className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
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

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Chi tiết chương trình"
        className="bg-white p-6 rounded-lg max-w-5xl mx-auto mt-20 shadow-xl border border-gray-300 outline-none max-h-screen overflow-y-auto relative text-left"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex"
      >
        {/* Nút đóng dấu X góc trên bên phải */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold focus:outline-none"
          aria-label="Đóng"
        >
          &times;
        </button>

        {/* Hình ảnh voucher */}
        <img
          src={
            discount.programImage && discount.programImage.trim() !== ""
              ? discount.programImage
              : "/voucher.png"
          }
          alt={discount.programName || "Chương trình khuyến mãi"}
          className="w-full h-80 object-contain rounded-md mb-4"
        />

        {/* Tên chương trình */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          {discount.programName}
        </h2>

        {/* Nội dung căn trái */}
        <div className="text-left">
          <p className="mb-2">
            <strong>Mã giảm giá:</strong> {discount.code}
          </p>
          <p className="mb-2">
            <strong>Giá trị giảm giá:</strong>{" "}
            {discount.discountValue?.toLocaleString("vi-VN")} VND
          </p>
          <p className="mb-2">
            <strong>Thời gian:</strong>{" "}
            {formatExpirationDate(discount.startDate)} -{" "}
            {formatExpirationDate(discount.expirationDate)}
          </p>
          <div className="mb-2">
            <strong>Mô tả:</strong>
            <div
              className="mt-1 text-gray-800"
              dangerouslySetInnerHTML={{ __html: discount.description }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VoucherCard;
