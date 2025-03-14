import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";

// Assets
import "./index.css";
import "./i18n.ts";

// Components
import App from "./App";

// Providers
import { PopupProvider, SidebarProvider, ThemeProvider } from "./providers";

const app = document.getElementById("root");

const root = createRoot(app as HTMLElement);

root.render(
  <BrowserRouter>
    <ThemeProvider>
      <SidebarProvider>
        <PopupProvider>
          <App />
        </PopupProvider>
      </SidebarProvider>
    </ThemeProvider>
  </BrowserRouter>
);
