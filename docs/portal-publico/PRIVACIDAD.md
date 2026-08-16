# Política de Privacidad y Protección de Datos — Portal Público

## 1. Principio de Zero-Leakage (Cero Fuga)

En estricto cumplimiento de la Ley 1581 de 2012 (Protección de Datos Personales de Colombia) y los protocolos internacionales de acción humanitaria:

### Datos Prohibidos en Exposición Pública
1. **Cédulas y Documentos de Identidad:** Ninguna consulta pública devuelve cédulas de beneficiarios, víctimas ni coordinadores locales.
2. **Direcciones Exactas de Hogares Damnificados:** Se muestran únicamente a nivel de barrio, vereda o zona general.
3. **Coordenadas de Familias Vulnerables:** En los mapas públicos no se grafican puntos exactos de viviendas particulares para prevenir riesgos de seguridad o revictimización.
4. **Secretos y Cuentas Bancarias Personales:** Solo se publican cuentas oficiales institucionales con numeración parcialmente ofuscada.

---

## 2. Filtrado en Capa de Backend

La protección de datos se aplica a nivel de base de datos y controlador:
- Uso de proyecciones `select` explícitas en Prisma ORM.
- Los modelos públicos solo transportan información agregada o anonimizada.
- Las denuncias anónimas no capturan direcciones IP personales ni metadatos de usuario.
