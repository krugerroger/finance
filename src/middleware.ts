import { createI18nMiddleware } from 'next-international/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

// Config i18n
const locales = ['en', 'fr', 'de', 'es', 'pt'] as const
const defaultLocale = 'en'

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  urlMappingStrategy: 'redirect'
})

// Configuration des redirections de base
const handleBaseRedirects = (request: NextRequest) => {
  const url = request.nextUrl.clone()
  
  // 1. Forcer HTTPS
  if (url.protocol === 'http:') {
    url.protocol = 'https:'
    return NextResponse.redirect(url)
  }

  // 2. Forcer www (ou l'inverse selon votre préférence)
  if (!url.hostname.startsWith('www.')) {
    url.hostname = `www.${url.hostname}`
    return NextResponse.redirect(url)
  }

  return null
}

// Middleware principal
export async function middleware(request: NextRequest) {
  // Gestion des redirections de base (HTTPS et www)
  const baseRedirect = handleBaseRedirects(request)
  if (baseRedirect) return baseRedirect

  const { pathname } = request.nextUrl
  const normalizedPath = pathname.replace(/\/$/, '')

  // Liste des routes publiques optimisée
  const isPublicRoute = [
    '/', '/login', '/register', '/adminlogin', '/unauthorized',
    '/api/auth', '/favicon.ico', '/robots.txt'
  ].some(route => {
    const baseRoute = route === '/' ? '' : route
    return normalizedPath === baseRoute || 
           normalizedPath.startsWith(`${baseRoute}/`) ||
           locales.some(locale => normalizedPath === `/${locale}${baseRoute}` || 
                                normalizedPath.startsWith(`/${locale}${baseRoute}/`))
  })

  if (isPublicRoute) {
    return I18nMiddleware(request)
  }

  // Traitement i18n
  const response = I18nMiddleware(request)

  // Authentification
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const locale = locales.find(l => pathname.startsWith(`/${l}/`)) || defaultLocale
    const redirectPath = pathname.includes('/admin') ? 'adminlogin' : 'login'
    return NextResponse.redirect(new URL(`/${locale}/${redirectPath}`, request.url))
  }

  // Vérification admin
  if (pathname.includes('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      const locale = locales.find(l => pathname.startsWith(`/${l}/`)) || defaultLocale
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
