import { createI18nMiddleware } from 'next-international/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr', 'de', 'es', 'pt'],
  defaultLocale: 'en',
  urlMappingStrategy: 'redirect'
})

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Étape 1: Gestion de la racine '/'
  if (pathname === '/') {
    const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en'
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  // Étape 2: Traitement i18n
  const response = I18nMiddleware(request)
  
  // Étape 3: Vérification des routes publiques
  const PUBLIC_ROUTES = ['/login', '/adminlogin', '/unauthorized']
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || 
    pathname.startsWith(`/${url.locale}${route}`)
  )

  if (isPublicRoute) {
    return response
  }

  // Étape 4: Authentification
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL(`/${url.locale}/login`, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/', // Seulement la racine
    '/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'
  ]
}
