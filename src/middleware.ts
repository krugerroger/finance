import { createI18nMiddleware } from 'next-international/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr', 'de', 'es', 'pt'],
  defaultLocale: 'en',
  urlMappingStrategy: 'redirect'
})

// Utilisation d'un Set pour des recherches plus efficaces
const PUBLIC_ROUTES = new Set([
  '/', '/login', '/register', '/adminlogin', '/unauthorized',
  '/api/auth', '/favicon.ico', '/robots.txt'
])

const LOCALES = ['en', 'fr', 'de', 'es', 'pt']

// Pré-générer toutes les routes localisées pour éviter les répétitions
function generateLocalizedRoutes(baseRoutes: Set<string>): Set<string> {
  const allRoutes = new Set(baseRoutes)
  
  for (const route of baseRoutes) {
    if (route.startsWith('/api') || route === '/favicon.ico' || route === '/robots.txt') continue
    
    for (const locale of LOCALES) {
      allRoutes.add(`/${locale}${route === '/' ? '' : route}`)
    }
  }
  
  return allRoutes
}

const ALL_PUBLIC_ROUTES = generateLocalizedRoutes(PUBLIC_ROUTES)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const normalizedPath = pathname.replace(/\/$/, '')
  
  // 1. Vérification des routes publiques (plus efficace avec Set)
  if ([...ALL_PUBLIC_ROUTES].some(route => {
    const normalizedRoute = route.replace(/\/$/, '')
    return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`)
  })) {
    return I18nMiddleware(request)
  }

  // 2. Traitement i18n
  const response = I18nMiddleware(request)

  // 3. Authentification
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const locale = LOCALES.includes(pathname.split('/')[1]) ? pathname.split('/')[1] : 'en'
    const redirectPath = pathname.includes('/admin') ? 'adminlogin' : 'login'
    return NextResponse.redirect(new URL(`/${locale}/${redirectPath}`, request.url))
  }

  // 4. Vérification admin si nécessaire
  if (pathname.includes('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      const locale = LOCALES.includes(pathname.split('/')[1]) ? pathname.split('/')[1] : 'en'
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
