import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";

// Register service worker with auto‑update; no manual cache clearing needed.
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Activate new SW and reload page to fetch fresh assets
    window.location.reload();
  },
  onRegisterError(err) {
    console.error('SW registration failed:', err);
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);