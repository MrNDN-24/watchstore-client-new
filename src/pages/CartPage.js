import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import CartItem from "../components/CartItem";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, status } = useSelector((state) => state.cart);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductTotal, setSelectedProductTotal] = useState(0);
  const [savingValue, setSavingValue] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    let discountPrice = 0;
    let originalPrice = 0;

    products
      .filter((product) => selectedProducts.includes(product.product_id))
      .forEach((product) => {
        const qty = product.quantity || 0;
        const original = product.product_id.price;
        const discounted =
          product.product_id.discount_price === 0 ||
          product.product_id.discount_price == null
            ? product.product_id.price
            : product.product_id.discount_price;

        originalPrice += qty * original;
        discountPrice += qty * discounted;
      });

    setOriginalTotal(originalPrice);
    setSavingValue(originalPrice - discountPrice);
    setSelectedProductTotal(discountPrice);
  }, [products, selectedProducts]);

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      const updatedSelected = prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId];

      let discountPrice = 0;
      let originalPrice = 0;

      const total = products
        .filter((product) => updatedSelected.includes(product.product_id))
        .reduce((sum, product) => {
          const qty = product.quantity || 0;
          const discounted =
            product.product_id.discount_price === 0
              ? product.product_id.price
              : product.product_id.discount_price;
          discountPrice = sum + qty * discounted;
          originalPrice = sum + qty * product.product_id.price;
          return discountPrice;
        }, 0);

      setOriginalTotal(originalPrice);
      setSavingValue(originalPrice - discountPrice);
      setSelectedProductTotal(total);

      return updatedSelected;
    });
  };

  const handleProceedToCheckout = () => {
    const selectedDetails = products.filter((product) =>
      selectedProducts.includes(product.product_id)
    );
    navigate("/checkout", {
      state: { selectedProducts: selectedDetails },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <Navbar />
      <section className="py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold sm:text-2xl dark:text-white">
            Giỏ hàng
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                  {status === "loading" ? (
                    <p>Đang tải...</p>
                  ) : products.length > 0 ? (
                    products.map((product) => {
                      const isDisabled =
                        product.product_id.isDelete ||
                        !product.product_id.isActive ||
                        product.product_id.stock === 0;

                      return (
                        <div
                          key={product._id}
                          className={`flex items-center gap-4 ${
                            isDisabled ? "opacity-50" : ""
                          }`}
                        >
                          <CartItem
                            product={product.product_id}
                            quantity={product.quantity}
                          />
                          <input
                            type="checkbox"
                            className="w-5 h-5"
                            onChange={() =>
                              handleCheckboxChange(product.product_id)
                            }
                            checked={selectedProducts.includes(
                              product.product_id
                            )}
                            disabled={isDisabled}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Bạn chưa có sản phẩm trong giỏ hàng.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold dark:text-white">
                  Đơn hàng
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-white">
                        Giá gốc
                      </dt>
                      <dd>{originalTotal.toLocaleString("vi-VN")}</dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-white">
                        Giảm giá
                      </dt>
                      <dd className="text-base font-medium text-green-600 dark:text-white">
                        {savingValue.toLocaleString("vi-VN")}
                      </dd>
                    </dl>
                  </div>
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold">Tổng tiền</dt>
                    <dd className="text-base font-bold">
                      {selectedProductTotal.toLocaleString("vi-VN")}
                    </dd>
                  </dl>
                </div>
                <button
                  className="mt-6 flex w-full items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleProceedToCheckout}
                  disabled={selectedProducts.length === 0}
                >
                  Thanh toán
                </button>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    hoặc
                  </span>
                  <a
                    href="/product"
                    className="text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                  >
                    Tiếp tục mua sắm
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CartPage;
