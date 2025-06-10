import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  deleteProductFromCart,
  updateCart,
} from "../../services/cartService";

// ✅ Lấy danh sách giỏ hàng từ server
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await getCart();
  return res.data.products;
});

// ✅ Thêm hoặc cập nhật sản phẩm trong giỏ hàng (gọi API updateCart)
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      const res = await updateCart(product_id, quantity);
      if (!res || !res.data || !res.data.products) {
        throw new Error("Không nhận được dữ liệu giỏ hàng từ server");
      }
      return res.data.products; // Trả về danh sách sản phẩm trong giỏ hàng
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Xoá sản phẩm khỏi giỏ hàng (gọi API)
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (product_id, { rejectWithValue }) => {
    try {
      await deleteProductFromCart(product_id);
      return product_id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // ✅ Xoá toàn bộ giỏ hàng khỏi state
    clearCart: (state) => {
      state.items = [];
    },
    // ✅ Cập nhật số lượng và tổng tiền của sản phẩm trong giỏ
    updateCartAmount: (state, action) => {
      const { productId, quantity, amount } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product_id._id === productId
      );
      if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.amount = amount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // Cập nhật toàn bộ giỏ hàng từ server
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.product_id._id !== action.payload
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ✅ Export action để sử dụng trong component
export const { clearCart, updateCartAmount } = cartSlice.actions;

// ✅ Export reducer để đưa vào store
export default cartSlice.reducer;
