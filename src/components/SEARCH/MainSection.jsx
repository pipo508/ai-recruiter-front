import React, { useState, useRef, useEffect } from "react";
import { APP_NAME, PLACEHOLDERS, MESSAGES, SEARCH_SUGGESTIONS } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { searchDocuments } from "../../services/api";
import HeroTitle from "./HeroTitle";
import SearchBox from "./SearchBox ";
import SuggestionTags from "./SuggestionTags ";
import SearchButton from "./SearchButton ";
import ErrorAlert from "./ErrorAlert ";

const MainSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();
  const searchBoxRef = useRef(null);

  // Auto-focus en el textarea al cargar
  useEffect(() => {
    if (searchBoxRef.current) {
      searchBoxRef.current.focus();
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setError(null);
    setShowSuggestions(e.target.value.length === 0);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Por favor, ingrese un texto de búsqueda.");
      searchBoxRef.current?.focus();
      return;
    }

    if (!token) {
      setError("Debe iniciar sesión para realizar una búsqueda.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      console.log("Buscando:", searchQuery);
      const results = await searchDocuments(searchQuery, token);
      navigate("/results", { state: { results, query: searchQuery } });
    } catch (err) {
      console.error("Error en la búsqueda:", err.message);
      setError(err.message || "Error al realizar la búsqueda");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setError(null);
    setShowSuggestions(false);
    searchBoxRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen overflow-y-auto">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-24">
        <div className="text-center space-y-12 z-10 max-w-5xl w-full px-4">
          {/* Título principal */}
          <HeroTitle 
            title={APP_NAME}
            subtitle={MESSAGES.DESCRIPTION}
          />

          {/* Contenedor principal de búsqueda */}
          <div className="search-container relative bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 lg:p-10 space-y-8 shadow-2xl hover:border-blue-500/30 transition-all duration-500 group">
            {/* Gradiente de fondo sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative space-y-6">
              {/* Caja de búsqueda */}
              <SearchBox
                ref={searchBoxRef}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                placeholder={PLACEHOLDERS.SEARCH}
                error={!!error}
              />

              {/* Error Alert */}
              {error && (
                <ErrorAlert 
                  message={error}
                  onClose={() => setError(null)}
                />
              )}

              {/* Botón de búsqueda */}
              <SearchButton
                onClick={handleSearch}
                isLoading={isSearching}
                disabled={!searchQuery.trim() || isSearching}
              />

              {/* Atajo de teclado */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300">Enter</kbd>
                <span>para buscar</span>
              </div>
            </div>
          </div>

          {/* Sugerencias de búsqueda */}
          {showSuggestions && (
            <SuggestionTags
              suggestions={SEARCH_SUGGESTIONS}
              onSuggestionClick={handleSuggestionClick}
              title={MESSAGES.SUGGESTED_SEARCHES}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default MainSection;