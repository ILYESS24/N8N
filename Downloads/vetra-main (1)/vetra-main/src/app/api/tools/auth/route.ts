import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';

/**
 * API pour valider les tokens d'authentification des outils
 * Les outils intégrés peuvent appeler cette API pour vérifier l'utilisateur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Parser le token
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      const { userId, accessToken, timestamp } = payload;

      // Vérifier que le token n'est pas trop vieux (24h)
      const tokenAge = Date.now() - timestamp;
      if (tokenAge > 24 * 60 * 60 * 1000) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }

      // Vérifier l'utilisateur avec Supabase
      const { user } = await getAuthenticatedUser(request);

      if (!user || user.id !== userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      // Retourner les informations utilisateur
      return NextResponse.json({
        valid: true,
        userId: user.id,
        email: user.email,
      });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Tool auth API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET: Récupère les informations utilisateur depuis un token
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      const { userId, timestamp } = payload;

      // Vérifier l'âge du token
      const tokenAge = Date.now() - timestamp;
      if (tokenAge > 24 * 60 * 60 * 1000) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }

      // Récupérer les données utilisateur depuis Supabase
      const { user } = await getAuthenticatedUser(request);

      if (!user || user.id !== userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      return NextResponse.json({
        userId: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Tool auth API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

