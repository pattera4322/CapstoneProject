import axios from "axios";
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
    throw error;
  }
};

export const getFile = async (index) => {
  try {
    console.log(process.env.NODE_ENV);
    console.log(`fetching file...`);
    const response = await axios.get(`${baseURL}/file/${userId.uid}/${index}`, {
      responseType: "arraybuffer",
    });
    console.log(`finish fetching file...`);
    const fileContent = response.data;
    return fileContent;
  } catch (error) {
    // console.error("Error fetching data:", error);
    //handle other error soon
    throw error;
  }
};

export const deleteFile = async (index) => {
  try {
    const response = await axios.delete(`${baseURL}/file/${userId.uid}/${index}`);
    console.log(`finish deleting file...`);
    return response;
  } catch (error) {
    console.error("Error delete file:", error.response);
    //handle other error soon
    if (error.response && error.response.status === 404) {
      return null;
    } else {
      throw error;
    }
  }
};

