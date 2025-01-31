// app/record/page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import oauthClient from "@/utils/auth/google_oauth";
import RecordPageComponent from "./recordPageComponent";

export default async function RecordPage() {
  // 1. Cookie からアクセストークンを取得
  const cookieStore =await  cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;

  // 2. アクセストークンが無い場合 → 認可画面へリダイレクト
  if (!accessToken) {
    return await redirectToOAuth();
  }

  // 3. アクセストークンの有効期限チェック
  try {
    // これを呼び出すと無効または期限切れの場合にエラーが返ります
    await oauthClient.getTokenInfo(accessToken);

  } catch (error) {
    // invalid_token（期限切れ or リフレッシュ不可）等のエラーが出ます
    console.error("Access token is invalid or expired:", error);
    return await redirectToOAuth();
  }

  // 4. 有効な場合は後続の処理へ
  oauthClient.setCredentials({ access_token: accessToken});

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