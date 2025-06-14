// src/App.js

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UploadProvider } from "./context/UploadContext"; // <-- 1. Importa el provider
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UploadProvider> {/* <-- 2. Envuélvelo aquí */}
          <AppRouter />
        </UploadProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;