import React, { createContext, useState, useEffect } from 'react';
import { fetchImageUrls } from '../api/getImageUrls';

export const ImageUrlsContext = createContext();

export const ImageUrlsProvider = ({ children }) => {
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {

    fetchImageUrls('assets')
      .then(urls => {
        setImageUrls(urls); 
      })
      .catch(error => {
        console.error('Error fetching image URLs:', error);
      });
  }, []); 

  return (
    <ImageUrlsContext.Provider value={imageUrls}>
      {children}
    </ImageUrlsContext.Provider>
  );  
};
