import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import * as hub from "langchain/hub";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { getApps } from "firebase-admin/app";

// Firebase初期化
if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

type Card = {
  companyName: string;
  position: string;
  name: string;
  mail: string;
  phoneNumber: string;
  companyAddress: string;
  companyUrl: string;
};

function isCard(data: unknown): data is Card {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const card = data as Record<string, unknown>;
  return (
    typeof card.companyName === "string" &&
    typeof card.position === "string" &&
    typeof card.name === "string" &&
    typeof card.mail === "string" &&
    typeof card.phoneNumber === "string" &&
    typeof card.companyAddress === "string" &&
    typeof card.companyUrl === "string"
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "No file uploaded.",
      });
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
      throw new Error("Invalid card data format");
    }

    // Firestoreに保存
    const docRef = await db.collection("businessCards").add({
      ...responseData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Image processed and data saved successfully",
      result: responseData,
      documentId: docRef.id,
    });
  } catch (error: unknown) {
    console.error("Error processing image:", error);
    return NextResponse.json({
      success: false,
      message: "Error processing the image",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
