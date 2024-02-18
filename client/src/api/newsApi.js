import axios from "axios";

// export const getNews = async (keywords) => {
//   try {
//     const responses = [];
//     // const apiKey = "46222a355a3e7db3702d560383569019"; //My
//     const apiKey = "f8e7ef6096c0abe1fcedbbafe9825d17"; //Max

//     for (const keyword of Object.values(keywords)) {
//       const response = await axios.get(
//         `https://gnews.io/api/v4/search?q=(economics OR business OR economy) AND ${encodeURIComponent(
//           keyword
//         )}&lang=en&country=us&max=1&token=${apiKey}`
//       );
//       responses.push(response.data.articles);
//     }
//     console.log(responses)
//     return responses.flat();
//   } catch (error) {
//     throw error;
//   }
// };

// export const getNews = async (keywords) => {
//   try {
//     const responses = [];
//     const apiKey = "46222a355a3e7db3702d560383569019"; //My
//     // const apiKey = "f8e7ef6096c0abe1fcedbbafe9825d17"; //Max
//     // const apiKey = "e1e3c4c113bfd1a8ee2cc716e4af8dab" //My KMUTT

//     for (const keyword of keywords) {

//       const response = await axios.get(
//         `https://gnews.io/api/v4/search?q=(economics OR business OR economy) AND ${encodeURIComponent(
//           keyword
//         )}&lang=en&country=us&max=1&token=${apiKey}`
//       );
//       responses.push(response.data.articles);
//     }
//     console.log(responses)
//     return responses;
//   } catch (error) {
//     throw error;
//   }
// };

export const getNews = async (keywords) => {
  const responses = [];
  try {
    const apiKey = "46222a355a3e7db3702d560383569019"; //My
    // const apiKey = "f8e7ef6096c0abe1fcedbbafe9825d17"; //Max
    // const apiKey = "e1e3c4c113bfd1a8ee2cc716e4af8dab" //My KMUTT

    const promises = keywords.map(async (keyword) => {
      const response = await axios.get(
        `https://gnews.io/api/v4/search?q=(economics OR business OR economy) AND ${encodeURIComponent(
          keyword
        )}&lang=en&country=us&max=1&token=${apiKey}`
      );
      return response.data.articles;
    });

    // Wait for all promises to resolve
    const responses = await Promise.all(promises);
    return responses.flat();
  } catch (error) {
    throw error;
  }
};