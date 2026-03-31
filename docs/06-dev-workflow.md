# Workflow de Desarrollo

## Requisitos

- Node.js LTS y npm.
- Redis opcional para persistencia real.

## Setup local

1. Instalar dependencias:
   - `npm install`
2. Configurar variables de entorno (recomendado en `.env.local`):
   - `INVITE_CODE=...`
   - `KV_REDIS_URL=redis://...` (opcional pero recomendado)
3. Correr en desarrollo:
   - `npm run dev`

## Scripts del proyecto

- `npm run dev` - inicia servidor de desarrollo Next.js.
- `npm run build` - build de produccion.
- `npm run start` - levanta la app compilada.
- `npm run test` - ejecuta tests unitarios con Jest.

## Estrategia de pruebas actual

- Tests unitarios en:
  - `src/lib/config.test.js`
  - `src/lib/store.test.js`
- Enfoque principal: validaciones de config y logica de persistencia.

## Checklist antes de abrir PR

- Ejecutar `npm run test` y confirmar verde.
- Verificar que cambios de API esten reflejados en `docs/04-api.md`.
- Verificar que cambios de persistencia esten reflejados en `docs/03-persistence.md`.
- Mantener consistencia entre UI y docs (`docs/05-frontend-flows.md`).
- Evitar introducir secretos en codigo o commits.

## Limitaciones del proyecto hoy

- Sin pipeline CI/CD versionado en repo.
- Sin sistema de auth robusto; control de acceso basado en `localStorage`.
- Sin migraciones/esquemas formales de base de datos.
