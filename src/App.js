// src/App.js

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UploadProvider } from "./context/UploadContext"; // <-- 1. Importa el provider
import AppRouter from "./routes/AppRouter";
import { TokenExpirationProvider } from './context/TokenExpirationContext';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TokenExpirationProvider>
          <UploadProvider> {/* <-- 2. Envuélvelo aquí */}
            <AppRouter />
          </UploadProvider>
        </TokenExpirationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;