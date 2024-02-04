import axios from "axios";
// const baseURL = 'http://localhost:5000/api/:userid/';

const baseURL = process.env.REACT_APP_API_URL;
const user = JSON.parse(localStorage.getItem("user"));

export const postUserData = async (userData) => {
  try {
    const response = await axios.post(
      `${baseURL}/saveUserData/${user.uid}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/userData/${user.uid}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserHistory = async ( fileId) => {
  try {
    const response = await axios.get(
      `${baseURL}/userData/${user.uid}/${fileId}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

