import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/cart`;
// export const getCart = async (cartId) => {
//   const token = localStorage.getItem("token");
//   // console.log("Day la token", token);
//   if (!token) return null;

//   try {
//     const response = await axios.get(`${API_URL}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log("Cart data", response.data);
//     return response.data; // Giả sử API trả về thông tin cart
//   } catch (error) {
//     console.error("Lỗi khi lấy dữ liệu người dùng:", error);
//     return null;
//   }
//   //   const response = await axios.post(`${API_URL}`, cartId);
//   //   console.log("Cart data:", cartId);
//   //   return response.data;
// };

export const getCart = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token không tồn tại. Người dùng cần đăng nhập lại.");
    return { success: false, message: "Người dùng chưa đăng nhập." };
  }

  try {
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Dữ liệu giỏ hàng nhận được:", response.data);

    return { success: true, data: response.data.data }; // Trả về dữ liệu giỏ hàng nếu thành công
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);

    if (error.response?.status === 401) {
      return {
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
      };
    }

    if (error.response?.status === 404) {
      return {
        success: true,
        message: "Không tìm thấy giỏ hàng",
        response: error.response,
      };
    }

    return {
      success: false,
      message: "Có lỗi xảy ra khi lấy dữ liệu giỏ hàng. Vui lòng thử lại.",
    };
  }
};

export const fetchUserData = async () => {
  const token = localStorage.getItem("token");
  // console.log("Day la token", token);
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    return response; // Giả sử API trả về thông tin user
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    return null;
  }
};

export const updateCart = async (product_id, quantity) => {
  const token = localStorage.getItem("token");
  // console.log("Day la token", token);
  if (!token) return null;

  try {
    const response = await axios.put(
      `${API_URL}`,
      {
        product_id,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Cart data", response.data);
    return response.data; // Giả sử API trả về thông tin cart
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
    return null;
  }
};

export const deleteProductFromCart = async (product_id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return null;
  }

  try {
    const response = await axios.delete(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
      data: { product_id }, // Truyền product_id trong body
    });

    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error.message);
    throw error; // Ném lỗi để xử lý bên ngoài (nếu cần)
  }
};
