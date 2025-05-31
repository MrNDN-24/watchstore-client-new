//Khách hàng
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/support-queue`;


// Xóa khách khỏi hàng chờ theo customerId
export const removeFromQueue = async (customerId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/${customerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // { message: "...", ... }
  } catch (error) {
    console.error("Error removing customer from queue:", error);
    throw error;
  }
};


