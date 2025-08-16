// middleware.ts (pastikan di root project)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
    // Ambil token dari cookies
    const token = request.cookies.get('jwt')?.value

  
  // Cek apakah route dimulai dengan /admin
  // if (pathname.startsWith('/admin')) {

    
  //   console.log('Token found:', !!token) // Debug log
    
  //   // Jika tidak ada token, redirect ke login
  //   if (!token) {
  //     console.log('No token, redirecting to login') // Debug log
  //     const loginUrl = new URL('/login', request.url)
  //     return NextResponse.redirect(loginUrl)
  //   }
  // }
  
  return NextResponse.next()
}

// Konfigurasi matcher yang lebih eksplisit
export const config = {
  matcher: [
    '/admin/:path*',
    '/admin'
  ]
}