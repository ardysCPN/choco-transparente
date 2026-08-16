import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white text-center">
      <div className="w-full max-w-md space-y-6 bg-slate-950/60 p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="text-5xl font-black">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Página No Encontrada
          </h1>
          <p className="text-sm text-slate-400">
            La ruta a la que intentas acceder no existe o fue reubicada en el sistema.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors shadow-lg shadow-emerald-950/40"
          >
            <Home className="w-4 h-4" />
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
