import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import "./i18n.ts";

// Assets
import "./index.css";

// Components
import App from "./App";

// Providers
import { SidebarProvider, ThemeProvider } from "./providers";

const app = document.getElementById("root");

const root = createRoot(app as HTMLElement);

root.render(
  <BrowserRouter>
    <ThemeProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </ThemeProvider>
  </BrowserRouter>
);
