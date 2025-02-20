// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './AppRouter';  // Importa el enrutador

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />  {/* Aquí renderizamos el enrutador */}
  </React.StrictMode>
);
