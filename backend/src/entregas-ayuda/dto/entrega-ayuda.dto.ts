import { z } from 'zod';

export const CrearEntregaAyudaSchema = z.object({
  solicitudId: z.coerce.bigint().optional(),
  beneficiarioId: z.coerce.bigint(),
  loteId: z.coerce.bigint().optional(),
  cantidad: z.number().positive('La cantidad entregada debe ser mayor que cero'),
  responsableEntrega: z.coerce.bigint(),
  evidencia: z.string().min(1, 'La evidencia de entrega es obligatoria'),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  observaciones: z.string().optional()
});

export const ActualizarEntregaAyudaSchema = CrearEntregaAyudaSchema.partial();

export type CrearEntregaAyudaDto = z.infer<typeof CrearEntregaAyudaSchema>;
export type ActualizarEntregaAyudaDto = z.infer<typeof ActualizarEntregaAyudaSchema>;
