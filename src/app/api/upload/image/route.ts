import { NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import * as hub from "langchain/hub";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const mimeType = file.type;
    const imageUrl = `data:${mimeType};base64,${base64}`;

    const geminiModel = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      temperature: 0,
    });

    const extractCartPrompt = await hub.pull("zenn_ai_agent_hackthon")
    const geminiChain = extractCartPrompt.pipe(geminiModel)
    const cardInfo = await geminiChain.invoke({"img_base64":imageUrl})

    const textToJsonPrompt = await hub.pull("zenn_text_to_json")
    const openaiModel = new ChatOpenAI({model:"gpt-4o-mini", temperature: 0})
    const openaiChain = textToJsonPrompt.pipe(openaiModel)
    const response = await openaiChain.invoke({"text":cardInfo})
    console.log("AI Response:", response);

    return NextResponse.json({
      success: true,
      message: 'Image processed successfully',
      result: response,
    });

  } catch (error: unknown) {
    console.error('Error processing image:', error);
    return NextResponse.json({
      success: false,
      message: 'Error processing the image',
      error: String(error),
    });
  }
}
