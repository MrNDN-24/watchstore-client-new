//Khách hàng
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/conversations`;

// Tạo cuộc hội thoại mới và thêm khách vào hàng chờ
export const createConversation = async (customerId) => {
  console.log("Sending customerId:", customerId); // <-- thêm dòng này debug
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/`,
      { customerId },  // phải có key customerId với giá trị
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};


// Đóng cuộc hội thoại, có thể gửi trạng thái resolved
export const closeConversation = async (conversationId, isResolved = false) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/close`,
      { conversationId, isResolved },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error closing conversation:", error);
    throw error;
  }
};


