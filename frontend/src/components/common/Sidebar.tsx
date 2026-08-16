import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Package,
  Users,
  Home,
  DollarSign,
  BarChart3,
  Shield,
  X,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { MODULOS_SISTEMA, APP_CONFIG } from '../../utils/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  UserCheck: <UserCheck className="w-5 h-5" />,
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop overlay para pantallas pequeñas */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar contenedor */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-slate-900 text-slate-200 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Encabezado del Sidebar / Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 p-0.5 shadow-lg shadow-emerald-950/40 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                {APP_CONFIG.NOMBRE}
              </h1>
              <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Plataforma Departamental
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Navegación de Módulos (7 Fases) */}
        <div className="flex-1 px-4 py-4 overflow-y-auto space-y-6 custom-scrollbar">
          <div>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Módulos del Sistema
            </p>

            <nav className="space-y-1">
              {MODULOS_SISTEMA.map((modulo) => {
                const isActivo = modulo.estado === 'ACTIVO';

                return (
                  <NavLink
                    key={modulo.ruta}
                    to={modulo.ruta}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30 font-semibold'
                          : isActivo
                          ? 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <span
                            className={`${
                              isActive
                                ? 'text-white'
                                : isActivo
                                ? 'text-emerald-400 group-hover:text-emerald-300'
                                : 'text-slate-500 group-hover:text-slate-400'
                            }`}
                          >
                            {iconMap[modulo.icono]}
                          </span>
                          <span>{modulo.nombre}</span>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            isActivo
                              ? isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                          }`}
                        >
                          {isActivo ? 'Activo' : 'Próximo'}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 text-xs text-slate-400">
          <div className="flex items-center justify-between text-[11px]">
            <span>Versión {APP_CONFIG.VERSION}</span>
            <span className="text-emerald-400 font-medium">Operativo 24/7</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
