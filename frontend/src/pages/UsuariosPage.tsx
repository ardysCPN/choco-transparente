import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Shield,
  CheckCircle2,
  XCircle,
  Edit2,
  Power,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { Usuario, Rol, CrearUsuarioInput, ActualizarUsuarioInput } from '../types/usuarios.types';
import { Municipio } from '../types/territorial.types';
import { usuariosService } from '../services/usuarios.service';
import { publicoService } from '../services/publico.service';
import { UsuarioModal } from '../components/usuarios/UsuarioModal';
import { ROL_LABELS } from '../utils/constants';
import { handleApiError } from '../utils/errorHandler';
import toast from 'react-hot-toast';

export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros y búsquedas
  const [activeTab, setActiveTab] = useState<'usuarios' | 'roles'>('usuarios');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRol, setFilterRol] = useState<string>('TODOS');
  const [filterMunicipio, setFilterMunicipio] = useState<string>('TODOS');
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioToEdit, setUsuarioToEdit] = useState<Usuario | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resUsers, resRoles, resMunis] = await Promise.allSettled([
        usuariosService.listarUsuarios(),
        usuariosService.listarRoles(),
        publicoService.getMunicipios(),
      ]);

      if (resUsers.status === 'fulfilled' && resUsers.value.exito && resUsers.value.datos) {
        setUsuarios(resUsers.value.datos);
      }
      if (resRoles.status === 'fulfilled' && resRoles.value.exito && resRoles.value.datos) {
        setRoles(resRoles.value.datos);
      }
      if (resMunis.status === 'fulfilled' && resMunis.value) {
        setMunicipios(resMunis.value as any);
      }
    } catch (error) {
      handleApiError(error, 'Error al sincronizar datos de usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveUsuario = async (data: CrearUsuarioInput | ActualizarUsuarioInput) => {
    try {
      if (usuarioToEdit) {
        await usuariosService.actualizarUsuario(usuarioToEdit.id, data);
        toast.success('Usuario actualizado exitosamente');
      } else {
        await usuariosService.crearUsuario(data as CrearUsuarioInput);
        toast.success('Usuario creado exitosamente');
      }
      fetchData();
    } catch (error) {
      handleApiError(error, 'No fue posible guardar el usuario');
    }
  };

  const handleToggleEstado = async (usuario: Usuario) => {
    try {
      const nuevoEstado = !usuario.activo;
      await usuariosService.cambiarEstado(usuario.id, nuevoEstado);
      toast.success(
        nuevoEstado
          ? `Usuario ${usuario.nombre} activado correctamente`
          : `Usuario ${usuario.nombre} desactivado`
      );
      fetchData();
    } catch (error: any) {
      handleApiError(error, 'Error al cambiar estado del usuario');
    }
  };

  const filteredUsuarios = usuarios.filter((u) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      u.nombre?.toLowerCase().includes(term) ||
      u.apellido?.toLowerCase().includes(term) ||
      u.correo?.toLowerCase().includes(term) ||
      u.documento?.toLowerCase().includes(term) ||
      u.municipio?.nombre?.toLowerCase().includes(term);

    if (!matchesSearch) return false;
    if (filterRol !== 'TODOS' && String(u.rolId) !== filterRol && u.rol?.nombre !== filterRol) return false;
    if (filterMunicipio !== 'TODOS' && String(u.municipioId) !== filterMunicipio) return false;
    if (filterEstado === 'ACTIVO' && !u.activo) return false;
    if (filterEstado === 'INACTIVO' && u.activo) return false;

    return true;
  });

  const totalActivos = usuarios.filter((u) => u.activo).length;
  const totalInactivos = usuarios.length - totalActivos;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 p-0.5 shadow-md shadow-emerald-600/20 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-emerald-700">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Gestión de Usuarios y Roles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Administración de cuentas, niveles de acceso departamentales y personal operativo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Refrescar lista"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setUsuarioToEdit(null);
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-900/20 flex items-center gap-2 transition hover:scale-105 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Usuarios</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{usuarios.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">En toda la plataforma</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Usuarios Activos</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{totalActivos}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Con acceso permitido</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-rose-700 uppercase tracking-wider">Inactivos</div>
          <div className="text-2xl font-black text-rose-700 mt-1">{totalInactivos}</div>
          <div className="text-[11px] text-rose-600/80 mt-0.5">Acceso suspendido</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-sky-700 uppercase tracking-wider">Roles del Sistema</div>
          <div className="text-2xl font-black text-sky-700 mt-1">{roles.length || 7}</div>
          <div className="text-[11px] text-sky-600/80 mt-0.5">Niveles de seguridad</div>
        </div>
      </div>

      {/* Pestañas de Vista */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'usuarios'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Directorio de Usuarios ({usuarios.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'roles'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Roles & Matriz de Permisos</span>
        </button>
      </div>

      {/* Contenido Pestaña 1: Directorio de Usuarios */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          {/* Barra de Búsqueda y Filtros */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, correo, documento o municipio..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <select
                value={filterRol}
                onChange={(e) => setFilterRol(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white"
              >
                <option value="TODOS">Todos los Roles</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>

              <select
                value={filterMunicipio}
                onChange={(e) => setFilterMunicipio(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white"
              >
                <option value="TODOS">Todos los Municipios</option>
                {municipios.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>

              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white"
              >
                <option value="TODOS">Todos los Estados</option>
                <option value="ACTIVO">Solo Activos</option>
                <option value="INACTIVO">Solo Inactivos</option>
              </select>
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4">Usuario</th>
                    <th className="py-3.5 px-4">Rol del Sistema</th>
                    <th className="py-3.5 px-4">Municipio / Ámbito</th>
                    <th className="py-3.5 px-4">Contacto</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsuarios.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400">
                        {isLoading ? 'Cargando directorio de usuarios...' : 'No se encontraron usuarios con los filtros aplicados.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsuarios.map((u) => {
                      const rolMeta = ROL_LABELS[u.rol?.nombre] || {
                        label: u.rol?.nombre || 'Usuario',
                        color: 'text-slate-700',
                        bg: 'bg-slate-50 border-slate-200',
                      };

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-sky-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                                {u.nombre?.charAt(0)}
                                {u.apellido?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">
                                  {u.nombre} {u.apellido}
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">
                                  {u.tipoDocumento}: {u.documento}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${rolMeta.bg} ${rolMeta.color}`}
                            >
                              <Shield className="w-3 h-3" />
                              <span>{rolMeta.label}</span>
                            </span>
                            {u.cargo && (
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {u.cargo}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{u.municipio?.nombre || 'Gobernación (Global)'}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 font-medium flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{u.correo}</span>
                            </div>
                            {u.telefono && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{u.telefono}</span>
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleEstado(u)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition ${
                                u.activo
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                              }`}
                              title={u.activo ? 'Click para desactivar' : 'Click para activar'}
                            >
                              {u.activo ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Activo</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                  <span>Inactivo</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setUsuarioToEdit(u);
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                                title="Editar datos"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleEstado(u)}
                                className={`p-1.5 rounded-lg transition ${
                                  u.activo
                                    ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                    : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                }`}
                                title={u.activo ? 'Desactivar usuario' : 'Activar usuario'}
                              >
                                <Power className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Pestaña 2: Roles y Matriz de Permisos */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((r) => {
            const meta = ROL_LABELS[r.nombre] || {
              label: r.nombre,
              color: 'text-slate-700',
              bg: 'bg-slate-50 border-slate-200',
            };

            return (
              <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">ID #{r.id}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{r.nombre}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.descripcion}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    <span>Permisos Asignados</span>
                  </div>
                  {r.permisos && r.permisos.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {r.permisos.map((p) => (
                        <span
                          key={p.permiso.id}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                        >
                          {p.permiso.nombre}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      {r.nombre === 'SUPERADMIN' ? 'Acceso global ilimitado (Root)' : 'Permisos heredados por ámbito'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Crear / Editar Usuario */}
      <UsuarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUsuario}
        usuarioToEdit={usuarioToEdit}
        roles={roles}
        municipios={municipios}
      />
    </div>
  );
};

export default UsuariosPage;
