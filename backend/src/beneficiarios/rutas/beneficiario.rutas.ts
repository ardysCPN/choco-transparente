import { Router } from 'express';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { CrearBeneficiarioSchema, ActualizarBeneficiarioSchema } from '../dto/beneficiario.dto.js';
import { BeneficiarioServicio } from '../servicio/beneficiario.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new BeneficiarioServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarBeneficiarios();
    return responderExito(res, 'Beneficiarios consultados correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar beneficiarios';
    return responderError(res, mensaje, 'ERROR_BENEFICIARIOS', 500);
  }
});

router.get('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.obtenerBeneficiario(BigInt(req.params.id));
    return responderExito(res, 'Beneficiario consultado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar beneficiario';
    return responderError(res, mensaje, 'ERROR_BENEFICIARIO', 400);
  }
});

router.post('/', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = CrearBeneficiarioSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearBeneficiario(resultado.data);
    return responderExito(res, 'Beneficiario creado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear beneficiario';
    return responderError(res, mensaje, 'ERROR_CREAR_BENEFICIARIO', 400);
  }
});

router.put('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = ActualizarBeneficiarioSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.actualizarBeneficiario(BigInt(req.params.id), resultado.data);
    return responderExito(res, 'Beneficiario actualizado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar beneficiario';
    return responderError(res, mensaje, 'ERROR_ACTUALIZAR_BENEFICIARIO', 400);
  }
});

export default router;
