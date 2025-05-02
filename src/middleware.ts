import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // 刷新会话
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('中间件获取会话错误:', error);
    }

    // 对于需要认证的路由
    if (request.nextUrl.pathname.startsWith('/issues')) {
      if (!session) {
        // 未登录时重定向到登录页
        const redirectUrl = request.nextUrl.origin;
        return NextResponse.redirect(redirectUrl);
      }
    }

    return res;
  } catch (error) {
    console.error('中间件错误:', error);
    return NextResponse.next();
  }
}

// 配置中间件匹配的路由
export const config = {
  matcher: ['/issues/:path*'],
};
