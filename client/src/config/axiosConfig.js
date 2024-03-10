import axios from "axios";
import {
  showNetworkErrorAlert,
  showExpiredTokenAlert,
} from "../utils/SwalAlert";

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
      showNetworkErrorAlert();
    }
    if (error.response) {
      if (error.response.status === 403) {
        showExpiredTokenAlert(() => {
          window.location.href = `${process.env.PUBLIC_URL}/Login`;
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
