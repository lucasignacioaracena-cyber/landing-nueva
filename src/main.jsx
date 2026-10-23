import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/dm-serif-display/latin-400.css";
import "@fontsource/dm-serif-display/latin-400-italic.css";
import "./styles.css";
import "./services-design.css";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
