import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/comment`;

export const getCommentsByBlogId = async (blogId) => {
  const res = await axios.get(`${API_URL}/${blogId}`);
  return res.data;
};

export const postComment = async (commentData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token không tồn tại. Người dùng cần đăng nhập lại.");
    return { success: false, message: "Người dùng chưa đăng nhập." };
  }

  try {
    const response = await axios.post(API_URL, commentData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Bình luận mới đã gửi thành công:", response.data);

    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Lỗi khi gửi bình luận:", error);

    if (error.response?.status === 401) {
      return {
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
      };
    }

    return {
      success: false,
      message: "Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.",
    };
  }
};
