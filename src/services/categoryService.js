import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/category`;
export const getAllCategory = async () => {
  const response = await axios.get(`${API_URL}`);
  const data = response.data;
  console.log(data);
  //   return Array.isArray(data.data) ? data.data : [];
  return data;
};
