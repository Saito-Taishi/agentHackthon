// app/record/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import oauthClient from "@/utils/auth/google_oauth";
import RecordPageComponent from "./recordPageComponent";

export default async function RecordPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;
  const refreshToken = cookieStore.get("google_refresh_token")?.value;
  console.log("refreshToken 保存:", refreshToken);

  // アクセストークンが無い場合は OAuth の認可画面へリダイレクト
  if (!accessToken) {
    return await redirectToOAuth();
  }
  try {
    // アクセストークンの有効性をチェック
    await oauthClient.getTokenInfo(accessToken);
  } catch {

    if (refreshToken) {
      oauthClient.setCredentials({refresh_token:refreshToken})
      // API Route を呼び出してアクセストークンをリフレッシュ
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/refresh-token`, {
        method: "POST",
        cache: "no-store",
      });

      if (!res.ok) {
        // リフレッシュに失敗した場合は再ログインを促す
        return redirectToOAuth();
      }

      const data = await res.json();
      if (!data.success) {
        return redirectToOAuth();
      }
      // ※ Cookie はブラウザにセットされるため、サーバー側で直ちに新しい値を読み取れない可能性があります。
      // 必要に応じてページの再リクエストやリダイレクト処理を検討してください。
    } else {
      return redirectToOAuth();
    }
  }

  // 有効なアクセストークンを oauthClient にセット
  oauthClient.setCredentials({ access_token: accessToken });

  return (
    <>
      <RecordPageComponent />
    </>
  );
}

async function redirectToOAuth() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth_google`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to get authorization URL");
  }
  const data = await res.json();
  redirect(data.authorizationUrl);
}
