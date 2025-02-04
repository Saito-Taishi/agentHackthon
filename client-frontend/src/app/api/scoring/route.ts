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
            model:"gpt-4o-mini",
            temperature:0
        })
        const scoringPrompt = await hub.pull("zenn_ai_agent_scoring")
        // プロンプト1
            //これから会社の営業見込み客の肩書き、とその企業の従業員人数を受け取ります。
            //以下のルールを厳守しポイントを割り当ててください。
            //ルール1：肩書きを{{部長以上の役職：4}},{{部長ではないが管理職 : 2}},{{肩書きがある一般社員 : 1}}, {{何もなし : 0}}に分類
            //ルール2：従業員人数からその企業が{{大企業 : 4}}, {{中企業 100~ 999人規模: 2}}, {{小企業 :1 }}, {{不明：0}}に分類
            //
            //上記ルールに載っとて、以下のように出力してください。
            //
            //7ポイント以上：{{ high }}
            //4ポイント以上：{{ mid }}
            //3ポイント以下：{{ low }}
        //input
            // {role}
            // {employeeCount}

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
        // プロンプト2
            // これから文章を受け取るので、以下のルールを厳守してください。
            // ルール1：文章の中に{{low}},があれば、{{low}}と出力
            // ルール2：文章の中に{{mid}},があれば、{{mid}}と出力
            // ルール3：文章の中に{{high}},があれば、{{high}}と出力
            // ルール4：どれにも該当しなければ、{{unknown}}と出力
        // parse
            // low, mid, high, unknown
        console.log(jsonRes)
    }catch{

    }
}