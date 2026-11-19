import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics
      beforeSend={(event) => {
        try {
          const parsed = new URL(event.url);
          parsed.search = '';
          parsed.hash = '';
          return { ...event, url: parsed.toString() };
        } catch {
          return event;
        }
      }}
    />
  </StrictMode>
);
