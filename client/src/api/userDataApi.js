import api from "../config/axiosConfig";

const user = JSON.parse(localStorage.getItem("user"));

export const postUserData = async (userData) => {
  try {
    const response = await api.post(
      `/userData/${user.uid}`,
      userData,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserData = async (userData) => {
  try {
    const response = await api.put(
      `/userData/${user.uid}`,
      userData,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const response = await api.get(
      `/userData/${user.uid}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
