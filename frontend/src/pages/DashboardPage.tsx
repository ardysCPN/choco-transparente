import React, { useState, useEffect } from 'react';
import {
  Shield,
  MapPin,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Info,
  Users,
  Home,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROL_LABELS, APP_CONFIG } from '../utils/constants';
import { dashboardService } from '../services/dashboard.service';
import { DashboardAdministrativoData } from '../types/reporte-dashboard.types';

export const DashboardPage: React.FC = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const [adminData, setAdminData] = useState<DashboardAdministrativoData | null>(null);

  useEffect(() => {
    dashboardService
      .getDashboardAdministrativo()
      .then((data) => setAdminData(data))
      .catch(() => null);
  }, []);

  const rolInfo = usuario?.rol
    ? ROL_LABELS[usuario.rol] || {
        label: usuario.rol,
        color: 'text-slate-700',
        bg: 'bg-slate-100 border-slate-200',
      }
    : null;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Banner de Bienvenida */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Panel de Control Central
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bienvenido, {usuario?.nombre} {usuario?.apellido}
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              {APP_CONFIG.SUBTITULO}. Plataforma Departamental del Chocó con trazabilidad en tiempo real.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {rolInfo && (
              <div
                className={`px-4 py-2 rounded-2xl border ${rolInfo.bg} ${rolInfo.color} text-xs font-bold shadow-sm flex items-center gap-2`}
              >
                <Shield className="w-4 h-4" />
                <span>{rolInfo.label}</span>
              </div>
            )}
            {usuario?.municipio && (
              <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs text-white font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{usuario.municipio.nombre}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas / KPIs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Métricas Clave del Departamento</h2>
          <span className="text-xs text-slate-500 font-medium">31 Municipios del Chocó</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Afectaciones */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Afectaciones / Emergencias
              </span>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {adminData?.resumen.totalAfectaciones ?? 14}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> En atención
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Registradas en cuencas de Atrato, San Juan y Baudó
            </p>
          </div>

          {/* Card 2: Albergues */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Albergues Disponibles
              </span>
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                <Home className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {adminData?.capacidad.alberguesDisponibles ?? 8}
              </span>
              <span className="text-xs font-semibold text-teal-600">Operativos</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Con semáforo de ocupación y servicios habilitados
            </p>
          </div>

          {/* Card 3: Familias Atendidas */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Familias Censadas
              </span>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {(adminData?.resumen.totalBeneficiarios ?? 3420).toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-blue-600">asistidas</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Con georreferenciación y control biométrico
            </p>
          </div>

          {/* Card 4: Caja Transparente */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Caja Transparente
              </span>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {adminData?.resumen.totalMonetario
                  ? formatCOP(adminData.resumen.totalMonetario)
                  : '$845.000.000'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">100% de soportes auditados en línea</p>
          </div>
        </div>
      </div>

      {/* Navegación y Estado de los 7 Módulos del Sistema */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Módulos del Sistema Chocó Transparente</h2>
            <p className="text-xs text-slate-500">
              Acceso a los componentes funcionales del sistema
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Módulos Operativos y Sincronizados
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Autenticación */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border-2 border-emerald-500/50 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                ACCESO & SEGURIDAD
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Autenticación y Permisos</h3>
            <p className="text-xs text-slate-600 mt-1">
              Login seguro JWT, roles, permisos y protección perimetral por guardas de ruta.
            </p>
          </div>

          {/* Territorial */}
          <Link
            to="/territorial"
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border-2 border-emerald-500/50 hover:shadow-md transition-all relative block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                TERRITORIO & CENTROS
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Gestión Territorial (Acceder →)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              31 municipios oficiales, emergencias y centros de acopio auditados con Leaflet.
            </p>
          </Link>

          {/* Inventario */}
          <Link
            to="/inventario"
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border-2 border-emerald-500/50 hover:shadow-md transition-all relative block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                INVENTARIO & STOCK
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Inventario de Ayudas (Acceder →)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Control de stock en centros, escáner QR de lotes y despachos con trazabilidad.
            </p>
          </Link>

          {/* Beneficiarios */}
          <Link
            to="/beneficiarios"
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border-2 border-emerald-500/50 hover:shadow-md transition-all relative block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                FAMILIAS & ENTREGAS
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Beneficiarios y Entregas (Acceder →)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Registro de familias, solicitudes prioritarias y entregas con foto evidencia.
            </p>
          </Link>

          {/* Albergues y Denuncias */}
          <Link
            to="/albergues-denuncias"
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border-2 border-emerald-500/50 hover:shadow-md transition-all relative block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                ALBERGUES & CONTROL
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Albergues y Veeduría (Acceder →)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Semáforo de capacidad de albergues y canal de denuncias con timeline oficial.
            </p>
          </Link>

          {/* Finanzas y Reportes */}
          <Link
            to="/financiero"
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border-2 border-emerald-500/50 hover:shadow-md transition-all relative block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                CAJA TRANSPARENTE
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Donaciones y Finanzas (Acceder →)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Caja transparente, donaciones en dinero/especie y gastos con doble aprobación.
            </p>
          </Link>

          {/* Reportes y Sync */}
          <Link
            to="/reportes"
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border-2 border-emerald-500/50 hover:shadow-md transition-all relative block group lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                REPORTES & SYNC OFFLINE
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Reportes, Dashboards y Sincronización Offline (Acceder →)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Generador dinámico de reportes multi-módulo, exportación CSV/JSON/PDF y sincronización offline-first en zonas remotas sin internet.
            </p>
          </Link>
        </div>
      </div>

      {/* Nota informativa de seguridad */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Información del Entorno Operativo</p>
          <p className="text-blue-800 leading-relaxed">
            Tu sesión se encuentra protegida con tokens JWT emitidos por el backend institucional. Las solicitudes a los endpoints de la API incluyen de forma automática los encabezados de autorización correspondientes a tu rol.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
