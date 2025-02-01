// app/record/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import oauthClient from "@/utils/auth/google_oauth";
import RecordPageComponent from "./recordPageComponent";

export default async function RecordPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;
  const refreshToken = cookieStore.get("google_refresh_token")?.value;

  //リフレッシュトークンの確認
  if (refreshToken){
    console.log("リフレッシュは保存済み")
  }

  if (!accessToken) {
    return await redirectToOAuth();
  }

  try {
    await oauthClient.getTokenInfo(accessToken);
  } catch {
    console.log("アクセストークンの有効期限が切れていました。");

    if (refreshToken) {
      // API Route でトークンをリフレッシュ
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/refresh_token`, {
        method: "POST",
        cache: "no-store",
      });

      if (!res.ok) {
        return redirectToOAuth();
      }
      // リフレッシュに成功したら、再度 oauthClient に新しいアクセストークンをセット
      const data = await res.json();
      if (!data.success) {
        return redirectToOAuth();
      }
      // ※ここでは Cookie の値はブラウザ側に反映されるため、
      //    すぐには server-side の cookies() では新しい値が見えない可能性があります。
      //    必要に応じて再リダイレクトなどの工夫が必要です。
    } else {
      return redirectToOAuth();
    }
  }

  // 有効な場合は後続の処理へ
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
