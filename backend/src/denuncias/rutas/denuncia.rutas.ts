import { Router } from 'express';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { CrearDenunciaSchema, ActualizarDenunciaSchema } from '../dto/denuncia.dto.js';
import { DenunciaServicio } from '../servicio/denuncia.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new DenunciaServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarDenuncias();
    return responderExito(res, 'Denuncias consultadas correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar denuncias';
    return responderError(res, mensaje, 'ERROR_DENUNCIAS', 500);
  }
});

router.get('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.obtenerDenuncia(BigInt(req.params.id));
    return responderExito(res, 'Denuncia consultada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar denuncia';
    return responderError(res, mensaje, 'ERROR_DENUNCIA', 400);
  }
});

router.post('/', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = CrearDenunciaSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearDenuncia(resultado.data);
    return responderExito(res, 'Denuncia registrada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar denuncia';
    return responderError(res, mensaje, 'ERROR_CREAR_DENUNCIA', 400);
  }
});

router.put('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = ActualizarDenunciaSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.actualizarDenuncia(BigInt(req.params.id), resultado.data);
    return responderExito(res, 'Denuncia actualizada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar denuncia';
    return responderError(res, mensaje, 'ERROR_ACTUALIZAR_DENUNCIA', 400);
  }
});

export default router;
