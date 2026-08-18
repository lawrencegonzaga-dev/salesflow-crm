/* ========================================================= */
/* FILE: src/main.jsx */
/* ========================================================= */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import "./styles/main.css";
import App from './App.jsx';
import { CRMProvider } from "./context/CRMContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <CRMProvider>
            <App />
        </CRMProvider>
    </StrictMode>,
);