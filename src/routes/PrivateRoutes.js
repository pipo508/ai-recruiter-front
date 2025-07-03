import { Routes, Route, Navigate } from 'react-router-dom';
import PageTransition from '../components/Transition/PageTransition';
import SearchPage from '../pages/SearchPage';
import WaitingPage from '../pages/WaitingPage';
import ResultsPage from '../pages/ResultsPage';
import ProfileComplete from '../pages/ProfileComplete';
import UploadDocuments from '../pages/UploadDocuments';
import DocumentListPage from '../pages/DocumentListPage';
import HistoryPage from '../pages/HistoryPage';

const PrivateRoutes = () => (
  <PageTransition>
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/waiting" element={<WaitingPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/profile/:candidateId" element={<ProfileComplete />} />
      <Route path="/upload" element={<UploadDocuments />} />
      <Route path="/getpdf" element={<getpdf />} />
      <Route path="/documentlist" element={<DocumentListPage />} />
      <Route path="/history" element={<HistoryPage />} />
      
      {/* NUEVO: Redirigir rutas públicas a la página principal */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
      
      {/* NUEVO: Capturar cualquier otra ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </PageTransition>
);

export default PrivateRoutes;