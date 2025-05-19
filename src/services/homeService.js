import axios from "axios";



const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/homepage`;

export const getProducts = async (page_number, limit_number) => {
  const response = await axios.get(`${API_URL}`, {
    params: { page: page_number, limit: limit_number }, // Truyền query params `page` và `limit`
  });
  console.log("limit", limit_number); // Log giá trị limit
  const data = response.data;
  return data;
};

export const getProductImages = async (productId) => {
  const response = await axios.get(`${API_URL}/${productId}`, productId);
  const data = response.data;
  // console.log(data);
  return Array.isArray(data.data) ? data.data : [];
  // return data;
};
