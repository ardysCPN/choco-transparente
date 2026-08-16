import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Bell, Menu, Shield, ChevronDown, CheckCircle2, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROL_LABELS, APP_CONFIG } from '../../utils/constants';
import toast from 'react-hot-toast';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Sesión finalizada correctamente', {
      icon: '👋',
      style: {
        borderRadius: '10px',
        background: '#0f172a',
        color: '#fff',
      },
    });
  };

  const rolInfo = usuario?.rol ? ROL_LABELS[usuario.rol] || {
    label: usuario.rol,
    color: 'text-slate-700',
    bg: 'bg-slate-100 border-slate-200'
  } : null;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Botón hamburguesa (móvil) + Título */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 lg:hidden transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sistema en Línea
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 font-medium">
            {APP_CONFIG.DEPARTAMENTO}
          </span>
        </div>
      </div>

      {/* Zona de Usuario y Acciones */}
      <div className="flex items-center gap-3">
        {/* Botón para ver Portal Público */}
        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold border border-slate-200 hover:border-emerald-200 transition-colors"
          title="Ver Portal Ciudadano"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ver Portal Público</span>
        </Link>

        {/* Notificaciones */}
        <button
          type="button"
          title="Notificaciones"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Dropdown de Perfil */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-sm font-semibold text-slate-800">
                {usuario?.nombre} {usuario?.apellido}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {usuario?.correo}
              </span>
            </div>

            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menú Desplegable */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Cuenta activa
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {usuario?.nombre} {usuario?.apellido}
                </p>
                <p className="text-xs text-slate-500 truncate mb-2">
                  {usuario?.correo}
                </p>

                {rolInfo && (
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${rolInfo.bg} ${rolInfo.color}`}>
                    <Shield className="w-3 h-3" />
                    {rolInfo.label}
                  </div>
                )}

                {usuario?.municipio && (
                  <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Jurisdicción: <span className="font-semibold text-slate-700">{usuario.municipio.nombre}</span>
                  </p>
                )}
              </div>

              <div className="p-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
