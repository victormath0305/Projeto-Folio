import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = () => 'blob:http://localhost/folio-curriculo-pdf';
  }
  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = () => {};
  }
  // Evita aviso de navegação de <a download> no ambiente sintético jsdom
  HTMLAnchorElement.prototype.click = function () {};
}
