// src/AppRouter.js
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import App from './App';
import WaitingPage from './pages/WaitingPage';
import PageTransition from './components/Transition/PageTransition';

// Wrapper component para las rutas
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<App />} />
        <Route path="/waiting" element={<WaitingPage />} />
      </Routes>
    </PageTransition>
  );
};

function AppRouter() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default AppRouter;