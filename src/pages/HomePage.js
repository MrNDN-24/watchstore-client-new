import React, { useState } from "react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import panel1 from "../assets/panel1.jpg";
import ProductList from "../components/ProductList";
import Brands from "../components/Brands";
import StoreDetail from "../components/StoreDetail";
import ChatBot from "../components/ChatBot"
const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const slides = [banner1, banner2, banner3];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex == 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const nextSlide = () => {
    const isLastSlide = currentIndex == slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div>
      <Navbar /> {/* Thêm Navbar */}
      <main>
        <div className="flex flex-col h-[600px]">
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
        <Brands />
        <div>
          <img src={panel1} className="w-[100%]" />
        </div>
        <p className="text-heading1-bold text-3xl font-extrabold">
          Đồng hồ bán chạy
        </p>
        <ProductList limit={5} />
      </main>
      <StoreDetail />
      <p className="text-heading1-bold text-3xl font-extrabold">
        Sản phẩm mới nhất
      </p>
      <ProductList limit={5} filter={{ sortBy: "createdAt" }} />
      <ChatBot/>
      <Footer /> {/* Thêm Footer */}
    </div>
  );
};

export default HomePage;
