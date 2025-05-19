import React, { useState, useEffect } from "react";
import { Button, Menu } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { getAllStyle } from "../services/styleService";
import { getAllCategory } from "../services/categoryService";
import { getBrands } from "../services/brandService";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";

const FilterPills = () => {
  const [styles, setStyles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    filter: [],
    brand_ids: [],
    category_ids: [],
    price: [],
    style_ids: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filtersToSend = {
          ...selectedFilters,
          price: selectedFilters.price[0] || {}, // Lấy giá trị price_min và price_max
        };
        // navigate("/product", { state: { filters: filtersToSend } });

        const [fetchedStyles, fetchedCategories, fetchBrands] =
          await Promise.all([
            getAllStyle(), // Gọi API lấy danh sách styles
            getAllCategory(), // Gọi API lấy danh sách categories
            getBrands(),
          ]);
        // console.log("Style", fetchedStyles.data);
        // console.log("Category", fetchedCategories.data);
        // console.log("Brand", fetchBrands);
        // console.log("Filter", selectedFilters);
        setStyles(fetchedStyles.data);
        setCategories(fetchedCategories.data);
        setBrands(fetchBrands);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (filterId, value, id, extraData = {}) => {
    setSelectedFilters((prevState) => {
      const newFilters = { ...prevState };
      const filterValues = newFilters[filterId] || [];

      if (filterId === "price") {
        // Nếu filter là price, lưu trực tiếp price_min và price_max
        newFilters[filterId] = [extraData];
      } else {
        // Xử lý các filter khác
        if (filterValues.includes(id)) {
          newFilters[filterId] = filterValues.filter((item) => item !== id);
        } else {
          newFilters[filterId] = [...filterValues, id];
        }
      }

      return newFilters;
    });
    // console.log("Filter select:", filterId, value, id, extraData);
  };

  const handleRemoveFilter = (filterId, id) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [filterId]: prevState[filterId].filter((item) => item !== id),
    }));
  };

  const handleSearch = async () => {
    const filtersToSend = {
      ...selectedFilters,
      price: selectedFilters.price[0] || {}, // Lấy giá trị price_min và price_max
    };
    navigate("/product", { state: { filters: filtersToSend } });
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({
      filter: [],
      brand_ids: [],
      category_ids: [],
      price: [],
      style_ids: [],
    });
  };

  const getFilterName = (filterId, filterValue) => {
    switch (filterId) {
      case "category_ids":
        return categories.find((category) => category._id === filterValue)
          ?.name;
      case "style_ids":
        return styles.find((style) => style._id === filterValue)?.name;
      case "price":
        const { price_min, price_max } = filterValue;
        return `Từ ${price_min.toLocaleString()} đến ${
          price_max === Infinity ? "trên" : price_max.toLocaleString()
        } VND`;
      case "brand_ids":
        return brands.find((brand) => brand._id === filterValue)?.name;
      default:
        return null;
    }
  };

  // Danh sách các filter options
  const filterOptions = [
    // {
    //   id: "sortBy",
    //   label: "Bộ lọc",
    //   icon: true,
    //   items: ["Tất cả bộ lọc", "Đã lưu", "Xóa bộ lọc"],
    // },
    {
      id: "brand_ids",
      label: "Hãng",
      items: brands.map((brand) => ({
        name: brand.name,
        id: brand._id,
        image_url: brand.image_url,
      })),
    },
    {
      id: "category_ids",
      label: "Danh mục",
      items: categories.map((category) => ({
        name: category.name,
        id: category._id,
      })),
    },
    {
      id: "price",
      label: "Giá",
      items: [
        { name: "Dưới 1 triệu", price_min: 0, price_max: 1000000 },
        { name: "1-3 triệu", price_min: 1000000, price_max: 3000000 },
        { name: "3-5 triệu", price_min: 3000000, price_max: 5000000 },
        { name: "5-10 triệu", price_min: 5000000, price_max: 10000000 },
        { name: "Trên 10 triệu", price_min: 10000000, price_max: Infinity },
      ],
    },

    {
      id: "style_ids",
      label: "Phong cách",
      items: styles.map((style) => ({
        name: style.name,
        id: style._id,
      })),
    },
  ];

  return (
    <div className="ml-20 flex flex-wrap gap-2 p-4">
      <div className="flex gap-2 w-full mb-4">
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-1 rounded-full border border-gray-300 px-4 py-1.5 text-sm hover:border-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
            Bộ lọc
          </Button>
        </div>
        {filterOptions.map((option) => (
          <Menu as="div" key={option.id} className="relative">
            <Menu.Button
              className={`flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm hover:border-gray-400 ${
                selectedFilters[option.id]?.length > 0
                  ? "border-blue-500" // Nếu filter được chọn, border sẽ là xanh nước biển
                  : "border-gray-300" // Nếu không được chọn, border là xám
              }`}
            >
              {option.icon && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                  />
                </svg>
              )}
              {option.label}
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Menu.Button>

            <Menu.Items className="absolute z-10 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {option.items.map((item, index) => (
                  <Menu.Item key={item.id || item.name || index}>
                    {({ active }) => (
                      <Button
                        className={`${
                          active
                            ? "bg-gray-100 text-gray-900" // Khi mục đang active
                            : option.id === "price" &&
                              selectedFilters.price.some(
                                (filter) =>
                                  filter.price_min === item.price_min &&
                                  filter.price_max === item.price_max
                              ) // Kiểm tra nếu price được chọn
                            ? "border border-blue-500 text-blue-500" // Hiển thị viền xanh nếu đã chọn
                            : selectedFilters[option.id]?.includes(item.id) // Kiểm tra các filter khác
                            ? "border border-blue-500 text-blue-500"
                            : "text-gray-700" // Màu văn bản khi không được chọn
                        } flex items-center gap-2 block w-full px-4 py-2 text-left text-sm`}
                        onClick={() =>
                          handleFilterChange(option.id, item.name, item.id, {
                            price_min: item.price_min,
                            price_max: item.price_max,
                          })
                        }
                      >
                        {item.name}
                      </Button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        ))}

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSearch}
            className="flex items-center gap-1 rounded-full border border-gray-300 px-4 py-1.5 text-sm hover:border-gray-400"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
      {/* Selected Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.values(selectedFilters).flat().length > 0 && (
          <div className="text-sm font-semibold text-gray-700">Đã chọn:</div>
        )}
        {Object.keys(selectedFilters).map((key) =>
          selectedFilters[key].map((filter) => (
            <div
              key={filter}
              className="text-sm flex items-center gap-2 px-3 py-1 bg-gray-300 rounded-md"
            >
              <span>{getFilterName(key, filter)}</span>
              <button
                onClick={() => handleRemoveFilter(key, filter)}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                x
              </button>
            </div>
          ))
        )}
        {Object.values(selectedFilters).flat().length > 0 && (
          <button
            onClick={handleClearAllFilters}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Xóa tất cả
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterPills;
