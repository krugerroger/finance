import { createI18nMiddleware } from 'next-international/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr', 'de', 'es', 'pt'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite' // Conserver 'rewrite' pour éviter les redirects i18n
})

export async function middleware(request: NextRequest) {
  // Étape 1: Traitement i18n en premier
  const response = I18nMiddleware(request)
  const url = request.nextUrl.clone()
  const pathname = url.pathname
  const locale = url.locale || 'en'

  // Étape 2: Vérification des routes publiques
  const isPublicRoute = [
    '/login',
    '/adminlogin',
    '/unauthorized',
    '/api/auth',
    '/'
  ].some(publicPath => 
    pathname === `/${locale}${publicPath}` || 
    pathname === publicPath
  )

  if (isPublicRoute) {
    return response
  }

  // Étape 3: Authentification
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const redirectPath = pathname.includes('/admin') ? '/adminlogin' : '/login'
    url.pathname = `/${locale}${redirectPath}`
    return NextResponse.redirect(url)
  }

  // Étape 4: Vérification admin
  if (pathname.includes('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      url.pathname = `/${locale}/unauthorized`
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'
  ]
}
