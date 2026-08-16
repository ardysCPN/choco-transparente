import { z } from 'zod';

export const RegistrarEntradaSchema = z.object({
  centroAcopioId: z.coerce.bigint(),
  tipoAyuda: z.string().min(2, 'El tipo de ayuda es obligatorio'),
  cantidad: z.number().positive('La cantidad debe ser mayor que cero'),
  peso: z.number().positive('El peso debe ser mayor que cero').optional(),
  origen: z.string().min(2, 'El origen es obligatorio'),
  numeroDocumento: z.string().optional(),
  fotoCamion: z.string().optional(),
  usuarioId: z.coerce.bigint(),
  loteId: z.coerce.bigint().optional(),
  identificadorOffline: z.string().optional()
});

export const RegistrarSalidaSchema = z.object({
  centroAcopioId: z.coerce.bigint(),
  tipoAyuda: z.string().min(2, 'El tipo de ayuda es obligatorio'),
  cantidad: z.number().positive('La cantidad debe ser mayor que cero'),
  peso: z.number().positive('El peso debe ser mayor que cero').optional(),
  municipioId: z.number().int().positive(),
  barrio: z.string().optional(),
  fotoEntrega: z.string().min(1, 'La evidencia de entrega es obligatoria'),
  usuarioId: z.coerce.bigint(),
  beneficiarioId: z.coerce.bigint().optional(),
  loteId: z.coerce.bigint().optional(),
  identificadorOffline: z.string().optional()
});

export type RegistrarEntradaDto = z.infer<typeof RegistrarEntradaSchema>;
export type RegistrarSalidaDto = z.infer<typeof RegistrarSalidaSchema>;
