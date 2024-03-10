import api from "../config/axiosConfig";

const user = JSON.parse(localStorage.getItem("user"));

export const getUserHistory = async (fileId) => {
    try {
      const response = await api.get(
        `/userHistory/${user.uid}/${fileId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const getUserHistories = async () => {
    try {
      const response = await api.get(
        `/userHistory/${user.uid}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };