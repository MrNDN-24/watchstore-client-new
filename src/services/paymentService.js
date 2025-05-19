import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/payment`;

export const momoPayment = async (order_id, total_price) => {
  try {
    const order = {
      order_id: order_id,
      total_amount: total_price,
    };
    const response = await axios.post(`${API_URL}/momo`, order);
    const data = response.data;
    // console.log(data);
    //   return Array.isArray(data.data) ? data.data : [];
    return data;
  } catch (error) {
    console.error("Lỗi khi thanh toán", error.message);
    throw error; // Ném lỗi để xử lý bên ngoài (nếu cần)
  }
};
