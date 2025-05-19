import React from "react";
import { getBrands } from "../services/brandService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleBrandClick = (brandId) => {
    // Điều hướng tới trang sản phẩm với filter brand_id
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading1-bold text-4xl font-extrabold ">Thương hiệu</p>
      {!Brands || brands.length === 0 ? (
        <p className="text-body-bold">Không tìm thấy thương hiệu</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-8">
          {brands.map((brand) => (
            <div
              key={brand._id}
              onClick={() => handleBrandClick(brand._id)}
              className="cursor-pointer"
            >
              <img
                src={brand.image_url}
                alt={brand.name}
                className="rounded-lg h-[60px] object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Brands;
