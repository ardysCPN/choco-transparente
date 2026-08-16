import { Router } from 'express';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { CrearSolicitudAyudaSchema, ActualizarSolicitudAyudaSchema } from '../dto/solicitud-ayuda.dto.js';
import { SolicitudAyudaServicio } from '../servicio/solicitud-ayuda.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new SolicitudAyudaServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarSolicitudes();
    return responderExito(res, 'Solicitudes consultadas correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar solicitudes';
    return responderError(res, mensaje, 'ERROR_SOLICITUDES', 500);
  }
});

router.get('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.obtenerSolicitud(BigInt(req.params.id));
    return responderExito(res, 'Solicitud consultada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar solicitud';
    return responderError(res, mensaje, 'ERROR_SOLICITUD', 400);
  }
});

router.post('/', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = CrearSolicitudAyudaSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearSolicitud(resultado.data);
    return responderExito(res, 'Solicitud creada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear solicitud';
    return responderError(res, mensaje, 'ERROR_CREAR_SOLICITUD', 400);
  }
});

router.put('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = ActualizarSolicitudAyudaSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.actualizarSolicitud(BigInt(req.params.id), resultado.data);
    return responderExito(res, 'Solicitud actualizada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar solicitud';
    return responderError(res, mensaje, 'ERROR_ACTUALIZAR_SOLICITUD', 400);
  }
});

export default router;
