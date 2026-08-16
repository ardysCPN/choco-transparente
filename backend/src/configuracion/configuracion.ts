import dotenv from 'dotenv';

dotenv.config();

export const configuracion = {
  entorno: process.env.NODE_ENV ?? 'development',
  puerto: Number(process.env.PORT ?? 4000),
  jwtSecreto: process.env.JWT_SECRET ?? process.env.JWT_SECRETO ?? 'desarrollo_local_secreto_choco_2026',
  jwtTiempoExpiracion: process.env.JWT_TIEMPO_EXPIRACION ?? process.env.JWT_EXPIRES_IN ?? '8h',
  jwtRefreshSecreto: process.env.JWT_REFRESH_SECRET ?? 'desarrollo_local_refresh_secreto_choco_2026',
  jwtRefreshTiempoExpiracion: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  baseDatosUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/choco_transparente?schema=public',
  corsOrigen: process.env.CORS_ORIGIN ?? '*',
};
