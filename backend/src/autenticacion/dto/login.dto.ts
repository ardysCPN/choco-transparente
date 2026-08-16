import { z } from 'zod';

export const LoginSchema = z.object({
  correo: z.string().email('El correo es obligatorio y debe ser válido'),
  contrasena: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

export type LoginDto = z.infer<typeof LoginSchema>;
