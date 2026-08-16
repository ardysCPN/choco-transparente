import { z } from 'zod';

export const CrearSolicitudAyudaSchema = z.object({
  beneficiarioId: z.coerce.bigint(),
  afectacionId: z.coerce.bigint(),
  tipoNecesidad: z.string().min(2, 'El tipo de necesidad es obligatorio'),
  prioridad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'URGENTE']).optional().default('MEDIA'),
  descripcion: z.string().optional(),
  cantidadSolicitada: z.number().positive('La cantidad solicitada debe ser mayor que cero'),
  evidencia: z.string().optional(),
  estado: z.enum(['PENDIENTE', 'APROBADA', 'RECHAZADA', 'ATENDIDA']).optional().default('PENDIENTE')
});

export const ActualizarSolicitudAyudaSchema = CrearSolicitudAyudaSchema.partial();

export type CrearSolicitudAyudaDto = z.infer<typeof CrearSolicitudAyudaSchema>;
export type ActualizarSolicitudAyudaDto = z.infer<typeof ActualizarSolicitudAyudaSchema>;
