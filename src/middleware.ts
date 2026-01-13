// middleware.ts (pastikan di root project)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from "jose"


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ambil token dari cookies
  const token = request.cookies.get('jwt')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }


  // Cek apakah route dimulai dengan /admin
  if (pathname.startsWith('/admin')) {


    // Jika tidak ada token, redirect ke login
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

  }
  try {
    // 2. Siapkan Secret Key (harus dalam format Uint8Array)
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_anda'
    );

    // 3. Verifikasi Token
    const { payload } = await jwtVerify(token, secret);
    const response = NextResponse.next()
    response.headers.set("x-user-id", payload?.id as string)

    return response

  } catch (error) {
    // Jika token tidak valid atau expired
    console.error('JWT Verification Failed:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }

}

// Konfigurasi matcher yang lebih eksplisit
export const config = {
  matcher: [
    '/admin/:path*',
    '/admin'
  ]
}