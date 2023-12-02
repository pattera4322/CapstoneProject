import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

export const analyzeData = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


