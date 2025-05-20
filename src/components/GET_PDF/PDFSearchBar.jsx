import React from 'react';
import PropTypes from 'prop-types';
import { DOCUMENTS_VIEW_CONSTANTS as C } from '../../constants/constants';

const PDFSearchBar = ({ query, setQuery, ocrFilter, setOcrFilter }) => (
  <div className="mb-4 space-y-4">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder={C.LABELS.SEARCH_PLACEHOLDER}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`w-full pl-10 pr-4 py-3 rounded-xl ${C.COLORS.SEARCH_BG} focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors duration-300`}
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          aria-label="Clear search"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>

    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setOcrFilter('')}
        className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
          ocrFilter === '' ? C.COLORS.FILTER_ACTIVE : C.COLORS.FILTER_INACTIVE
        }`}
      >
        {C.LABELS.ALL_DOCUMENTS}
      </button>
      <button
        onClick={() => setOcrFilter('true')}
        className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
          ocrFilter === 'true' ? C.COLORS.FILTER_ACTIVE : C.COLORS.FILTER_INACTIVE
        }`}
      >
        {C.LABELS.OCR_PROCESSED}
      </button>
      <button
        onClick={() => setOcrFilter('false')}
        className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
          ocrFilter === 'false' ? C.COLORS.FILTER_ACTIVE : C.COLORS.FILTER_INACTIVE
        }`}
      >
        {C.LABELS.OCR_NOT_PROCESSED}
      </button>
    </div>
  </div>
);

PDFSearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  ocrFilter: PropTypes.string.isRequired,
  setOcrFilter: PropTypes.func.isRequired,
};

export default PDFSearchBar;