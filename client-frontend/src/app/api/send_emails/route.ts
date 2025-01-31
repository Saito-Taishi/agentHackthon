// send_email/route.ts

import oauthClient from "@/utils/auth/google_oauth";
import { google } from "googleapis";
import { cookies } from "next/headers";

// 型定義を追加
interface EmailData {
	id: string;
	to: string;
	subject: string;
	message: string;
}

export async function POST(request: Request) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("google_access_token")?.value;
	if (!accessToken) {
		return new Response(JSON.stringify({ message: "No access token found" }), {
			status: 401,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	// リクエストボディを取得
	const { emails } = (await request.json()) as { emails: EmailData[] };

	oauthClient.setCredentials({ access_token: accessToken });

	// Gmail Clientの初期化
	const gmail = google.gmail({ version: "v1", auth: oauthClient });

	try {
		// ユーザーのメールアドレスを取得
		const profile = await gmail.users.getProfile({ userId: "me" });
		const userEmail = profile.data.emailAddress;
		if (!userEmail) {
			return new Response(
				JSON.stringify({ message: "Failed to get user email" }),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		// 各メールを送信
		const results = await Promise.all(
			emails.map(async (emailData) => {
				try {
					const rawMessage = createMessage(
						userEmail,
						emailData.to,
						emailData.subject,
						emailData.message,
					);

					const sentMessage = await gmail.users.messages.send({
						userId: "me",
						requestBody: {
							raw: rawMessage,
						},
					});

					return {
						id: emailData.id,
						success: true,
						messageId: sentMessage.data.id,
					};
				} catch {
					return {
						id: emailData.id,
						success: false,
						error: "Failed to send email",
					};
				}
			}),
		);

		return new Response(
			JSON.stringify({
				message: "Emails processed",
				results,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error: unknown) {
		console.error("Failed to process emails:", error);
		return new Response(
			JSON.stringify({ message: "Failed to process emails", error: error }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
}

function createMessage(
	from: string,
	to: string,
	subject: string,
	message: string,
) {
	// 日本語など非 ASCII 文字を含む場合の Subject を MIME エンコード
	const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`;

	const messageLines = [
		"MIME-Version: 1.0", // MIME バージョンを明示
		`From: ${from}`,
		`To: ${to}`,
		`Subject: ${encodedSubject}`, // エンコード済みの件名
		"Content-Type: text/plain; charset=UTF-8",
		"Content-Transfer-Encoding: 7bit", // 本文が日本語などを含む場合でも正しく表示されるように
		"",
		message,
	];

	// CRLF(\r\n)で繋ぐのがメールヘッダ的には正しい
	const messageStr = messageLines.join("\r\n");

	// Base64 エンコード (Gmail API は raw: Base64URL encoded string を必要とする)
	return (
		Buffer.from(messageStr)
			.toString("base64")
			// Gmail API の都合で、Base64URL 形式に一部置き換える
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "")
	);
}
