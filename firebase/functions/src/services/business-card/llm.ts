import { getStorage } from "firebase-admin/storage";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { OCRBusinessCardResponse, isBusinessCard } from "./type";

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

export async function ocrBusinessCard(
  fileName: string
): Promise<OCRBusinessCardResponse> {
  const storage = getStorage();
  const file = await storage.bucket().file(fileName).download();
  const base64Image = file[0].toString("base64");
  const imageMemeType = fileName.split(".").pop(); // corrected to use fileName
  if (!imageMemeType) throw new Error("Invalid image URL");

  // AI処理
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp",
    temperature: 0,
  });
  const extractCartPrompt = await pull("zenn_ai_agent_hackthon");
  const geminiChain = extractCartPrompt.pipe(llm);
  const cardInfo = await geminiChain.invoke({
    img_base64: `data:image/${imageMemeType};base64,${base64Image}`,
  });

  return await parseBusinessCardFromText(cardInfo.content.toString());
}

async function parseBusinessCardFromText(
  text: string
): Promise<OCRBusinessCardResponse> {
  const textToJsonPrompt = await pull("zenn_text_to_json");
  const openaiModel = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  const openaiChain = textToJsonPrompt.pipe(openaiModel);
  const response = await openaiChain.invoke({ text });

  // 型チェックと変換:
  // 1. Parse the response if it's a string (JSON.parse will return null if the string is "null").
  // 2. Recursively convert any nested property values that equal "null" (as a string) to the actual null.
  const responseParsed =
    typeof response === "string" ? JSON.parse(response) : response;
  const responseData = convertStringNulls(responseParsed);

  if (!isBusinessCard(responseData))
    throw new Error("The response data is not a valid BusinessCardData object");

  return responseData;
}
