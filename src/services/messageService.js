//Khách hàng
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/messages`;

// Gửi tin nhắn mới
export const sendMessage = async ({
  conversationId,
  senderId,
  receiverId,
  senderRole,
  message,
  isBot = false,
}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/`,
      { conversationId, senderId, receiverId, senderRole, message, isBot },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Lấy danh sách tin nhắn theo conversationId
export const getMessagesByConversation = async (conversationId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};


