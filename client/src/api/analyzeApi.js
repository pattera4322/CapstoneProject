import api from "../config/axiosConfig";

const baseURL = process.env.REACT_APP_API_URL;
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

export const analyzeData = async (fileId) => {
  try {
    const response = await api.post(
      `/analyze/${user.uid}/${fileId}`,
      {}
    );
    console.log("Analyze Data...");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQueues = async () => {
  try {
    const response = await api.get(`/queues/${user.uid}`);
    console.log("Get queues..");
    return response.data;
  } catch (error) {
    throw error;
  }
};