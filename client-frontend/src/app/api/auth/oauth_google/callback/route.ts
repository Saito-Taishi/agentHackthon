import { NextResponse } from "next/server";
import oauthClient from "@/utils/auth/google_oauth";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const code = searchParams.get("code");
	const error = searchParams.get("error");

	if (error) {
		return NextResponse.json({ error: error });
	}

	if (!code) {
		return NextResponse.json({ error: "Authorization code not found" });
	}

	// トークンに変更
	try {
		const { tokens } = await oauthClient.getToken(code);
		const response = NextResponse.redirect(new URL("/record", req.url));

		response.cookies.set({
			name: "google_access_token",
			value: tokens.access_token || "", // the access token
			httpOnly: true, // for security, the cookie is accessible only by the server
			secure: process.env.NODE_ENV === "production", // send cookie over HTTPS only in production
			path: "/", // cookie is available on every route
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});

		response.cookies.set({
			// リフレッシュトークン用のCookieを追加
			name: "google_refresh_token",
			value: tokens.refresh_token || "", // リフレッシュトークンを保存
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24 * 30, // リフレッシュトークンの有効期限は長めに設定することが一般的 (例: 30日)
		});

		return response;
	} catch (error) {
		return NextResponse.json({ error: error });
	}
}
