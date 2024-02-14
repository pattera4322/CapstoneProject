import axios from "axios";

// url = 'https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=' + apikey;

export const getNews = async (keywords) => {
  try {
    const responses = [];
    const apiKey = "46222a355a3e7db3702d560383569019";

    for (const keyword of Object.values(keywords)) {
      const response = await axios.get(
        `https://gnews.io/api/v4/search?q=(economics OR business OR economy) AND ${encodeURIComponent(
          keyword
        )}&lang=en&country=us&max=3&token=${apiKey}`
      );
      responses.push(response.data.articles);
    }
    console.log(responses)
    return responses.flat();
  } catch (error) {
    throw error;
  }
};
