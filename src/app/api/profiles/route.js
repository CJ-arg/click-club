import { getAllProfiles, createOrUpdateProfile } from '@/lib/db';
import { isLinkedInProfile } from '@/lib/config';

export async function GET() {
  const profiles = await getAllProfiles();
  return Response.json({ profiles });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, url, visitorId } = body;

    if (!name || name.trim().length < 2) {
      return Response.json({ error: 'El nombre es muy corto' }, { status: 400 });
    }

    if (!visitorId || visitorId === 'anonymous') {
       return Response.json({ error: 'No se pudo identificar tu dispositivo' }, { status: 400 });
    }

    // Validate LinkedIn Profile URL using our new config rule
    if (!url || !isLinkedInProfile(url)) {
      return Response.json(
        { error: 'Debe ser un enlace válido a tu PERFIL de LinkedIn (https://www.linkedin.com/in/...)' },
        { status: 400 }
      );
    }

    const savedProfile = await createOrUpdateProfile({ visitorId, name, url });
    return Response.json(savedProfile);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
