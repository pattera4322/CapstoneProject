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
    throw error;
  }
};
