import { Router, type Request, type Response } from 'express';
import { PublicoServicio } from '../servicio/publico.servicio.js';
import {
  SolicitudAyudaPublicaSchema,
  ProponerCentroAcopioSchema,
  DonacionPublicaSchema,
  VoluntariadoPublicoSchema,
  TransportePublicoSchema,
  DenunciaPublicaSchema,
  VinculacionCentroSchema,
} from '../dto/publico.dto.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';
import { ErrorAplicacion } from '../../comun/errores/errores.js';

const router = Router();
const servicio = new PublicoServicio();

// ==========================================
// CONSULTAS PÚBLICAS (Lectura sin token)
// ==========================================

router.get('/dashboard', async (_req: Request, res: Response) => {
  try {
    const datos = await servicio.dashboard();
    return responderExito(res, 'Dashboard público consultado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar dashboard';
    return responderError(res, mensaje, 'ERROR_DASHBOARD_PUBLICO', 500);
  }
});

router.get('/municipios', async (_req: Request, res: Response) => {
  try {
    const datos = await servicio.listarMunicipios();
    return responderExito(res, 'Municipios consultados correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar municipios';
    return responderError(res, mensaje, 'ERROR_MUNICIPIOS_PUBLICO', 500);
  }
});

router.get('/municipios/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return responderError(res, 'ID de municipio inválido', 'PARAMETRO_INVALIDO', 400);
    }
    const datos = await servicio.obtenerMunicipio(id);
    return responderExito(res, 'Ficha municipal consultada correctamente', datos);
  } catch (error) {
    if (error instanceof ErrorAplicacion) {
      return responderError(res, error.message, error.codigo, error.estadoHttp);
    }
    const mensaje = error instanceof Error ? error.message : 'Error al consultar municipio';
    return responderError(res, mensaje, 'ERROR_MUNICIPIO_PUBLICO', 500);
  }
});

router.get('/centros-acopio', async (_req: Request, res: Response) => {
  try {
    const datos = await servicio.listarCentrosAcopio();
    return responderExito(res, 'Centros de acopio consultados correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar centros';
    return responderError(res, mensaje, 'ERROR_CENTROS_PUBLICO', 500);
  }
});

router.get('/centros-acopio/:id', async (req: Request, res: Response) => {
  try {
    const id = BigInt(req.params.id);
    const datos = await servicio.obtenerCentroAcopio(id);
    return responderExito(res, 'Centro de acopio consultado correctamente', datos);
  } catch (error) {
    if (error instanceof ErrorAplicacion) {
      return responderError(res, error.message, error.codigo, error.estadoHttp);
    }
    const mensaje = error instanceof Error ? error.message : 'Error al consultar centro de acopio';
    return responderError(res, mensaje, 'ERROR_CENTRO_PUBLICO', 400);
  }
});

router.get('/inventario', async (_req: Request, res: Response) => {
  try {
    const datos = await servicio.inventarioConsolidado();
    return responderExito(res, 'Inventario consolidado consultado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar inventario';
    return responderError(res, mensaje, 'ERROR_INVENTARIO_PUBLICO', 500);
  }
});

router.get('/albergues', async (_req: Request, res: Response) => {
  try {
    const datos = await servicio.listarAlbergues();
    return responderExito(res, 'Albergues consultados correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar albergues';
    return responderError(res, mensaje, 'ERROR_ALBERGUES_PUBLICO', 500);
  }
});

router.get('/afectaciones', async (_req: Request, res: Response) => {
  try {
    const datos = await servicio.listarAfectaciones();
    return responderExito(res, 'Afectaciones consultadas correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar afectaciones';
    return responderError(res, mensaje, 'ERROR_AFECTACIONES_PUBLICO', 500);
  }
});

router.get('/contactos', async (_req: Request, res: Response) => {
  try {
    const datos = await servicio.directorioContactos();
    return responderExito(res, 'Directorio de contactos oficiales consultado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar contactos';
    return responderError(res, mensaje, 'ERROR_CONTACTOS_PUBLICO', 500);
  }
});

// ==========================================
// FORMULARIOS DE PARTICIPACIÓN CIUDADANA
// ==========================================

router.post('/solicitudes-ayuda', async (req: Request, res: Response) => {
  try {
    const resultado = SolicitudAyudaPublicaSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }
    const datos = await servicio.registrarSolicitudAyuda(resultado.data);
    return responderExito(res, 'Solicitud de ayuda registrada con éxito', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al radicar solicitud';
    return responderError(res, mensaje, 'ERROR_SOLICITUD_PUBLICO', 400);
  }
});

router.post('/centros-acopio', async (req: Request, res: Response) => {
  try {
    const resultado = ProponerCentroAcopioSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }
    const datos = await servicio.proponerCentroAcopio(resultado.data);
    return responderExito(res, 'Propuesta de centro de acopio registrada con éxito', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al proponer centro';
    return responderError(res, mensaje, 'ERROR_CENTRO_PROPUESTA_PUBLICO', 400);
  }
});

router.post('/donaciones', async (req: Request, res: Response) => {
  try {
    const resultado = DonacionPublicaSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }
    const datos = await servicio.registrarDonacion(resultado.data);
    return responderExito(res, 'Donación registrada con éxito', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar donación';
    return responderError(res, mensaje, 'ERROR_DONACION_PUBLICO', 400);
  }
});

router.post('/voluntarios', async (req: Request, res: Response) => {
  try {
    const resultado = VoluntariadoPublicoSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }
    const datos = await servicio.registrarVoluntario(resultado.data);
    return responderExito(res, 'Registro de voluntariado completado con éxito', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al inscribir voluntario';
    return responderError(res, mensaje, 'ERROR_VOLUNTARIO_PUBLICO', 400);
  }
});

router.post('/transportadores', async (req: Request, res: Response) => {
  try {
    const resultado = TransportePublicoSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }
    const datos = await servicio.registrarTransporte(resultado.data);
    return responderExito(res, 'Oferta de transporte registrada con éxito', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar transporte';
    return responderError(res, mensaje, 'ERROR_TRANSPORTE_PUBLICO', 400);
  }
});

router.post('/denuncias', async (req: Request, res: Response) => {
  try {
    const resultado = DenunciaPublicaSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }
    const datos = await servicio.registrarDenuncia(resultado.data);
    return responderExito(res, 'Denuncia ciudadana radicada con éxito', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al radicar denuncia';
    return responderError(res, mensaje, 'ERROR_DENUNCIA_PUBLICO', 400);
  }
});

router.post('/vinculaciones-centro', async (req: Request, res: Response) => {
  try {
    const resultado = VinculacionCentroSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }
    const datos = await servicio.vincularACentro(resultado.data);
    return responderExito(res, 'Vinculación a centro radicada con éxito', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al vincular a centro';
    return responderError(res, mensaje, 'ERROR_VINCULACION_PUBLICO', 400);
  }
});

export default router;
