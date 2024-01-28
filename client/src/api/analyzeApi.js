import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;
// axios.defaults.timeout = 300000

export const enqueueData = async (userId, fileId) => {
  try {
    const response = await axios.post(
      `${baseURL}/enqueueJob/${userId}/${fileId}`
    );
    console.log("Enqueue job...");
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response.status === 500) {
      console.log(
        "Error from wrong parameter: ",
        error.response.data.RespMessage
      );
      throw error;
    }
    throw error;
  }
};

export const getQueuesData = async () => {
  try {
    const response = await axios.get(`${baseURL}/queues`);
    console.log("Get Queues success");
    return response.data;
  } catch (error) {
    console.error("Error fetching queues:", error);
  }
};

export const analyzeData = async (dataForAnalyze) => {
  try {
    const response = await axios.post(`${baseURL}/analyze`, { dataForAnalyze });
    console.log("Analyze Data...");
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response.status === 500) {
      console.log(
        "Error from wrong parameter: ",
        error.response.data.RespMessage
      );
      throw error;
    }
    throw error;
  }
};
