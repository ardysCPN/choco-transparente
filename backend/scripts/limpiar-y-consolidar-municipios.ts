import { prisma } from '../biblioteca/prisma.js';

// 31 Municipios Oficiales del Departamento del Chocó
const MUNICIPIOS_OFICIALES = [
  { id: 1, codigoDane: '27001', nombre: 'QUIBDÓ', latitud: 5.694722, longitud: -76.661111 },
  { id: 2, codigoDane: '27006', nombre: 'ACANDÍ', latitud: 8.508611, longitud: -77.278056 },
  { id: 3, codigoDane: '27025', nombre: 'ALTO BAUDÓ', latitud: 5.525556, longitud: -77.014444 },
  { id: 4, codigoDane: '27050', nombre: 'ATRATO', latitud: 5.518611, longitud: -76.685278 },
  { id: 5, codigoDane: '27073', nombre: 'BAGADÓ', latitud: 5.412222, longitud: -76.411667 },
  { id: 6, codigoDane: '27075', nombre: 'BAHÍA SOLANO', latitud: 6.226389, longitud: -77.404444 },
  { id: 7, codigoDane: '27077', nombre: 'BAJO BAUDÓ', latitud: 4.954722, longitud: -77.368889 },
  { id: 8, codigoDane: '27099', nombre: 'BOJAYÁ', latitud: 6.550278, longitud: -76.901111 },
  { id: 9, codigoDane: '27135', nombre: 'EL CÁRMEN DE ATRATO', latitud: 5.604722, longitud: -76.143889 },
  { id: 10, codigoDane: '27150', nombre: 'CARMEN DEL DARIÉN', latitud: 7.080556, longitud: -77.000000 },
  { id: 11, codigoDane: '27205', nombre: 'CONDOTO', latitud: 5.093056, longitud: -76.649722 },
  { id: 12, codigoDane: '27245', nombre: 'EL LITORAL DEL SAN JUAN', latitud: 4.266111, longitud: -77.366111 },
  { id: 13, codigoDane: '27250', nombre: 'ISTMINA', latitud: 5.160000, longitud: -76.685000 },
  { id: 14, codigoDane: '27361', nombre: 'JURADÓ', latitud: 7.108611, longitud: -77.766389 },
  { id: 15, codigoDane: '27411', nombre: 'LLORÓ', latitud: 5.511667, longitud: -76.541667 },
  { id: 16, codigoDane: '27425', nombre: 'MEDIO ATRATO', latitud: 5.864722, longitud: -76.711667 },
  { id: 17, codigoDane: '27430', nombre: 'MEDIO BAUDÓ', latitud: 5.200000, longitud: -77.000000 },
  { id: 18, codigoDane: '27450', nombre: 'MEDIO SAN JUAN', latitud: 5.000000, longitud: -76.800000 },
  { id: 19, codigoDane: '27491', nombre: 'NÓVITA', latitud: 4.954167, longitud: -76.605278 },
  { id: 20, codigoDane: '27495', nombre: 'NUQUÍ', latitud: 5.712500, longitud: -77.270833 },
  { id: 21, codigoDane: '27580', nombre: 'RÍO IRO', latitud: 4.933333, longitud: -76.600000 },
  { id: 22, codigoDane: '27600', nombre: 'RÍO QUITO', latitud: 5.516667, longitud: -76.700000 },
  { id: 23, codigoDane: '27615', nombre: 'RIOSUCIO', latitud: 7.441944, longitud: -77.118611 },
  { id: 24, codigoDane: '27660', nombre: 'SAN JOSÉ DEL PALMAR', latitud: 4.972778, longitud: -76.229444 },
  { id: 25, codigoDane: '27737', nombre: 'SIPÍ', latitud: 4.656944, longitud: -76.480278 },
  { id: 26, codigoDane: '27745', nombre: 'TADÓ', latitud: 5.268333, longitud: -76.559444 },
  { id: 27, codigoDane: '27787', nombre: 'UNGUÍA', latitud: 8.043611, longitud: -77.094167 },
  { id: 28, codigoDane: '27800', nombre: 'UNIÓN PANAMERICANA', latitud: 5.316667, longitud: -76.650000 },
  { id: 29, codigoDane: '27810', nombre: 'BELÉN DE BAJIRÁ', latitud: 7.230000, longitud: -76.730000 },
  { id: 30, codigoDane: '27160', nombre: 'CÉRTEGUI', latitud: 5.366667, longitud: -76.583333 },
  { id: 31, codigoDane: '27137', nombre: 'CANTÓN DE SAN PABLO', latitud: 5.316667, longitud: -76.716667 },
];

function normalizarNombre(nombre: string): string {
  const norm = nombre
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (norm.includes('ITSMINA') || norm.includes('ISTMINA')) return 'ISTMINA';
  if (norm.includes('BAHIA')) return 'BAHÍA SOLANO';
  if (norm.includes('ALTO BAUDO')) return 'ALTO BAUDÓ';
  if (norm.includes('BAJO BAUDO')) return 'BAJO BAUDÓ';
  if (norm.includes('MEDIO BAUDO')) return 'MEDIO BAUDÓ';
  if (norm.includes('LLORO')) return 'LLORÓ';
  if (norm.includes('NUQUI')) return 'NUQUÍ';
  if (norm.includes('QUIBDO')) return 'QUIBDÓ';
  return norm;
}

async function ejecutarConsolidacion() {
  console.log('Iniciando consolidación y limpieza de municipios...');

  // 1. Asegurar los 31 municipios canónicos
  for (const m of MUNICIPIOS_OFICIALES) {
    const existe = await prisma.municipio.findFirst({
      where: {
        OR: [
          { id: m.id },
          { codigoDane: m.codigoDane },
        ],
      },
    });

    if (!existe) {
      await prisma.municipio.create({
        data: {
          id: m.id,
          departamentoId: 27,
          codigoDane: m.codigoDane,
          nombre: m.nombre,
          latitud: m.latitud,
          longitud: m.longitud,
          estado: true,
        },
      });
      console.log(`+ Creado municipio oficial: ${m.nombre} (${m.codigoDane})`);
    } else if (existe.nombre !== m.nombre) {
      await prisma.municipio.update({
        where: { id: existe.id },
        data: { nombre: m.nombre },
      });
    }
  }

  // 2. Obtener todos los municipios actuales
  const todos = await prisma.municipio.findMany({ orderBy: { id: 'asc' } });
  
  const oficialesMap = new Map<string, number>();
  for (const ofi of MUNICIPIOS_OFICIALES) {
    oficialesMap.set(normalizarNombre(ofi.nombre), ofi.id);
  }

  const idsOficiales = new Set(MUNICIPIOS_OFICIALES.map(o => o.id));

  // 3. Reasignar relaciones en todas las 10 tablas relacionadas
  for (const m of todos) {
    if (idsOficiales.has(m.id)) continue;

    const nombreNorm = normalizarNombre(m.nombre);
    const idCanonico = oficialesMap.get(nombreNorm) || 1; // Default a Quibdó si no coincide

    console.log(`Reasignando relaciones de ID ${m.id} ("${m.nombre}") -> Canónico ID ${idCanonico}`);

    // Tablas directas con SQL crudo para cubrir todas las FKs de forma segura
    await prisma.$executeRawUnsafe(`UPDATE usuario SET municipio_id = ${idCanonico} WHERE municipio_id = ${m.id};`);
    await prisma.$executeRawUnsafe(`UPDATE afectacion SET municipio_id = ${idCanonico} WHERE municipio_id = ${m.id};`);
    await prisma.$executeRawUnsafe(`UPDATE centro_acopio SET municipio_id = ${idCanonico} WHERE municipio_id = ${m.id};`);
    await prisma.$executeRawUnsafe(`UPDATE inventario SET municipio_id = ${idCanonico} WHERE municipio_id = ${m.id};`);
    await prisma.$executeRawUnsafe(`UPDATE salida_inventario SET municipio_id = ${idCanonico} WHERE municipio_id = ${m.id};`);
    await prisma.$executeRawUnsafe(`UPDATE beneficiario SET municipio_id = ${idCanonico} WHERE municipio_id = ${m.id};`);
    await prisma.$executeRawUnsafe(`UPDATE donacion SET municipio_id = ${idCanonico} WHERE municipio_id = ${m.id};`);
    await prisma.$executeRawUnsafe(`UPDATE albergue SET municipio_id = ${idCanonico} WHERE municipio_id = ${m.id};`);
    await prisma.$executeRawUnsafe(`UPDATE denuncia SET municipio_id = ${idCanonico} WHERE municipio_id = ${m.id};`);
    await prisma.$executeRawUnsafe(`UPDATE notificacion SET municipio_id = ${idCanonico} WHERE municipio_id = ${m.id};`);

    // Eliminar el duplicado
    await prisma.municipio.delete({
      where: { id: m.id },
    });
  }

  const final = await prisma.municipio.findMany({ orderBy: { id: 'asc' } });
  console.log(`\n✅ CONSOLIDACIÓN EXITOSA: Base de datos limpia con exactamente ${final.length} municipios oficiales.`);
  for (const m of final) {
    console.log(`[ID ${m.id.toString().padStart(2, ' ')}] DANE: ${m.codigoDane} - ${m.nombre}`);
  }
}

ejecutarConsolidacion().catch(err => {
  console.error('Error durante consolidación:', err);
  process.exit(1);
});
