import { deletePost } from '@/lib/store';
import { deleteProfile } from '@/lib/db';

export async function POST(req) {
  try {
    const { secret, type, id } = await req.json();

    // Verificamos la contraseña contra el .env.local de Vercel
    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      return Response.json({ error: 'Acceso Denegado. Contraseña incorrecta.' }, { status: 401 });
    }

    if (!id || !type) {
       return Response.json({ error: 'Falta ID o Tipo.' }, { status: 400 });
    }

    // Ejecutar borrado según el tipo
    if (type === 'post') {
      await deletePost(id);
    } else if (type === 'profile') {
      await deleteProfile(id);
    } else {
      return Response.json({ error: 'Tipo desconocido (debe ser post o profile)' }, { status: 400 });
    }

    return Response.json({ success: true, message: `💥 Eliminado correctamente (${type}: ${id})` });
  } catch (error) {
    console.error("Error admin delete:", error);
    return Response.json({ error: 'Error del servidor al intentar borrar' }, { status: 500 });
  }
}
