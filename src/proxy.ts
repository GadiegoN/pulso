import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Intercepta todas as requisições exceto arquivos estáticos,
     * imagens e metadados públicos.
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|icon|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
