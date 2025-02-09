// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatVertexAI } from "@langchain/google-vertexai";
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
import {
  type BusinessCardData,
  createBusinessCard,
} from "@/utils/db/business-card";

type UploadResponse = APISuccessResponse<BusinessCardData> & {
  documentId: string;
};

// Helper function to recursively convert any property equal to "null" (string) to the actual null value
function convertStringNulls(obj: unknown): unknown {
  if (typeof obj === "string") {
    return obj.trim() === "null" ? null : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => convertStringNulls(item));
  }
  if (obj !== null && typeof obj === "object") {
    const newObj: Record<string, unknown> = {
      ...(obj as Record<string, unknown>),
    };
    for (const key in newObj) {
      if (Object.prototype.hasOwnProperty.call(newObj, key)) {
        newObj[key] = convertStringNulls(newObj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

export async function POST(request: Request) {
  console.log("ファイルが呼び出される");
  try {
    // セッションの検証とユーザー情報の取得
    const user = await validateSession();

    // parse the incoming formData and get all files under "files"
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      return createErrorResponse(
        "ファイルが存在しません",
        "NO_FILE_PROVIDED",
        400
      );
    }

    // Will accumulate responses for each uploaded file
    const responses: UploadResponse[] = [];

    for (const file of files) {
      // Convert each file to an ArrayBuffer and then to a base64 string.
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const imageUrl = `data:image/png;base64,${base64}`;

      // AI処理

      // const geminiModel = new ChatGoogleGenerativeAI({
        // model: "gemini-2.0-flash-exp",
        // temperature: 0,
      // });

      const vertexAImodel = new ChatVertexAI({
        model:"gemini-2.0-flash-exp",
        temperature:0
      })

      const extractCartPrompt = await hub.pull("zenn_ai_agent_hackthon");
      const geminiChain = extractCartPrompt.pipe(vertexAImodel);
      const cardInfo = await geminiChain.invoke({ img_base64: imageUrl });
      console.log("cardInfoの情報は以下のようになる",cardInfo)
      const textToJsonPrompt = await hub.pull("zenn_text_to_json");
      const openaiModel = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
      });

      const openaiChain = textToJsonPrompt.pipe(openaiModel);
      const response = await openaiChain.invoke({ text: cardInfo });

      // 型チェックと変換:
      // 1. Parse the response if it's a string (JSON.parse will return null if the string is "null").
      // 2. Recursively convert any nested property values that equal "null" (as a string) to the actual null.
      const responseParsed =
        typeof response === "string" ? JSON.parse(response) : response;
      const responseData = convertStringNulls(responseParsed);

      if (!isCard(responseData)) {
        return createErrorResponse(
          "名刺情報の形式が正しくありません",
          "INVALID_CARD_FORMAT",
          400
        );
      }

      // Firestoreに保存
      const companyWebsiteDomain = responseData.companyUrl
        ? new URL(responseData.companyUrl).hostname
        : null;
      const { id, data } = await createBusinessCard({
        personName: responseData.name,
        personEmail: responseData.mail,
        personPhoneNumber: responseData.phoneNumber,
        role: responseData.position,
        websiteURL: responseData.companyUrl,
        websiteDomain: companyWebsiteDomain,
        createdBy: user.uid,
        companyName: responseData.companyName,
      });

      responses.push({
        success: true,
        message: "名刺画像の処理とデータ保存が完了しました",
        result: data,
        documentId: id,
      });
    }

    return createSuccessResponse(
      {
        success: true,
        message: "全ての名刺画像の処理とデータ保存が完了しました",
        result: responses,
        documentId: "", // Not applicable for multiple images
      },
      "全ての名刺画像の処理とデータ保存が完了しました"
    );
  } catch (error: unknown) {
    return handleAPIError(error);
  }
}
