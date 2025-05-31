import React, { useEffect, useState } from "react";
import { getBrands } from "../services/brandService";
import { useNavigate } from "react-router-dom";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleBrandClick = (brandId) => {
    navigate("/product", { state: { filters: { brand_ids: [brandId] } } });
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-500">
      <p className="text-4xl font-extrabold dark:text-white">Thương hiệu</p>

      {loading ? (
        <p className="text-body-bold">Đang tải...</p>
      ) : brands.length === 0 ? (
        <p className="text-body-bold">Không tìm thấy thương hiệu</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-8">
          {brands.map((brand) => (
            <div
              key={brand._id}
              onClick={() => handleBrandClick(brand._id)}
              className="cursor-pointer bg-white-100 dark:bg-white p-2 rounded-lg shadow hover:scale-105 transition-transform"
            >
              <img
                src={brand.image_url}
                alt={brand.name}
                className="h-[60px] w-[120px] object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Brands;
