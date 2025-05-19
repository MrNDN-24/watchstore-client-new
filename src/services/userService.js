import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/user`;

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`);
  return response.data;
};

export const fetchUserData = async () => {
  const token = localStorage.getItem("token");
  // console.log("Day la token", token);
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(response.data);
    return response.data; // Giả sử API trả về thông tin user
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    return null;
  }
};

export const updateUser = async (userData) => {
  console.log("User update data", userData);
  const response = await axios.put(`${API_URL}/profile`, userData);
  // console.log("Du lieu phan hoi", response.data);
  const result = await response.data;
  return result;
};

export const uploadImage = async (file) => {
  try {
    const response = await axios.post(`${API_URL}/uploadfile`, file);
    console.log("image url response:", response.data);
    const result = await response.data;
    console.log("result", result);
    return result;
  } catch (error) {
    return error;
  }
};
