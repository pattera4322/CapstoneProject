import axios from "axios";
// const baseURL = 'http://localhost:5000/api/file';

const baseURL = process.env.REACT_APP_API_URL;
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

export const postFile = async (index, formData, onUploadProgress) => {
  try {
    const response = await axios.post(
      `${baseURL}/file/${user.uid}/${index}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFile = async (index) => {
  try {
    const response = await axios.get(`${baseURL}/file/${user.uid}/${index}`, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const fileContent = response.data;
    return fileContent;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (index) => {
  try {
    const response = await axios.delete(`${baseURL}/file/${user.uid}/${index}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
