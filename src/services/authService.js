import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/auth`;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const loginUserWithGoogle = async (googleToken) => {
  if (!googleToken) {
    throw new Error("Google token is missing");
  }
  const response = await axios.post(`${API_URL}/google-login`, {
    token: googleToken,
  });
  return response.data;
};

export const loginWithFacebook = async (accessToken) => {
   if (!accessToken) {
    throw new Error("FB token is missing");
  }
  const response = await axios.post(`${API_URL}/facebook-login`, {
    token:accessToken,
  });
  return response.data;
};


export const forgotpassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgotpassword`, {
    email: email,
  });
  return response;
};

export const resetPassword = async (id, token, newPassword) => {
  // const apiUrl = `/reset_password/${id}/${token}`;

  try {
    const response = await fetch(`${API_URL}/reset_password/${id}/${token}`, {
      method: "POST", // Phương thức POST
      headers: {
        "Content-Type": "application/json", // Dữ liệu gửi đi là JSON
      },
      body: JSON.stringify({ password: newPassword }), // Body gửi mật khẩu mới
    });

    if (!response.ok) {
      // Nếu server trả lỗi (HTTP status >= 400)
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset password.");
    }

    const data = await response.json();
    console.log("Password reset successful:", data);
    return data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};
