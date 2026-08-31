import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function getSubdomain(request: NextRequest): string | null {
  const host = request.headers.get('host') || ''
  const hostname = host.split(':')[0]

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return request.nextUrl.searchParams.get('gym')
  }

  const parts = hostname.split('.')

  if (parts.length >= 3) {
    const sub = parts[0]
    if (sub === 'www') return null
    return sub
  }

  return null
}

export async function middleware(request: NextRequest) {
  const subdomain = getSubdomain(request)

  const requestHeaders = new Headers(request.headers)
  if (subdomain) {
    requestHeaders.set('x-gym-subdomain', subdomain)
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}