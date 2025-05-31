import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_CLIENT;
const API_URL = `${API_BASE_URL}/notifications`;

export const getNotifications = (userId) => {
  return axios.get(`${API_URL}/${userId}`);
};

export const markAsRead = (id) => {
  return axios.put(`${API_URL}/${id}/read`);
};

export const markAllAsRead = (userId) => {
  return axios.put(`${API_URL}/${userId}/mark-all-read`);
};
