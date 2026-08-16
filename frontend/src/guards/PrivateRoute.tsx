import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const PrivateRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirigir a login guardando la ruta a la que intentaba acceder
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
