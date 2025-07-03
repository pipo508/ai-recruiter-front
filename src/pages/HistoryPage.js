// src/pages/HistoryPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSearchHistory, deleteSearchResult } from '../services/api';

// Componentes de la UI
import Navbar from '../components/Navbar';
import ParticlesBackground from '../components/ParticlesBackground';
import HistoryCard from '../components/HISTORIAL/HistoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/HISTORIAL/EmptyState';
import ErrorMessage from '../components/HISTORIAL/ErrorMessage';
import PageHeader from '../components/HISTORIAL/PageHeader';
import SearchStats from '../components/HISTORIAL/SearchStats';
import ConfirmDeleteModal from '../components/HISTORIAL/ConfirmDeleteModal'; // MODIFICACIÓN 1: Importar el modal

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  // MODIFICACIÓN 2: Nuevos estados para manejar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // Guarda el ID del ítem a eliminar
  const [isDeleting, setIsDeleting] = useState(false); // Para el estado de carga

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
    if (isDeleting) return; // Prevenir click si se está borrando algo
    navigate('/results', {
      state: {
        results: historyItem.result_json,
        query: historyItem.query,
      },
    });
  };

  // MODIFICACIÓN 3: Reemplazamos la lógica de borrado anterior por estas tres funciones

  // Esta función se llama desde el HistoryCard para ABRIR el modal
  const handleOpenDeleteModal = (searchId) => {
    setItemToDelete(searchId);
    setIsModalOpen(true);
  };
  
  // Esta función se pasa al modal para CERRARLO
  const handleCloseModal = () => {
    if (isDeleting) return;
    setIsModalOpen(false);
    setItemToDelete(null);
  };
  
  // Esta función se pasa al modal y se ejecuta al CONFIRMAR la eliminación
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await deleteSearchResult(itemToDelete, token);
      setHistory(prevHistory => prevHistory.filter(item => item.id !== itemToDelete));
      console.log('✅ Resultado de búsqueda eliminado correctamente');
    } catch (error) {
      console.error('❌ Error al eliminar resultado:', error);
      setError(`Error al eliminar resultado: ${error.message}`);
    } finally {
      setIsDeleting(false);
      handleCloseModal(); // Cierra el modal después de terminar
    }
  };
  
  const filteredHistory = history.filter(item =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSearchStats = () => {
    // ... (esta función no cambia)
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

  // Los returns de `loading` y `error` no cambian
  if (loading) { /* ... */ return <LoadingSpinner />; }
  if (error) { /* ... */ return <ErrorMessage message={error} />; }

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

            {history.length > 0 && <SearchStats stats={stats} />}

            <div className="mt-8">
              {/* La lógica de EmptyState y el mapeo no cambia */}
              {filteredHistory.length > 0 ? (
                <div className="grid gap-4 md:gap-6">
                  {filteredHistory.map((item, index) => (
                    <HistoryCard
                      key={item.id}
                      item={item}
                      index={index}
                      onClick={() => handleHistoryClick(item)}
                      // MODIFICACIÓN 4: Conectamos la prop `onDelete` a la función que abre el modal
                      onDelete={() => handleOpenDeleteModal(item.id)}
                      // Pasamos el estado de carga para que la tarjeta individual lo sepa
                      isDeleting={isDeleting && itemToDelete === item.id}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                    title={history.length === 0 ? "No hay búsquedas aún" : "No se encontraron resultados"}
                    description={history.length === 0 ? "Comienza a buscar para ver tu historial aquí" : `No hay búsquedas que coincidan con "${searchTerm}"`}
                    actionText="Hacer nueva búsqueda"
                    onAction={() => navigate('/')}
                    showAction={history.length === 0}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MODIFICACIÓN 5: Renderizamos el modal y lo conectamos a nuestros estados y funciones */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="¿Eliminar este resultado?"
        message="Esta acción es permanente y no podrás recuperar el resultado de esta búsqueda."
      />
    </div>
  );
};

export default HistoryPage;