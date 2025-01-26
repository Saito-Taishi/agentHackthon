import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import * as hub from "langchain/hub";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { getApps } from "firebase-admin/app";
import { validateSession } from "@/utils/auth/session";
import { type Card, isCard } from "@/utils/types/card";
import {
  createErrorResponse,
  createSuccessResponse,
  handleAPIError,
  type APISuccessResponse,
} from "@/utils/api/response";

// Firebase初期化
if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

type UploadResponse = APISuccessResponse<Card> & {
  documentId: string;
};

export async function POST(request: Request) {
  try {
    // セッションの検証とユーザー情報の取得
    const user = await validateSession();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return createErrorResponse("ファイルがアップロードされていません", "NO_FILE_UPLOADED", 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type;
    const imageUrl = `data:${mimeType};base64,${base64}`;

    // AI処理
    const geminiModel = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      temperature: 0,
    });

    const extractCartPrompt = await hub.pull("zenn_ai_agent_hackthon");
    const geminiChain = extractCartPrompt.pipe(geminiModel);
    const cardInfo = await geminiChain.invoke({ img_base64: imageUrl });

    const textToJsonPrompt = await hub.pull("zenn_text_to_json");
    const openaiModel = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
    const openaiChain = textToJsonPrompt.pipe(openaiModel);
    const response = await openaiChain.invoke({ text: cardInfo });

    // 型チェックと変換
    const responseData = JSON.parse(JSON.stringify(response));
    if (!isCard(responseData)) {
      return createErrorResponse("名刺情報の形式が正しくありません", "INVALID_CARD_FORMAT", 400);
    }

    // Firestoreに保存（ユーザー情報を含める）
    const docRef = await db.collection("businessCards").add({
      ...responseData,
      createdBy: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return createSuccessResponse<UploadResponse>(
      {
        success: true,
        message: "名刺画像の処理とデータ保存が完了しました",
        result: responseData,
        documentId: docRef.id,
      },
      "名刺画像の処理とデータ保存が完了しました",
    );
  } catch (error: unknown) {
    return handleAPIError(error);
  }
}
