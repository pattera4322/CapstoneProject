import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  // other config options
  timeout: 300000, // Set the timeout to 10 seconds (or any value that suits your needs)
});
export const analyzeData = async (dataForAnalyze) => {
  try {
    const response = await instance.post(
      `${baseURL}/analyze`,
      { dataForAnalyze }
    );
    console.log("Analyze Data...");
    return response.data;
  } catch (error) {
    console.log(error)
    if (error.response.status === 500) {
      console.log("Error from wrong parameter: ",error.response.data.RespMessage);
      throw error;
    }
    throw error;
  }
};
