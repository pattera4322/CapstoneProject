import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

export const analyzeData = async (dataForAnalyze) => {
  try {
    const response = await axios.post(
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
