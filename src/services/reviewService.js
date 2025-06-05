import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/review`;

export const getProductReviews = async (page_number, limit, productId) => {
  const queryParams = {
    page: page_number,
    limit: limit,
  };

  const response = await axios.get(`${API_URL}/${productId}`, {
    params: queryParams, // Thêm query parameters vào request
  });
  const data = response.data;
  // console.log(data);
  //   return Array.isArray(data.data) ? data.data : [];
  return data;
};

export const addReview = async (order_id, rating, comment, product_id) => {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "Bạn chưa đăng nhập." };

  try {
    const response = await axios.post(
      `${API_URL}`,
      {
        order_id,
        rating,
        comment,
        product_id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Review added successfully", response.data);
    return { success: true, data: response.data.review };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error("Error adding review", message);
    return { success: false, message };
  }
};

