// middleware.js
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session');
  const path = req.nextUrl.pathname;

  // 保護するパスのリスト
  const protectedPaths = ['/history', '/upload'];

  // 保護されたパスへのアクセスをチェック
  if (protectedPaths.some(protectedPath => path.startsWith(protectedPath))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // ログインページへのアクセス制御
  if (path === '/login') {
    if (session) {
      return NextResponse.redirect(new URL('/upload', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/history',
    '/upload',
    '/login',
  ],
};