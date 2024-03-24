import axios from "axios";
import { showErrorAlertWithRefresh, showExpiredTokenAlert } from "../utils/SwalAlert";

const baseURL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error") {
      showErrorAlertWithRefresh("Network");
    }
    if (error.response) {
      if (error.response.status === 403) {
        showExpiredTokenAlert();
      }
      if (error.response.status === 500) {
        showErrorAlertWithRefresh("Internal Server");
      }
      if (error.response.status === 502) {
        showErrorAlertWithRefresh("Bad gateway");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
