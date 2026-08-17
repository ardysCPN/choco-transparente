import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  MapPin,
  HeartHandshake,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  LifeBuoy,
  Layers,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Phone,
  Package,
  Users,
  Search,
  ExternalLink,
} from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { DashboardPublicoData } from '../../types/reporte-dashboard.types';
import {
  MunicipioPublico,
  CentroAcopioPublico,
  AlberguePublico,
  AfectacionPublica,
  InventarioConsolidadoItem,
} from '../../types/publico.types';
import { ModuloValidacionAyuda } from '../../components/portal/ModuloValidacionAyuda';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix para icons en Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Helper universal para parsear coordenadas (soporta number, string decimal y null)
const parseCoords = (lat?: number | string | null, lng?: number | string | null): [number, number] | null => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return null;
  const numLat = typeof lat === 'number' ? lat : parseFloat(String(lat));
  const numLng = typeof lng === 'number' ? lng : parseFloat(String(lng));
  if (isNaN(numLat) || isNaN(numLng)) return null;
  return [numLat, numLng];
};

// Componente para redibujar tiles y centrar mapa
const MapController: React.FC<{ selectedCoords?: [number, number] | null }> = ({ selectedCoords }) => {
  const map = useMap();

  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    const t3 = setTimeout(() => map.invalidateSize(), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [map]);

  useEffect(() => {
    if (selectedCoords && selectedCoords[0] && selectedCoords[1]) {
      map.flyTo(selectedCoords, 12, { animate: true, duration: 1.2 });
    }
  }, [selectedCoords, map]);

  return null;
};

// Creador de pines vectoriales de alto contraste
const createMarkerIcon = (color: string, symbol: string) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;
      ">
        ${symbol}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export const PortalInicioPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardPublicoData | null>(null);
  const [municipios, setMunicipios] = useState<MunicipioPublico[]>([]);
  const [centros, setCentros] = useState<CentroAcopioPublico[]>([]);
  const [albergues, setAlbergues] = useState<AlberguePublico[]>([]);
  const [afectaciones, setAfectaciones] = useState<AfectacionPublica[]>([]);
  const [inventario, setInventario] = useState<InventarioConsolidadoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  // Estados de capas del mapa (activadas por defecto)
  const [verMunicipios, setVerMunicipios] = useState(true);
  const [verCentros, setVerCentros] = useState(true);
  const [verAlbergues, setVerAlbergues] = useState(true);
  const [verAfectaciones, setVerAfectaciones] = useState(true);

  const defaultCenter: [number, number] = [5.694722, -76.661111]; // Quibdó

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [dashRes, munRes, cenRes, albRes, afeRes, invRes] = await Promise.all([
        publicoService.getDashboard(),
        publicoService.getMunicipios(),
        publicoService.getCentrosAcopio(),
        publicoService.getAlbergues(),
        publicoService.getAfectaciones(),
        publicoService.getInventario(),
      ]);

      if (dashRes) setDashboard(dashRes);
      setMunicipios(munRes || []);
      setCentros(cenRes || []);
      setAlbergues(albRes || []);
      setAfectaciones(afeRes || []);
      setInventario(invRes || []);
    } catch (error) {
      console.error('Error al cargar datos del portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const formatCOP = (val?: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const municipiosFiltrados = municipios.filter((m) =>
    m.nombre.toLowerCase().includes(filtroMunicipio.toLowerCase()) ||
    m.codigoDane.includes(filtroMunicipio)
  );

  const totalStockUnidades = inventario.reduce((acc, i) => acc + (i.totalUnidades || 0), 0);

  const handleMunicipioSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const munId = Number(e.target.value);
    if (!munId) {
      setSelectedCoords(defaultCenter);
      return;
    }
    const found = municipios.find((m) => m.id === munId);
    if (found) {
      const coords = parseCoords(found.latitud, found.longitud);
      if (coords) setSelectedCoords(coords);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 w-full">
      {/* ========================================================================= */}
      {/* 1. SECCIÓN HERO INSTITUCIONAL (Fondo Cálido, Autoridad y Tricolor Chocó)  */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 border border-emerald-800/40 shadow-xl p-6 sm:p-10 lg:p-14 text-white">
        {/* Resplandores territoriales suaves */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Badge institucional */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gobernación del Chocó • CDGRD • Sistema Oficial de Transparencia</span>
          </div>

          {/* Título & Mensaje Claro */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Transparencia, Coordinación y Ayuda para el{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-sky-300">
              Chocó
            </span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl font-normal">
            Conoce en tiempo real el estado de la emergencia humanitaria, ubica los centros de acopio autorizados,
            consulta las ayudas recibidas y entregadas, y canaliza tu solidaridad de forma segura en los <strong>31 municipios</strong>.
          </p>

          {/* Botones de Acción Ciudadana Principales */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/solicitar-ayuda"
              className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <LifeBuoy className="w-5 h-5" />
              <span>🆘 Necesito Ayuda Humanitaria</span>
            </Link>

            <Link
              to="/mapa"
              className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl border border-white/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 backdrop-blur-xs"
            >
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>Explorar Mapa en Vivo</span>
            </Link>

            <Link
              to="/como-ayudar"
              className="bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-200 border border-emerald-400/40 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 backdrop-blur-xs"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>¿Cómo Puedo Ayudar?</span>
            </Link>

            <button
              onClick={cargarDatos}
              disabled={isLoading}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition"
              title="Actualizar información en vivo"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-300' : ''}`} />
            </button>
          </div>
        </div>

        {/* Semáforo Departamental y Barra de Resumen en Portada */}
        <div className="relative z-10 mt-10 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/25 shrink-0"></div>
            <div>
              <span className="text-slate-300 block font-medium text-[11px]">Estado General</span>
              <span className="text-white font-bold">Monitoreo Activo 24/7</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-amber-400/25 shrink-0"></div>
            <div>
              <span className="text-slate-300 block font-medium text-[11px]">Territorio</span>
              <span className="text-white font-bold">31 Municipios Oficiales</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-sky-400 ring-4 ring-sky-400/25 shrink-0"></div>
            <div>
              <span className="text-slate-300 block font-medium text-[11px]">Centros de Acopio</span>
              <span className="text-white font-bold">{centros.length} Puntos Auditados</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-400 ring-4 ring-rose-400/25 shrink-0"></div>
            <div>
              <span className="text-slate-300 block font-medium text-[11px]">Canal de Veeduría</span>
              <span className="text-white font-bold">100% Anónimo y Seguro</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MÓDULO: ¿ESTA PERSONA YA RECIBIÓ AYUDA? (VALIDACIÓN RÁPIDA DE AYUDA)   */}
      {/* ========================================================================= */}
      <ModuloValidacionAyuda />

      {/* ========================================================================= */}
      {/* 3. ESTADÍSTICAS Y KPIS CIUDADANOS EN FONDO CLARO                         */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Transparencia y Cifras Reales</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Impacto y Ayuda Humanitaria en Cifras
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Fuente oficial: Gobernación del Chocó / CDGRD
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Tarjeta 1: Familias Asistidas */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Censo Oficial
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {isLoading ? '...' : (dashboard?.impacto?.personasAsistidas ?? 0).toLocaleString()}
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-1">
                Familias y Damnificados Censados
              </p>
            </div>
          </div>

          {/* Tarjeta 2: Stock de Ayudas */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl border border-sky-100">
                <Package className="w-6 h-6" />
              </div>
              <Link to="/inventario-publico" className="text-xs font-bold text-sky-700 hover:text-sky-800">
                Ver Stock →
              </Link>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {isLoading ? '...' : totalStockUnidades.toLocaleString()}
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-1">
                Kits e Insumos en Bodegas
              </p>
            </div>
          </div>

          {/* Tarjeta 3: Centros de Acopio Aprobados */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100">
                <Shield className="w-6 h-6" />
              </div>
              <Link to="/centros-acopio" className="text-xs font-bold text-amber-700 hover:text-amber-800">
                Ver Centros →
              </Link>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {isLoading ? '...' : centros.length}
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-1">
                Centros de Acopio Auditados
              </p>
            </div>
          </div>

          {/* Tarjeta 4: Caja Transparente */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                <DollarSign className="w-6 h-6" />
              </div>
              <Link to="/transparencia" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
                Caja Abierta →
              </Link>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                {isLoading ? '...' : formatCOP(dashboard?.resumen?.total_donaciones_dinero)}
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-1">
                Donaciones Monetarias Auditadas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAPA DE LA EMERGENCIA EN TIEMPO REAL (Conexión 100% Funcional y Puntos) */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Georreferenciación Departamental</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Mapa de la Emergencia y Recursos en Tiempo Real
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Visualiza en el mapa los municipios, centros de acopio autorizados, albergues y afectaciones activas.
            </p>
          </div>

          {/* Selector de municipio rápido para centrar la cámara del mapa */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              onChange={handleMunicipioSelect}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">🗺️ Centrar en un municipio...</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} (Alerta {m.nivelAlerta})
                </option>
              ))}
            </select>

            <Link
              to="/mapa"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Pantalla Completa</span>
            </Link>
          </div>
        </div>

        {/* Filtros de Capas con Botones Claros y Conteo en Vivo */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100 rounded-2xl text-xs">
          <button
            onClick={() => setVerMunicipios(!verMunicipios)}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
              verMunicipios
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>31 Municipios ({municipios.length})</span>
          </button>

          <button
            onClick={() => setVerCentros(!verCentros)}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
              verCentros
                ? 'bg-sky-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sky-300"></span>
            <span>Centros de Acopio ({centros.length})</span>
          </button>

          <button
            onClick={() => setVerAlbergues(!verAlbergues)}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
              verAlbergues
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-300"></span>
            <span>Albergues ({albergues.length})</span>
          </button>

          <button
            onClick={() => setVerAfectaciones(!verAfectaciones)}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
              verAfectaciones
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-300"></span>
            <span>Afectaciones Activas ({afectaciones.length})</span>
          </button>
        </div>

        {/* Contenedor del Mapa Leaflet con controlador de tamaño y dibujo */}
        <div className="h-[480px] w-full rounded-2xl overflow-hidden border border-slate-300 shadow-inner relative z-0">
          <MapContainer
            center={defaultCenter}
            zoom={8}
            style={{ height: '100%', width: '100%', backgroundColor: '#e2e8f0' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController selectedCoords={selectedCoords} />

            {/* Capa 1: 31 Municipios Oficiales */}
            {verMunicipios &&
              municipios.map((mun) => {
                const coords = parseCoords(mun.latitud, mun.longitud);
                if (!coords) return null;
                const pinColor =
                  mun.nivelAlerta === 'ROJO'
                    ? '#e11d48'
                    : mun.nivelAlerta === 'AMARILLO'
                    ? '#d97706'
                    : '#059669';
                return (
                  <Marker
                    key={`mun-${mun.id}`}
                    position={coords}
                    icon={createMarkerIcon(pinColor, '🏛️')}
                  >
                    <Popup>
                      <div className="p-1 space-y-1 text-slate-900">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                            mun.nivelAlerta === 'ROJO'
                              ? 'bg-rose-600'
                              : mun.nivelAlerta === 'AMARILLO'
                              ? 'bg-amber-600'
                              : 'bg-emerald-600'
                          }`}
                        >
                          Municipio Oficial • Alerta {mun.nivelAlerta}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-1">{mun.nombre}</h4>
                        <p className="text-xs text-slate-600">Código DANE: {mun.codigoDane}</p>
                        <div className="text-xs text-slate-700 font-semibold space-y-0.5 pt-1 border-t border-slate-200">
                          <p>⚠️ Afectaciones activas: {mun.afectacionesActivas}</p>
                          <p>🏠 Centros de acopio: {mun.centrosAprobados}</p>
                          <p>🛏️ Albergues disponibles: {mun.alberguesDisponibles}</p>
                        </div>
                        <Link
                          to={`/municipios/${mun.id}`}
                          className="mt-2 block text-center text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 py-1.5 rounded-lg transition"
                        >
                          Ver Ficha del Municipio →
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Capa 2: Centros de Acopio (Azul / Sky) */}
            {verCentros &&
              centros.map((centro) => {
                const coords = parseCoords(centro.latitud, centro.longitud);
                if (!coords) return null;
                return (
                  <Marker
                    key={`cen-${centro.id}`}
                    position={coords}
                    icon={createMarkerIcon('#0284c7', '🏠')}
                  >
                    <Popup>
                      <div className="p-1 space-y-1 text-slate-900">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                          Centro de Acopio Autorizado
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900">{centro.nombre}</h4>
                        <p className="text-xs text-slate-600">{centro.direccion}</p>
                        <p className="text-xs font-bold text-slate-700">
                          Municipio: {centro.municipio?.nombre}
                        </p>
                        {centro.telefono && (
                          <p className="text-xs text-slate-500">Teléfono: {centro.telefono}</p>
                        )}
                        <Link
                          to={`/centros-acopio/${centro.id}`}
                          className="mt-2 block text-center text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 py-1.5 rounded-lg transition"
                        >
                          Consultar Detalle y Stock →
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Capa 3: Albergues (Índigo) */}
            {verAlbergues &&
              albergues.map((albergue) => {
                const coords = parseCoords(albergue.latitud, albergue.longitud);
                if (!coords) return null;
                return (
                  <Marker
                    key={`alb-${albergue.id}`}
                    position={coords}
                    icon={createMarkerIcon('#4f46e5', '🛏️')}
                  >
                    <Popup>
                      <div className="p-1 space-y-1 text-slate-900">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          Albergue Oficial
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900">{albergue.nombre}</h4>
                        <p className="text-xs text-slate-600">{albergue.municipio?.nombre}</p>
                        <div className="text-xs font-bold text-slate-700 pt-1">
                          Capacidad: {albergue.capacidad} personas
                        </div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            albergue.estado === 'DISPONIBLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Estado: {albergue.estado}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Capa 4: Afectaciones (Rojo) */}
            {verAfectaciones &&
              afectaciones.map((afectacion) => {
                const coords = parseCoords(afectacion.latitud, afectacion.longitud);
                if (!coords) return null;
                return (
                  <Marker
                    key={`afe-${afectacion.id}`}
                    position={coords}
                    icon={createMarkerIcon('#e11d48', '⚠️')}
                  >
                    <Popup>
                      <div className="p-1 space-y-1 text-slate-900">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Emergencia / Afectación
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900">{afectacion.tipo}</h4>
                        <p className="text-xs text-slate-600">{afectacion.municipio?.nombre}</p>
                        <p className="text-xs text-slate-700">{afectacion.descripcion}</p>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Severidad: {afectacion.severidad}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECCIÓN "¿CÓMO PUEDES AYUDAR?" (5 Opciones en Fondo Claro)             */}
      {/* ========================================================================= */}
      <section className="space-y-6" id="como-ayudar">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>Red Solidaria por el Chocó</span>
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            ¿Cómo Puedes Ayudar al Territorio?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Selecciona la vía con la que deseas vincularte para que la ayuda llegue directamente y con total trazabilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* 1. Donar en especie */}
          <Link
            to="/donar"
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                🙋
              </div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                Tengo algo para donar
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Alimentos no perecederos, agua potable, kits de aseo, colchonetas y frazadas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Registrar aporte</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. Donación Monetaria */}
          <Link
            to="/donar"
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                💰
              </div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-amber-700 transition-colors">
                Donación de Dinero
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Aporte directo a las cuentas bancarias oficiales auditadas del Fondo de Gestión del Riesgo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Cuentas oficiales</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 3. Voluntariado */}
          <Link
            to="/voluntariado"
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-sky-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                🙌
              </div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-sky-700 transition-colors">
                Quiero ser Voluntario
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Armado de kits de ayuda, apoyo logístico, cocina comunitaria y atención en albergues.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
              <span>Inscribirme</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 4. Transporte Fluvial / Terrestre */}
          <Link
            to="/transporte"
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                🚤
              </div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-700 transition-colors">
                Tengo Transporte
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Lanchas rápidas, botes con motor fuera de borda o camionetas 4x4 para llevar carga.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
              <span>Registrar vehículo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 5. Postular Centro de Acopio */}
          <Link
            to="/centros-acopio"
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                🏠
              </div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-700 transition-colors">
                Centro de Acopio
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Postula un espacio comunal seguro en tu municipio para recibir y custodiar ayudas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Postular centro</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DIRECTORIO TERRITORIAL DE LOS 31 MUNICIPIOS DEL CHOCÓ                 */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Directorio Territorial</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Los 31 Municipios del Chocó
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Consulta las alertas, centros de acopio y albergues habilitados en cada localidad.
            </p>
          </div>

          {/* Buscador de municipio */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar municipio o código DANE..."
              value={filtroMunicipio}
              onChange={(e) => setFiltroMunicipio(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
          {municipiosFiltrados.map((mun) => (
            <Link
              key={mun.id}
              to={`/municipios/${mun.id}`}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-400 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  DANE: {mun.codigoDane}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    mun.nivelAlerta === 'ROJO'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : mun.nivelAlerta === 'AMARILLO'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  Alerta {mun.nivelAlerta}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {mun.nombre}
                </h4>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span>⚠️ {mun.afectacionesActivas} emergencias</span>
                  <span>🏠 {mun.centrosAprobados} centros</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LÍNEAS OFICIALES Y ORGANISMOS DE SOCORRO EN FONDO CLARO                */}
      {/* ========================================================================= */}
      <section className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-rose-600" />
              <span>Canales Institucionales Verificados</span>
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Directorio de Emergencia y Socorro 24/7
            </h2>
          </div>
          <Link
            to="/contactos"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Ver contactos de las 31 Alcaldías</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 font-black text-xl flex items-center justify-center shrink-0">
              123
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">Policía Nacional</span>
              <span className="text-[11px] text-slate-500">Línea Única de Emergencias</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center shrink-0">
              119
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">Cuerpo de Bomberos</span>
              <span className="text-[11px] text-slate-500">Inundaciones y Rescates</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 font-black text-xl flex items-center justify-center shrink-0">
              144
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">Defensa Civil Chocó</span>
              <span className="text-[11px] text-slate-500">Búsqueda y Apoyo Fluvial</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 font-black text-xl flex items-center justify-center shrink-0">
              132
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">Cruz Roja Colombiana</span>
              <span className="text-[11px] text-slate-500">Primeros Auxilios y Asistencia</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CAJA TRANSPARENTE Y CANAL DE DENUNCIAS ANÓNIMAS                        */}
      {/* ========================================================================= */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Auditoría Ciudadana Abierta</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Caja Transparente y Veeduría Social
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            Cada donación y cada paquete entregado cuenta con registro auditable. Si detectas irregularidades o desvío de ayudas,
            radica tu reporte 100% anónimo con código de seguimiento único.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            to="/transparencia"
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition text-center"
          >
            Ver Caja Transparente
          </Link>
          <Link
            to="/denunciar"
            className="w-full sm:w-auto bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs px-5 py-3 rounded-xl transition text-center flex items-center justify-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Radicar Denuncia Anónima</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PortalInicioPage;
