// CartContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { getCart } from "../services/cartService";

// Tạo Context cho giỏ hàng
const CartContext = createContext();

// Tạo CartProvider để lưu và quản lý trạng thái
export const CartProvider = ({ children }) => {
  // Trạng thái lưu trữ amount của từng sản phẩm, với mỗi sản phẩm có ID riêng
  const [cartAmounts, setCartAmounts] = useState({});

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const data = await getCart();
        console.log("Cart:", data.data);
        const ProductList = Array.isArray(data.data.products)
          ? data.data.products
          : [data.data.products];
        console.log("ProductList", ProductList);
        setCartItems(ProductList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchCarts();
  }, []);

  

  // // Cập nhật lại mỗi khi cartItems thay đổi
  useEffect(() => {
    getCartItemCount();
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      console.log("Add to cart");
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const getCartItemCount = () => {
    const uniqueItems = new Set(cartItems.map((item) => item._id));
    return uniqueItems.size;
  };

  // Hàm cập nhật `amount` của một sản phẩm dựa trên productId
  const updateCartAmount = (productId, amount) => {
    setCartAmounts((prevAmounts) => ({
      ...prevAmounts,
      [productId]: amount,
    }));
  };

  // Truyền `cartAmounts` và `updateCartAmount` xuống các component con
  return (
    <CartContext.Provider
      value={{
        cartAmounts,
        updateCartAmount,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook để sử dụng CartContext ở các component khác
export const useCart = () => useContext(CartContext);
