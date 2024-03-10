import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export default api;
