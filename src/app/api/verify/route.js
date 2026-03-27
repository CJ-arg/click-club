import { INVITE_CODE } from '@/lib/config';

export async function POST(request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (code === INVITE_CODE) {
      return Response.json({ valid: true });
    }

    return Response.json(
      { valid: false, error: 'Código de invitación inválido.' },
      { status: 403 }
    );
  } catch {
    return Response.json(
      { valid: false, error: 'Error al verificar.' },
      { status: 500 }
    );
  }
}
