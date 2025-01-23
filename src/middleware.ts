// middleware.js
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // セッションCookieの存在をチェック
  const session = req.cookies.get('session');

  if (!session && req.nextUrl.pathname !== '/login') {
    // 未ログインで/login以外にアクセスした場合、/loginにリダイレクト
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (session && req.nextUrl.pathname === '/login') {
    // ログイン済みで/loginにアクセスした場合、/にリダイレクト
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next).*)'], // api, static, _nextフォルダを除外
};