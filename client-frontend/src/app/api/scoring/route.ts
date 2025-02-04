import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

import * as hub from "langchain/hub"


export async function POST(request:Request){
    try{
        const body = await request.json()
        //役職、従業員数、売上、事業内容
        const {role, employeeCount} = body;
        const geminiModel = new ChatGoogleGenerativeAI({
            model:"gemini-2.0-flash-exp",
            temperature:0
        })
        const openaiModel = new ChatOpenAI({
            model:"gpt-4o",
            temperature:0
        })
        const scoringPrompt = await hub.pull("zenn_ai_agent_scoring")
        const geminiChain = scoringPrompt.pipe(geminiModel)
        const scoringRes = await geminiChain.invoke({
            role:role,
            employeeCount:employeeCount,
            // sales:sales
        })
        const jsonPrompt = await hub.pull("zenn_ai_agent_scoring_json")
        const openaiChain = jsonPrompt.pipe(openaiModel)
        const jsonRes = await openaiChain.invoke({
            scoringRes:scoringRes
        })
        //低、中、高でレスポンス
        console.log(jsonRes)
    }catch{

    }
}