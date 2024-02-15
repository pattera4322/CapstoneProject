import React, { useState, useEffect } from 'react';
import { getNews } from '../../api/newsApi';

const RelatedNews = ({ keywords }) => {

    const [news, setNews] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        getNews(keywords).then((res) => {
                // console.log("news : ",res)
                setNews(res);
            
        }).catch((error) => {
            if (error.response.status === 403) {
                setError(error.response.data.errors[0])
            } else {
                //An error occurred while fetching news.
                console.log(error)
                setError(error.response.data.errors[0])
            }
        })
    }, [keywords]);

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
                <p className="pb-2 font-bold">Related News</p>
                {error ? (
                    <p className=" text-sm text-gray-500">{error}</p>
                ) : (
                    news.length === 0 ? (
                        <p className="mt-16 text-sm text-gray-500">No news available.</p>
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