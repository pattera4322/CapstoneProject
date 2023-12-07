import axios from "axios";
// const baseURL = 'http://localhost:5000/api/file';

const baseURL = process.env.REACT_APP_API_URL;

export const postFile = async (userId, index, formData) => {
  try {
    const response = await axios.post(
      `${baseURL}/file/${userId}/${index}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFile = async (userId, index) => {
  try {
    console.log(process.env.NODE_ENV);
    console.log(`fetching file...`);
    const response = await axios.get(`${baseURL}/file/${userId}/${index}`, {
      responseType: "arraybuffer",
    });
    console.log(`finish fetching file...`);
    const fileContent = response.data;
    return fileContent;
  } catch (error) {
    console.error("Error fetching data:", error.response);
    //handle other error soon
    if (error.response && error.response.status === 404) {
      return null;
    } else {
      throw error;
    }
  }
};

export const deleteFile = async (userId, index) => {
  try {
    const response = await axios.delete(`${baseURL}/file/${userId}/${index}`);
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
