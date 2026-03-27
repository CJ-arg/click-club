import { getAllPosts, createPost } from '@/lib/store';
import { isValidLinkedInUrl, CATEGORIES } from '@/lib/config';

export async function GET() {
  const posts = await getAllPosts();
  return Response.json({ posts });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, url, category } = body;

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return Response.json(
        { error: 'El nombre debe tener al menos 2 caracteres.' },
        { status: 400 }
      );
    }

    // Validate LinkedIn URL
    if (!url || !isValidLinkedInUrl(url)) {
      return Response.json(
        { error: 'Debe ser un enlace válido de LinkedIn (https://www.linkedin.com/...)' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = CATEGORIES.map((c) => c.value);
    if (!category || !validCategories.includes(category)) {
      return Response.json(
        { error: 'Selecciona una categoría válida.' },
        { status: 400 }
      );
    }

    const id = `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const post = await createPost({
      id,
      name: name.trim(),
      url: url.trim(),
      category,
    });

    return Response.json({ post }, { status: 201 });
  } catch {
    return Response.json(
      { error: 'Error al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
