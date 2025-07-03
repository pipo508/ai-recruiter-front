import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PageTransition from '../components/TRANSITION/PageTransition';

const PublicRoutes = () => (
  <PageTransition>
    <Routes>
      {/* Redirigir "/" a "/register" si no está autenticado */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  </PageTransition>
);

export default PublicRoutes;
