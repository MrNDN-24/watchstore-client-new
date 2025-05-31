import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/blog`;

export const getBlogs = async (search, page, limit) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        search: search || "",
        page,
        limit,
      },
    });
    const data = response.data;
    console.log("Fetched blogs:", data);
    if (!data || !data.success) {
      console.error("Failed to fetch blogs:", data);
      return [];
    }
    return data;
    // return Array.isArray(data.content) ? data.content : [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách blog:", error);
    return [];
  }
};

export const getBlogById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
