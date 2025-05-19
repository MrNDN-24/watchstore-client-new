import React from "react";
import StoreDetailbanner from "../assets/store_detail.webp";
import { useNavigate } from "react-router-dom";

const StoreDetail = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/about");
  };

  return (
    // <div className="bg-black text-white py-16">
    //   <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    //     <div className="flex items-center justify-between">
    //       <div className="max-w-3xl mt-8 mb-12 px-4 sm:px-6 lg:px-8">
    //         <h1 className="text-4xl font-bold mb-4">
    //           Cửa hàng đồng hồ đeo tay chính hãng
    //         </h1>
    //         <p className="text-lg mb-8">
    // Được thành lập vào năm 2020, trải qua 4 năm hoạt động và phát
    // triển, chuỗi cửa hàng đồng hồ WatchStore trở thành đại lý ủy quyền
    // cho rất nhiều thương hiệu đến từ Nhật Bản và Thụy Sĩ chuyên bán
    // đồng hồ đeo tay chính hãng.
    //         </p>
    //         <button
    //           onClick={handleClick}
    //           className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 px-6 rounded-lg"
    //         >
    //           Xem thêm
    //         </button>
    //       </div>
    //       <div>
    //         <img
    //           className="w-full h-auto"
    //           src={StoreDetailbanner}
    //           alt="Watch"
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div>
      <section className="bg-black dark:bg-black">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-bold leading-none md:text-5xl xl:text-6xl text-white">
              Cửa hàng đồng hồ đeo tay chính hãng
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-300 lg:mb-8 md:text-lg lg:text-xl">
              Được thành lập vào năm 2020, trải qua 4 năm hoạt động và phát
              triển, chuỗi cửa hàng đồng hồ WatchStore trở thành đại lý ủy quyền
              cho rất nhiều thương hiệu đến từ Nhật Bản và Thụy Sĩ chuyên bán
              đồng hồ đeo tay chính hãng.
            </p>
            <div className="flex">
              <a
                href="/about"
                // onClick={handleClick}
                className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
              >
                Xem thêm
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              {/* <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white border border-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-700"
              >
                Speak to Sales
              </a> */}
            </div>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src={StoreDetailbanner} alt="mockup" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoreDetail;
