import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// JWT secret for verification - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-replace-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

async function verifyJWTToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret);
    
    // Check if token has required fields and is not expired
    if (!payload.userId || !payload.role) {
      return false;
    }
    
    // Check expiration explicitly (jose handles this automatically, but good to be explicit)
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return false;
    }
    
    return true;
  } catch (error) {
    // Token is invalid, expired, or malformed
    console.error('JWT verification failed:', error.message);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Only protect admin routes (exclude login page)
  if (pathname.startsWith('/admin')) {
    // Allow access to login page without authentication
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    // Get the auth token from cookies
    const authToken = request.cookies.get('authToken')?.value;
    
    // If no token, redirect to login
    if (!authToken) {
      const loginUrl = new URL('/admin/login', request.url);
      // Add redirect parameter to return user to intended page after login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Verify the JWT token
    const isValidToken = await verifyJWTToken(authToken);
    
    if (!isValidToken) {
      // Invalid token - clear cookie and redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      
      // Clear the invalid auth cookie
      response.cookies.set('authToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        expires: new Date(0) // Expire immediately
      });
      
      return response;
    }
    
    // Token is valid - allow access
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

// Configure middleware to run on admin routes
export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
    // Optionally add other routes you want to protect
    // '/dashboard/:path*',
  ],
};
