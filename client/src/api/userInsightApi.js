import axios from "axios";
// const baseURL = 'http://localhost:5000/api/:userid/';

const baseURL = process.env.REACT_APP_API_URL;
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

export const postUserInsight = async (insightData, fileId) => {
    try {
      const response = await axios.post(
        `${baseURL}/userInsight/${user.uid}/${fileId}`,
        insightData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const updateUserInsight = async (insightData,fileId) => {
    try {
      const response = await axios.put(
        `${baseURL}/userInsight/${user.uid}/${fileId}`,
        insightData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  