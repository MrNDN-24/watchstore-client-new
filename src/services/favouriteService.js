import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const FAVOURITE_API_URL = `${API_BASE_URL}/favourite`;

// Hàm lấy token từ localStorage và trả về header Authorization
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
};

// Lấy danh sách sản phẩm yêu thích của user
export const getFavourites = async () => {
  const headers = getAuthHeaders();
  if (!headers) return null;

  try {
    const response = await axios.get(FAVOURITE_API_URL, { headers });
    // Trả về toàn bộ data (có thể là mảng danh sách sản phẩm)

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu thích:", error);
    return null;
  }
};

// Thêm sản phẩm vào danh sách yêu thích
export const addFavourite = async (productId) => {
  if (!productId) return { success: false, data: null };

  const headers = getAuthHeaders();
  if (!headers) return { success: false, data: null };

  try {
    const response = await axios.post(
      `${FAVOURITE_API_URL}/${productId}`,
      {},
      { headers }
    );
    return {
      success: response.data?.success ?? true,
      data: response.data,
    };
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào yêu thích:", error);
    return { success: false, data: null };
  }
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFavourite = async (productId) => {
  if (!productId) return { success: false, data: null };

  const headers = getAuthHeaders();
  if (!headers) return { success: false, data: null };

  try {
    const response = await axios.delete(`${FAVOURITE_API_URL}/${productId}`, {
      headers,
    });
    return {
      success: response.data?.success ?? true,
      data: response.data,
    };
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi yêu thích:", error);
    return { success: false, data: null };
  }
};
