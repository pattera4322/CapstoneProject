import React, { useState, useEffect } from 'react';

const RelatedNews = ({keywords}) => {
    console.log(`------ News -----`)
    console.log(`keywords : ${keywords}`)

    const [news, setNews] = useState([]);
    const GNEWS_API_KEY = '46222a355a3e7db3702d560383569019';

    useEffect((keywords) => {
            // async function fetchNews() {
            //   try {
            //     const response = await axios.get('/news'); // Assuming your backend is running on the same domain
            //     setNews(response.data.articles);
            //   } catch (error) {
            //     console.error('Error fetching news:', error);
            //   }
            // }
        
            // getNews();
    }, []);

    async function getNews(query) {
        await fetch(`https://gnews.io/api/v4/search?q=${query}&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`).
        then((response) => {
          return response.json();
        }).then((response) => {
            const articles = response.articles;
            setNews(articles)
        }).catch((error) => {
            console.log(`Error with CODE : ${error.response.data.RespMessage}`)
            // console.log(error);
        })
    }

    return (
        <div className="">
        <div className="text-base text-left p-4 overflow-y-auto">
            <p className="pb-4 font-bold">Related News</p>
            <div className="text-base text-left p-4 overflow-y-auto bg-gray-200 rounded-lg">
            <div className="message">
                <p className="pb-2 font-bold">อินเดียประกาศส่งออกข้าวนาาา</p>
                <p className="text-sm"> Posted Date XX/XX/XX</p>
                <a href='#' className="text-sm">More details...</a>
            </div>
            </div>
            <br />
            <div className="text-base text-left p-4 overflow-y-auto bg-gray-200 rounded-lg">
            <div className="message">
                <p className="pb-2 font-bold">น้ำมันขึ้นราคา</p>
                <p className="text-sm"> Posted Date XX/XX/XX</p>
            </div>
            </div>
        </div>
        </div>
    );
};

export default RelatedNews;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function RelatedNews(products) {
//   const [news, setNews] = useState([]);

//   useEffect(() => {
//     async function fetchNews() {
//       try {
//         const response = await axios.get('/news'); // Assuming your backend is running on the same domain
//         setNews(response.data.articles);
//       } catch (error) {
//         console.error('Error fetching news:', error);
//       }
//     }

//     fetchNews();
//   }, []);

//   return (
//     <div>
//       <h1>Latest News</h1>
//       <ul>
//         {news.map((article, index) => (
//           <li key={index}>
//             <h2>{article.title}</h2>
//             <p>{article.description}</p>
//             <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default RelatedNews;