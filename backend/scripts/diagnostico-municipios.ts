import { prisma } from '../biblioteca/prisma.js';

async function diagnostico() {
  const municipios = await prisma.municipio.findMany({
    orderBy: { id: 'asc' },
    include: {
      _count: {
        select: {
          afectaciones: true,
          centroAcopio: true,
          beneficiarios: true,
          denuncias: true,
          albergues: true,
          usuarios: true,
        },
      },
    },
  });

  console.log(`=== TOTAL MUNICIPIOS EN BD: ${municipios.length} ===`);
  for (const m of municipios) {
    console.log(`ID ${m.id.toString().padStart(2, ' ')} | DANE: ${m.codigoDane} | ${m.nombre.padEnd(25, ' ')} | Afectaciones: ${m._count.afectaciones} | Centros: ${m._count.centroAcopio} | Familias: ${m._count.beneficiarios} | Denuncias: ${m._count.denuncias} | Albergues: ${m._count.albergues}`);
  }
  process.exit(0);
}

diagnostico().catch(err => {
  console.error(err);
  process.exit(1);
});
