import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Refresh session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Middleware failed to get session:', error);
    }

    // For routes that require authentication
    if (request.nextUrl.pathname.startsWith('/issues')) {
      if (!session) {
        // Redirect to login page if not logged in
        const redirectUrl = request.nextUrl.origin;
        return NextResponse.redirect(redirectUrl);
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Configure routes matched by the middleware
export const config = {
  matcher: ['/issues/:path*'],
};
