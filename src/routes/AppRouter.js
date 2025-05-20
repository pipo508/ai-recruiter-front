import { useAuth } from '../context/AuthContext';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

const AppRouter = () => {
  const { user } = useAuth();
  return user ? <PrivateRoutes /> : <PublicRoutes />;
};

export default AppRouter;
