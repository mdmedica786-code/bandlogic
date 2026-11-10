import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { registerSW } from 'virtual:pwa-register';
import './i18n';
import './index.css';

registerSW({ immediate: true });

// After a new version is deployed the old JS chunks no longer exist, so an
// open tab that tries to load one would show a blank page. Reload once to get
// the new version (the timestamp guard prevents a reload loop).
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  try {
    const last = Number(sessionStorage.getItem('chunk-reload-at') || 0);
    if (Date.now() - last < 30000) return;
    sessionStorage.setItem('chunk-reload-at', String(Date.now()));
  } catch {
    /* sessionStorage blocked — reload anyway */
  }
  window.location.reload();
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
