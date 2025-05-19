import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VoucherCard from "../components/VoucherCard";
import { getDiscounts } from "../services/discountService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VoucherPage = () => {
  const [ongoingDiscounts, setOngoingDiscounts] = useState([]);
  const [upcomingDiscounts, setUpcomingDiscounts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getDiscountData = async () => {
      try {
        const response = await getDiscounts();
        setOngoingDiscounts(response.ongoingDiscounts);
        setUpcomingDiscounts(response.upcomingDiscounts);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      } finally {
        setLoading(false);
      }
    };
    getDiscountData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800 uppercase tracking-wider border-b-4 border-black pb-3">
          Voucher Đang Diễn Ra
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {isLoading ? (
            <p>Đang tải...</p>
          ) : ongoingDiscounts.length === 0 ? (
            <p>Không tìm thấy mã giảm giá.</p>
          ) : (
            ongoingDiscounts.map((voucher, index) => (
              <VoucherCard key={index} discount={voucher} />
            ))
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800 uppercase tracking-wider border-b-4 border-black pb-3">
          Voucher Sắp Diễn Ra
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {isLoading ? (
            <p>Đang tải...</p>
          ) : upcomingDiscounts.length === 0 ? (
            <p>Không tìm thấy mã giảm giá.</p>
          ) : (
            upcomingDiscounts.map((voucher, index) => (
              <VoucherCard key={index} discount={voucher} />
            ))
          )}
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default VoucherPage;
