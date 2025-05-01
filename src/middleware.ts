import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 如果用户未登录且访问受保护的路由，重定向到登录页
  if (!session && req.nextUrl.pathname.startsWith('/issues')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 如果用户已登录且访问登录页，重定向到issues页面
  if (session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/issues', req.url));
  }

  return res;
}
