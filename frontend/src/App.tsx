import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './guards/PrivateRoute';
import PublicRoute from './guards/PublicRoute';
import Layout from './components/common/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TerritorialPage from './pages/TerritorialPage';
import InventarioPage from './pages/InventarioPage';
import BeneficiariosPage from './pages/BeneficiariosPage';
import AlberguesDenunciasPage from './pages/AlberguesDenunciasPage';
import FinancieroPage from './pages/FinancieroPage';
import ReportesPage from './pages/ReportesPage';
import UsuariosPage from './pages/UsuariosPage';
import NotFoundPage from './pages/NotFoundPage';

// Componentes del Portal Público
import PortalLayout from './components/portal/PortalLayout';
import PortalInicioPage from './pages/portal/PortalInicioPage';
import PortalMapaPage from './pages/portal/PortalMapaPage';
import PortalMunicipiosPage from './pages/portal/PortalMunicipiosPage';
import PortalMunicipioDetallePage from './pages/portal/PortalMunicipioDetallePage';
import PortalCentrosAcopioPage from './pages/portal/PortalCentrosAcopioPage';
import PortalCentroDetallePage from './pages/portal/PortalCentroDetallePage';
import PortalInventarioPage from './pages/portal/PortalInventarioPage';
import PortalAlberguesPage from './pages/portal/PortalAlberguesPage';
import PortalAfectacionesPage from './pages/portal/PortalAfectacionesPage';
import PortalSolicitarAyudaPage from './pages/portal/PortalSolicitarAyudaPage';
import PortalComoAyudarPage from './pages/portal/PortalComoAyudarPage';
import PortalDonarPage from './pages/portal/PortalDonarPage';
import PortalVoluntariadoPage from './pages/portal/PortalVoluntariadoPage';
import PortalTransportePage from './pages/portal/PortalTransportePage';
import PortalDenunciarPage from './pages/portal/PortalDenunciarPage';
import PortalContactosPage from './pages/portal/PortalContactosPage';
import PortalTransparenciaPage from './pages/portal/PortalTransparenciaPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================================= */}
        {/* RUTAS DEL PORTAL PÚBLICO CIUDADANO (Acceso Universal)     */}
        {/* ========================================================= */}
        <Route element={<PortalLayout />}>
          <Route path="/" element={<PortalInicioPage />} />
          <Route path="/mapa" element={<PortalMapaPage />} />
          <Route path="/municipios" element={<PortalMunicipiosPage />} />
          <Route path="/municipios/:id" element={<PortalMunicipioDetallePage />} />
          <Route path="/centros-acopio" element={<PortalCentrosAcopioPage />} />
          <Route path="/centros-acopio/:id" element={<PortalCentroDetallePage />} />
          <Route path="/inventario-publico" element={<PortalInventarioPage />} />
          <Route path="/albergues-publico" element={<PortalAlberguesPage />} />
          <Route path="/afectaciones-publico" element={<PortalAfectacionesPage />} />
          <Route path="/solicitar-ayuda" element={<PortalSolicitarAyudaPage />} />
          <Route path="/como-ayudar" element={<PortalComoAyudarPage />} />
          <Route path="/donar" element={<PortalDonarPage />} />
          <Route path="/voluntariado" element={<PortalVoluntariadoPage />} />
          <Route path="/transporte" element={<PortalTransportePage />} />
          <Route path="/denunciar" element={<PortalDenunciarPage />} />
          <Route path="/contactos" element={<PortalContactosPage />} />
          <Route path="/transparencia" element={<PortalTransparenciaPage />} />
        </Route>

        {/* Acceso a inicio de sesión de funcionarios */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* ========================================================= */}
        {/* RUTAS ADMINISTRATIVAS PRIVADAS (Requieren Token JWT)       */}
        {/* ========================================================= */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/territorial" element={<TerritorialPage />} />
            <Route path="/inventario" element={<InventarioPage />} />
            <Route path="/beneficiarios" element={<BeneficiariosPage />} />
            <Route path="/albergues-denuncias" element={<AlberguesDenunciasPage />} />
            <Route path="/financiero" element={<FinancieroPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/admin/usuarios" element={<UsuariosPage />} />
          </Route>
        </Route>

        {/* Ruta comodín 404 */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;