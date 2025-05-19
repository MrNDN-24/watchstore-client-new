import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/order`;

export const createOrder = async (order) => {
  console.log("Create order", order);
  const response = await axios.post(`${API_URL}`, order);
  const data = response.data;
  console.log(data);
  //   return Array.isArray(data.data) ? data.data : [];
  return data;
};

// export const getOrder = async () => {
//   const token = localStorage.getItem("token");
//   // console.log("Day la token", token);
//   if (!token) return null;

//   try {
//     const response = await axios.get(`${API_URL}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log("Order data", response.data);
//     return response.data; // Giả sử API trả về thông tin cart
//   } catch (error) {
//     console.error("Lỗi khi lấy dữ liệu Order:", error);
//     return null;
//   }
// };

export const cancelOrder = async (orderId) => {
  const response = await axios.delete(`${API_URL}/${orderId}`, orderId);
  const data = response.data;
  console.log(data);
  //   return Array.isArray(data.data) ? data.data : [];
  return data;
};

export const getOrder = async (deliveryStatus) => {
  const token = localStorage.getItem("token");

  const query = deliveryStatus ? { deliveryStatus } : {};
  // console.log("Day la token", token);
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: query, // Axios tự động thêm query string vào URL
    });
    console.log("Order data", response.data);
    return response.data; // Giả sử API trả về thông tin order
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu Order:", error);
    return null;
  }
};
