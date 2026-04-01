# Click Club

Comunidad privada para compartir publicaciones de LinkedIn entre perfiles tecnicos.

## Inicio rapido

1. Instala dependencias:
   - `npm install`
2. Configura variables de entorno (recomendado en `.env.local`):
   - `INVITE_CODE=...`
   - `KV_REDIS_URL=redis://...` (opcional, recomendado para persistencia temporal)
   - `POSTGRES_URL=postgres://...` (obligatorio para persistencia del Directorio de Perfiles)
3. Levanta el proyecto:
   - `npm run dev`
4. Abre:
   - [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - desarrollo.
- `npm run build` - build de produccion.
- `npm run start` - correr build.
- `npm run test` - tests unitarios.

## Arquitectura en una linea

App Next.js monolitica (UI + API routes) con persistencia dual: Redis (para el Feed temporal de posts) y PostgreSQL (para el Directorio VIP de Perfiles fijos).

## Documentacion completa

- [Vision general](docs/01-overview.md)
- [Arquitectura](docs/02-architecture.md)
- [Persistencia](docs/03-persistence.md)
- [API](docs/04-api.md)
- [Flujos frontend](docs/05-frontend-flows.md)
- [Workflow de desarrollo](docs/06-dev-workflow.md)
- [Contexto para agentes IA](docs/07-ai-context.md)

## Archivos clave del codigo

- `src/components/Feed.js` - UI principal (Posteos Temporales).
- `src/components/Directory.js` - UI de Perfiles Permanentes.
- `src/app/api/posts/route.js` - listado y creacion de posts en Redis.
- `src/app/api/profiles/route.js` - listado y creacion de perfiles en PostgreSQL.
- `src/app/api/posts/[id]/like/route.js` - likes.
- `src/app/api/verify/route.js` - verificacion de invitacion.
- `src/lib/store.js` - persistencia temporal (Redis/fallback).
- `src/lib/db.js` - persistencia permanente (PostgreSQL).
- `src/lib/config.js` - constantes y validaciones de dominio estrictas.
