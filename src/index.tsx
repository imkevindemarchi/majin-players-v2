import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Assets
import "./index.css";

// Components
import App from "./App";

const app = document.getElementById("root");

const root = createRoot(app as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
