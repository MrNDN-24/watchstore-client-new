import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VoucherSection from "../components/VoucherSection";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VoucherPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <VoucherSection type="ongoing" title="Voucher Đang Diễn Ra" />
      <VoucherSection type="upcoming" title="Voucher Sắp Diễn Ra" />
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default VoucherPage;
