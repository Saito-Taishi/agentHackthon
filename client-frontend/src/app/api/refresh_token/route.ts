// app/api/refresh-token/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import oauthClient from '@/utils/auth/google_oauth';

export async function POST() {
  // サーバー側の Cookie を取得
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("google_refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token provided' }, { status: 400 });
  }

  // oauthClient にリフレッシュトークンをセット
  oauthClient.setCredentials({ refresh_token: refreshToken });

  try {
    // リフレッシュ処理を実行
    const { credentials } = await oauthClient.refreshAccessToken();

    // 新しい Cookie を返すレスポンスを作成
    const response = NextResponse.json({ success: true });

    if (credentials.access_token) {
      response.cookies.set("google_access_token", credentials.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 例として1週間
      });
    }

    if (credentials.refresh_token) {
      response.cookies.set("google_refresh_token", credentials.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return NextResponse.json({ error: 'Failed to refresh access token' }, { status: 500 });
  }
}
