// app/record/page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import oauthClient from "@/utils/auth/google_oauth";
import RecordPageComponent from "./recordPageComponent";

export default async function RecordPage() {
  // 1. Cookie からアクセストークンを取得
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;
  const refreshToken = cookieStore.get("google_refresh_token")?.value;
  console.log("refresh保存されとった",refreshToken)

  // 2. アクセストークンが無い場合 → 認可画面へリダイレクト
  if (!accessToken) {
    return await redirectToOAuth();
  }

  // 3. アクセストークンの有効期限チェック
  try {
    // これを呼び出すと無効または期限切れの場合にエラーが返ります
    await oauthClient.getTokenInfo(accessToken);
  } catch {
    console.log("アクセストークンの有効期限が切れていました。")
    // リフレッシュトークンがあれば再取得を試みる
    if (refreshToken) {
      try {
        // 明示的に refreshAccessToken() を呼び出す
        const { credentials } = await oauthClient.refreshAccessToken();
        // 新しいアクセストークンを Cookie に再セット
        if (credentials.access_token) {
          cookieStore.set("google_access_token", credentials.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
        }

        // もし新たにrefresh_tokenが返ってきたら、そちらも更新しておく
        if (credentials.refresh_token) {
          cookieStore.set("google_refresh_token", credentials.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
        }

        // oauthClient にも再度セット
        oauthClient.setCredentials({
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token,
        });
      } catch (refreshError) {
        console.error("Failed to refresh access token:", refreshError);
        // リフレッシュに失敗 → ユーザーに再ログインしてもらう
        return redirectToOAuth();
      }
    } else {
      // リフレッシュトークンすら無い場合は再ログイン
      return redirectToOAuth();
    }
  }

  // 4. 有効な場合は後続の処理へ
  oauthClient.setCredentials({ access_token: accessToken });

  return (
    <>
      <RecordPageComponent />
    </>
  );
}

/**
 * 認可画面へサーバーサイドでリダイレクトするためのヘルパー関数
 */
async function redirectToOAuth() {
  // /api/auth/oauth_google などで認可用URLを生成
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth_google`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to get authorization URL");
  }
  const data = await res.json();
  redirect(data.authorizationUrl);
}