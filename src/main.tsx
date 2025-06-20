// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css'; // ou './index.css' – veja o passo acima
import { PrivyWrapper } from './PrivyProvider';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyWrapper>
      <App />
    </PrivyWrapper>
  </StrictMode>
);
