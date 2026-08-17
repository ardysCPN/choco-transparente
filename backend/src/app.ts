import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRutas from './autenticacion/rutas/auth.rutas.js';
import usuarioRutas from './usuarios/rutas/usuario.rutas.js';
import rolRutas from './roles/rutas/rol.rutas.js';
import permisoRutas from './permisos/rutas/permiso.rutas.js';
import municipioRutas from './municipios/rutas/municipio.rutas.js';
import afectacionRutas from './afectaciones/rutas/afectacion.rutas.js';
import centroAcopioRutas from './centros-acopio/rutas/centro-acopio.rutas.js';
import inventarioRutas from './inventario/rutas/inventario.rutas.js';
import beneficiarioRutas from './beneficiarios/rutas/beneficiario.rutas.js';
import solicitudAyudaRutas from './solicitudes-ayuda/rutas/solicitud-ayuda.rutas.js';
import entregaAyudaRutas from './entregas-ayuda/rutas/entrega-ayuda.rutas.js';
import albergueRutas from './albergues/rutas/albergue.rutas.js';
import denunciaRutas from './denuncias/rutas/denuncia.rutas.js';
import donacionRutas from './donaciones/rutas/donacion.rutas.js';
import gastoRutas from './gastos/rutas/gasto.rutas.js';
import reporteRutas from './reportes/rutas/reporte.rutas.js';
import dashboardRutas from './dashboards/rutas/dashboard.rutas.js';
import publicoRutas from './publico/rutas/publico.rutas.js';
import validacionAyudaRutas from './validacion-ayuda/rutas/validacion-ayuda.rutas.js';
import { configuracion } from './configuracion/configuracion.js';
import { ErrorAplicacion } from './comun/errores/errores.js';
import { responderError } from './comun/utilidades/respuestas.js';

// Parche global: permite a Express serializar BigInt a string automáticamente en res.json()
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, mensaje: 'Servidor operativo' });
});

app.use('/api/v1/autenticacion', authRutas);
app.use('/api/v1/usuarios', usuarioRutas);
app.use('/api/v1/roles', rolRutas);
app.use('/api/v1/permisos', permisoRutas);
app.use('/api/v1/municipios', municipioRutas);
app.use('/api/v1/afectaciones', afectacionRutas);
app.use('/api/v1/centros-acopio', centroAcopioRutas);
app.use('/api/v1/inventario', inventarioRutas);
app.use('/api/v1/beneficiarios', beneficiarioRutas);
app.use('/api/v1/solicitudes-ayuda', solicitudAyudaRutas);
app.use('/api/v1/entregas-ayuda', entregaAyudaRutas);
app.use('/api/v1/albergues', albergueRutas);
app.use('/api/v1/denuncias', denunciaRutas);
app.use('/api/v1/donaciones', donacionRutas);
app.use('/api/v1/gastos', gastoRutas);
app.use('/api/v1/reportes', reporteRutas);
app.use('/api/v1/dashboards', dashboardRutas);
app.use('/api/v1/publico', publicoRutas);
app.use('/api/v1/validacion-ayuda', validacionAyudaRutas);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ErrorAplicacion) {
    return responderError(res, error.message, error.codigo, error.estadoHttp);
  }

  if (error instanceof Error) {
    return responderError(res, 'Error interno del servidor', 'ERROR_INTERNO', 500);
  }

  return responderError(res, 'Error desconocido', 'ERROR_DESCONOCIDO', 500);
});

app.listen(configuracion.puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${configuracion.puerto}`);
});
