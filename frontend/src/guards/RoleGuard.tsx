import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: string[];
  fallbackPath?: string;
  showFallbackUI?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  fallbackPath = '/',
  showFallbackUI = false,
}) => {
  const usuario = useAuthStore((state) => state.usuario);
  const hasRole = useAuthStore((state) => state.hasRole);

  const isAllowed = usuario && hasRole(allowedRoles);

  if (!isAllowed) {
    if (showFallbackUI) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-amber-200 text-center max-w-lg mx-auto my-12">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-full mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Acceso Restringido</h2>
          <p className="text-slate-600 mb-4">
            Tu rol actual ({usuario?.rol || 'Desconocido'}) no cuenta con los permisos necesarios para acceder a esta sección.
          </p>
          <a
            href="/"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      );
    }

    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
