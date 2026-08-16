import { Router } from 'express';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { CrearAlbergueSchema, ActualizarAlbergueSchema } from '../dto/albergue.dto.js';
import { AlbergueServicio } from '../servicio/albergue.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new AlbergueServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarAlbergues();
    return responderExito(res, 'Albergues consultados correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar albergues';
    return responderError(res, mensaje, 'ERROR_ALBERGUES', 500);
  }
});

router.get('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.obtenerAlbergue(BigInt(req.params.id));
    return responderExito(res, 'Albergue consultado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar albergue';
    return responderError(res, mensaje, 'ERROR_ALBERGUE', 400);
  }
});

router.post('/', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = CrearAlbergueSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearAlbergue(resultado.data);
    return responderExito(res, 'Albergue creado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear albergue';
    return responderError(res, mensaje, 'ERROR_CREAR_ALBERGUE', 400);
  }
});

router.put('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = ActualizarAlbergueSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.actualizarAlbergue(BigInt(req.params.id), resultado.data);
    return responderExito(res, 'Albergue actualizado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar albergue';
    return responderError(res, mensaje, 'ERROR_ACTUALIZAR_ALBERGUE', 400);
  }
});

export default router;
