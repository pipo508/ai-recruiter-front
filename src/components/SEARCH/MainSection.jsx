import React, { useState } from "react";
import { APP_NAME, PLACEHOLDERS, MESSAGES, SEARCH_SUGGESTIONS } from "../../constants/constants";
import { useNavigate } from "react-router-dom";

const MainSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    console.log("Buscando:", searchQuery);
    navigate("/waiting");
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 z-10 max-w-4xl w-full px-4">
        <div className="space-y-4 mb-12">
          <h1 className="text-5xl font-bold text-white tracking-tight">{APP_NAME}</h1>
          <p className="text-gray-400 text-xl">{MESSAGES.DESCRIPTION}</p>
        </div>

        <div className="search-container rounded-2xl p-6 space-y-6">
          <textarea
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input w-full h-32 rounded-xl p-4 text-lg focus:outline-none resize-none"
            placeholder={PLACEHOLDERS.SEARCH}
          ></textarea>

          <button
            onClick={handleSearch}
            className="search-button px-8 py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 w-full md:w-auto mx-auto"
          >
            Buscar Talento
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400">{MESSAGES.SUGGESTED_SEARCHES}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {SEARCH_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-tag px-4 py-2 rounded-full text-blue-400 text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainSection;
