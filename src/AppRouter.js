// src/AppRouter.js
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import WaitingPage from './pages/WaitingPage';
import PageTransition from './components/TRANSITION/PageTransition';
import ResultsPage from './pages/ResultsPage';
import SearchPage from './pages/SearchPage';
import ProfileComplete from './pages/ProfileComplete';

// Wrapper component para las rutas
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/waiting" element={<WaitingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/profile/:candidateId" element={<ProfileComplete />} />
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
