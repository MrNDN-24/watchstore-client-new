import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import ProductDetailPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import StoreDetail from "./components/StoreDetail";
import { CartProvider } from "./context/CartContext";
import StoreDetailPage from "./pages/StoreDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import AddressPage from "./pages/AddressPage";
import ProductListingPage from "./pages/ProductListingPage";
import OrderPage from "./pages/OrderPage";
import VoucherPage from "./pages/VoucherPage";
import { ToastContainer } from "react-toastify";

import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/homepage" />} />{" "}
          {/* Chuyển hướng đến "/homepage" */}
          {/* <Route path="/login" element={<LoginPage2 />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/api/profile" element={<AccountPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<StoreDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/product" element={<ProductListingPage />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/voucher" element={<VoucherPage />} />
          <Route
            path="/reset_password/:id/:token"
            element={<ResetPassword />}
          />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
