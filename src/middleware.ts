import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('jwt')?.value

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback_secret_anda'
      )
      const { payload } = await jwtVerify(token, secret)
      const response = NextResponse.next()
      response.headers.set("x-user-id", payload?.id as string)
      return response
    } catch (error) {
      console.error('JWT Verification Failed:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
