import { useEffect, useState } from "react";
import { getTopSellingProduct } from "../services/productService";
import { getSuitableDiscount } from "../services/discountService";

const ProductAdPanel = () => {
  const [product, setProduct] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const fetchAdData = async () => {
      const productData = await getTopSellingProduct();
      const discountData = await getSuitableDiscount();

      if (!productData) {
        console.error("Không tìm thấy sản phẩm.");
        return;
      }

      setProduct(productData.data);
      setDiscount(discountData?.data?.discount || null);
    };

    fetchAdData();
  }, []);

  if (!product || !showModal) return null;

  const calculateDiscountPercent = () => {
    if (!product?.price || !product?.discount_price) return null;
    const originalPrice = product.price;
    const discountPrice = product.discount_price;
    const discountValue = originalPrice - discountPrice;
    return Math.round((discountValue / originalPrice) * 100);
  };

  const discountPercent = calculateDiscountPercent();

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setShowModal(false)}
      />

      <div className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold z-10"
          aria-label="Close"
        >
          &times;
        </button>

        <div
          className="cursor-pointer relative"
          onClick={() => window.open(`/product/${product._id}`, "_blank")}
        >
          {/* Hiển thị phần trăm giảm giá nếu có */}
          {discountPercent && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">
              -{discountPercent}%
            </div>
          )}

          <img
            src={product.image_url || "/default.jpg"}
            alt={product.name}
            className="w-full max-h-60 object-contain bg-white rounded-t-xl"
          />

          <div className="p-5 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600">{product.description}</p>

            {/* Chỉ hiển thị nếu có mã giảm giá */}
            {discount && (
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl px-5 py-4 shadow-lg space-y-2">
                <div className="text-lg font-extrabold tracking-wide flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span>
                    🔥 Giảm đến{" "}
                    <span className="text-2xl">
                      {discount.discountValue.toLocaleString("vi-VN")}đ
                    </span>
                  </span>
                  <span className="bg-white text-orange-500 px-4 py-2 text-sm font-bold rounded-md shadow">
                    {discount.code}
                  </span>
                </div>
                <p className="text-xs italic text-white">
                  HSD: {new Date(discount.expirationDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <button className="w-full bg-black text-white py-3 rounded-lg font-semibold text-base hover:bg-gray-800 transition">
              MUA NGAY
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductAdPanel;
