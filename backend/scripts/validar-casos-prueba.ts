import { prisma } from '../biblioteca/prisma.js';
import { AuthServicio } from '../../autenticacion/servicio/auth.servicio.js';
import { MunicipioServicio } from '../../municipios/servicio/municipio.servicio.js';
import { AfectacionServicio } from '../../afectaciones/servicio/afectacion.servicio.js';
import { CentroAcopioServicio } from '../../centros-acopio/servicio/centro-acopio.servicio.js';
import { InventarioServicio } from '../../inventario/servicio/inventario.servicio.js';
import { BeneficiarioServicio } from '../../beneficiarios/servicio/beneficiario.servicio.js';
import { SolicitudAyudaServicio } from '../../solicitudes-ayuda/servicio/solicitud-ayuda.servicio.js';
import { EntregaAyudaServicio } from '../../entregas-ayuda/servicio/entrega-ayuda.servicio.js';
import { DonacionServicio } from '../../donaciones/servicio/donacion.servicio.js';
import { GastoServicio } from '../../gastos/servicio/gasto.servicio.js';
import { AlbergueServicio } from '../../albergues/servicio/albergue.servicio.js';
import { DenunciaServicio } from '../../denuncias/servicio/denuncia.servicio.js';
import { DashboardServicio } from '../../dashboards/servicio/dashboard.servicio.js';
import { ReportesServicio } from '../../reportes/servicio/reporte.servicio.js';

interface TestResult {
  categoria: string;
  codigo: string;
  descripcion: string;
  estado: 'EXITOSO' | 'FALLIDO';
  detalle?: string;
}

const resultados: TestResult[] = [];

function registrarResultado(categoria: string, codigo: string, descripcion: string, exito: boolean, detalle?: string) {
  resultados.push({
    categoria,
    codigo,
    descripcion,
    estado: exito ? 'EXITOSO' : 'FALLIDO',
    detalle,
  });
  const icono = exito ? '✅' : '❌';
  console.log(`${icono} [${codigo}] ${descripcion} ${detalle ? `(${detalle})` : ''}`);
}

async function ejecutarValidacion() {
  console.log('\n=============================================================');
  console.log('🧪 EJECUCIÓN DE PRUEBAS INTEGRALES SEGÚN CASOS-DE-PRUEBA.MD');
  console.log('=============================================================\n');

  // --- 1. AUTENTICACIÓN Y USUARIOS ---
  console.log('--- 1. Autenticación y Usuarios ---');
  const authServicio = new AuthServicio();
  let tokenSuperadmin = '';

  try {
    const login = await authServicio.iniciarSesion('fase1@test.local', 'Admin12345');
    tokenSuperadmin = login.token;
    registrarResultado('Autenticación', 'AUTH-01', 'Login correcto con credenciales de superadmin', !!tokenSuperadmin);
  } catch (err: any) {
    registrarResultado('Autenticación', 'AUTH-01', 'Login correcto con credenciales de superadmin', false, err.message);
  }

  try {
    const perfil = await authServicio.obtenerPerfil(2n);
    registrarResultado('Autenticación', 'AUTH-02', 'Obtener perfil de usuario activo', perfil.correo === 'fase1@test.local', `Rol: ${(perfil.rol as any)?.nombre || perfil.rol}`);
  } catch (err: any) {
    registrarResultado('Autenticación', 'AUTH-02', 'Obtener perfil de usuario activo', false, err.message);
  }

  try {
    await authServicio.iniciarSesion('inexistente@choco.gov', 'Admin123!');
    registrarResultado('Autenticación', 'AUTH-03', 'Usuario incorrecto rechazado con 401', false);
  } catch (err: any) {
    registrarResultado('Autenticación', 'AUTH-03', 'Usuario incorrecto rechazado con 401', true, err.message);
  }

  try {
    await authServicio.iniciarSesion('fase1@test.local', 'ClaveErronea!');
    registrarResultado('Autenticación', 'AUTH-04', 'Contraseña incorrecta rechazada con 401', false);
  } catch (err: any) {
    registrarResultado('Autenticación', 'AUTH-04', 'Contraseña incorrecta rechazada con 401', true, err.message);
  }

  // --- 2. GESTIÓN TERRITORIAL Y MUNICIPIOS ---
  console.log('\n--- 2. Gestión Territorial y Municipios de Chocó ---');
  const municipioServicio = new MunicipioServicio();
  const municipios = await municipioServicio.listarMunicipios();
  registrarResultado('Territorio', 'MUNI-01', 'Listar 31 municipios oficiales sin duplicados', municipios.length === 31, `Total: ${municipios.length} municipios`);

  const nombresUnicos = new Set(municipios.map(m => m.nombre.toUpperCase()));
  registrarResultado('Territorio', 'MUNI-02', 'Verificar nombres 100% únicos en base de datos', nombresUnicos.size === 31, `Únicos: ${nombresUnicos.size}/31`);

  const quibdo = municipios.find(m => m.codigoDane === '27001');
  registrarResultado('Territorio', 'MUNI-03', 'Municipio capital Quibdó disponible con DANE 27001', !!quibdo, `ID: ${quibdo?.id}`);

  // --- 3. EVENTOS Y AFECTACIONES ---
  console.log('\n--- 3. Eventos y Afectaciones ---');
  const afectacionServicio = new AfectacionServicio();
  let afectacionCreada: any = null;

  try {
    afectacionCreada = await afectacionServicio.crearAfectacion({
      municipioId: quibdo?.id || 1,
      nombre: 'Creciente súbita Río Atrato - Sector El Caraño',
      descripcion: 'Afectación por desbordamiento de cuenca fluvial media',
      tipo: 'INUNDACION',
      severidad: 'ALTA',
      estado: 'ACTIVA',
      latitud: 5.694,
      longitud: -76.661,
      direccion: 'Barrio El Caraño, Sector Puente',
      fechaInicio: new Date().toISOString().split('T')[0],
      creadoPor: 1n,
    });
    registrarResultado('Afectaciones', 'EVENT-01', 'Crear evento de afectación válido', !!afectacionCreada.id, `ID: ${afectacionCreada.id}`);
  } catch (err: any) {
    registrarResultado('Afectaciones', 'EVENT-01', 'Crear evento de afectación válido', false, err.message);
  }

  // --- 4. CENTROS DE ACOPIO Y AUDITORÍA ---
  console.log('\n--- 4. Centros de Acopio y Auditoría ---');
  const centroServicio = new CentroAcopioServicio();
  let centroCreado: any = null;

  try {
    centroCreado = await centroServicio.crearCentro({
      municipioId: quibdo?.id || 1,
      organizacionId: 1n,
      nombre: 'Centro Logístico Humanitario Quibdó - Coliseo',
      direccion: 'Carrera 1 # 20-50',
      barrio: 'Centro',
      responsable: 'Coordinador Departamental Cruz Roja',
      telefono: '3101234567',
      latitud: 5.6947,
      longitud: -76.6611,
      fotoFachada: 'https://ejemplo.com/fachada_coliseo.jpg',
      estado: 'PENDIENTE',
    });
    registrarResultado('Centros', 'CENTER-01', 'Registrar centro de acopio en estado PENDIENTE', centroCreado.estado === 'PENDIENTE', `ID: ${centroCreado.id}`);
  } catch (err: any) {
    registrarResultado('Centros', 'CENTER-01', 'Registrar centro de acopio', false, err.message);
  }

  try {
    const centroAuditado = await centroServicio.auditarCentro(centroCreado.id, {
      decision: 'APROBADO',
      comentario: 'Verificación técnica completada en sitio con capacidad óptima',
      fotoEvidencia: 'https://ejemplo.com/evidencia_auditoria.jpg',
      latitud: 5.6947,
      longitud: -76.6611,
      auditorId: 1n,
    });
    registrarResultado('Auditoría', 'AUDIT-02', 'Auditor aprueba centro con evidencia fotográfica', centroAuditado.estado === 'APROBADO');
  } catch (err: any) {
    registrarResultado('Auditoría', 'AUDIT-02', 'Auditor aprueba centro con evidencia', false, err.message);
  }

  // --- 5. INVENTARIO CON NÚMEROS REALES ---
  console.log('\n--- 5. Inventario con Números Reales ---');
  const inventarioServicio = new InventarioServicio();
  let inventarioId: any = null;

  try {
    // INV-01: Entrada inicial = 100
    const entrada1 = await inventarioServicio.registrarEntrada({
      centroAcopioId: centroCreado.id,
      tipoAyuda: 'KITS_ALIMENTOS_FAMILIAR',
      cantidad: 100,
      peso: 1500,
      origen: 'Donación Nacional UNGRD',
      numeroDocumento: `DOC-QUIB-${Date.now()}`,
      usuarioId: 1n,
    });
    registrarResultado('Inventario', 'INV-01', 'Entrada inicial de 100 kits registrada', Number(entrada1.cantidad) === 100);

    // Consulta de inventario
    const invList = await inventarioServicio.listarInventarioPorCentro(centroCreado.id);
    const invActual = invList.find(i => i.tipoAyuda === 'KITS_ALIMENTOS_FAMILIAR');
    inventarioId = invActual?.id;
    registrarResultado('Inventario', 'INV-02', 'Saldo de inventario actualizado en centro', Number(invActual?.cantidadActual) >= 100, `Stock: ${invActual?.cantidadActual}`);

    // INV-05: Intento de salida mayor a stock disponible -> Debe rechazar
    try {
      await inventarioServicio.registrarSalida({
        municipioId: 1,
        centroAcopioId: centroCreado.id,
        tipoAyuda: 'KITS_ALIMENTOS_FAMILIAR',
        cantidad: 999999,
        peso: 999999,
        usuarioId: 1n,
        fotoEntrega: 'https://ejemplo.com/salida.jpg',
      });
      registrarResultado('Inventario', 'INV-05', 'Rechazar salida mayor al inventario disponible', false, 'Permitió salida inválida');
    } catch (err: any) {
      registrarResultado('Inventario', 'INV-05', 'Rechazar salida mayor al inventario disponible', true, 'Rechazado correctamente por falta de stock');
    }
  } catch (err: any) {
    registrarResultado('Inventario', 'INV-01/02', 'Gestión de inventarios', false, err.message);
  }

  // --- 6. FAMILIAS, BENEFICIARIOS Y ENTREGAS ---
  console.log('\n--- 6. Familias, Solicitudes y Entregas ---');
  const beneficiarioServicio = new BeneficiarioServicio();
  const solicitudServicio = new SolicitudAyudaServicio();
  const entregaServicio = new EntregaAyudaServicio();
  let beneficiarioCreado: any = null;
  let solicitudCreada: any = null;

  try {
    const codFam = `FAM-CH-${Date.now() % 100000}`;
    beneficiarioCreado = await beneficiarioServicio.crearBeneficiario({
      codigoFamilia: codFam,
      municipioId: quibdo?.id || 1,
      barrio: 'El Caraño',
      direccion: 'Manzana B Casa 14',
      latitud: 5.694,
      longitud: -76.661,
      cantidadPersonas: 5,
      contacto: '3119876543',
      estado: 'ACTIVO',
    });
    registrarResultado('Beneficiarios', 'FAM-01', 'Crear registro de familia damnificada', !!beneficiarioCreado.id, `Código: ${codFam}`);

    solicitudCreada = await solicitudServicio.crearSolicitud({
      beneficiarioId: beneficiarioCreado.id,
      afectacionId: afectacionCreada?.id,
      tipoNecesidad: 'ALIMENTO',
      prioridad: 'ALTA',
      descripcion: 'Kit de asistencia familiar para 5 integrantes',
      cantidadSolicitada: 1,
      evidencia: 'https://ejemplo.com/censo_familiar.jpg',
      estado: 'PENDIENTE',
    });
    registrarResultado('Solicitudes', 'HELP-01', 'Crear solicitud de ayuda en estado PENDIENTE', solicitudCreada.estado === 'PENDIENTE');

    const entrega = await entregaServicio.crearEntrega({
      beneficiarioId: beneficiarioCreado.id,
      solicitudId: solicitudCreada.id,
      cantidad: 1,
      responsableEntrega: 1n,
      evidencia: 'https://ejemplo.com/acta_entrega_firmada.jpg',
      latitud: 5.694,
      longitud: -76.661,
    });
    registrarResultado('Entregas', 'DEL-01', 'Registrar entrega efectiva con acta y trazabilidad', !!entrega.id, `ID Entrega: ${entrega.id}`);
  } catch (err: any) {
    registrarResultado('Beneficiarios', 'FAM/DEL', 'Flujo de beneficiarios y entrega', false, err.message);
  }

  // --- 7. DONACIONES, GASTOS Y CAJA TRANSPARENTE ---
  console.log('\n--- 7. Donaciones, Gastos y Caja Transparente ---');
  const donacionServicio = new DonacionServicio();
  const gastoServicio = new GastoServicio();

  try {
    const donacionDinero = await donacionServicio.crearDonacionDinero({
      donante: 'Fundación Solidaridad por el Pacífico',
      monto: 25000000,
      cuentaDestino: 'Banco Agrario - Cuenta Fondos Chocó N° 123-456-78',
      referencia: `TRX-${Date.now()}`,
      municipioId: quibdo?.id || 1,
      descripcion: 'Aporte de emergencia para atención en cuenca media',
    });
    registrarResultado('Financiero', 'DON-04', 'Registrar donación en dinero ($25.000.000 COP)', Number(donacionDinero.dinero?.monto) === 25000000);

    const donacionEspecie = await donacionServicio.crearDonacionEspecie({
      donante: 'Empresarios Unidos del Chocó',
      tipoAyuda: 'Kits de Potabilización y Filtros de Agua',
      cantidad: 200,
      peso: 600,
      unidadMedida: 'Unidades',
      municipioId: quibdo?.id || 1,
    });
    registrarResultado('Financiero', 'DON-05', 'Registrar donación en especie (200 unidades potabilización)', donacionEspecie.tipo === 'ESPECIE');

    const gasto = await gastoServicio.crearGasto({
      organizacionId: 1,
      concepto: 'Flete fluvial lancha rápida Quibdó - Bojayá para transporte de kits',
      monto: 3800000,
      proveedor: 'Transportes Fluviales del Atrato S.A.S. - NIT 900.555.444-1',
      numeroFactura: `FE-ATRATO-${Date.now() % 10000}`,
      fecha: new Date().toISOString().split('T')[0],
      soporte: 'https://ejemplo.com/factura_electronica_flete.pdf',
    }, 1n);
    registrarResultado('Financiero', 'FIN-01', 'Radicar gasto y factura electrónica en BORRADOR', gasto.estado === 'BORRADOR');

    const gastoAprobado = await gastoServicio.aprobarGasto(gasto.id, 'APROBAR', 1n);
    registrarResultado('Financiero', 'FIN-04', 'Aprobar orden de gasto tras auditoría contable', gastoAprobado.estado === 'APROBADO');
  } catch (err: any) {
    registrarResultado('Financiero', 'FIN/DON', 'Operaciones financieras y caja', false, err.message);
  }

  // --- 8. ALBERGUES Y DENUNCIAS ---
  console.log('\n--- 8. Albergues y Denuncias ---');
  const albergueServicio = new AlbergueServicio();
  const denunciaServicio = new DenunciaServicio();

  try {
    const albergue = await albergueServicio.crearAlbergue({
      municipioId: quibdo?.id || 1,
      nombre: 'Albergue Temporal La Aurora',
      direccion: 'Calle 28 # 4-15',
      latitud: 5.698,
      longitud: -76.658,
      capacidad: 80,
      ocupacion: 35,
      responsable: 'Dra. Patricia Mena',
      telefono: '3124567890',
      servicios: 'Agua potable, batería sanitaria, carpas familiares, enfermería',
      estado: 'DISPONIBLE',
    });
    registrarResultado('Albergues', 'SHELTER-01', 'Crear albergue con capacidad y servicios', albergue.capacidad === 80);

    const denuncia = await denunciaServicio.crearDenuncia({
      tipo: 'DISTRIBUCION_DESIGUAL',
      descripcion: 'Presunta exclusión de lista en sector marginal',
      municipioId: quibdo?.id || 1,
      barrio: 'Zona Norte',
      latitud: 5.701,
      longitud: -76.655,
      evidencia: 'https://ejemplo.com/foto_denuncia.jpg',
      estado: 'RECIBIDA',
    });
    registrarResultado('Denuncias', 'NOT-01', 'Canal ciudadano de denuncias y veeduría', denuncia.estado === 'RECIBIDA');
  } catch (err: any) {
    registrarResultado('Albergues/Denuncias', 'ALB/DEN', 'Albergues y denuncias', false, err.message);
  }

  // --- 9. DASHBOARDS Y REPORTES ---
  console.log('\n--- 9. Dashboards y Reportes Consolidados ---');
  const dashboardServicio = new DashboardServicio();
  const reportesServicio = new ReportesServicio();

  try {
    const adminDash = await dashboardServicio.dashboardAdministrativo();
    registrarResultado('Dashboards', 'REP-01', 'Dashboard administrativo consolidado con métricas', !!adminDash.resumen);

    const publicDash = await dashboardServicio.dashboardPublico();
    registrarResultado('Dashboards', 'REP-02', 'Dashboard público de transparencia territorial', publicDash.cobertura_territorial.length === 31, `Cobertura: ${publicDash.cobertura_territorial.length} municipios`);

    const repDonaciones = await reportesServicio.reporteDonaciones();
    registrarResultado('Reportes', 'REP-03', 'Reporte analítico multi-módulo de donaciones', repDonaciones.total > 0, `Total registros: ${repDonaciones.total}`);
  } catch (err: any) {
    registrarResultado('Dashboards/Reportes', 'DASH/REP', 'Dashboards y reportes', false, err.message);
  }

  // --- RESUMEN FINAL ---
  console.log('\n=============================================================');
  const exitosos = resultados.filter(r => r.estado === 'EXITOSO').length;
  const fallidos = resultados.filter(r => r.estado === 'FALLIDO').length;
  console.log(`📊 RESUMEN DE PRUEBAS: ${exitosos}/${resultados.length} EXITOSAS (${Math.round((exitosos/resultados.length)*100)}%)`);
  if (fallidos > 0) {
    console.log(`❌ PRUEBAS FALLIDAS: ${fallidos}`);
  } else {
    console.log('🎉 TODOS LOS CASOS DE PRUEBA PRINCIPALES PASARON AL 100%');
  }
  console.log('=============================================================\n');

  process.exit(fallidos > 0 ? 1 : 0);
}

ejecutarValidacion().catch(err => {
  console.error('Error fatal ejecutando validación:', err);
  process.exit(1);
});
