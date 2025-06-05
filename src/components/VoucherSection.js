import React, { useEffect, useState } from "react";
import VoucherCard from "./VoucherCard";
import { getDiscounts } from "../services/discountService";

const VoucherSection = ({ type, title }) => {
  const [discounts, setDiscounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setLoading] = useState(true);

  const loadDiscounts = async (page = 1) => {
    setLoading(true);
    const data = await getDiscounts({ type, page, limit: 3 });
    if (data) {
      if (page === 1) setDiscounts(data.discounts);
      else setDiscounts((prev) => [...prev, ...data.discounts]);

      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDiscounts(1);
  }, [type]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      loadDiscounts(currentPage + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-extrabold text-center mb-6 uppercase tracking-wider border-b-4 border-black dark:border-white pb-3 text-gray-800 dark:text-white">
        {title}
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {isLoading && discounts.length === 0 ? (
          <p>Đang tải...</p>
        ) : discounts.length === 0 ? (
          <p>Không tìm thấy mã giảm giá.</p>
        ) : (
          discounts.map((voucher, index) => (
            <VoucherCard key={index} discount={voucher} />
          ))
        )}
      </div>

      {currentPage < totalPages && !isLoading && (
        <div className="flex justify-center mt-6">
          <div className="my-4 flex items-center before:h-px before:flex-1 before:bg-gray-300 after:h-px after:flex-1 after:bg-gray-300 dark:before:bg-gray-600 dark:after:bg-gray-600">
            <button
              type="button"
              onClick={handleLoadMore}
              className="flex items-center gap-2 rounded-full border border-gray-300 bg-secondary-50 px-6 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                className="h-5 w-5"
              >
                <polygon points="6,8 10,12 14,8" />
              </svg>
              Xem thêm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherSection;
