import axios from "axios";
import qs from "qs"; // Import thư viện qs

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/product`;

export const getProductById = async (productId) => {
  const response = await axios.get(`${API_URL}/${productId}`, productId);
  const data = response.data;
  // console.log("Product Response", data);
  //   return Array.isArray(data.data) ? data.data : [];
  return data;
};

export const getProductImages = async (productId) => {
  const response = await axios.get(`${API_URL}/images/${productId}`, productId);
  const data = response.data;
  // console.log(data);
  return Array.isArray(data.data) ? data.data : [];
  // return data;
};
// --- API mới cho chatbot: lấy tất cả sản phẩm không phân trang ---
export const getProductChatBot = async () => {
  try {
    const response = await axios.get(`${API_URL}/chatbot`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm chatbot:", error.message || error);
    return null;
  }
};

export const getProducts = async (page_number, limit, filters) => {
  try {
    // Tạo query string từ filters
    const queryParams = {
      page: page_number,
      limit: limit,
      ...filters,
    };

    const queryString = qs.stringify(queryParams, { encode: false }); // Tạo query string

    // console.log("Query string:", queryString);

    const response = await fetch(`${API_URL}?${queryString}`, {
      method: "GET",
    });

    const data = await response.json();

    // console.log("Response", data);

    return data;

    // const data = await response.json();

    // if (data.success) {
    //   console.log("Dữ liệu sản phẩm lấy thành công:", data.message);
    //   return data; // Trả về dữ liệu thực tế
    // } else {
    //   console.warn("Có lỗi xảy ra:", data?.message || "Không rõ nguyên nhân.");
    //   return null;
    // }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu Product:", error.message || error);
    return null; // Trả về null nếu xảy ra lỗi
  }
};
