import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  const hashAdmin = await bcrypt.hash('AdminChoco2026!', 10);
  const hashTest = await bcrypt.hash('TestChoco2026!', 10);

  // 1. Admin user
  const admin = await prisma.usuario.upsert({
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
  console.log('Superadmin user ready:', admin.correo);

  // 2. Test user
  const testUser = await prisma.usuario.upsert({
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
  console.log('Test user ready:', testUser.correo);

  await prisma.$disconnect();
}

seed().catch(console.error);
