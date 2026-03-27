import { likePost } from '@/lib/store';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { visitorId } = body;

    if (!visitorId) {
      return Response.json(
        { error: 'Se requiere un identificador de visitante.' },
        { status: 400 }
      );
    }

    const post = await likePost(id, visitorId);

    if (!post) {
      return Response.json(
        { error: 'Post no encontrado o expirado.' },
        { status: 404 }
      );
    }

    return Response.json({ post });
  } catch {
    return Response.json(
      { error: 'Error al procesar el like.' },
      { status: 500 }
    );
  }
}
