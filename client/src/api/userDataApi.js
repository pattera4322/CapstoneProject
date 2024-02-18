import axios from "axios";
import Swal from "sweetalert2";
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
    if(error.message === "Network Error"){
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Something went wrong! Please refresh the page"
      });
      throw error;
    }else{
      throw error;
    }
  }
};

export const getUserData = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/userData/${user.uid}`,
    );
    return response.data;
  } catch (error) {
    if(error.message === "Network Error"){
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Something went wrong! Please refresh the page"
      });
      throw error;
    }else{
      throw error;
    }
  }
};

export const getUserHistory = async (fileId) => {
  try {
    const response = await axios.get(
      `${baseURL}/userHistory/${user.uid}/${fileId}`,
    );
    return response.data;
  } catch (error) {
    if(error.message === "Network Error"){
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Something went wrong! Please refresh the page"
      });
      throw error;
    }else{
      throw error;
    }
  }
};

export const getUserHistories = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/userHistory/${user.uid}`,
    );
    return response.data;
  } catch (error) {
    if(error.message === "Network Error"){
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Something went wrong! Please refresh the page"
      });
      throw error;
    }else{
      throw error;
    }
  }
};

