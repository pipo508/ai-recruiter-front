import React, { useEffect, useState } from 'react';
import { COLORSTATS } from '../../constants/constants'; 
const StatsGrid = () => {
  const [profilesCount, setProfilesCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const interval = setInterval(() => {
      if (profilesCount < 32) {
        setProfilesCount((prev) => prev + 1);
      }
      if (matchesCount < 8) {
        setMatchesCount((prev) => prev + 1);
      }
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [profilesCount, matchesCount, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
      <div 
        className="glass-container p-6 rounded-xl border-2 border-blue-700 animate-count" 
        style={{ backgroundColor: COLORSTATS }}
      >
        <p className="text-blue-400 mb-2">Perfiles analizados</p>
        <p className="text-gray-300 text-2xl font-semibold">{profilesCount}%</p>
      </div>
      <div 
        className="glass-container p-6 rounded-xl border-2 border-blue-700 animate-count" 
        style={{ backgroundColor: COLORSTATS }}
      >
        <p className="text-blue-400 mb-2">Matches encontrados</p>
        <p className="text-gray-300 text-2xl font-semibold">{matchesCount}</p>
      </div>
      <div 
        className="glass-container p-6 rounded-xl border-2 border-blue-700 animate-count" 
        style={{ backgroundColor: COLORSTATS }}
      >
        <p className="text-blue-400 mb-2">Tiempo estimado</p>
        <p className="text-gray-300 text-2xl font-semibold">{formatTime(timeLeft)}</p>
      </div>
    </div>
  );
};

export default StatsGrid;
