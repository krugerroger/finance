import { createI18nMiddleware } from 'next-international/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr', 'de', 'es', 'pt'],
  defaultLocale: 'en',
  urlMappingStrategy: 'redirect'
})

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/adminlogin',
  '/unauthorized'
]

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname
  const locale = url.locale || 'en'

  // 1. Traitement i18n pour toutes les requêtes
  const response = I18nMiddleware(request)

  // 2. Vérification des routes publiques après traitement i18n
  const isPublic = PUBLIC_PATHS.some(publicPath => 
    pathname === `/${publicPath}` ||
    pathname === `/${locale}${publicPath}` ||
    pathname === '/'
  )

  if (isPublic) {
    return response
  }

  // 3. Authentification
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const redirectPath = pathname.startsWith(`/${locale}/admin`) 
      ? `/${locale}/adminlogin` 
      : `/${locale}/login`
    
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  // 4. Vérification admin
  if (pathname.startsWith(`/${locale}/admin`)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'
  ]
}
