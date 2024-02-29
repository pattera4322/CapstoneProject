import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

export const analyzeData = async (fileId) => {
  try {
    const response = await axios.post(
      `${baseURL}/analyze/${user.uid}/${fileId}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Analyze Data...");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQueues = async () => {
  try {
    const response = await axios.get(`${baseURL}/queues/${user.uid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Get queues..");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const enqueueData = async (fileId, userData) => {
//   try {
//     const response = await axios.post(
//       `${baseURL}/enqueueJob/${user.uid}/${fileId}`,{userData}
//     );
//     console.log("Enqueue job...");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getQueuesDataByUser = async () => {
//   try {
//     const response = await axios.get(`${baseURL}/queues/${user.uid}`);
//     console.log("Get Queues success");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
