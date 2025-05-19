import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/discount`;

export const validateDiscountForUser = async (discountCode) => {
  const token = localStorage.getItem("token");
  // console.log("Day la token", token);
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/${discountCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Check voucher", response);
    return response.data; // Giả sử API trả về thông tin user
  } catch (error) {
    console.error("Lỗi khi lấy mã giảm giá người dùng:", error);
    return null;
  }
};

export const getDiscounts = async () => {
  const token = localStorage.getItem("token"); // ✅ Thêm token

  if (!token) {
    console.error("Không tìm thấy token");
    return null;
  }

  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách mã giảm giá:", error);
    return null;
  }
};