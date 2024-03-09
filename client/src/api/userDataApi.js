import axios from "axios";
// const baseURL = 'http://localhost:5000/api/:userid/';

const baseURL = process.env.REACT_APP_API_URL;
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

export const postUserData = async (userData) => {
  try {
    const response = await axios.post(
      `${baseURL}/userData/${user.uid}`,
      userData,
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

export const updateUserData = async (userData) => {
  try {
    const response = await axios.put(
      `${baseURL}/userData/${user.uid}`,
      userData,
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

export const getUserData = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/userData/${user.uid}`,
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

export const getUserHistory = async (fileId) => {
  try {
    const response = await axios.get(
      `${baseURL}/userHistory/${user.uid}/${fileId}`,
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

export const getUserHistories = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/userHistory/${user.uid}`,
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