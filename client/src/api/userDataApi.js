import axios from "axios";
// const baseURL = 'http://localhost:5000/api/:userid/';

const baseURL = process.env.REACT_APP_API_URL;

export const postUserData = async (userId, userData) => {
  try {
    const response = await axios.post(
      `${baseURL}/saveUserData/${userId}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
