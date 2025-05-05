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

  // Étape 1: Gestion spéciale de la racine
  if (pathname === '/') {
    const acceptLanguage = request.headers.get('accept-language')
    const locale = acceptLanguage?.split(',')?.[0]?.split('-')?.[0]?.toLowerCase() || 'en'
    const supportedLocales = ['en', 'fr', 'de', 'es', 'pt']
    const finalLocale = supportedLocales.includes(locale) ? locale : 'en'
    return NextResponse.redirect(new URL(`/${finalLocale}`, request.url))
  }

  // Étape 2: Traitement i18n
  const response = I18nMiddleware(request)
  const locale = url.locale || 'en'

  // Étape 3: Définir le header pour éviter la cache des redirections
  response.headers.set('Cache-Control', 'no-store, max-age=0')

  // Étape 4: Vérifier les routes publiques
  const PUBLIC_ROUTES = [
    `/${locale}`, // Page d'accueil localisée
    '/login',
    '/adminlogin',
    '/unauthorized'
  ]

  if (PUBLIC_ROUTES.some(publicPath => pathname === publicPath)) {
    return response
  }

  // Étape 5: Authentification pour les routes protégées
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/',
    '/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'
  ]
}
