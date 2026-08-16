import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Shield,
  MapPin,
  HeartHandshake,
  AlertTriangle,
  DollarSign,
  Phone,
  Home,
  Menu,
  X,
  Lock,
  Layers,
  LifeBuoy,
  Globe,
  Package,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const PortalLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const adminRoute = isAuthenticated ? '/admin/dashboard' : '/login';

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Cinta tricolor institucional del Chocó: Verde (Biodiversidad), Amarillo (Riqueza), Azul (Ríos y Mar) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-sky-600 shadow-xs shrink-0" />

      {/* Top Announcement Bar Oficial - 100% de Ancho Fluido */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-6 lg:px-8 shrink-0 border-b border-slate-800 w-full">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400">Portal Oficial Ciudadano:</span>
            <span className="text-slate-300 hidden md:inline">
              Gobernación del Chocó & CDGRD • Gestión Humanitaria y Trazabilidad en Tiempo Real
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-300">
            <span className="font-mono">Policía 123</span>
            <span>•</span>
            <span className="font-mono">Bomberos 119</span>
            <span>•</span>
            <span className="font-mono">Defensa Civil 144</span>
            <span>•</span>
            <span className="font-mono">Cruz Roja 132</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold text-[10px] hidden lg:inline">
              EN LÍNEA 24/7
            </span>
          </div>
        </div>
      </div>

      {/* Main Header / Navbar en Fondo Claro — Ancho Completo sin Margen Vacío a los Lados */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs shrink-0 w-full transition-all duration-150">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
            {/* LADO IZQUIERDO: Logotipo e Identidad Institucional (Alineado a la Izquierda) */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-sky-600 to-amber-500 p-0.5 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700 group-hover:text-amber-600 transition-colors" />
                </div>
              </div>

              <div className="shrink-0">
                <div className="font-black text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                  <span>CHOCÓ</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">
                    TRANSPARENTE
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 tracking-wider font-semibold uppercase mt-0.5 sm:mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>Portal Oficial Ciudadano</span>
                </div>
              </div>
            </Link>

            {/* CENTRO: Enlaces de Navegación Fluidos y Optimizados */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 shrink min-w-0 justify-center">
              <Link
                to="/"
                className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                  isActive('/')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Inicio</span>
              </Link>

              <Link
                to="/mapa"
                className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                  isActive('/mapa')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Mapa en Vivo</span>
              </Link>

              <Link
                to="/municipios"
                className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                  isActive('/municipios')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>31 Municipios</span>
              </Link>

              {/* Dropdown de Recursos y Centros */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                    isActive('/centros-acopio') || isActive('/inventario-publico') || isActive('/albergues-publico') || isActive('/afectaciones-publico')
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Centros & Ayudas</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <Link
                      to="/centros-acopio"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Centros de Acopio</span>
                    </Link>
                    <Link
                      to="/inventario-publico"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <Package className="w-4 h-4 text-sky-600" />
                      <span>Stock e Insumos</span>
                    </Link>
                    <Link
                      to="/albergues-publico"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <Home className="w-4 h-4 text-indigo-600" />
                      <span>Albergues Oficiales</span>
                    </Link>
                    <Link
                      to="/afectaciones-publico"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Afectaciones Activas</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/como-ayudar"
                className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                  isActive('/como-ayudar') || isActive('/donar') || isActive('/voluntariado') || isActive('/transporte')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>¿Cómo Ayudar?</span>
              </Link>

              <Link
                to="/transparencia"
                className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                  isActive('/transparencia')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Caja Transparente</span>
              </Link>

              <Link
                to="/contactos"
                className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                  isActive('/contactos')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Líneas Oficiales</span>
              </Link>
            </nav>

            {/* LADO DERECHO: Acciones Rápidas y Panel Admin (Alineado a la Derecha, Siempre Visible) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <Link
                to="/solicitar-ayuda"
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
              >
                <LifeBuoy className="w-4 h-4 animate-spin-slow" />
                <span className="hidden sm:inline">Pedir Ayuda</span>
                <span className="sm:hidden">Ayuda</span>
              </Link>

              <Link
                to="/denunciar"
                className="hidden md:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-2.5 rounded-xl transition whitespace-nowrap shrink-0"
                title="Canal anónimo de denuncias y veeduría"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>Denunciar</span>
              </Link>

              {/* Botón de Acceso Admin Siempre Presente y Visible */}
              <Link
                to={adminRoute}
                className="px-3 sm:px-3.5 py-2 sm:py-2.5 text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition whitespace-nowrap shadow-xs shrink-0"
                title="Acceso para funcionarios y coordinadores"
              >
                <Lock className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">{isAuthenticated ? 'Panel Admin' : 'Admin'}</span>
                <span className="sm:hidden">{isAuthenticated ? 'Panel' : 'Admin'}</span>
              </Link>

              {/* Botón de Menú Móvil */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 bg-white lg:hidden focus:outline-none shrink-0"
                aria-label="Abrir navegación móvil"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Drawer de Navegación Móvil */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <Link
                to="/solicitar-ayuda"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-rose-600 text-white text-xs font-bold p-3 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <LifeBuoy className="w-4 h-4" />
                <span>🆘 Solicitar Ayuda</span>
              </Link>
              <Link
                to="/como-ayudar"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-emerald-700 text-white text-xs font-bold p-3 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>🙋 Quiero Ayudar</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${
                  isActive('/') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-slate-500" />
                <span>Inicio</span>
              </Link>

              <Link
                to="/mapa"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${
                  isActive('/mapa') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Mapa en Vivo</span>
              </Link>

              <Link
                to="/municipios"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${
                  isActive('/municipios') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>31 Municipios</span>
              </Link>

              <Link
                to="/centros-acopio"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${
                  isActive('/centros-acopio') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span>Centros de Acopio</span>
              </Link>

              <Link
                to="/inventario-publico"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${
                  isActive('/inventario-publico') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-slate-500" />
                <span>Stock e Insumos</span>
              </Link>

              <Link
                to="/albergues-publico"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${
                  isActive('/albergues-publico') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-slate-500" />
                <span>Albergues</span>
              </Link>

              <Link
                to="/transparencia"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${
                  isActive('/transparencia') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <span>Caja Transparente</span>
              </Link>

              <Link
                to="/contactos"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${
                  isActive('/contactos') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Líneas Oficiales</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
              <Link
                to="/denunciar"
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-800 hover:underline flex items-center gap-1.5 font-bold"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Reportar Irregularidad</span>
              </Link>
              <Link
                to={adminRoute}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-900 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1 font-extrabold shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAuthenticated ? 'Panel Admin' : 'Acceso Admin'}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Área Principal de Contenido — 100% Fluida, Espaciosa y Adaptable */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Outlet />
      </main>

      {/* Pie de Página Institucional Robusto y Elegante */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-12 shrink-0 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Columna 1: Identidad Institucional */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3 text-white font-black text-lg">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 via-sky-500 to-amber-500 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <span>CHOCÓ TRANSPARENTE</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Plataforma oficial para la rendición de cuentas, georreferenciación de ayudas humanitarias y coordinación ante emergencias en los 31 municipios del Chocó.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
                <Globe className="w-3.5 h-3.5" />
                <span>Transparencia y Datos Abiertos</span>
              </div>
            </div>

            {/* Columna 2: Líneas de Emergencia */}
            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>Líneas de Emergencia 24/7</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Emergencia Policía:</span>
                  <span className="font-mono font-bold text-white bg-slate-850 px-2 py-0.5 rounded">123</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Cuerpo de Bomberos:</span>
                  <span className="font-mono font-bold text-white bg-slate-850 px-2 py-0.5 rounded">119</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Defensa Civil Chocó:</span>
                  <span className="font-mono font-bold text-white bg-slate-850 px-2 py-0.5 rounded">144</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Cruz Roja Colombiana:</span>
                  <span className="font-mono font-bold text-white bg-slate-850 px-2 py-0.5 rounded">132</span>
                </li>
              </ul>
            </div>

            {/* Columna 3: Servicios y Participación */}
            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                <span>Participación Ciudadana</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/solicitar-ayuda" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>🆘</span>
                    <span>Solicitar Ayuda Humanitaria</span>
                  </Link>
                </li>
                <li>
                  <Link to="/donar" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>💰</span>
                    <span>Cuentas Oficiales de Donación</span>
                  </Link>
                </li>
                <li>
                  <Link to="/voluntariado" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>🙌</span>
                    <span>Red de Voluntarios</span>
                  </Link>
                </li>
                <li>
                  <Link to="/transporte" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>🚤</span>
                    <span>Transporte Fluvial y Terrestre</span>
                  </Link>
                </li>
                <li>
                  <Link to="/denunciar" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                    <span>🚨</span>
                    <span>Canal de Denuncias Anónimas</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 4: Marco Institucional */}
            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>Marco Institucional</span>
              </h4>
              <p className="text-xs leading-relaxed text-slate-400">
                Gobernación del Chocó<br />
                Consejo Departamental de Gestión del Riesgo (CDGRD)<br />
                Unidad Nacional para la Gestión del Riesgo (UNGRD)<br />
                Quibdó, Chocó, Colombia
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                Respuesta humanitaria coordinada, georreferenciada y libre de datos sensibles.
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} Chocó Transparente. Plataforma de Transparencia Departamental.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/transparencia" className="hover:text-slate-300">Caja Transparente</Link>
              <span>•</span>
              <Link to="/contactos" className="hover:text-slate-300">Directorio Territorial</Link>
              <span>•</span>
              <Link to={adminRoute} className="hover:text-slate-300">Acceso Institucional</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortalLayout;
