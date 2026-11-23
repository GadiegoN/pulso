import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Validação segura com try/catch para evitar qualquer travamento de borda
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      user = data.user;
    }
  } catch (err) {
    console.error('Erro na resolução de sessão no proxy:', err);
  }

  const pathname = request.nextUrl.pathname;

  // Guarda de perímetro na Borda (Camada 1):
  // Se tentar acessar rota administrativa (/admin/*) ou portal do comerciante (/portal/*) sem autenticação válida
  if (
    (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) ||
    pathname.startsWith('/portal')
  ) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);

      const redirectResponse = NextResponse.redirect(url);
      // REGRA OFICIAL SUPABASE: Preservar cookies durante redirects
      supabaseResponse.cookies.getAll().forEach((c) => {
        redirectResponse.cookies.set(c.name, c.value, c);
      });
      return redirectResponse;
    }
  }

  return supabaseResponse;
}
