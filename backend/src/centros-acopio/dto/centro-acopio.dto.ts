import { z } from 'zod';

export const CrearCentroAcopioSchema = z.object({
  municipioId: z.number().int().positive(),
  organizacionId: z.coerce.bigint(),
  nombre: z.string().min(2, 'El nombre del centro es obligatorio'),
  direccion: z.string().min(5, 'La dirección es obligatoria'),
  barrio: z.string().optional(),
  responsable: z.string().min(2, 'El responsable es obligatorio'),
  telefono: z.string().min(7, 'El teléfono es obligatorio'),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  fotoFachada: z.string().optional(),
  estado: z.enum(['PENDIENTE', 'EN_REVISION', 'APROBADO', 'RECHAZADO', 'SUSPENDIDO', 'CERRADO']).optional().default('PENDIENTE')
});

export const AuditarCentroAcopioSchema = z.object({
  decision: z.enum(['APROBADO', 'RECHAZADO', 'OBSERVADO']),
  comentario: z.string().min(5, 'Debe incluir un comentario'),
  fotoEvidencia: z.string().min(1, 'Debe adjuntar evidencia'),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  auditorId: z.coerce.bigint()
});

export const ActualizarCentroAcopioSchema = CrearCentroAcopioSchema.partial();

export type CrearCentroAcopioDto = z.infer<typeof CrearCentroAcopioSchema>;
export type ActualizarCentroAcopioDto = z.infer<typeof ActualizarCentroAcopioSchema>;
export type AuditarCentroAcopioDto = z.infer<typeof AuditarCentroAcopioSchema>;
