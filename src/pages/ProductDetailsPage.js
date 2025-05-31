import React from "react";
import Navbar from "../components/Navbar";
import ProductDetail from "../components/ProductDetail";
import ProductOverView from "../components/ProductOverview";
import Footer from "../components/Footer";

const ProductDetailsPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Navbar />
      <ProductDetail />
      {/* <ProductOverView /> */}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
