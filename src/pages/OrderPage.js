import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MyOrderForm from "../components/MyOrderForm";

const OrderPage = () => {
  return (
    <div>
      <Navbar />
      <MyOrderForm />
      <Footer />
    </div>
  );
};

export default OrderPage;
