# API

## Convenciones generales

- Todas las rutas estan en `src/app/api/**/route.js`.
- Respuestas en JSON usando `Response.json(...)`.
- Validaciones basicas del payload en cada endpoint.

## Endpoints

### `POST /api/verify`

Valida el codigo de invitacion contra `INVITE_CODE`.

Request:

```json
{ "code": "CLICKCLUB2026" }
```

Respuestas:

- `200`: `{ "valid": true }`
- `403`: `{ "valid": false, "error": "Codigo de invitacion invalido." }`
- `500`: `{ "valid": false, "error": "Error al verificar." }`

### `GET /api/posts`

Retorna posts activos ordenados del mas nuevo al mas viejo.

Respuesta:

```json
{ "posts": [/* post[] */] }
```

### `POST /api/posts`

Crea un nuevo post.

Request:

```json
{
  "name": "Maria Garcia",
  "url": "https://www.linkedin.com/in/maria-garcia",
  "category": "fullstack"
}
```

Validaciones:

- `name` minimo 2 caracteres.
- `url` debe ser LinkedIn valida por `isValidLinkedInUrl`.
- `category` debe existir en `CATEGORIES`.

Respuestas:

- `201`: `{ "post": { ... } }`
- `400`: `{ "error": "..." }` por validacion
- `500`: `{ "error": "Error al procesar la solicitud." }`

### `POST /api/posts/{id}/like`

Registra un like para `visitorId`.

Request:

```json
{ "visitorId": "v_1711111111111_ab12cd" }
```

Respuestas:

- `200`: `{ "post": { ...actualizado... } }`
- `400`: `{ "error": "Se requiere un identificador de visitante." }`
- `404`: `{ "error": "Post no encontrado o expirado." }`
- `500`: `{ "error": "Error al procesar el like." }`

## Errores y manejo esperado

- Los errores de validacion devuelven `400`.
- Los errores de negocio de recurso inexistente devuelven `404`.
- Los errores inesperados devuelven `500`.
- En frontend, los errores se presentan como mensajes de formulario o fallback silencioso segun accion.
