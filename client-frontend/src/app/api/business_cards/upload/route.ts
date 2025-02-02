import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import * as hub from "langchain/hub";
import { validateSession } from "@/utils/auth/session";
import { isCard } from "@/utils/types/card";
import {
  createErrorResponse,
  createSuccessResponse,
  handleAPIError,
  type APISuccessResponse,
} from "@/utils/api/response";
import { type BusinessCardData, createBusinessCard } from "@/utils/db/business-card";

type UploadResponse = APISuccessResponse<BusinessCardData> & {
  documentId: string;
};

export async function POST(request: Request) {
  console.log("ファイルが呼び出される")
  try {
    // セッションの検証とユーザー情報の取得
    const user = await validateSession();
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const imageUrl = `data:image/png;base64,${base64}`;

    // AI処理
    const geminiModel = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash-exp",
      temperature: 0,
    });

    const extractCartPrompt = await hub.pull("zenn_ai_agent_hackthon");
    const geminiChain = extractCartPrompt.pipe(geminiModel);
    const cardInfo = await geminiChain.invoke({ img_base64: imageUrl });

    const textToJsonPrompt = await hub.pull("zenn_text_to_json");
    const openaiModel = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
    const openaiChain = textToJsonPrompt.pipe(openaiModel);
    const response = await openaiChain.invoke({ text: cardInfo });
    console.log("responseは以下のようになる。",response)


    // 型チェックと変換
    const responseData = JSON.parse(JSON.stringify(response));
    if (!isCard(responseData)) {
      return createErrorResponse("名刺情報の形式が正しくありません", "INVALID_CARD_FORMAT", 400);
    }

    // Firestoreに保存
    const { id, data } = await createBusinessCard({
      personName: responseData.name,
      personEmail: responseData.mail,
      personPosition: responseData.role,
      personPhoneNumber: responseData.phoneNumber,
      role: responseData.role,
      websiteURL: responseData.companyUrl,
      createdBy: user.uid,
      companyName: responseData.companyName,
    });

    return createSuccessResponse<UploadResponse>(
      {
        success: true,
        message: "名刺画像の処理とデータ保存が完了しました",
        result: data,
        documentId: id,
      },
      "名刺画像の処理とデータ保存が完了しました",
    );
  } catch (error: unknown) {
    return handleAPIError(error);
  }
}
