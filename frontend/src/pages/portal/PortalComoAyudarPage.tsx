import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  DollarSign,
  Package,
  Users,
  Truck,
  Building,
  ArrowRight,
  LifeBuoy,
} from 'lucide-react';

export const PortalComoAyudarPage: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto w-full">
      {/* Header en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
          <span>Solidaridad Humanitaria Activa</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          ¿Cómo quieres ayudar al Chocó?
        </h1>

        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Toda ayuda suma. Ponemos a tu disposición 5 canales oficiales y auditados para canalizar donaciones en dinero o especie, voluntariado y apoyo logístico.
        </p>
      </div>

      {/* Grid de 5 Formas de Ayuda */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Donación Monetaria */}
        <Link
          to="/donar"
          className="group bg-white border border-slate-200/90 hover:border-emerald-500 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition">
              Donación Monetaria Oficial
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Realiza transferencias a las cuentas bancarias oficiales del Fondo Departamental de Emergencia con certificación inmediata.
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-emerald-700 gap-1 pt-2">
            <span>Ver cuentas y registrar aporte</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 2. Donación en Especie */}
        <Link
          to="/donar"
          className="group bg-white border border-slate-200/90 hover:border-cyan-500 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-cyan-700 transition">
              Donación en Especie
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Alimentos no perecederos, agua potable tratada, kits de aseo, colchonetas y frazadas para damnificados.
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-cyan-700 gap-1 pt-2">
            <span>Registrar donación en especie</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 3. Voluntariado */}
        <Link
          to="/voluntariado"
          className="group bg-white border border-slate-200/90 hover:border-amber-500 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-amber-700 transition">
              Red de Voluntariado
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inscríbete para apoyar en armado de paquetes, cocina comunitaria, censo y atención directa en albergues.
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-amber-700 gap-1 pt-2">
            <span>Inscribirme como voluntario</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 4. Transporte Fluvial / Terrestre */}
        <Link
          to="/transporte"
          className="group bg-white border border-slate-200/90 hover:border-indigo-500 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-700 transition">
              Transporte y Logística
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Registra tu lancha rápida, bote fluvial con motor o vehículo 4x4 para trasladar suministros hacia zonas de difícil acceso.
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-indigo-700 gap-1 pt-2">
            <span>Registrar transporte</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 5. Proponer Centro de Acopio */}
        <Link
          to="/centros-acopio"
          className="group bg-white border border-slate-200/90 hover:border-purple-500 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition flex flex-col justify-between md:col-span-2 lg:col-span-2"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 group-hover:scale-110 transition-transform">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-purple-700 transition">
              Centros de Acopio y Veeduría
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Postula un espacio comunal o consulta los centros habilitados en los 31 municipios para llevar tu aporte directamente.
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-purple-700 gap-1 pt-2">
            <span>Ver centros de acopio autorizados</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Banner de Auxilio */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-extrabold text-rose-900 flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-rose-600" />
            <span>¿Tú o tu comunidad necesitan auxilio humanitario?</span>
          </h4>
          <p className="text-xs text-rose-700 font-medium">
            Radica tu solicitud con los datos básicos de tu hogar o sector para priorizar la respuesta del CDGRD.
          </p>
        </div>
        <Link
          to="/solicitar-ayuda"
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs shrink-0"
        >
          🆘 Solicitar Ayuda Ahora
        </Link>
      </div>
    </div>
  );
};

export default PortalComoAyudarPage;
