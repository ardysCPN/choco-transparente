import { Router } from 'express';
import { PermisoServicio } from '../servicio/permiso.servicio.js';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new PermisoServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarPermisos();
    return responderExito(res, 'Permisos consultados correctamente', datos);
  } catch (error) {
    return responderError(res, 'Error al consultar permisos', 'ERROR_PERMISOS', 500);
  }
});

export default router;
