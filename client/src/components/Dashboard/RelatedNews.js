import React, { useState, useEffect } from 'react';

const RelatedNews = ({ keywords }) => {
    console.log(`------ News -----`)
    console.log(`keywords : ${keywords}`)
    // const query = keywords.join(' OR ')

    const [news, setNews] = useState([]);
    const [error, setError] = useState(null);
    const GNEWS_API_KEY = '46222a355a3e7db3702d560383569019';

    useEffect(() => {
        // console.log(`Query => ${query}`)
        // getNews(query);
        getNews(keywords)
    }, keywords);

    async function getNews(keywords) {
        const promises = keywords.map(keyword =>
            fetch(`https://gnews.io/api/v4/search?q=(economics OR business OR economy) AND ${encodeURIComponent(keyword)}&lang=en&country=us&max=3&apikey=${GNEWS_API_KEY}`)
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 403) {
                            throw new Error(`Sorry, Code 403 Forbidden.`);
                        } else {
                            throw new Error(`HTTP error ${response.status}`);
                        }
                    }
                    return response.json();
                })
                .then(response => response.articles)
        );

        try {
            const articlesArray = await Promise.all(promises);
            const articles = articlesArray.flat(); // Flatten the array of articles
            setNews(articles);
            setError(null); // Reset error state
            console.log(news);
        } catch (error) {
            setError(error.message); // Set error state
            console.error('Error fetching news:', error);
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month starts from 0
        const year = date.getFullYear().toString();

        return `${day}-${month}-${year}`;
    }

    return (
        <div className="">
            <div className="text-base text-left p-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
                <p className="pb-4 font-bold">Related News</p>
                {error ? (
                    <p className="mt-16 text-sm text-gray-500">The news retrieval is unavailable at this moment.</p>
                ) : (
                    news.length === 0 ? (
                        <p className="mt-16 text-sm text-gray-500">The news retrieval is unavailable at this moment.</p>
                    ) : (
                        news.map((article, index) => (
                            <div key={index} className="text-base text-left p-4 bg-gray-200 rounded-lg">
                                <div className="message">
                                    <p className="pb-2 font-bold">{article.title}</p>
                                    <p className="text-sm"> Posted Date {formatDate(article.publishedAt)}</p>
                                    <a href={article.url} className="text-xs text-gray-500">More details...</a>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default RelatedNews;