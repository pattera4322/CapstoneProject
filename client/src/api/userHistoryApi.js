import api from "../config/axiosConfig";

const user = JSON.parse(localStorage.getItem("user"));

export const getUserHistory = async (historyId) => {
    try {
      const response = await api.get(
        `/userHistory/${user.uid}/${historyId}`,
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