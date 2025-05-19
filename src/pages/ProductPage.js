import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProductPage = () => {
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleFilter = () => {
    setFilterVisible(!isFilterVisible);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const resetFilter = () => {
    setSearchValue("");
  };
  return (
    <div>
      <Navbar />
      <div>
        <div class="block_products_filter_width">
          <div className="filter-item block-manu">
            <div
              className="filter-item__title jsTitle jsTitle_hang"
              onClick={toggleFilter}
              data-alias="hang"
            >
              <div
                className="arrow-filter"
                style={{ display: isFilterVisible ? "block" : "none" }}
              ></div>
              <span>Hãng</span>
            </div>

            {isFilterVisible && (
              <div
                className="filter-show filter-show-hang has-scroll filter_group_manufactory"
                data-alias="hang"
              >
                <div className="manu__search">
                  <input
                    type="text"
                    id="manu__search"
                    placeholder="Nhập tên thương hiệu cần tìm"
                    value={searchValue}
                    onChange={handleSearchChange}
                    autoComplete="off"
                  />
                  <button className="manu__search--btn">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.84375 14.0625C6.58182 14.0625 3.9375 11.4182 3.9375 8.15625C3.9375 4.89432 6.58182 2.25 9.84375 2.25C13.1057 2.25 15.75 4.89432 15.75 8.15625C15.75 11.4182 13.1057 14.0625 9.84375 14.0625Z"
                        stroke="#344054"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.66797 12.333L2.25074 15.7502"
                        stroke="#344054"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="filter_group_add">
                  <div className="filter-list filter_list_hang manu filter_group_manufactory">
                    <button
                      type="button"
                      data-type="manufactory"
                      className="c-btnbox c-btnbox-7 filter-manu"
                      data-alias="srwatch"
                      data-id="7"
                      data-name="SRWatch"
                    >
                      <img
                        className="lazy after-lazy"
                        alt="SRWatch"
                        width="87"
                        height="50"
                        srcSet="https://www.watchstore.vn/images/products/manufactories/2024/resized/logo-srwatch-1712398047.webp"
                        src="https://www.watchstore.vn/images/products/manufactories/2024/resized/logo-srwatch-1712398047.jpg"
                        style={{ opacity: 1, display: "block" }}
                      />
                    </button>
                  </div>

                  <div className="filter-button filter-button--total stick-filter">
                    <button onClick={resetFilter} className="btn-filter-close">
                      Bỏ chọn
                    </button>
                    <button
                      className="btn-filter-readmore"
                      data-link="https://www.watchstore.vn/dong-ho-srwatch-chinh-hang-c1"
                    >
                      <b className="total-reloading">877</b> kết quả
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
