import { z } from 'zod';

export const CrearMunicipioSchema = z.object({
  departamentoId: z.number().int().positive(),
  codigoDane: z.string().min(4, 'El código DANE es obligatorio'),
  nombre: z.string().min(2, 'El nombre del municipio es obligatorio'),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  estado: z.boolean().optional().default(true)
});

export const ActualizarMunicipioSchema = CrearMunicipioSchema.partial();

export type CrearMunicipioDto = z.infer<typeof CrearMunicipioSchema>;
export type ActualizarMunicipioDto = z.infer<typeof ActualizarMunicipioSchema>;
