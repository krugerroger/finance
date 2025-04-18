import { createI18nMiddleware } from 'next-international/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

// Configuration i18n
const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr', 'de', 'es', 'pt'],
  defaultLocale: 'en',
  urlMappingStrategy: 'redirect' // ou 'redirect' selon votre préférence
})

// Routes publiques (ne nécessitent pas d'authentification)
const PUBLIC_ROUTES = [
  '/login',
  '/adminlogin',
  '/unauthorized',
  '/api/auth',
  '/favicon.ico',
  '/robots.txt'
]

export async function middleware(request: NextRequest) {
  // 1. Traitement i18n en premier
  const response = I18nMiddleware(request)
  const pathname = request.nextUrl.pathname

  // 2. Exclusion des routes publiques et fichiers statiques
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return response
  }

  // 3. Authentification Supabase
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  // 4. Gestion des accès non authentifiés
  if (!session) {
    const locale = pathname.split('/')[1] || 'fr'
    if (pathname.startsWith(`/${locale}/admin`)) {
      return NextResponse.redirect(new URL(`/${locale}/adminlogin`, request.url))
    }
    if (pathname.startsWith(`/${locale}/customer`)) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }
    return response
  }

  // 5. Vérification des rôles admin
  if (pathname.includes('/admin')) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (error || !profile || profile.role !== 'admin') {
      const locale = pathname.split('/')[1] || 'fr'
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)',
    '/customer/:path*',
    '/admin/:path*'
  ]
}