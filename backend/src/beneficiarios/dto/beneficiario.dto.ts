import { z } from 'zod';

export const CrearBeneficiarioSchema = z.object({
  codigoFamilia: z.string().min(2, 'El código de familia es obligatorio'),
  municipioId: z.number().int().positive(),
  barrio: z.string().optional(),
  direccion: z.string().optional(),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  cantidadPersonas: z.number().int().positive(),
  contacto: z.string().optional(),
  estado: z.enum(['ACTIVO', 'INACTIVO', 'PENDIENTE']).optional().default('ACTIVO')
});

export const ActualizarBeneficiarioSchema = CrearBeneficiarioSchema.partial();

export type CrearBeneficiarioDto = z.infer<typeof CrearBeneficiarioSchema>;
export type ActualizarBeneficiarioDto = z.infer<typeof ActualizarBeneficiarioSchema>;
