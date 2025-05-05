import { createI18nMiddleware } from 'next-international/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr', 'de', 'es', 'pt'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite' // Changement crucial ici
})

const PUBLIC_ROUTES = [
  '/login',
  '/adminlogin', 
  '/unauthorized',
  '/api/auth'
]

export async function middleware(request: NextRequest) {
  // 1. Traitement i18n en premier
  const response = I18nMiddleware(request)
  const url = request.nextUrl.clone()

  // 2. Vérifier les routes publiques APRÈS le traitement i18n
  const isPublic = PUBLIC_ROUTES.some(route => {
    const path = url.pathname
    return path === `/${url.locale}${route}` || path === route
  })

  if (isPublic) {
    return response
  }

  // 3. Authentification
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    url.pathname = `/${url.locale}/login`
    return NextResponse.redirect(url)
  }

  // 4. Vérification admin
  if (url.pathname.includes('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      url.pathname = `/${url.locale}/unauthorized`
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
