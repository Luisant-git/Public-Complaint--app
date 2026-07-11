import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";

// Register service worker with update handling so new deployments show immediately.
// One-time clear of existing service worker registrations and caches.
async function clearCachesOnce() {
  try {
    if (localStorage.getItem('cf_caches_cleared_v1')) return;
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    localStorage.setItem('cf_caches_cleared_v1', '1');
    console.info('Cleared service worker registrations and caches');
    // Reload to fetch fresh assets from network
    window.location.reload();
  } catch (e) {
    console.error('Failed clearing caches', e);
  }
}

clearCachesOnce();

const updateSW = registerSW({
  immediate: true,
  onRegistered(registration) {
    if (registration) {
      // Periodically check for updates (hourly)
      try {
        setInterval(() => registration.update(), 60 * 60 * 1000);
      } catch (e) {
        // ignore
      }
    }
  },
  onNeedRefresh() {
    // When a new service worker is waiting, activate it and reload to get fresh UI.
    // Calling updateSW(true) will skipWaiting and reload the page.
    try {
      updateSW(true);
    } catch (e) {
      // fallback: reload page
      window.location.reload();
    }
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