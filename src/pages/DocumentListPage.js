import React, { useState, useEffect } from 'react';
import CandidateCard from '../components/RESULTS/CandidateCard';
import PDFSearchBar from '../components/GET_PDF/PDFSearchBar';
import { fetchUserDocuments } from '../services/api';
import ParticlesBackground from '../components/ParticlesBackground';
import Navbar from '../components/Navbar';
import ButtonSubir from '../components/GET_PDF/ButtonSubir';
import Spinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState('');
  const [ocrFilter, setOcrFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadDocuments, setReloadDocuments] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    const loadDocuments = () => {
      if (!token) {
        setError('No se encontró el token de autenticación');
        setLoading(false);
        return;
      }

      setLoading(true);
      fetchUserDocuments(token)
        .then((data) => {
          const sortedData = (Array.isArray(data) ? data : []).sort((a, b) => {
            const aHasProfile = a.text_json ? 1 : 0;
            const bHasProfile = b.text_json ? 1 : 0;
            return bHasProfile - aHasProfile;
          });
          setDocuments(sortedData);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          console.error('Error al cargar documentos:', err);
          setError('Error al cargar los documentos');
          setLoading(false);
        });
    };

    loadDocuments();
  }, [reloadDocuments, token]);

  const getFirstValidLetter = (filename) => {
    if (!filename) return '#';
    const cleanFilename = String(filename).trim();
    for (let i = 0; i < cleanFilename.length; i++) {
      const char = cleanFilename[i];
      if (/[A-Za-z0-9]/.test(char)) {
        const upperChar = char.toUpperCase();
        if (/[A-Z0-9]/.test(upperChar)) {
          return upperChar;
        }
      }
    }
    return '#';
  };

  const filtered = documents
    .filter((doc) => {
      // --- MODIFICACIÓN PRINCIPAL: Búsqueda por nombre de candidato ---
      // 1. Intentamos obtener el nombre del candidato desde el perfil JSON
      const candidateName = doc.text_json && doc.text_json['Nombre completo'];
      
      // 2. Si existe nombre de candidato, buscamos en él; si no, usamos el filename como fallback
      const searchTarget = candidateName || doc.filename;
      
      // 3. Realizamos la búsqueda en el texto objetivo
      const matchesQuery = searchTarget.toLowerCase().includes(query.toLowerCase());
      
      // 4. Mantenemos el filtro OCR como estaba
      const matchesOcr = ocrFilter === '' ? true : doc.ocr_processed === (ocrFilter === 'true');
      
      return matchesQuery && matchesOcr;
    })
    // Ordenamos por nombre de candidato si existe, sino por filename
    .sort((a, b) => {
      const nameA = (a.text_json && a.text_json['Nombre completo']) || a.filename;
      const nameB = (b.text_json && b.text_json['Nombre completo']) || b.filename;
      return nameA.localeCompare(nameB);
    });

  const groupedDocuments = filtered.reduce((acc, doc) => {
    // Agrupamos por la primera letra del nombre del candidato
    const candidateName = doc.text_json && doc.text_json['Nombre completo'];
    const firstLetter = getFirstValidLetter(candidateName || doc.filename);
    
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(doc);
    return acc;
  }, {});

  const letters = Object.keys(groupedDocuments).sort((a, b) => {
    if (/\d/.test(a) && !/\d/.test(b)) return -1;
    if (!/\d/.test(a) && /\d/.test(b)) return 1;
    if (/[A-Z]/.test(a) && !/[A-Z]/.test(b) && b !== '#') return -1;
    if (!/[A-Z]/.test(a) && /[A-Z]/.test(b) && a !== '#') return 1;
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });

  const handleDocumentDeleted = (documentId) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((doc) => doc.id !== documentId)
    );
  };

  const handleRetry = () => {
    setQuery('');
    setOcrFilter('');
    setError(null);
    setReloadDocuments((prev) => prev + 1);
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      <Navbar />
      <div className="animated-bg"></div>
      <ParticlesBackground />

      <div className="relative z-10">
        <div className={`container mx-auto px-4 pt-32 pb-16`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-white text-3xl font-bold mb-2 mr-6 flex items-center">
                <svg
                  className="w-8 h-8 mr-3 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                Biblioteca de Documentos
              </h1>
              <p className="text-gray-400">Encuentra y gestiona todos tus documentos</p>
            </div>
            <ButtonSubir />
          </div>

          <div className="search-container rounded-2xl p-6 shadow-xl mb-8">
            <PDFSearchBar
              query={query}
              setQuery={setQuery}
              ocrFilter={ocrFilter}
              setOcrFilter={setOcrFilter}
            />
          </div>

          <div className="min-h-[600px]">
            {error ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-red-400 text-lg">{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
                >
                  Reintentar
                </button>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className={`p-6 rounded-lg`}>
                  <Spinner />
                  <p className="text-white text-lg mt-4">Cargando documentos</p>
                </div>
              </div>
            ) : letters.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-gray-400 text-lg">No se encontraron resultados</p>
                <button
                  onClick={handleRetry}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="scrollbar-custom overflow-y-auto max-h-[600px] pr-2 pb-8">
                {letters.map((letter) => (
                  <div key={letter} className="mb-8">
                    <div className="mb-6 pb-2 border-b border-blue-500/30">
                      <h2 className="text-2xl font-bold text-blue-400 pl-4 border-l-4 border-blue-500">
                        {letter}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                      {groupedDocuments[letter]
                        .filter(doc => doc.text_json)
                        .map((doc) => (
                          <CandidateCard
                            key={doc.id}
                            candidate={doc}
                            showDeleteButton={true}
                            onDelete={handleDocumentDeleted}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentListPage;