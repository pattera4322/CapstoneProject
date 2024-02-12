import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;
// axios.defaults.timeout = 300000
const user = JSON.parse(localStorage.getItem("user"));

export const enqueueData = async (fileId, userData) => {
  try {
    const response = await axios.post(
      `${baseURL}/enqueueJob/${user.uid}/${fileId}`,{userData}
    );
    console.log("Enqueue job...");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQueuesDataByUser = async () => {
  try {
    const response = await axios.get(`${baseURL}/queues/${user.uid}`);
    console.log("Get Queues success");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const analyzeData = async (fileId) => {
  try {
    const response = await axios.post(`${baseURL}/analyze/${user.uid}/${fileId}`);
    console.log("Analyze Data...");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
