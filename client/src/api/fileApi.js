import api from "../config/axiosConfig";

const user = JSON.parse(localStorage.getItem("user"));

export const postFile = async (index, formData, onUploadProgress) => {
  try {
    const response = await api.post(
      `/file/${user.uid}/${index}`,
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
    const response = await api.get(`/file/${user.uid}/${index}`, {
      responseType: "arraybuffer",
    });
    const fileContent = response.data;
    return fileContent;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (index) => {
  try {
    const response = await api.delete(`/file/${user.uid}/${index}`,{
    });
    return response;
  } catch (error) {
    throw error;
  }
};
