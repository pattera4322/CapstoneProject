import React, { useState, useEffect } from 'react';

const RelatedNews = ({ keywords, news , error}) => {
    // console.log(keywords)
    // console.log(news)
    // console.log(error)

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month starts from 0
        const year = date.getFullYear().toString();

        return `${day}-${month}-${year}`;
    }

    return (
        <div className="">
            <div className="text-base text-left p-4 overflow-y-auto max-h-96" >
                <p className="pb-2 font-bold">Related News</p>
                {error ? (
                    <p className=" text-sm text-gray-500">{error}</p>
                ) : (
                    news.length === 0 ? (
                        <p className="mt-16 text-sm text-gray-500">No news available.</p>
                    ) : (
                        news.map((article, index) => (
                            <div key={index} className="text-base text-left p-4 mb-4 bg-gray-100 rounded-lg">
                                <div className="message">
                                    <p>{article.index}</p>
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