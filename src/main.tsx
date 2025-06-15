import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css'; // caminho corrigido
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
