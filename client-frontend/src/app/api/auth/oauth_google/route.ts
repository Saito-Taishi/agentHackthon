// /pages/api/auth/oauth_google/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import oauthClient from "@/utils/auth/google_oauth"; // 既存のOAuthクライアント設定を読み込み

export async function GET() {
  const SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.modify',
    'profile',
    'email'
  ];
  const state =  crypto.randomBytes(16).toString("hex");

  const authorizationUrl = oauthClient.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    state,
  });
  console.log("認証URLは",authorizationUrl)
  // NextResponse.jsonを使用してJSONレスポンスを返す
  return NextResponse.json({ authorizationUrl });
}
