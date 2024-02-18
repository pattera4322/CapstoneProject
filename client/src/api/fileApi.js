import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = 'http://localhost:5000/api/file';

const baseURL = process.env.REACT_APP_API_URL;
const userId = JSON.parse(localStorage.getItem("user"));

export const postFile = async ( index, formData, onUploadProgress) => {
  try {
    const response = await axios.post(
      `${baseURL}/file/${userId.uid}/${index}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      }
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

export const getFile = async (index) => {
  try {
    const response = await axios.get(`${baseURL}/file/${userId.uid}/${index}`, {
      responseType: "arraybuffer",})
    const fileContent = response.data;
    return fileContent;
  } catch (error) {
    if(error.message === 'Network Error'){
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

export const deleteFile = async (index) => {
  try {
    const response = await axios.delete(`${baseURL}/file/${userId.uid}/${index}`);
    return response;
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

