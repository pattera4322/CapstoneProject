import axios from 'axios';

const baseURL = 'http://localhost:5000/api/file'; 

export const postFile = async (userId, index, formData) => {
  try {
    const response = await axios.post(`${baseURL}/${userId}/${index}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFile = async (userId, index) => {
    try {
        console.log(`fetching file...`);
        const response = await axios.get(`${baseURL}/${userId}/${index}`, {
          responseType: 'arraybuffer',
        });
    
        const fileContent = response.data;
    
        return fileContent;
      } catch (error) {
        console.error('Error fetching data:', error);
        //handle other error soon
        if (error.response && error.response.status === 404) {
          return null; 
        } else {
          throw error;
        }
      }
  };
