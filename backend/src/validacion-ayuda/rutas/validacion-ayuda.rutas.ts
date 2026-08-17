import { Router, Request, Response, NextFunction } from 'express';
import {
  ConsultarValidacionAyudaSchema,
  RegistrarValidacionAyudaSchema,
} from '../dto/validacion-ayuda.dto.js';
import { ValidacionAyudaServicio } from '../servicio/validacion-ayuda.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new ValidacionAyudaServicio();

// =============================================================================
// RATE LIMITING LIGERO EN MEMORIA (Protección contra scraping masivo)
// =============================================================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 60; // Máximo 60 consultas por minuto por IP

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = rateLimitMap.get(clientIp);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return responderError(
      res,
      'Demasiadas consultas en poco tiempo. Por favor espera un momento antes de reintentar.',
      'LIMITE_CONSULTAS',
      429
    );
  }

  record.count += 1;
  next();
};

// Limpieza periódica de memoria del rate limiter cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// =============================================================================
// ENDPOINTS PÚBLICOS DE VALIDACIÓN DE AYUDA
// =============================================================================

/**
 * POST /api/v1/validacion-ayuda/consultar
 * Consulta si un número de identificación ya tiene una ayuda registrada
 */
router.post('/consultar', rateLimiter, async (req: Request, res: Response) => {
  try {
    const validacion = ConsultarValidacionAyudaSchema.safeParse(req.body);
    if (!validacion.success) {
      const primerError = validacion.error.issues[0]?.message || 'Número de identificación inválido';
      return responderError(res, primerError, 'VALIDACION_DOCUMENTO', 400);
    }

    const resultado = await servicio.consultar(validacion.data);
    return responderExito(res, 'Consulta realizada correctamente', resultado);
  } catch (error: any) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar validación de ayuda';
    return responderError(res, mensaje, 'ERROR_CONSULTA_AYUDA', 500);
  }
});

/**
 * GET /api/v1/validacion-ayuda/consultar
 * Variante GET para consultas por query param
 */
router.get('/consultar', rateLimiter, async (req: Request, res: Response) => {
  try {
    const validacion = ConsultarValidacionAyudaSchema.safeParse({
      numeroIdentificacion: req.query.numeroIdentificacion,
    });

    if (!validacion.success) {
      const primerError = validacion.error.issues[0]?.message || 'Número de identificación inválido';
      return responderError(res, primerError, 'VALIDACION_DOCUMENTO', 400);
    }

    const resultado = await servicio.consultar(validacion.data);
    return responderExito(res, 'Consulta realizada correctamente', resultado);
  } catch (error: any) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar validación de ayuda';
    return responderError(res, mensaje, 'ERROR_CONSULTA_AYUDA', 500);
  }
});

/**
 * POST /api/v1/validacion-ayuda/registrar
 * Registra una nueva entrega de ayuda previa verificación de duplicados
 */
router.post('/registrar', rateLimiter, async (req: Request, res: Response) => {
  try {
    const validacion = RegistrarValidacionAyudaSchema.safeParse(req.body);
    if (!validacion.success) {
      const primerError = validacion.error.issues[0]?.message || 'Datos de registro incompletos o inválidos';
      return responderError(res, primerError, 'VALIDACION_REGISTRO', 400);
    }

    const resultado = await servicio.registrar(validacion.data);
    return responderExito(res, resultado.mensaje, resultado);
  } catch (error: any) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar entrega de ayuda';
    return responderError(res, mensaje, 'ERROR_REGISTRO_AYUDA', 500);
  }
});

export default router;
