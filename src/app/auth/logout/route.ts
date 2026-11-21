import { createClient } from '@/lib/supabase/server';
import { recordAuditLog } from '@/lib/auth/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await recordAuditLog({
      actorId: user.id,
      action: 'user_logout_via_route',
    });
  }

  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/login', request.url));
}
