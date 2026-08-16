import { z } from 'zod';

export const LoginSchema = z.object({
  correo: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .min(1, 'El correo electrónico no puede estar vacío')
    .email('Debe ingresar un correo electrónico válido'),
  contrasena: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  recordarme: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
