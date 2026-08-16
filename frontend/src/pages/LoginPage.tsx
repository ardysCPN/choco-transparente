import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';

import { LoginSchema, LoginFormData } from '../utils/validators';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { APP_CONFIG } from '../utils/constants';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      correo: '',
      contrasena: '',
      recordarme: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      const response = await authService.login({
        correo: data.correo,
        contrasena: data.contrasena,
      });

      if (response.exito && response.datos) {
        login(response.datos.token, response.datos.usuario);
        toast.success(`¡Bienvenido, ${response.datos.usuario.nombre}!`, {
          icon: '✨',
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#064e3b',
            color: '#fff',
          },
        });
        navigate(from, { replace: true });
      } else {
        const msg = response.mensaje || 'Error al iniciar sesión';
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.mensaje ||
        error.message ||
        'Error de conexión con el servidor. Verifica que el backend esté activo.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  // Helper para autocompletar credenciales de prueba pública
  const setDemoCredentials = (correo: string, pass: string) => {
    setValue('correo', correo, { shouldValidate: true });
    setValue('contrasena', pass, { shouldValidate: true });
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900">
      {/* Panel Izquierdo: Branding & Contexto Departamental */}
      <div className="relative lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Decoraciones visuales de fondo */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado Institucional */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 p-0.5 shadow-xl shadow-emerald-900/50 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {APP_CONFIG.DEPARTAMENTO}
              </span>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                {APP_CONFIG.NOMBRE}
              </h1>
            </div>
          </div>
        </div>

        {/* Hero Central */}
        <div className="relative z-10 my-10 lg:my-0 max-w-lg space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Transparencia y Control en Tiempo Real
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Gestión territorial integral y trazabilidad de ayudas humanitarias.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Plataforma oficial para la coordinación de emergencias, inventarios de acopio,
            censo de beneficiarios y auditoría pública de recursos en el Chocó.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>31 Municipios Conectados</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Evidencia Fotográfica Geolocalizada</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Caja Transparente y Donaciones</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Auditoría y Veeduría Ciudadana</span>
            </div>
          </div>
        </div>

        {/* Footer Institucional */}
        <div className="relative z-10 text-xs text-slate-500">
          <p>© 2026 {APP_CONFIG.DEPARTAMENTO}. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Panel Derecho: Formulario de Autenticación */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-900">
        <div className="w-full max-w-md space-y-6 bg-slate-950/80 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
          {/* Botón Superior para Volver al Portal Público */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-emerald-400 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold transition-all shadow-sm group w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>← Volver al Portal Ciudadano</span>
          </Link>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Iniciar Sesión
            </h3>
            <p className="text-sm text-slate-400">
              Ingresa tus credenciales oficiales para acceder al portal administrativo.
            </p>
          </div>

          {/* Mensaje de error si ocurre */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Campo Correo */}
            <div className="space-y-1.5">
              <label
                htmlFor="correo"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="correo"
                  type="email"
                  placeholder="usuario@chocotransparente.gov.co"
                  autoComplete="email"
                  {...register('correo')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.correo
                      ? 'border-rose-500 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.correo && (
                <p className="text-xs text-rose-400 font-medium">
                  {errors.correo.message}
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="contrasena"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="contrasena"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('contrasena')}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl bg-slate-900 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.contrasena
                      ? 'border-rose-500 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.contrasena && (
                <p className="text-xs text-rose-400 font-medium">
                  {errors.contrasena.message}
                </p>
              )}
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validando acceso...</span>
                </>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Selector de Cuenta Demo de Pruebas (Solo Operador de Testing) */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400">
                Acceso rápido para evaluadores:
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setDemoCredentials('admin@chocotransparente.gov.co', 'AdminChoco2026!')
                }
                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/60 hover:border-emerald-400 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-1.5"
              >
                <span>👑 Superadministrador (Gobernación)</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setDemoCredentials('test@chocotransparente.gov.co', 'TestChoco2026!')
                }
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>🧪 Operador / Coordinador</span>
              </button>
            </div>

            {/* Enlace al Portal Público */}
            <div className="pt-2 text-center border-t border-slate-800/50">
              <Link
                to="/"
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium inline-flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>¿Buscas ayuda o reportes? <strong className="text-emerald-400 underline ml-1">Ir al Portal Ciudadano</strong></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
