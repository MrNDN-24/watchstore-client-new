import React, { useState, useEffect } from "react";
// import { Menu } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FilterPills from "../components/FilterPills";
import ProductList from "../components/ProductList";
import banner1 from "../assets/slider_product_1.webp";
import banner2 from "../assets/slider_product_2.webp";
import banner3 from "../assets/slider_product_3.webp";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useLocation } from "react-router-dom";

const ProductListingPage = () => {
  const slides = [banner1, banner2, banner3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  let { filters } = location.state || {};

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

  useEffect(() => {
    console.log("Selected Filters:", filters);
    filters = location.state || {};
    // Tại đây bạn có thể sử dụng các filters này để lọc sản phẩm từ API hoặc dữ liệu local
  }, [filters]);

  return (
    <div className="bg-white">
      <Navbar />
      <div>
        <div className="flex flex-col">
          <div className="relative w-full h-[600px] overflow-hidden">
            {slides.map((slide, index) => (
              <img
                src={slide}
                alt=""
                key={index}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute group-hover:block absolute top-[50%] -translate-x-0 translate-y-[50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <MdArrowBackIos onClick={prevSlide} size={30} />
            </div>
            <div className="absolute group-hover:block absolute top-[50%] -translate-x-0 translate-y-[50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <MdArrowForwardIos onClick={nextSlide} size={30} />
            </div>
          </div>
        </div>
        <FilterPills />
        <ProductList filter={filters} limit={10} />
      </div>
      <Footer />
    </div>
  );
};

export default ProductListingPage;
