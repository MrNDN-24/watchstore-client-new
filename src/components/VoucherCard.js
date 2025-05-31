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
    e.stopPropagation();
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
        className="cursor-pointer bg-white dark:bg-gray-800 border-2 border-black dark:border-white text-black dark:text-white p-6 rounded-lg shadow-lg w-full max-w-sm hover:shadow-xl transition-shadow"
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

        <div className="text-3xl font-bold mb-2 text-black dark:text-white">
          {discount.programName || "Mã giảm giá!"}
        </div>

        <p className="text-base text-black dark:text-white mb-4">
          Giảm {discount.discountValue?.toLocaleString("vi-VN")} VND trên đơn
          hàng
        </p>

        <div className="bg-gray-100 dark:bg-gray-700 border border-black dark:border-white rounded-lg px-4 py-2 flex items-center justify-between">
          <span className="text-xl font-semibold text-black dark:text-white">
            {discount.code}
          </span>
          <button
            className="bg-black dark:bg-white dark:text-black text-white px-3 py-1 rounded hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors"
            onClick={handleCopyCode}
          >
            Sao chép
          </button>
        </div>

        <div className="text-sm mt-4 text-black dark:text-white">
          <p>
            Ngày bắt đầu:{" "}
            <span className="font-semibold text-black dark:text-white">
              {formatExpirationDate(discount.startDate)}
            </span>
          </p>
          <p>
            Hạn sử dụng:{" "}
            <span className="font-semibold text-black dark:text-white">
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
        className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-5xl mx-auto mt-20 shadow-xl border border-gray-300 dark:border-gray-600 outline-none max-h-screen overflow-y-auto relative text-left text-black dark:text-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 dark:text-white hover:text-black dark:hover:text-white text-2xl font-bold focus:outline-none"
          aria-label="Đóng"
        >
          &times;
        </button>

        <img
          src={
            discount.programImage && discount.programImage.trim() !== ""
              ? discount.programImage
              : "/voucher.png"
          }
          alt={discount.programName || "Chương trình khuyến mãi"}
          className="w-full h-80 object-contain rounded-md mb-4"
        />

        <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
          {discount.programName}
        </h2>

        <div className="text-left text-black dark:text-white">
          <p className="mb-2 text-black dark:text-white">
            <strong className="text-black dark:text-white">Mã giảm giá:</strong>{" "}
            <span className="text-black dark:text-white">{discount.code}</span>
          </p>
          <p className="mb-2 text-black dark:text-white">
            <strong className="text-black dark:text-white">
              Giá trị giảm giá:
            </strong>{" "}
            <span className="text-black dark:text-white">
              {discount.discountValue?.toLocaleString("vi-VN")} VND
            </span>
          </p>
          <p className="mb-2 text-black dark:text-white">
            <strong className="text-black dark:text-white">Thời gian:</strong>{" "}
            <span className="text-black dark:text-white">
              {formatExpirationDate(discount.startDate)} -{" "}
              {formatExpirationDate(discount.expirationDate)}
            </span>
          </p>
          <div className="mb-2 text-black dark:text-white">
            <strong className="text-black dark:text-white">Mô tả:</strong>
            <div
              className="mt-1 text-black dark:text-white"
              dangerouslySetInnerHTML={{ __html: discount.description }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VoucherCard;
