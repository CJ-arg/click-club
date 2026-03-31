# Contexto para Agentes IA

## Objetivo

Dar un mapa rapido para que un agente pueda ubicar responsabilidades, tocar los archivos correctos y minimizar regresiones.

## Entry points criticos

- UI principal: `src/app/page.js`
- Flujo de invitacion: `src/app/entrar/page.js`
- Feed y comportamiento cliente: `src/components/Feed.js`
- API posts: `src/app/api/posts/route.js`
- API like: `src/app/api/posts/[id]/like/route.js`
- API verify: `src/app/api/verify/route.js`
- Persistencia: `src/lib/store.js`
- Reglas de dominio: `src/lib/config.js`

## Limites de responsabilidad por capa

- **Frontend (`src/app`, `src/components`)**
  - Render, estado de UI y experiencia de usuario.
  - No debe duplicar validaciones sensibles de backend.
- **API routes (`src/app/api`)**
  - Validacion de entrada y contrato HTTP.
  - Delega logica de almacenamiento a `store.js`.
- **Store (`src/lib/store.js`)**
  - Unico punto de persistencia.
  - No mezclar logica de presentacion aqui.
- **Config (`src/lib/config.js`)**
  - Reglas compartidas y constantes de dominio.

## Reglas operativas recomendadas para agentes

1. Si el cambio afecta almacenamiento, tocar primero `src/lib/store.js` y luego actualizar tests/docs.
2. Si cambia payload o respuesta, alinear `src/app/api/**` + `docs/04-api.md`.
3. Si cambia comportamiento visible de usuario, alinear `src/components/Feed.js` + `docs/05-frontend-flows.md`.
4. Mantener `INVITE_CODE` y `KV_REDIS_URL` como configuracion externa (no hardcodear secretos).
5. Ejecutar `npm run test` despues de cambios sustanciales.

## Riesgos frecuentes

- Depender accidentalmente de estado en memoria cuando falta Redis.
- Romper deduplicacion de likes por no respetar `visitorId`.
- Cambiar categorias en frontend sin sincronizar `CATEGORIES` de backend/config.
- Modificar flujos sin actualizar documentacion de onboarding.

## Definicion de listo para cambios de agentes

- Codigo implementado en capa correcta.
- Tests relevantes ajustados o agregados.
- Documentacion en `docs/` actualizada.
- No se introducen secretos ni contratos inconsistentes.
