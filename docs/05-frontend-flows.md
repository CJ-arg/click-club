# Flujos Frontend

## Flujo 1: Acceso inicial por invitacion

Archivos:

- `src/app/page.js`
- `src/app/entrar/page.js`

Pasos:

1. Usuario abre `/entrar?codigo=...`.
2. Se llama `POST /api/verify`.
3. Si es valido:
   - guarda `clickclub_pass = granted` en `localStorage`;
   - crea `clickclub_visitor` si no existe;
   - redirige a `/`.
4. En `/`, `page.js` lee `clickclub_pass`:
   - si no existe: muestra gate de acceso;
   - si existe: renderiza `Feed`.

## Flujo 2: Carga del feed

Archivo: `src/components/Feed.js`.

- Al montar componente, se ejecuta `fetch('/api/posts')`.
- Se programa polling cada 30 segundos.
- Si la carga falla, se mantiene comportamiento silencioso y estado previo.

## Flujo 3: Publicar un post

- Usuario abre formulario "Compartir mi post de LinkedIn".
- Completa `name`, `url`, `category`.
- Frontend envia `POST /api/posts`.
- Si sale bien:
  - limpia formulario;
  - cierra panel;
  - recarga feed.
- Si falla:
  - muestra error visible en formulario.

## Flujo 4: Marcar visita y like local

Estado local del navegador:

- `clickclub_visited`: ids de posts visitados.
- `clickclub_liked`: ids de posts marcados localmente como liked.
- `clickclub_visitor`: id visitante para deduplicacion de likes en backend.

Comportamiento:

- Click en enlace LinkedIn marca post como visitado localmente.
- Like llama `POST /api/posts/{id}/like` con `visitorId`.
- Si backend confirma, se actualiza contador en memoria React y en `clickclub_liked`.

## Notas de UX

- El feed informa que los posts caducan cada 72h (3 dias).
- El filtrado por categoria ocurre en cliente sobre los posts cargados.
- No existe estado global externo (Redux/Zustand); todo vive en estado local del componente.
