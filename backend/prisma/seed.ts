import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de usuarios...');

  const hashAdmin = await bcrypt.hash('AdminChoco2026!', 10);
  const hashTest = await bcrypt.hash('TestChoco2026!', 10);

  // 1. Superadministrador
  await prisma.usuario.upsert({
    where: { correo: 'admin@chocotransparente.gov.co' },
    update: {
      contrasenaHash: hashAdmin,
      activo: true,
    },
    create: {
      nombre: 'Super',
      apellido: 'Administrador',
      correo: 'admin@chocotransparente.gov.co',
      telefono: '3100000000',
      documento: '0000000000',
      contrasenaHash: hashAdmin,
      activo: true,
      rolId: 1,
      municipioId: 1,
      organizacionId: 1n,
    },
  });

  // 2. Operador de Pruebas
  await prisma.usuario.upsert({
    where: { correo: 'test@chocotransparente.gov.co' },
    update: {
      contrasenaHash: hashTest,
      activo: true,
      rolId: 3, // COORDINADOR
    },
    create: {
      nombre: 'Operador',
      apellido: 'Testing',
      correo: 'test@chocotransparente.gov.co',
      telefono: '3109998877',
      documento: '1111111111',
      contrasenaHash: hashTest,
      activo: true,
      rolId: 3, // COORDINADOR
      municipioId: 1,
      organizacionId: 1n,
    },
  });

  console.log('Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
