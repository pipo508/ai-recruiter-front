import React from 'react';
import { DOCUMENTS_VIEW_CONSTANTS as C } from '../../constants/constants';

const AlphabetScroll = ({ letters, onSelect, activeLetter }) => (
  <div className="fixed right-4 top-1/4 z-50 flex flex-col items-center backdrop-blur-sm bg-gray-900/40 py-3 px-2 rounded-full shadow-lg">
    {letters.map(letter => (
      <button
        key={letter}
        onClick={() => onSelect(letter)}
        className={`
          ${activeLetter === letter ? C.COLORS.LETTER_ACTIVE : C.COLORS.LETTER_DEFAULT}
          text-sm my-1 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-800/60
        `}
      >
        {letter}
      </button>
    ))}
  </div>
);

export default AlphabetScroll;