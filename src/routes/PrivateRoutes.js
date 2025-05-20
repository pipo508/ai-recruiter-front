import { Routes, Route } from 'react-router-dom';
import PageTransition from '../components/TRANSITION/PageTransition';
import SearchPage from '../pages/SearchPage';
import WaitingPage from '../pages/WaitingPage';
import ResultsPage from '../pages/ResultsPage';
import ProfileComplete from '../pages/ProfileComplete';
import UploadDocuments from '../pages/UploadDocuments';
import DocumentListPage from '../pages/DocumentListPage';


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
      {/* Más rutas privadas si necesitás */}
    </Routes>
  </PageTransition>
);

export default PrivateRoutes;
