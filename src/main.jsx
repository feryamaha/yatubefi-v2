import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

console.log("main.jsx carregado");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
