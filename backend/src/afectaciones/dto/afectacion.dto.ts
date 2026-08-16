import { z } from 'zod';

export const CrearAfectacionSchema = z.object({
  municipioId: z.number().int().positive(),
  nombre: z.string().min(2, 'El nombre de la afectación es obligatorio'),
  descripcion: z.string().optional(),
  tipo: z.enum(['INUNDACION', 'DESLIZAMIENTO', 'VENDAVAL', 'INCENDIO', 'DESPLAZAMIENTO', 'OTRO']),
  severidad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).optional().default('MEDIA'),
  estado: z.enum(['ACTIVA', 'EN_ATENCION', 'CONTROLADA', 'CERRADA']).optional().default('ACTIVA'),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  direccion: z.string().optional(),
  fechaInicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
  creadoPor: z.coerce.bigint()
});

export const ActualizarAfectacionSchema = CrearAfectacionSchema.partial();

export type CrearAfectacionDto = z.infer<typeof CrearAfectacionSchema>;
export type ActualizarAfectacionDto = z.infer<typeof ActualizarAfectacionSchema>;
