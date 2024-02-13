const axios = require('axios');
GNEWS_API_KEY = '46222a355a3e7db3702d560383569019';
// url = 'https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=' + apikey;


fetch('/news', async (req, res) => {
    const { query } = req.query;
    try {
      const response = await axios.get('https://gnews.io/api/v4/search', {
        params: {
          q: query.join(' OR '), // Constructing the query string with "OR" operator
          token: GNEWS_API_KEY,
          lang: 'en', // Optional: You can specify the language
          country: 'us', // Optional: You can specify the country
        }
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});