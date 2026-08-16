import React, { useState } from 'react';
import { X, User, Mail, Lock } from 'lucide-react';
import { Usuario, Rol, CrearUsuarioInput, ActualizarUsuarioInput } from '../../types/usuarios.types';
import { Municipio } from '../../types/territorial.types';
import toast from 'react-hot-toast';

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CrearUsuarioInput | ActualizarUsuarioInput) => Promise<void>;
  usuarioToEdit?: Usuario | null;
  roles: Rol[];
  municipios: Municipio[];
}

export const UsuarioModal: React.FC<UsuarioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  usuarioToEdit,
  roles,
  municipios,
}) => {
  const [nombre, setNombre] = useState(usuarioToEdit?.nombre || '');
  const [apellido, setApellido] = useState(usuarioToEdit?.apellido || '');
  const [tipoDocumento, setTipoDocumento] = useState(usuarioToEdit?.tipoDocumento || 'CC');
  const [documento, setDocumento] = useState(usuarioToEdit?.documento || '');
  const [correo, setCorreo] = useState(usuarioToEdit?.correo || '');
  const [contrasena, setContrasena] = useState('');
  const [rolId, setRolId] = useState<number>(usuarioToEdit?.rolId || (roles[0]?.id || 3));
  const [municipioId, setMunicipioId] = useState<number | ''>(usuarioToEdit?.municipioId || '');
  const [telefono, setTelefono] = useState(usuarioToEdit?.telefono || '');
  const [cargo, setCargo] = useState(usuarioToEdit?.cargo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim() || !correo.trim() || !documento.trim()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (!usuarioToEdit && !contrasena.trim()) {
      toast.error('La contraseña es obligatoria para nuevos usuarios');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        tipoDocumento,
        documento: documento.trim(),
        correo: correo.trim(),
        rolId: Number(rolId),
        municipioId: municipioId ? Number(municipioId) : null,
        telefono: telefono.trim() || undefined,
        cargo: cargo.trim() || undefined,
      };

      if (contrasena.trim()) {
        payload.contrasena = contrasena.trim();
      }

      await onSave(payload);
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.mensaje || 'Error al guardar usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {usuarioToEdit ? 'Editar Usuario Operativo' : 'Crear Nuevo Usuario Institucional'}
              </h3>
              <p className="text-xs text-slate-300">
                {usuarioToEdit ? `Modificando acceso de ${usuarioToEdit.nombre}` : 'Asigna rol, municipio y credenciales de acceso'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nombre *</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Carlos"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Apellido */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Apellido *</label>
              <input
                type="text"
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ej. Palacios"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Tipo Documento */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tipo de Documento *</label>
              <select
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="CE">Cédula de Extranjería (CE)</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="NIT">NIT Institucional</option>
              </select>
            </div>

            {/* Documento */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Número de Documento *</label>
              <input
                type="text"
                required
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="Ej. 1077489230"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Correo */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Correo Electrónico Institucional *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="coordinador.quibdo@chocotransparente.gov.co"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                {usuarioToEdit ? 'Nueva Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña Inicial *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder={usuarioToEdit ? '••••••••' : 'Mínimo 8 caracteres'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Rol Asignado */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Rol del Sistema *</label>
              <select
                value={rolId}
                onChange={(e) => setRolId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre} — {r.descripcion}
                  </option>
                ))}
              </select>
            </div>

            {/* Municipio Asignado */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Municipio Asignado</label>
              <select
                value={municipioId}
                onChange={(e) => setMunicipioId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">Ámbito Departamental (Global)</option>
                {municipios.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Teléfono / Celular</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej. 312 456 7890"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Cargo */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Cargo / Responsabilidad</label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ej. Coordinador de Acopio Quibdó"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Footer del Modal */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/20 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Guardando...' : usuarioToEdit ? 'Actualizar Usuario' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
