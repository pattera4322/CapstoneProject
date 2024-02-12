import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@material-tailwind/react";
import { ProgressProvider } from "./context/ProgressContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename="/sj1">
    <ThemeProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </ThemeProvider>
  </BrowserRouter>
);
