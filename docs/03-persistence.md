# Persistencia

## Resumen

La persistencia esta centralizada en `src/lib/store.js` con una estrategia dual:

1. **Primario**: Redis via `KV_REDIS_URL`.
2. **Fallback**: `Map` en memoria del proceso si Redis no esta disponible.

## Datos guardados

Modelo implicito de `post`:

- `id` (string)
- `name` (string)
- `url` (string)
- `category` (string)
- `likes` (number)
- `likedBy` (string[])
- `createdAt` (timestamp ms)
- `expiresAt` (timestamp ms)

## Estructura en Redis

- Hash por post: `post:{id}`
- Sorted set para feed: `posts:feed` (score = `createdAt`)

Operaciones principales:

- Crear: `hSet`, `zAdd`, `expire`
- Listar: `zRange` + `hGetAll`
- Like: `hGetAll` + `hSet`
- Borrar: `del` + `zRem`

## Expiracion de posts (24 horas)

- TTL definido por `POST_TTL_SEC = 24 * 60 * 60`.
- En Redis se aplica con `expire(post:{id}, POST_TTL_SEC)`.
- En fallback local se limpia con `cleanupLocal()` comparando `expiresAt`.

## Comportamiento por entorno

- **Con `KV_REDIS_URL` valido**: datos persistentes entre reinicios del servidor.
- **Sin `KV_REDIS_URL`**: datos viven solo en memoria del proceso actual.

## Integridad y consideraciones

- `likedBy` evita likes duplicados por `visitorId`.
- El parseo de tipos desde Redis se hace manualmente (`parseInt`, `JSON.parse`).
- Si un hash expira en Redis pero su id sigue indexado, `getAllPosts()` filtra registros invalidos.

## Variables de entorno relevantes

- `KV_REDIS_URL`: URL de conexion Redis.
- `INVITE_CODE`: codigo de invitacion para habilitar acceso.

Endpoint util de inspeccion:

- `GET /api/debug-env` retorna nombres de variables relacionadas a KV/Redis, sin exponer valores secretos.
