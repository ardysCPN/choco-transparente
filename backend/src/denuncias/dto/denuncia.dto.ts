import { z } from 'zod';

export const CrearDenunciaSchema = z.object({
  tipo: z.string().min(2, 'El tipo de denuncia es obligatorio'),
  descripcion: z.string().min(5, 'La descripción es obligatoria'),
  municipioId: z.number().int().positive(),
  barrio: z.string().optional(),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  evidencia: z.string().optional(),
  estado: z.enum(['RECIBIDA', 'EN_REVISION', 'INVESTIGACION', 'RESUELTA', 'DESCARTADA']).optional().default('RECIBIDA'),
  respuesta: z.string().optional(),
  identificadorOffline: z.string().optional()
});

export const ActualizarDenunciaSchema = CrearDenunciaSchema.partial();

export type CrearDenunciaDto = z.infer<typeof CrearDenunciaSchema>;
export type ActualizarDenunciaDto = z.infer<typeof ActualizarDenunciaSchema>;
