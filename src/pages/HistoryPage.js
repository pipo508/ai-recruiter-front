// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSearchHistory } from '../services/api';
import Navbar from '../components/Navbar';
import ParticlesBackground from '../components/ParticlesBackground';
import HistoryCard from '../components/HISTORIAL/HistoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/HISTORIAL/EmptyState';
import ErrorMessage from '../components/HISTORIAL/ErrorMessage';
import PageHeader from '../components/HISTORIAL/PageHeader';
import SearchStats from '../components/HISTORIAL/SearchStats';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setError("Necesitas iniciar sesión para ver el historial.");
        setLoading(false);
        return;
      }
      try {
        const data = await getSearchHistory(token);
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const handleHistoryClick = (historyItem) => {
    navigate('/results', {
      state: {
        results: historyItem.result_json,
        query: historyItem.query,
      },
    });
  };

  const filteredHistory = history.filter(item =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSearchStats = () => {
    const today = new Date();
    const todaySearches = history.filter(item => {
      const itemDate = new Date(item.created_at);
      return itemDate.toDateString() === today.toDateString();
    }).length;

    const thisWeek = history.filter(item => {
      const itemDate = new Date(item.created_at);
      const daysDiff = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }).length;

    return {
      total: history.length,
      today: todaySearches,
      thisWeek: thisWeek
    };
  };

  if (loading) {
    return (
      <div className="relative w-full min-h-screen bg-black text-white">
        <ParticlesBackground />
        <div className="relative z-10 flex flex-col h-screen">
          <Navbar />
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full min-h-screen bg-black text-white">
        <ParticlesBackground />
        <div className="relative z-10 flex flex-col h-screen">
          <Navbar />
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  const stats = getSearchStats();

  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      <ParticlesBackground />
      
      <div className="relative z-10 flex flex-col h-screen">
        <Navbar />

        <main className="flex-grow overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 lg:p-8">
            <PageHeader
              title="Historial de Búsquedas"
              subtitle="Explora y revisa todas tus búsquedas anteriores"
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            {history.length > 0 && (
              <SearchStats stats={stats} />
            )}

            <div className="mt-8">
              {history.length === 0 ? (
                <EmptyState
                  title="No hay búsquedas aún"
                  description="Comienza a buscar para ver tu historial aquí"
                  actionText="Hacer nueva búsqueda"
                  onAction={() => navigate('/')}
                />
              ) : filteredHistory.length === 0 ? (
                <EmptyState
                  title="No se encontraron resultados"
                  description={`No hay búsquedas que coincidan con "${searchTerm}"`}
                  showAction={false}
                />
              ) : (
                <div className="grid gap-4 md:gap-6">
                  {filteredHistory.map((item, index) => (
                    <HistoryCard
                      key={item.id}
                      item={item}
                      index={index}
                      onClick={() => handleHistoryClick(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;