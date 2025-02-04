import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as hub from "langchain/hub"


export async function POST(request:Request){
    try{
        const body = await request.json()
        //役職、従業員数、売上、事業内容
        const {role, employeeCount} = body;
        const model = new ChatGoogleGenerativeAI({
            model:"gemini-2.0-flash-exp",
            temperature:0
        })
        const prompt = await hub.pull("zenn_ai_agent_scoring")
        const geminiChain = prompt.pipe(model)
        const res = await geminiChain.invoke({
            role:role,
            employeeCount:employeeCount,
            // sales:sales
        })

        //低、中、高でレスポンス
        console.log(res)
    }catch{

    }
}