import { Router } from 'express';
import { CrearRolSchema, AsignarPermisoRolSchema } from '../dto/rol.dto.js';
import { RolServicio } from '../servicio/rol.servicio.js';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new RolServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarRoles();
    return responderExito(res, 'Roles consultados correctamente', datos);
  } catch (error) {
    return responderError(res, 'Error al consultar roles', 'ERROR_ROLES', 500);
  }
});

router.post('/', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = CrearRolSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearRol(resultado.data);
    return responderExito(res, 'Rol creado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear rol';
    return responderError(res, mensaje, 'ERROR_CREAR_ROL', 400);
  }
});

router.get('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.obtenerRol(Number(req.params.id));
    return responderExito(res, 'Rol consultado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar rol';
    return responderError(res, mensaje, 'ERROR_ROL', 400);
  }
});

router.post('/:id/permisos', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = AsignarPermisoRolSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.asignarPermisoRol(Number(req.params.id), resultado.data);
    return responderExito(res, 'Permiso asignado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al asignar permiso';
    return responderError(res, mensaje, 'ERROR_ASIGNAR_PERMISO', 400);
  }
});

export default router;
