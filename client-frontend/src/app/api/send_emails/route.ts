import oauthClient from "@/utils/auth/google_oauth"
import { google } from "googleapis"
import { cookies } from "next/headers"


export async function POST(request: Request) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("google_access_token")?.value
    
    console.log("Access Token:", accessToken ? "存在します" : "存在しません");
    
    if (!accessToken) {
        return new Response(JSON.stringify({ message: "No access token found" }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // スコープの確認のためにデバッグログを追加
    try {
        const tokenInfo = await oauthClient.getTokenInfo(accessToken);
        console.log("Token Info:", tokenInfo);
    } catch (error) {
        console.error("Token Info Error:", error);
    }

    oauthClient.setCredentials({ access_token: accessToken })
    
    console.log("やあ")
    // 3. Gmail Clientの初期化
    const gmail = google.gmail({ version: 'v1', auth: oauthClient });

    const subject = 'テストメール from Next.js';

    const messageText = `
    以下のレコードを選択しました:
    これはテスト送信です。
    `;

    try {
        // ユーザーのメールアドレスを取得
        const profile = await gmail.users.getProfile({ userId: 'me' });
        const userEmail = profile.data.emailAddress;
        if (!userEmail) {
            return new Response(JSON.stringify({ message: "Failed to get user email" }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // MIME形式のメッセージを作成
        const rawMessage = createMessage(userEmail, userEmail, subject, messageText); // 送信先も自分自身にする

        // メッセージを送信
        const sentMessage = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: rawMessage,
            },
        });

        return new Response(JSON.stringify({ message: "Email sent successfully!", messageId: sentMessage.data.id }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error: any) {
        console.error("Failed to send email:", error);
        return new Response(JSON.stringify({ message: "Failed to send email", error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}


function createMessage(from: string, to: string, subject: string, message: string) {
    const messageLines = [
        `From: ${from}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=UTF-8',
        '',
        message,
    ];
    const messageStr = messageLines.join('\n');

    // Base64 エンコード (URL-safe base64 ではない通常の base64)
    const encodedMessage = Buffer.from(messageStr).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return encodedMessage;
}