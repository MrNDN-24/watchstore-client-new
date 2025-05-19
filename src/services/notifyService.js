import axios from "axios";

export const getNotifications = (userId) => {
  return axios.get(`/api/notifications/${userId}`);
};
