import React from "react";
import logo from "../assets/WatchThis-.png";
import money from "../assets/money.jpg";
import atm from "../assets/atm.jpg";
import momo from "../assets/momo.png";

const Footer = () => {
  const methods = [
    { label: "Tiền mặt", icon: money }, // Thay icon bằng hình ảnh
    { label: "Chuyển khoản", icon: atm },
    { label: "Momo", icon: momo },
  ];

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col items-center justify-center">
            <img src={logo} className="mr-5 h-6 sm:h-9" alt="logo" />
            <p className="max-w-xs mt-4 text-sm text-gray-400">
              CÔNG TY CỔ PHẦN WATCHTHIS.
            </p>
            <div className="flex mt-8 space-x-6 text-gray-400">
              <a
                className="hover:opacity-75"
                href="#"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <div className="flex justify-center gap-4 bg-gray-800 p-4">
              {methods.map((method, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-4 bg-transparent rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  {/* Hiển thị ảnh thay vì biểu tượng */}
                  <div className="mb-2">
                    <img
                      src={method.icon}
                      className="w-10 h-10 object-contain border border-gray-300 rounded-lg"
                    />
                  </div>
                  {/* <span className="text-sm font-semibold text-gray-400">
                    {method.label}
                  </span> */}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-400">© 2022 Company Name</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-medium">WatchStore</p>
              <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-400 bg-transparent shadow-none">
                <a className="hover:opacity-75" href="#">
                  Home
                </a>
                <a className="hover:opacity-75" href="#">
                  About
                </a>
                <a className="hover:opacity-75" href="#">
                  Sản phẩm
                </a>
              </nav>
            </div>
            <div>
              <p className="font-medium">Chính sách</p>
              <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-400 bg-transparent shadow-none">
                <a className="hover:opacity-75" href="#">
                  Bảo mật thông tin
                </a>
                <a className="hover:opacity-75" href="#">
                  Chính sách bảo hành
                </a>
                <a className="hover:opacity-75" href="#">
                  Chính sách đổi trả
                </a>
                <a className="hover:opacity-75" href="#">
                  Chính sách vận chuyển
                </a>
              </nav>
            </div>
            <div>
              <p className="font-medium">Địa chỉ cửa hàng</p>
              <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-400 bg-transparent shadow-none w-full">
                <a className="hover:opacity-75" href="#">
                  97 Trần Đại Nghĩa, HBT, Hà Nội
                </a>
                <a className="hover:opacity-75" href="#">
                  61 Quang Trung, P10, Gò Vấp, HCM
                </a>
                <a className="hover:opacity-75" href="#">
                  339 Lê Duẩn, Thanh Khê, Đà Nẵng
                </a>
              </nav>
            </div>
            <div>
              <p className="font-medium">LIÊN HỆ HỖ TRỢ</p>
              <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-400 bg-transparent shadow-none w-full">
                <a className="hover:opacity-75" href="#">
                  Hotline 1: 0352291310
                </a>
                <a className="hover:opacity-75" href="#">
                  Hotline 2: 0814342357
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
