import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';

import App from '@/App';
import '@/styles/globals.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find root element');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
