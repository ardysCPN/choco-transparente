import React, { useState } from 'react';
import {
  DollarSign,
  Shield,
  CheckCircle2,
  Copy,
  Package,
  HeartHandshake,
} from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { DonacionPublicaPayload } from '../../types/publico.types';
import toast from 'react-hot-toast';

export const PortalDonarPage: React.FC = () => {
  const [tipoDonacion, setTipoDonacion] = useState<'DINERO' | 'ESPECIE'>('DINERO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exito, setExito] = useState(false);

  const [formData, setFormData] = useState<DonacionPublicaPayload>({
    tipo: 'DINERO',
    donante: '',
    correo: '',
    telefono: '',
    municipioId: 1,
    descripcion: '',
    monto: 100000,
    referenciaTransferencia: '',
    tipoAyuda: 'ALIMENTOS',
    cantidad: 10,
    unidadMedida: 'KITS',
    requiereTransporte: false,
  });

  const copiarAlPortapapeles = (texto: string) => {
    navigator.clipboard.writeText(texto);
    toast.success('¡Copiado al portapapeles!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donante || !formData.telefono) {
      toast.error('Por favor complete los campos obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      await publicoService.registrarDonacion({
        ...formData,
        tipo: tipoDonacion,
      });
      setExito(true);
      toast.success('¡Donación registrada para verificación!');
    } catch (err) {
      toast.error('Error al registrar la donación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      {/* Header en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
            <span>Fondo de Ayuda Humanitaria Oficial</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Canal de Donaciones Auditadas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Realice aportes en dinero a las cuentas oficiales o registre donaciones en especie para logística y entrega.
          </p>
        </div>

        {/* Toggle Tipo de Donación */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setTipoDonacion('DINERO');
              setExito(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tipoDonacion === 'DINERO'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💰 Donación Monetaria
          </button>
          <button
            type="button"
            onClick={() => {
              setTipoDonacion('ESPECIE');
              setExito(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tipoDonacion === 'ESPECIE'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📦 Donación en Especie
          </button>
        </div>
      </div>

      {exito ? (
        <div className="bg-white border border-emerald-300 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            ¡Muchas gracias por su solidaridad!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Su intención de donación ha sido radicada correctamente. El equipo de auditoría y logística del CDGRD verificará los datos y se pondrá en contacto con usted.
          </p>
          <button
            onClick={() => setExito(false)}
            className="mt-4 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
          >
            Realizar otra donación
          </button>
        </div>
      ) : tipoDonacion === 'DINERO' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cuentas Bancarias Oficiales */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>Cuentas Bancarias Autorizadas</span>
              </div>

              {/* Cuenta 1: Bancolombia */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">Bancolombia</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Cuenta de Ahorros
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Titular: <strong>Fondo Departamental de Gestión del Riesgo Chocó</strong>
                </div>
                <div className="text-xs text-slate-600">
                  NIT: <strong>891.680.024-5</strong>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="font-mono font-black text-slate-900 text-base">458-920194-11</span>
                  <button
                    onClick={() => copiarAlPortapapeles('458-920194-11')}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
                    title="Copiar número de cuenta"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cuenta 2: Banco Agrario */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">Banco Agrario de Colombia</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Cuenta Corriente
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Titular: <strong>Gobernación del Chocó - Emergencias</strong>
                </div>
                <div className="text-xs text-slate-600">
                  NIT: <strong>891.680.024-5</strong>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="font-mono font-black text-slate-900 text-base">3001-002948-2</span>
                  <button
                    onClick={() => copiarAlPortapapeles('3001-002948-2')}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
                    title="Copiar número de cuenta"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Reporte de Transferencia */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Reportar Transferencia Realizada
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Diligencie este formulario para certificar su aporte y publicarlo de forma auditada en la Caja Transparente.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre o Razón Social *</label>
                <input
                  type="text"
                  placeholder="Nombre de la persona o empresa"
                  value={formData.donante}
                  onChange={(e) => setFormData({ ...formData, donante: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    placeholder="300 000 0000"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monto Donado (COP) *</label>
                  <input
                    type="number"
                    min="10000"
                    step="10000"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">N° Comprobante / Ref</label>
                  <input
                    type="text"
                    placeholder="Ej: APROB-98214"
                    value={formData.referenciaTransferencia}
                    onChange={(e) => setFormData({ ...formData, referenciaTransferencia: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-xs flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                <span>{isSubmitting ? 'Registrando...' : 'Registrar Aporte para Certificación'}</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Formulario de Donación en Especie */
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto">
          <h3 className="font-extrabold text-base text-slate-900 mb-1">
            Registro de Donación en Especie
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Registre los bienes que desea aportar para coordinar su recepción en un centro de acopio o recogida logística.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre del Donante / Organización *</label>
              <input
                type="text"
                placeholder="Persona u organización"
                value={formData.donante}
                onChange={(e) => setFormData({ ...formData, donante: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono de Contacto *</label>
                <input
                  type="tel"
                  placeholder="300 000 0000"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipo de Ayuda *</label>
                <select
                  value={formData.tipoAyuda}
                  onChange={(e) => setFormData({ ...formData, tipoAyuda: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALIMENTOS">Kits de Alimentos no perecederos</option>
                  <option value="AGUA">Agua Potable tratada</option>
                  <option value="ASEO">Kits de Aseo e Higiene</option>
                  <option value="COLCHONETAS">Colchonetas y Frazadas</option>
                  <option value="MEDICAMENTOS">Medicamentos / Primeros Auxilios</option>
                  <option value="HERRAMIENTAS">Herramientas y Construcción</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cantidad *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Unidad de Medida *</label>
                <input
                  type="text"
                  placeholder="Kits, Cajas, Litros, Bultos"
                  value={formData.unidadMedida}
                  onChange={(e) => setFormData({ ...formData, unidadMedida: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Descripción de los Artículos</label>
              <textarea
                rows={2}
                placeholder="Detalles sobre empaque, fechas de vencimiento o especificaciones"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="reqTrans"
                checked={formData.requiereTransporte}
                onChange={(e) => setFormData({ ...formData, requiereTransporte: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <label htmlFor="reqTrans" className="text-slate-700 font-medium cursor-pointer">
                Requiero apoyo logístico para transportar la donación hasta el centro de acopio
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold transition shadow-xs flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>{isSubmitting ? 'Registrando...' : 'Registrar Donación en Especie'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PortalDonarPage;
