// En tu archivo: src/pages/ResultsPage.js

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ParticlesBackground from "../components/ParticlesBackground";
import CandidateCard from "../components/RESULTS/CandidateCard";

const ResultsPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuery, setCurrentQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    const { results, query } = location.state || {};

    console.log("Datos recibidos en ResultsPage:", { results, query });

    if (results && query) {
      // ▼▼▼ AQUÍ ESTÁ LA CORRECCIÓN ▼▼▼
      // Esta lógica ahora maneja ambas estructuras de datos:
      // 1. Si `results.results` es un array (búsqueda nueva).
      // 2. Si `results` ya es un array (desde el historial).
      const candidatesArray = Array.isArray(results.results)
        ? results.results
        : Array.isArray(results)
        ? results
        : [];
      
      console.log("Array de candidatos extraído:", candidatesArray);

      setCandidates([...candidatesArray]);
      setCurrentQuery(query);
      setLoading(false);
    } else {
      console.error("No se encontraron datos de búsqueda en el state");
      setCandidates([]);
      setCurrentQuery("");
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="relative w-full min-h-screen bg-black text-white">
        <ParticlesBackground />
        <Navbar />
        <div className="max-w-7xl mx-auto p-8 relative z-10 text-center">
          <p className="text-gray-400">Cargando candidatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      <ParticlesBackground />
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        <header className="text-center mb-12 mt-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-4 animate-gradient">
            Candidatos Encontrados
          </h1>
          <p className="text-gray-400 text-lg">
            Descubre los mejores perfiles que coinciden con tu búsqueda
          </p>
          {currentQuery && (
            <p className="text-blue-300 text-sm mt-2 italic">
              Búsqueda: "{currentQuery}"
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto scrollbar-custom pb-10">
          {candidates.length > 0 ? (
            candidates.map((candidate, index) => (
              <CandidateCard key={candidate.document_id || index} candidate={candidate} />
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-gray-400 mb-2">
                No se encontraron candidatos.
              </p>
            </div>
          )}
        </div>

        {/* Mantenemos la información de debug que ya tenías */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg text-xs text-gray-300">
            <p><strong>Debug Info:</strong></p>
            <p>Query: {currentQuery || "No query"}</p>
            <p>Candidatos encontrados: {candidates.length}</p>
            <p>State data: {location.state ? "Presente" : "Ausente"}</p>
            {/* <p>Candidatos: {JSON.stringify(candidates, null, 2)}</p> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;