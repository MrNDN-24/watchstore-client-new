import { React, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchUserData } from "../services/userService";
import CheckOutItem from "../components/CheckOutItem";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { toast, ToastContainer } from "react-toastify";
import { validateDiscountForUser } from "../services/discountService";
import "react-toastify/dist/ReactToastify.css";
import { momoPayment } from "../services/paymentService";

const CheckoutPage = () => {
  const [user, setUser] = useState();
  const [address, setAddress] = useState();
  const [isLoading, setLoading] = useState(true);
  const [voucherCode, setVoucherCode] = useState(""); // Mã giảm giá
  const [discountAmount, setDiscountAmount] = useState(0); // Giá trị giảm giá
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("Cash on Delivery"); // Mặc định là "Thanh toán khi nhận hàng"
  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const [addressSelectionMethod, setAddressSelectionMethod] =
    useState("custom");
  const [customAddress, setCustomAddress] = useState({
    addressLine: "",
    ward: "",
    district: "",
    city: "",
  });

  const navigate = useNavigate();

  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts || [];

  const totalAmount = selectedProducts.reduce((total, product) => {
    const priceToUse =
      product.product_id.discount_price > 0
        ? product.product_id.discount_price
        : product.product_id.price;
    return total + priceToUse * product.quantity;
  }, 0);

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    try {
      const data = await validateDiscountForUser(voucherCode);
      if (data) {
        console.log("Mã giảm giá:", data);
        setDiscountAmount(data.discount.discountValue);
      } else {
        toast.error("Mã giảm giá không hợp lệ");
      }
    } catch (error) {
      console.error("Error validating voucher:", error);
    }
  };

  const handlePlaceOrder = async () => {
    // console.log("Cờ address", addressSelectionMethod);
    // if (addressSelectionMethod === "custom" && !customAddress) {
    //   toast.error("Địa chỉ không được để trống. Vui lòng nhập địa chỉ.");
    //   return; // Dừng hàm nếu không có địa chỉ
    // }
    if (
      (addressSelectionMethod === "default" && !address) || // Nếu chọn địa chỉ mặc định nhưng không có địa chỉ
      (addressSelectionMethod === "custom" &&
        (!customAddress.addressLine || // Kiểm tra trường addressLine
          !customAddress.ward || // Kiểm tra trường ward
          !customAddress.district || // Kiểm tra trường district
          !customAddress.city)) // Kiểm tra trường city
    ) {
      toast.error(
        "Địa chỉ không được để trống. Vui lòng nhập đầy đủ thông tin địa chỉ."
      );
      setLoading(false); // Đảm bảo dừng loading
      return; // Dừng hàm nếu không có địa chỉ
    }
    try {
      setLoading(true);
      const orderData = {
        user_id: user._id,
        products: selectedProducts.map((item) => ({
          product_id: item.product_id._id,
          quantity: item.quantity,
        })),
        total_price: totalAmount - discountAmount,
        address_id: address?._id,
        customAddress: customAddress,
        deliveryStatus: "Chờ xử lý",
        isActive: true,
        isDelete: false,
        isAddressDefault: addressSelectionMethod === "default",
        payment_method: selectedPaymentMethod,
        discountCode: discountAmount !== 0 ? voucherCode : null,
      };

      // Gọi hàm createOrder từ service
      const response = await createOrder(orderData);
      console.log("Order created:", response.order._id);
      if (selectedPaymentMethod === "Cash on Delivery") {
        toast.success("Đặt hàng thành công");
        // Điều hướng hoặc hiển thị thông báo thành công
        setTimeout(() => {
          navigate("/order", { state: { orderId: response._id } });
        }, 5000); // Đợi 10 giây (10000 milliseconds)
      } else if (selectedPaymentMethod === "Bank Transfer") {
        const momoResponse = await momoPayment(
          response.order._id,
          response.order.total_price
        );
        // console.log("Momo response", momoResponse.data.payUrl);
        if (momoResponse.data.resultCode === 0) {
          const payUrl = momoResponse.data.payUrl;
          // console.log("Pay url", payUrl);
          window.location.href = payUrl;
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.");
    }
  };

  const handleInputChange = () => {
    setIsAddressChanged(true);
    // console.log("FlaisAddressChanged)
  };

  useEffect(() => {
    const getAddress = async () => {
      // console.log("Ham lay user profile");
      const userData = await fetchUserData();
      if (userData) {
        console.log("Address", userData);
        setUser(userData);
        setAddress(userData.address_id);
        setLoading(false);
      } else {
        // navigate("/login"); // Chuyển đến trang đăng nhập nếu không có token hợp lệ
      }
    };
    getAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddressMethodChange = (method) => {
    setAddressSelectionMethod(method);
  };

  const handleCustomAddressChange = (e) => {
    const { name, value } = e.target;
    setCustomAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      {/* Main Content */}
      {user && (
        <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
          {/* Left Section */}
          <div className="px-4 pt-8">
            <p className="text-xl font-medium">Thông tin đơn hàng</p>
            <p className="text-gray-400">
              Kiểm tra thông tin đơn hàng và áp mã giảm giá
            </p>
            <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
              {/* Product Item */}
              {selectedProducts.map((product) => (
                <CheckOutItem
                  key={product._id}
                  product={product.product_id}
                  quantity={product.quantity}
                />
              ))}

              {/* More items... */}
            </div>
            <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <form className="space-y-4" onSubmit={handleApplyVoucher}>
                <div>
                  <label
                    htmlFor="voucher"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Áp dụng mã giảm giá tại đây
                  </label>
                  <input
                    type="text"
                    id="voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                    placeholder=""
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800"
                >
                  Sử dụng
                </button>
              </form>
            </div>
            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  Tổng tiền hàng:
                </p>
                <p className="font-semibold text-gray-900">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Giảm giá:</p>
                <p className="font-semibold text-gray-900">
                  {discountAmount.toLocaleString("vi-VN")}đ
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  Phí vận chuyển
                </p>
                <p className="font-semibold text-gray-900">Miễn phí</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                Tổng tiền thanh toán
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {(totalAmount - discountAmount).toLocaleString("vi-VN")}đ
              </p>
            </div>
            <button
              className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
              onClick={handlePlaceOrder}
            >
              Thanh toán
            </button>
          </div>

          {/* Right Section */}
          <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl font-medium">Thông tin giao hàng</p>
            <p className="text-gray-400">
              Hoàn thiện thông tin giao hàng của bạn.
            </p>
            <div>
              {/* Trong phần Right Section */}
              <form>
                <label
                  htmlFor="name"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Họ và tên
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={user?.name}
                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Họ và tên"
                  />
                </div>

                <label
                  htmlFor="phone"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Số điện thoại
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={user?.phone}
                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Số điện thoại"
                  />
                </div>

                <p className="text-xl font-medium">Địa chỉ giao hàng</p>
                <p className="text-gray-400 mb-4">Chọn địa chỉ giao hàng</p>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      className="peer hidden"
                      id="default-address"
                      type="radio"
                      name="addressMethod"
                      value="default"
                      checked={addressSelectionMethod === "default"}
                      onChange={() => handleAddressMethodChange("default")}
                      disabled={!address}
                    />
                    <label
                      className="peer-checked:border-2 peer-checked:border-blue-600 peer-checked:bg-blue-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                      htmlFor="default-address"
                    >
                      <div className="ml-5">
                        <span className="mt-2 font-semibold">
                          Sử dụng địa chỉ mặc định
                        </span>
                        {addressSelectionMethod === "default" && (
                          <div className="mt-2 text-sm text-gray-600">
                            {address?.addressLine}, {address?.ward},{" "}
                            {address?.district}, {address?.city}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      className="peer hidden"
                      id="custom-address"
                      type="radio"
                      name="addressMethod"
                      value="custom"
                      checked={addressSelectionMethod === "custom"}
                      onChange={() => handleAddressMethodChange("custom")}
                    />
                    <label
                      className="peer-checked:border-2 peer-checked:border-blue-600 peer-checked:bg-blue-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                      htmlFor="custom-address"
                    >
                      <div className="ml-5">
                        <span className="mt-2 font-semibold">
                          Nhập địa chỉ mới
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <label
                  htmlFor="address"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Địa chỉ
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="addressLine"
                    name="addressLine"
                    value={
                      addressSelectionMethod === "default"
                        ? address?.addressLine
                        : customAddress.addressLine
                    }
                    onChange={
                      addressSelectionMethod === "custom"
                        ? handleCustomAddressChange
                        : undefined
                    }
                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Địa chỉ"
                  />
                </div>
                <label
                  htmlFor="ward"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Phường
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="ward"
                    name="ward"
                    value={
                      addressSelectionMethod === "default"
                        ? address?.ward
                        : customAddress.ward
                    }
                    onChange={
                      addressSelectionMethod === "custom"
                        ? handleCustomAddressChange
                        : undefined
                    }
                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Phường"
                  />
                </div>
                <label
                  htmlFor="district"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Quận/huyện
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={
                      addressSelectionMethod === "default"
                        ? address?.district
                        : customAddress.district
                    }
                    onChange={
                      addressSelectionMethod === "custom"
                        ? handleCustomAddressChange
                        : undefined
                    }
                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Quận/huyện"
                  />
                </div>
                <label
                  htmlFor="city"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Tỉnh/thành phố
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={
                      addressSelectionMethod === "default"
                        ? address?.city
                        : customAddress.city
                    }
                    onChange={
                      addressSelectionMethod === "custom"
                        ? handleCustomAddressChange
                        : undefined
                    }
                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Tỉnh/thành phố"
                  />
                </div>

                {/* <button
                  type="submit"
                  className="mt-4 w-full rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Cập nhật địa chỉ
                </button> */}
              </form>
              {/* Card Details and other input fields */}
              <p class="mt-8 text-lg font-medium">Hình thức thanh toán</p>
              <form class="mt-5 mb-10 grid gap-6">
                <div class="relative">
                  <input
                    className="peer hidden"
                    id="radio_1"
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={selectedPaymentMethod === "Cash on Delivery"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  />
                  <span class="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    class="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    for="radio_1"
                  >
                    <div class="ml-5">
                      <span class="mt-2 font-semibold">
                        Thanh toán khi nhận hàng
                      </span>
                    </div>
                  </label>
                </div>
                <div class="relative">
                  <input
                    className="peer hidden"
                    id="radio_2"
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer"
                    checked={selectedPaymentMethod === "Bank Transfer"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  />
                  <span class="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    class="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    for="radio_2"
                  >
                    <div class="ml-5">
                      <span class="mt-2 font-semibold">
                        Thanh toán bằng Momo
                      </span>
                    </div>
                  </label>
                </div>
              </form>
              {/* <!-- Total --> */}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CheckoutPage;
