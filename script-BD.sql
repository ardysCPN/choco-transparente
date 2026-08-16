-- =============================================================================
-- PLATA-FORMA CHOCÓ TRANSPARENTE v1.0
-- SCRIPT PRINCIPAL DE BASE DE DATOS (DDL + SEED DEMO)
-- Base de datos: PostgreSQL 15+ con PostGIS
-- =============================================================================

BEGIN;

-- 1. EXTENSIONES Y FUNCIONES AUXILIARES
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE OR REPLACE FUNCTION public.actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TABLAS GEOGRÁFICAS Y TERRITORIALES
CREATE TABLE IF NOT EXISTS public.departamento (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo_dane VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.municipio (
    id SERIAL PRIMARY KEY,
    departamento_id INT NOT NULL REFERENCES public.departamento(id),
    codigo_dane VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    latitud NUMERIC(10, 8),
    longitud NUMERIC(11, 8),
    ubicacion GEOMETRY(Point, 4326),
    estado BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_municipio_modificacion BEFORE UPDATE ON public.municipio
FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_modificacion();

-- 3. ORGANIZACIONES, ROLES Y USUARIOS
CREATE TABLE IF NOT EXISTS public.organizacion (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    identificacion VARCHAR(50) UNIQUE NOT NULL,
    responsable VARCHAR(200) NOT NULL,
    telefono VARCHAR(50),
    correo VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'INACTIVA', 'SUSPENDIDA')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_organizacion_modificacion BEFORE UPDATE ON public.organizacion
FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_modificacion();

CREATE TABLE IF NOT EXISTS public.rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.permiso (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS public.rol_permiso (
    rol_id INT REFERENCES public.rol(id) ON DELETE CASCADE,
    permiso_id INT REFERENCES public.permiso(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE IF NOT EXISTS public.usuario (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    documento VARCHAR(50) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    rol_id INT NOT NULL REFERENCES public.rol(id),
    municipio_id INT REFERENCES public.municipio(id),
    organizacion_id BIGINT REFERENCES public.organizacion(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_usuario_modificacion BEFORE UPDATE ON public.usuario
FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_modificacion();

-- 4. AFECTACIONES
CREATE TABLE IF NOT EXISTS public.afectacion (
    id BIGSERIAL PRIMARY KEY,
    municipio_id INT NOT NULL REFERENCES public.municipio(id),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50) NOT NULL,
    severidad VARCHAR(20) DEFAULT 'MEDIA' CHECK (severidad IN ('BAJA', 'MEDIA', 'ALTA', 'CRITICA')),
    estado VARCHAR(20) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'EN_ATENCION', 'CONTROLADA', 'CERRADA')),
    latitud NUMERIC(10, 8),
    longitud NUMERIC(11, 8),
    ubicacion GEOMETRY(Point, 4326),
    direccion VARCHAR(255),
    fecha_inicio DATE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por BIGINT NOT NULL REFERENCES public.usuario(id)
);

-- 5. CENTROS DE ACOPIO
CREATE TABLE IF NOT EXISTS public.centro_acopio (
    id BIGSERIAL PRIMARY KEY,
    municipio_id INT NOT NULL REFERENCES public.municipio(id),
    organizacion_id BIGINT NOT NULL REFERENCES public.organizacion(id),
    nombre VARCHAR(200) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    barrio VARCHAR(100),
    responsable VARCHAR(150) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    latitud NUMERIC(10, 8),
    longitud NUMERIC(11, 8),
    ubicacion GEOMETRY(Point, 4326),
    foto_fachada VARCHAR(500),
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'CERRADO')),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion TIMESTAMP,
    aprobado_por BIGINT REFERENCES public.usuario(id)
);

CREATE TABLE IF NOT EXISTS public.auditoria_centro (
    id BIGSERIAL PRIMARY KEY,
    centro_acopio_id BIGINT NOT NULL REFERENCES public.centro_acopio(id) ON DELETE CASCADE,
    auditor_id BIGINT NOT NULL REFERENCES public.usuario(id),
    decision VARCHAR(20) NOT NULL CHECK (decision IN ('APROBADO', 'RECHAZADO')),
    comentario TEXT NOT NULL,
    foto_evidencia VARCHAR(500) NOT NULL,
    latitud NUMERIC(10, 8),
    longitud NUMERIC(11, 8),
    ubicacion GEOMETRY(Point, 4326),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. INVENTARIOS
CREATE TABLE IF NOT EXISTS public.inventario (
    id BIGSERIAL PRIMARY KEY,
    centro_acopio_id BIGINT NOT NULL REFERENCES public.centro_acopio(id) ON DELETE CASCADE,
    municipio_id INT NOT NULL,
    tipo_ayuda VARCHAR(50) NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    cantidad_actual NUMERIC(12, 2) DEFAULT 0 CHECK (cantidad_actual >= 0),
    peso_actual NUMERIC(12, 2) DEFAULT 0 CHECK (peso_actual >= 0),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_centro_tipo UNIQUE (centro_acopio_id, tipo_ayuda)
);

CREATE TABLE IF NOT EXISTS public.lote (
    id BIGSERIAL PRIMARY KEY,
    codigo_qr VARCHAR(100) UNIQUE NOT NULL,
    inventario_id BIGINT NOT NULL REFERENCES public.inventario(id) ON DELETE CASCADE,
    tipo_ayuda VARCHAR(50) NOT NULL,
    cantidad_inicial NUMERIC(12, 2) NOT NULL CHECK (cantidad_inicial > 0),
    cantidad_actual NUMERIC(12, 2) NOT NULL CHECK (cantidad_actual >= 0),
    peso NUMERIC(12, 2) DEFAULT 0,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    origen VARCHAR(100) NOT NULL,
    estado VARCHAR(20) DEFAULT 'DISPONIBLE' CHECK (estado IN ('DISPONIBLE', 'AGOTADO', 'CUARENTENA'))
);

CREATE TABLE IF NOT EXISTS public.entrada_inventario (
    id BIGSERIAL PRIMARY KEY,
    centro_acopio_id BIGINT NOT NULL REFERENCES public.centro_acopio(id),
    lote_id BIGINT REFERENCES public.lote(id),
    tipo_ayuda VARCHAR(50) NOT NULL,
    cantidad NUMERIC(12, 2) NOT NULL CHECK (cantidad > 0),
    peso NUMERIC(12, 2),
    origen VARCHAR(100) NOT NULL,
    numero_documento VARCHAR(100),
    foto_camion VARCHAR(500),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL REFERENCES public.usuario(id),
    identificador_offline VARCHAR(100) UNIQUE
);

-- 7. BENEFICIARIOS
CREATE TABLE IF NOT EXISTS public.beneficiario (
    id BIGSERIAL PRIMARY KEY,
    codigo_familia VARCHAR(50) UNIQUE NOT NULL,
    municipio_id INT NOT NULL REFERENCES public.municipio(id),
    barrio VARCHAR(100),
    direccion VARCHAR(255),
    latitud NUMERIC(10, 8),
    longitud NUMERIC(11, 8),
    ubicacion GEOMETRY(Point, 4326),
    cantidad_personas INT NOT NULL CHECK (cantidad_personas > 0),
    contacto VARCHAR(100),
    estado VARCHAR(20) DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO', 'ATENDIDO')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.salida_inventario (
    id BIGSERIAL PRIMARY KEY,
    centro_acopio_id BIGINT NOT NULL REFERENCES public.centro_acopio(id),
    lote_id BIGINT REFERENCES public.lote(id),
    cantidad NUMERIC(12, 2) NOT NULL CHECK (cantidad > 0),
    peso NUMERIC(12, 2),
    beneficiario_id BIGINT REFERENCES public.beneficiario(id),
    municipio_id INT NOT NULL,
    barrio VARCHAR(100),
    foto_entrega VARCHAR(500) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL REFERENCES public.usuario(id),
    identificador_offline VARCHAR(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS public.solicitud_ayuda (
    id BIGSERIAL PRIMARY KEY,
    beneficiario_id BIGINT NOT NULL REFERENCES public.beneficiario(id),
    afectacion_id BIGINT NOT NULL REFERENCES public.afectacion(id),
    tipo_necesidad VARCHAR(50) NOT NULL,
    prioridad VARCHAR(20) DEFAULT 'MEDIA' CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA', 'CRITICA')),
    descripcion TEXT,
    cantidad_solicitada NUMERIC(12, 2) NOT NULL CHECK (cantidad_solicitada > 0),
    evidencia VARCHAR(500),
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'APROBADA', 'ENTREGADA', 'CANCELADA')),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atendida_por BIGINT REFERENCES public.usuario(id)
);

CREATE TABLE IF NOT EXISTS public.entrega_ayuda (
    id BIGSERIAL PRIMARY KEY,
    solicitud_id BIGINT REFERENCES public.solicitud_ayuda(id),
    beneficiario_id BIGINT NOT NULL REFERENCES public.beneficiario(id),
    lote_id BIGINT REFERENCES public.lote(id),
    cantidad NUMERIC(12, 2) NOT NULL CHECK (cantidad > 0),
    responsable_entrega BIGINT NOT NULL REFERENCES public.usuario(id),
    evidencia VARCHAR(500) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    latitud NUMERIC(10, 8),
    longitud NUMERIC(11, 8),
    ubicacion GEOMETRY(Point, 4326),
    observaciones TEXT,
    identificador_offline VARCHAR(100) UNIQUE
);

-- 8. DONACIONES Y GASTOS
CREATE TABLE IF NOT EXISTS public.donacion (
    id BIGSERIAL PRIMARY KEY,
    organizacion_id BIGINT REFERENCES public.organizacion(id),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('DINERO', 'ESPECIE')),
    donante VARCHAR(150) NOT NULL,
    monto NUMERIC(15, 2) CHECK (monto > 0),
    descripcion TEXT,
    municipio_id INT REFERENCES public.municipio(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'RECHAZADA'))
);

CREATE TABLE IF NOT EXISTS public.donacion_dinero (
    donacion_id BIGINT PRIMARY KEY REFERENCES public.donacion(id) ON DELETE CASCADE,
    cuenta_destino VARCHAR(100) NOT NULL,
    referencia VARCHAR(100) NOT NULL,
    monto NUMERIC(15, 2) NOT NULL CHECK (monto > 0),
    soporte_archivo VARCHAR(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.donacion_especie (
    donacion_id BIGINT PRIMARY KEY REFERENCES public.donacion(id) ON DELETE CASCADE,
    tipo_ayuda VARCHAR(50) NOT NULL,
    cantidad NUMERIC(12, 2) NOT NULL CHECK (cantidad > 0),
    peso NUMERIC(12, 2),
    unidad_medida VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gasto (
    id BIGSERIAL PRIMARY KEY,
    organizacion_id BIGINT NOT NULL REFERENCES public.organizacion(id),
    concepto VARCHAR(255) NOT NULL,
    monto NUMERIC(15, 2) NOT NULL CHECK (monto > 0),
    proveedor VARCHAR(150) NOT NULL,
    numero_factura VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    soporte VARCHAR(500) NOT NULL,
    estado VARCHAR(20) DEFAULT 'BORRADOR' CHECK (estado IN ('BORRADOR', 'APROBADO', 'RECHAZADO')),
    creado_por BIGINT NOT NULL REFERENCES public.usuario(id),
    aprobado_por BIGINT REFERENCES public.usuario(id)
);

-- 9. ALBERGUES, DENUNCIAS Y AUDITORÍA
CREATE TABLE IF NOT EXISTS public.albergue (
    id BIGSERIAL PRIMARY KEY,
    municipio_id INT NOT NULL REFERENCES public.municipio(id),
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    latitud NUMERIC(10, 8),
    longitud NUMERIC(11, 8),
    ubicacion GEOMETRY(Point, 4326),
    capacidad INT NOT NULL CHECK (capacidad > 0),
    ocupacion INT DEFAULT 0 CHECK (ocupacion >= 0),
    responsable VARCHAR(150) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    servicios TEXT,
    estado VARCHAR(20) DEFAULT 'DISPONIBLE' CHECK (estado IN ('DISPONIBLE', 'CASI_LLENO', 'LLENO', 'CERRADO')),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.denuncia (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    municipio_id INT NOT NULL REFERENCES public.municipio(id),
    barrio VARCHAR(100),
    latitud NUMERIC(10, 8),
    longitud NUMERIC(11, 8),
    ubicacion GEOMETRY(Point, 4326),
    evidencia VARCHAR(500),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'RECIBIDA' CHECK (estado IN ('RECIBIDA', 'EN_REVISION', 'INVESTIGADA', 'DESCARTADA')),
    respuesta TEXT,
    atendido_por BIGINT REFERENCES public.usuario(id),
    identificador_offline VARCHAR(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS public.notificacion (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES public.usuario(id),
    municipio_id INT REFERENCES public.municipio(id),
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.auditoria (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES public.usuario(id),
    modulo VARCHAR(50) NOT NULL,
    accion VARCHAR(50) NOT NULL,
    entidad VARCHAR(50) NOT NULL,
    entidad_id VARCHAR(50),
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip VARCHAR(45),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.configuracion (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT NOT NULL,
    descripcion TEXT
);

-- =============================================================================
-- ÍNDICES DE RENDIMIENTO Y ESPACIALES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_municipio_ubicacion ON public.municipio USING GIST (ubicacion);
CREATE INDEX IF NOT EXISTS idx_afectacion_ubicacion ON public.afectacion USING GIST (ubicacion);
CREATE INDEX IF NOT EXISTS idx_centro_acopio_ubicacion ON public.centro_acopio USING GIST (ubicacion);
CREATE INDEX IF NOT EXISTS idx_albergue_ubicacion ON public.albergue USING GIST (ubicacion);
CREATE INDEX IF NOT EXISTS idx_beneficiario_ubicacion ON public.beneficiario USING GIST (ubicacion);
CREATE INDEX IF NOT EXISTS idx_usuario_municipio ON public.usuario(municipio_id);
CREATE INDEX IF NOT EXISTS idx_usuario_organizacion ON public.usuario(organizacion_id);
CREATE INDEX IF NOT EXISTS idx_inventario_centro ON public.inventario(centro_acopio_id);
CREATE INDEX IF NOT EXISTS idx_solicitud_estado ON public.solicitud_ayuda(estado);
CREATE INDEX IF NOT EXISTS idx_gasto_estado ON public.gasto(estado);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON public.auditoria(usuario_id);

-- =============================================================================
-- POBLAMIENTO BASE (31 MUNICIPIOS + ROLES + USUARIOS)
-- =============================================================================

INSERT INTO public.departamento (id, nombre, codigo_dane) VALUES 
(27, 'CHOCÓ', '27')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.municipio (id, departamento_id, codigo_dane, nombre, latitud, longitud, ubicacion) VALUES
(1, 27, '27001', 'QUIBDÓ', 5.694722, -76.661111, ST_SetSRID(ST_MakePoint(-76.661111, 5.694722), 4326)),
(2, 27, '27006', 'ACANDÍ', 8.508611, -77.278056, ST_SetSRID(ST_MakePoint(-77.278056, 8.508611), 4326)),
(3, 27, '27025', 'ALTO BAUDÓ', 5.525556, -77.014444, ST_SetSRID(ST_MakePoint(-77.014444, 5.525556), 4326)),
(4, 27, '27050', 'ATRATO', 5.518611, -76.685278, ST_SetSRID(ST_MakePoint(-76.685278, 5.518611), 4326)),
(5, 27, '27073', 'BAGADÓ', 5.412222, -76.411667, ST_SetSRID(ST_MakePoint(-76.411667, 5.412222), 4326)),
(6, 27, '27075', 'BAHÍA SOLANO', 6.226389, -77.404444, ST_SetSRID(ST_MakePoint(-77.404444, 6.226389), 4326)),
(7, 27, '27077', 'BAJO BAUDÓ', 4.954722, -77.368889, ST_SetSRID(ST_MakePoint(-77.368889, 4.954722), 4326)),
(8, 27, '27099', 'BOJAYÁ', 6.550278, -76.901111, ST_SetSRID(ST_MakePoint(-76.901111, 6.550278), 4326)),
(9, 27, '27135', 'EL CÁRMEN DE ATRATO', 5.604722, -76.143889, ST_SetSRID(ST_MakePoint(-76.143889, 5.604722), 4326)),
(10, 27, '27150', 'CARMEN DEL DARIÉN', 7.080556, -77.000000, ST_SetSRID(ST_MakePoint(-77.000000, 7.080556), 4326)),
(11, 27, '27160', 'CÉRTEGUI', 5.366667, -76.583333, ST_SetSRID(ST_MakePoint(-76.583333, 5.366667), 4326)),
(12, 27, '27205', 'CONDOTO', 5.093056, -76.649722, ST_SetSRID(ST_MakePoint(-76.649722, 5.093056), 4326)),
(13, 27, '27245', 'EL LITORAL DEL SAN JUAN', 4.266111, -77.366111, ST_SetSRID(ST_MakePoint(-77.366111, 4.266111), 4326)),
(14, 27, '27250', 'ISTMINA', 5.160000, -76.685000, ST_SetSRID(ST_MakePoint(-76.685000, 5.160000), 4326)),
(15, 27, '27361', 'JURADÓ', 7.108611, -77.766389, ST_SetSRID(ST_MakePoint(-77.766389, 7.108611), 4326)),
(16, 27, '27411', 'LLORÓ', 5.511667, -76.541667, ST_SetSRID(ST_MakePoint(-76.541667, 5.511667), 4326)),
(17, 27, '27425', 'MEDIO ATRATO', 5.864722, -76.711667, ST_SetSRID(ST_MakePoint(-76.711667, 5.864722), 4326)),
(18, 27, '27430', 'MEDIO BAUDÓ', 5.200000, -77.000000, ST_SetSRID(ST_MakePoint(-77.000000, 5.200000), 4326)),
(19, 27, '27450', 'MEDIO SAN JUAN', 5.000000, -76.800000, ST_SetSRID(ST_MakePoint(-76.800000, 5.000000), 4326)),
(20, 27, '27491', 'NÓVITA', 4.954167, -76.605278, ST_SetSRID(ST_MakePoint(-76.605278, 4.954167), 4326)),
(21, 27, '27495', 'NUQUÍ', 5.712500, -77.270833, ST_SetSRID(ST_MakePoint(-77.270833, 5.712500), 4326)),
(22, 27, '27580', 'RÍO IRO', 4.933333, -76.600000, ST_SetSRID(ST_MakePoint(-76.600000, 4.933333), 4326)),
(23, 27, '27600', 'RÍO QUITO', 5.516667, -76.700000, ST_SetSRID(ST_MakePoint(-76.700000, 5.516667), 4326)),
(24, 27, '27615', 'RIOSUCIO', 7.441944, -77.118611, ST_SetSRID(ST_MakePoint(-77.118611, 7.441944), 4326)),
(25, 27, '27660', 'SAN JOSÉ DEL PALMAR', 4.972778, -76.229444, ST_SetSRID(ST_MakePoint(-76.229444, 4.972778), 4326)),
(26, 27, '27737', 'SIPÍ', 4.656944, -76.480278, ST_SetSRID(ST_MakePoint(-76.480278, 4.656944), 4326)),
(27, 27, '27745', 'TADÓ', 5.268333, -76.559444, ST_SetSRID(ST_MakePoint(-76.559444, 5.268333), 4326)),
(28, 27, '27787', 'UNGUÍA', 8.043611, -77.094167, ST_SetSRID(ST_MakePoint(-77.094167, 8.043611), 4326)),
(29, 27, '27800', 'UNIÓN PANAMERICANA', 5.316667, -76.650000, ST_SetSRID(ST_MakePoint(-76.650000, 5.316667), 4326)),
(30, 27, '27810', 'BELÉN DE BAJIRÁ', 7.230000, -76.730000, ST_SetSRID(ST_MakePoint(-76.730000, 7.230000), 4326)),
(31, 27, '27130', 'CANTÓN DE SAN PABLO', 4.950000, -77.360000, ST_SetSRID(ST_MakePoint(-77.360000, 4.950000), 4326))
ON CONFLICT (id) DO NOTHING;

SELECT setval('municipio_id_seq', (SELECT MAX(id) FROM public.municipio));

-- Roles
INSERT INTO public.rol (id, nombre, descripcion, activo) VALUES
(1, 'SUPERADMIN', 'Acceso global total al sistema departamental', true),
(2, 'ADMIN_MUNICIPAL', 'Administración dentro de su ámbito municipal', true),
(3, 'COORDINADOR', 'Gestión operativa de acopio, inventario y entregas', true),
(4, 'AUDITOR', 'Aprobación y verificación técnica de acopios y operaciones', true),
(5, 'VEEDOR', 'Monitoreo, veeduría e interposición de denuncias', true),
(6, 'ORGANIZACION', 'Registro de donaciones, operaciones y gastos autorizados', true),
(7, 'PUBLICO', 'Acceso a la información transparente sin datos personales', true)
ON CONFLICT (id) DO NOTHING;

SELECT setval('rol_id_seq', (SELECT MAX(id) FROM public.rol));

-- Permisos
INSERT INTO public.permiso (codigo, nombre, descripcion) VALUES
('SISTEMA_GLOBAL', 'Administración Global', 'Acceso sin restricción territorial'),
('USUARIOS_GESTION', 'Gestión de Usuarios', 'Crear y modificar usuarios'),
('CENTROS_SOLICITAR', 'Solicitar Centro de Acopio', 'Registrar propuesta de centro'),
('CENTROS_AUDITAR', 'Auditar Centro de Acopio', 'Aprobar o rechazar centros'),
('INVENTARIO_ENTRADA', 'Registrar Entrada', 'Incrementar existencias'),
('INVENTARIO_SALIDA', 'Registrar Salida', 'Disminuir existencias'),
('GASTOS_APROBAR', 'Aprobar Gastos', 'Aprobación financiera de gastos'),
('DENUNCIAS_CREAR', 'Registrar Denuncia', 'Ingresar denuncias de transparencia')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO public.rol_permiso (rol_id, permiso_id)
SELECT 1, id FROM public.permiso
ON CONFLICT (rol_id, permiso_id) DO NOTHING;

-- Organizaciones
INSERT INTO public.organizacion (id, nombre, tipo, identificacion, responsable, telefono, correo, estado) VALUES
(1, 'Gobernación del Chocó - Gestión del Riesgo', 'GOBERNACION', '891680011-8', 'Coordinador Departamental', '3100000000', 'gestionriesgo@choco.gov.co', 'ACTIVA'),
(2, 'Cruz Roja Seccional Chocó', 'ONG', '891680022-9', 'Director de Socorro', '3101112233', 'socorro.choco@cruzrojacolombiana.org', 'ACTIVA')
ON CONFLICT (id) DO NOTHING;

SELECT setval('organizacion_id_seq', (SELECT MAX(id) FROM public.organizacion));

-- Usuarios
-- 1. Superadmin: admin@chocotransparente.gov.co / AdminChoco2026!
INSERT INTO public.usuario (id, nombre, apellido, correo, telefono, documento, contrasena_hash, activo, rol_id, municipio_id, organizacion_id) VALUES
(1, 'Super', 'Administrador', 'admin@chocotransparente.gov.co', '3100000000', '0000000000', '$2a$10$fVevFf5f26f06LWUX4HOF.xDV3Oh6fTIqmRFu4V0/.6jRqVBYqU0O', true, 1, 1, 1)
ON CONFLICT (id) DO UPDATE SET contrasena_hash = EXCLUDED.contrasena_hash;

-- 2. Test User: test@chocotransparente.gov.co / TestChoco2026!
INSERT INTO public.usuario (id, nombre, apellido, correo, telefono, documento, contrasena_hash, activo, rol_id, municipio_id, organizacion_id) VALUES
(2, 'Operador', 'Testing', 'test@chocotransparente.gov.co', '3109998877', '1111111111', '$2a$10$fjz2dgVAvSUGu7yhvauSMesCrUPmEarS9lW9ZZSpA1w2NvJQPBIf.', true, 3, 1, 1)
ON CONFLICT (id) DO UPDATE SET contrasena_hash = EXCLUDED.contrasena_hash;

SELECT setval('usuario_id_seq', (SELECT MAX(id) FROM public.usuario));

-- Parámetros Globales
INSERT INTO public.configuracion (clave, valor, descripcion) VALUES
('MONTO_LIMITE_DOBLE_APROBACION', '50000000', 'Monto en COP que exige doble aprobación financiera de gastos'),
('DIAS_VENTANA_DUPLICADOS_ENTREGA', '15', 'Días mínimos para alertar por posible entrega duplicada a una familia'),
('MAX_TAMAÑO_ARCHIVO_MB', '10', 'Límite máximo de carga por evidencia fotográfica o soporte')
ON CONFLICT (clave) DO NOTHING;

COMMIT;