import { z } from 'zod';

export const ConsultarValidacionAyudaSchema = z.object({
  numeroIdentificacion: z
    .string({ required_error: 'El número de identificación es obligatorio' })
    .trim()
    .min(3, 'El número de identificación debe tener al menos 3 caracteres')
    .max(50, 'El número de identificación no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9.\-_]+$/, 'El número de identificación contiene caracteres inválidos'),
});

export const RegistrarValidacionAyudaSchema = z.object({
  numeroIdentificacion: z
    .string({ required_error: 'El número de identificación es obligatorio' })
    .trim()
    .min(3, 'El número de identificación debe tener al menos 3 caracteres')
    .max(50, 'El número de identificación no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9.\-_]+$/, 'El número de identificación contiene caracteres inválidos'),
  organizacionEntregante: z
    .string({ required_error: 'Debe especificar la organización o persona que entrega' })
    .trim()
    .min(2, 'El nombre de la organización o persona debe tener al menos 2 caracteres')
    .max(255, 'El nombre de la organización o persona no puede exceder 255 caracteres'),
  consentimientoDatos: z
    .literal(true, {
      errorMap: () => ({ message: 'Debe confirmar que la persona fue informada y autoriza el registro' }),
    }),
});

export type ConsultarValidacionAyudaDto = z.infer<typeof ConsultarValidacionAyudaSchema>;
export type RegistrarValidacionAyudaDto = z.infer<typeof RegistrarValidacionAyudaSchema>;
