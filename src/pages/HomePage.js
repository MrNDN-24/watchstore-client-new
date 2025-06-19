import React, { useState } from "react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import panel1 from "../assets/panel1.jpg";
import ProductList from "../components/ProductList";
import Brands from "../components/Brands";
import StoreDetail from "../components/StoreDetail";
import ProductAdPanel from "../components/ProductAdPanel";

const HomePage = () => {
  const slides = [banner1, banner2, banner3];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-500">
      <Navbar />
      <main className="px-4 sm:px-8 md:px-12">
        {/* Banner slider */}
        <div className="flex flex-col h-[600px]">
          <div className="relative w-full h-[600px] overflow-hidden">
            {slides.map((slide, index) => (
              <img
                src={slide}
                alt={`banner-${index + 1}`}
                key={index}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute top-[50%] left-5 -translate-y-1/2 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer">
              <MdArrowBackIos onClick={prevSlide} size={30} />
            </div>
            <div className="absolute top-[50%] right-5 -translate-y-1/2 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer">
              <MdArrowForwardIos onClick={nextSlide} size={30} />
            </div>
          </div>
        </div>

        {/* Brands */}
        <Brands />
        <ProductAdPanel />

        {/* Panel image */}
        <div className="my-6">
          <img src={panel1} className="w-full" alt="Panel Promotion" />
        </div>

        {/* Best selling */}
        <p className="text-3xl font-extrabold my-6 text-black dark:text-white">
          Đồng hồ bán chạy
        </p>
        <ProductList limit={5} />

        {/* Store info */}
        <StoreDetail />

        {/* Latest products */}
        <p className="text-3xl font-extrabold my-6 text-black dark:text-white">
          Sản phẩm mới nhất
        </p>
        <ProductList limit={5} filter={{ sortBy: "createdAt" }} />
      </main>

   
      <Footer />
    </div>
  );
};

export default HomePage;
