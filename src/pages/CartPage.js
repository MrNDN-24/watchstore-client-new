import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../services/cartService";
import CartItem from "../components/CartItem";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import { useCart } from "../context/CartContext";

const CartPage = () => {
  const [cart, setCart] = useState();
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductTotal, setSelectedProductTotal] = useState(0);
  const [savingValue, setSavingValue] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);

  const [reload, setReload] = useState(false);

  // const { cartAmounts } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getCart();
        console.log("Cart data", data);
        const shouldNavigateToLogin =
          !data.success &&
          (!data.response ||
            (data.response.status !== 404 &&
              data.response.status !== undefined));

        if (shouldNavigateToLogin) {
          navigate("/login");
        } else {
          setCart(data);
          const ProductList = Array.isArray(data.data.products)
            ? data.data.products
            : [data.data.products];
          console.log("ProductList", ProductList);
          setProducts(ProductList);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [reload]);

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      const updatedSelected = prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId];
      let discountPrice = 0;
      let originalPrice = 0;
      // Tính toán tổng giá trị dựa trên giá trị mới
      const total = products
        .filter((product) => updatedSelected.includes(product.product_id)) // Lọc sản phẩm được chọn
        .reduce((sum, product) => {
          console.log("product:", product);
          const productAmount = product.quantity || 0;
          let productPrice = 0;
          if (product.product_id.discount_price === 0) {
            productPrice = product.product_id.price;
          } // Lấy số lượng, mặc định là 1
          else {
            productPrice = product.product_id.discount_price;
          }
          discountPrice = sum + productAmount * productPrice;
          originalPrice = sum + productAmount * product.product_id.price;
          return discountPrice; // Tính giá trị
        }, 0);
      console.log("Selected products:", selectedProducts);
      setOriginalTotal(originalPrice);
      setSavingValue(originalPrice - discountPrice);
      setSelectedProductTotal(total); // Cập nhật tổng giá trị ngay lập tức
      console.log("Total", selectedProductTotal);
      return updatedSelected; // Cập nhật selectedProducts
    });
  };

  const handleProceedToCheckout = () => {
    console.log("Proceed to checkout");
    const selectedProductDetails = products.filter((product) =>
      selectedProducts.includes(product.product_id)
    );
    navigate("/checkout", {
      state: { selectedProducts: selectedProductDetails },
    });
  };

  return (
    <div>
      <Navbar />
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Giỏ hàng
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                  {products.length > 0 ? (
                    products.map((product) => {
                      const isDisabled =
                        product.product_id.isDelete ||
                        !product.product_id.isActive;

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
                            onReload={() => setReload((prev) => !prev)}
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
                    <p className="text-center text-gray-500">
                      Bạn chưa có sản phẩm trong giỏ hàng.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Đơn hàng
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Giá gốc
                      </dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">
                        {originalTotal.toLocaleString("vi-VN")}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Giảm giá
                      </dt>
                      <dd className="text-base font-medium text-green-600">
                        {savingValue.toLocaleString("vi-VN")}
                      </dd>
                    </dl>
                  </div>

                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Tổng tiền
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      {selectedProductTotal.toLocaleString("vi-VN")}
                    </dd>
                  </dl>
                </div>
                <button
                  className="mt-6 flex w-full items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
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
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
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
