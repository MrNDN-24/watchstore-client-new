import React from "react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useEffect, useState } from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const [page, setPage] = useState(currentPage); // State cho trang hiện tại
  const [pageSize, setPageSize] = useState(totalPages); // Số trang tổng cộng

  const handlePreviousPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      setCurrentPage(newPage); // Gọi prop setCurrentPage để thông báo thay đổi trang
      // console.log("Current Page", page);
    }
  };

  // Xử lý chuyển trang sau
  const handleNextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      setCurrentPage(newPage); // Gọi prop setCurrentPage để thông báo thay đổi trang
      // console.log("Current Page", page);
    }
  };

  let pagesList = [];
  for (let i = 1; i <= totalPages; i++) {
    pagesList.push(i);
  }
  return (
    <div>
      <div className="flex justify-center items-center gap-4 mt-8">
        {/* Nút Previous */}
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={`
            px-4 py-2 text-white rounded-md 
            flex items-center justify-center
            ${
              page === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black cursor-pointer hover:bg-gray-800"
            }
          `}
        >
          <MdArrowBackIos size={20} />
        </button>

        {/* Hiển thị số trang */}
        <div className="text-sm font-medium">
          Trang {page} / {totalPages}
        </div>

        {/* Nút Next */}
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className={`
            px-4 py-2 text-white rounded-md 
            flex items-center justify-center
            ${
              page === totalPages
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black cursor-pointer hover:bg-gray-800"
            }
          `}
        >
          <MdArrowForwardIos size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
