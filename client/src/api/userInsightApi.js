import api from "../config/axiosConfig";

const user = JSON.parse(localStorage.getItem("user"));

export const postUserInsight = async (insightData, fileId) => {
    try {
      const response = await api.post(
        `/userInsight/${user.uid}/${fileId}`,
        insightData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const updateUserInsight = async (insightData,fileId) => {
    try {
      const response = await api.put(
        `/userInsight/${user.uid}/${fileId}`,
        insightData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  