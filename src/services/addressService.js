import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/address`;

export const getUserAddress = async () => {
  const token = localStorage.getItem("token");
  // console.log("Day la token", token);
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(response.data);
    return response.data; // Giả sử API trả về thông tin user
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ người dùng:", error);
    return null;
  }
};

export const updateAddress = async (address) => {
  const token = localStorage.getItem("token");
  // console.log("Day la token", token);
  if (!token) return null;

  const response = await axios.put(
    `${API_URL}`, // Thay bằng URL API thực tế
    address,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    }
  );

  // const response = await axios.put(`${API_URL}`, address);
  console.log("Du lieu phan hoi", response.data);
  const result = await response.data;
  return result;
};
