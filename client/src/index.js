import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@material-tailwind/react";
import { ProgressProvider } from "./context/ProgressContext.js";
import { ImageUrlsProvider } from "./context/ImageUrlsContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename="/sj1">
    <ThemeProvider>
      <ImageUrlsProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </ImageUrlsProvider>
    </ThemeProvider>
  </BrowserRouter>
);
