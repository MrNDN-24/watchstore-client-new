import React, { useState, useEffect } from "react";
import { Button, Menu } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { getAllStyle } from "../services/styleService";
import { getAllCategory } from "../services/categoryService";
import { getBrands } from "../services/brandService";
import { useNavigate } from "react-router-dom";

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
        const [fetchedStyles, fetchedCategories, fetchedBrands] =
          await Promise.all([getAllStyle(), getAllCategory(), getBrands()]);
        setStyles(fetchedStyles.data);
        setCategories(fetchedCategories.data);
        setBrands(fetchedBrands);
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
        newFilters[filterId] = [extraData];
      } else {
        newFilters[filterId] = filterValues.includes(id)
          ? filterValues.filter((item) => item !== id)
          : [...filterValues, id];
      }

      return newFilters;
    });
  };

  const handleRemoveFilter = (filterId, id) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [filterId]: prevState[filterId].filter((item) => item !== id),
    }));
  };

  const handleSearch = () => {
    const filtersToSend = {
      ...selectedFilters,
      price: selectedFilters.price[0] || {},
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
        return categories.find((c) => c._id === filterValue)?.name;
      case "style_ids":
        return styles.find((s) => s._id === filterValue)?.name;
      case "price":
        const { price_min, price_max } = filterValue;
        return `Từ ${price_min.toLocaleString()} đến ${
          price_max === Infinity ? "trên" : price_max.toLocaleString()
        } VND`;
      case "brand_ids":
        return brands.find((b) => b._id === filterValue)?.name;
      default:
        return null;
    }
  };

  const filterOptions = [
    {
      id: "brand_ids",
      label: "Hãng",
      items: brands.map((b) => ({
        name: b.name,
        id: b._id,
      })),
    },
    {
      id: "category_ids",
      label: "Danh mục",
      items: categories.map((c) => ({
        name: c.name,
        id: c._id,
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
      items: styles.map((s) => ({
        name: s.name,
        id: s._id,
      })),
    },
  ];

  return (
    <div className="ml-20 flex flex-wrap gap-2 p-4 dark:text-white">
      <div className="flex gap-2 w-full mb-4">
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-1 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-1.5 text-sm hover:border-gray-400 dark:hover:border-gray-400">
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
              className={`flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm hover:border-gray-400 dark:hover:border-gray-400 ${
                selectedFilters[option.id]?.length > 0
                  ? "border-blue-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              {option.label}
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-300" />
            </Menu.Button>

            <Menu.Items className="absolute z-10 mt-2 w-48 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {option.items.map((item, index) => (
                  <Menu.Item key={item.id || item.name || index}>
                    {({ active }) => {
                      const isSelected =
                        option.id === "price"
                          ? selectedFilters.price.some(
                              (f) =>
                                f.price_min === item.price_min &&
                                f.price_max === item.price_max
                            )
                          : selectedFilters[option.id]?.includes(item.id);

                      return (
                        <Button
                          className={`${
                            active
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                              : isSelected
                              ? "border border-blue-500 text-blue-500"
                              : "text-gray-700 dark:text-gray-300"
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
                      );
                    }}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        ))}

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSearch}
            className="flex items-center gap-1 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-1.5 text-sm hover:border-gray-400 dark:hover:border-gray-400"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* Selected Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.values(selectedFilters).flat().length > 0 && (
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Đã chọn:
          </div>
        )}
        {Object.keys(selectedFilters).map((key) =>
          selectedFilters[key].map((filter) => (
            <div
              key={JSON.stringify(filter)}
              className="text-sm flex items-center gap-2 px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded-md"
            >
              <span>{getFilterName(key, filter)}</span>
              <button
                onClick={() => handleRemoveFilter(key, filter)}
                className="text-sm text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
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
