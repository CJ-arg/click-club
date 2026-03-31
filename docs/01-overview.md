# Click Club - Vision General

## Que es Click Club

Click Club es una comunidad privada para compartir publicaciones de LinkedIn entre perfiles tecnicos. La app permite:

- ingresar con un codigo de invitacion;
- publicar un enlace de LinkedIn por 24 horas;
- visualizar publicaciones activas del grupo.

## Stack tecnico

- Frontend + Backend en un solo proyecto Next.js (App Router).
- React para UI (`src/app` y `src/components`).
- API Routes para backend (`src/app/api`).
- Persistencia en Redis cuando existe `KV_REDIS_URL`.
- Fallback en memoria del proceso (`Map`) si Redis no esta disponible.
- Tests unitarios con Jest.

## Como leer esta documentacion

1. Empeza por arquitectura para entender responsabilidades.
2. Segui con persistencia para conocer como se guardan y expiran datos.
3. Revisa API para contratos de entrada/salida.
4. Revisa flujos frontend para entender comportamiento de UI.
5. Cierra con workflow de desarrollo y guia para agentes IA.

## Mapa de documentos

- `docs/02-architecture.md` - Componentes y flujo end-to-end.
- `docs/03-persistence.md` - Redis, fallback local, TTL y modelo de datos.
- `docs/04-api.md` - Endpoints, payloads, respuestas y errores.
- `docs/05-frontend-flows.md` - Flujos de acceso, feed y estado local.
- `docs/06-dev-workflow.md` - Setup local, scripts, pruebas y checklist de PR.
- `docs/07-ai-context.md` - Guia operativa para agentes de IA.

## Glosario rapido

- **Invite code**: codigo para habilitar acceso inicial a la app.
- **Visitor ID**: identificador local del visitante para evitar likes duplicados.
- **Post TTL**: tiempo de vida de un post (24 horas).
- **Feed index**: sorted set en Redis que ordena posts por fecha de creacion.
