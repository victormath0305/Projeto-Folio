import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import App from './App';

if (import.meta.env.PROD && typeof console !== 'undefined') {
  console.warn(
    '%cAtenção — Segurança do Navegador (FOLIO)',
    'font-size: 14px; font-weight: bold; color: #D94732;'
  );
  console.info(
    'Este console é voltado a desenvolvedores. Nunca cole ou execute códigos desconhecidos aqui: isso pode expor os dados do currículo salvos no seu navegador (Self-XSS).'
  );
}

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
