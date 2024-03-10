import axios from "axios";
import {
  showErrorAlert,
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
      showErrorAlert("Network");
    }
    if (error.response) {
      if (error.response.status === 403) {
        showExpiredTokenAlert(() => {
          window.location.href = `${process.env.PUBLIC_URL}/Login`;
        });
      }
      if (error.response.status === 500) {
        showErrorAlert("Internal Server");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
