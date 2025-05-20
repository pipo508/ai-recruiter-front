import React, { useState, useEffect } from 'react';
import { DOCUMENTS_VIEW_CONSTANTS as C } from '../constants/constants';
import PDFCard from '../components/GET_PDF/PDFCard';
import PDFSearchBar from '../components/GET_PDF/PDFSearchBar';
import AlphabetScroll from '../components/GET_PDF/AlphabetScroll';
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
  const [activeLetter, setActiveLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadDocuments, setReloadDocuments] = useState(0);
  
  // Usamos el contexto de autenticación para coherencia
  const { token } = useAuth();

  useEffect(() => {
    // Función para cargar documentos dentro del useEffect
    const loadDocuments = () => {
      if (!token) {
        setError('No se encontró el token de autenticación');
        setLoading(false);
        return;
      }

      setLoading(true);
      fetchUserDocuments(token)
        .then((data) => {
          setDocuments(Array.isArray(data) ? data : []);
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
  }, [reloadDocuments, token]); // Ahora todas las dependencias están declaradas correctamente

  const filtered = documents
    .filter((doc) => {
      const matchesQuery = doc.filename.toLowerCase().includes(query.toLowerCase());
      const matchesOcr =
        ocrFilter === '' ? true : doc.ocr_processed === (ocrFilter === 'true');
      return matchesQuery && matchesOcr;
    })
    .sort((a, b) => a.filename.localeCompare(b.filename));

  const alphabet = [...new Set(filtered.map((doc) => doc.filename[0].toUpperCase()))].sort();

  const scrollToLetter = (letter) => {
    setActiveLetter(letter);
    const el = document.getElementById(`letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navbarHeight = 88;

  // Función para manejar la eliminación desde PDFCard
  const handleDocumentDeleted = (documentId) => {
    // Actualizamos la lista local
    setDocuments((prevDocuments) => 
      prevDocuments.filter((doc) => doc.id !== documentId)
    );
    
    // También podemos recargar completamente si es necesario
    // setReloadDocuments(prev => prev + 1);
  };

  // Función para manejar el reintentar
  const handleRetry = () => {
    setQuery('');
    setOcrFilter('');
    setError(null);
    setReloadDocuments(prev => prev + 1);
  };

  return (
    <div className="relative w-full h-screen bg-black text-white">
      <div className="relative min-h-screen text-white">
        <Navbar />
        <div className="animated-bg"></div>
        <ParticlesBackground />

        <div className="relative z-10">
          <div className={`container mx-auto px-4 pt-32 pb-16 ${C.ANIMATIONS.FADE_IN}`}>
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
                <p className="text-gray-400">Encuentra y gestiona todos tus documentos PDF</p>
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
                  <svg
                    className="w-16 h-16 text-red-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
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
                  <div className={`p-6 rounded-lg ${C.COLORS.CARD} ${C.ANIMATIONS.FADE_IN}`}>
                    <Spinner />
                    <p className="text-white text-lg mt-4">Cargando documentos</p>
                  </div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <svg
                    className="w-16 h-16 text-gray-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-400 text-lg">{C.LABELS.NO_RESULTS}</p>
                  <button
                    onClick={handleRetry}
                    className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((doc, i, arr) => {
                    const currentFirstLetter = doc.filename[0].toUpperCase();
                    const showLetter =
                      i === 0 || currentFirstLetter !== arr[i - 1].filename[0].toUpperCase();
                    return (
                      <React.Fragment key={doc.id}>
                        {showLetter && (
                          <div
                            id={`letter-${currentFirstLetter}`}
                            className="col-span-full pt-4 pb-2 sticky bg-[rgba(9,22,42,0.80)] backdrop-blur-lg rounded z-10"
                            style={{ top: `${navbarHeight}px` }}
                          >
                            <h2 className="text-2xl font-bold text-blue-400 pl-4 border-l-4 border-blue-500">
                              {currentFirstLetter}
                            </h2>
                          </div>
                        )}
                        <div className={C.ANIMATIONS.CARD_HOVER}>
                          <PDFCard 
                            document={doc} 
                            onDelete={handleDocumentDeleted}
                            skipRedirect={true} // Añadimos esta prop para evitar la redirección
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <AlphabetScroll letters={alphabet} onSelect={scrollToLetter} activeLetter={activeLetter} />
        </div>
      </div>
    </div>
  );
};

export default DocumentListPage;