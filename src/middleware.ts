import { createI18nMiddleware } from 'next-international/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr', 'de', 'es', 'pt'],
  defaultLocale: 'en',
  urlMappingStrategy: 'redirect'
})

// Ajoutez explicitement toutes les versions localisées des routes de login
const PUBLIC_ROUTES = [
  '/',                 // Nouveau
  '/en',               // Nouveau
  '/fr',               // Nouveau
  '/de',               // Nouveau
  '/es',               // Nouveau
  '/pt', 
  '/login',
  '/en/login',
  '/fr/login',
  '/de/login',
  '/es/login',
  '/pt/login',
  '/adminlogin', 
  '/en/adminlogin',
  '/fr/adminlogin',
  '/de/adminlogin',
  '/es/adminlogin',
  '/pt/adminlogin',
  '/unauthorized',
  '/api/auth',
  '/favicon.ico',
  '/robots.txt'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. D'abord vérifier les routes publiques
  if (PUBLIC_ROUTES.some(route => {
    // Compare en ignorant le trailing slash
    const normalizedPath = pathname.replace(/\/$/, '')
    const normalizedRoute = route.replace(/\/$/, '')
    return normalizedPath === normalizedRoute || pathname.startsWith(`${route}/`)
  })) {
    return I18nMiddleware(request)
  }

  // 2. Ensuite le traitement i18n
  const response = I18nMiddleware(request)

  // 3. Authentification
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const locale = pathname.split('/')[1] || 'en'
    if (pathname.includes('/admin')) {
      return NextResponse.redirect(new URL(`/${locale}/adminlogin`, request.url))
    }
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  // 4. Vérification admin
  if (pathname.includes('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      const locale = pathname.split('/')[1] || 'en'
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|register).*)', // Ajoutez 'images' si vous avez un dossier dédié
    '/customer/:path*',
    '/admin/:path*'
  ]
}