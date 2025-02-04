import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

const COMPANY_SCORE = ["high", "mid", "low", "unknown"] as const;
type CompanyScore = (typeof COMPANY_SCORE)[number];

export async function scoreCompany(
  role: string,
  employeeCount: number
): Promise<CompanyScore> {
  if (!role || !employeeCount) {
    throw new Error("role or employeeCount is missing");
  }
  const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp",
    temperature: 0,
  });
  const openaiModel = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  const scoringPrompt = PromptTemplate.fromTemplate(`
  これから会社の営業見込み客の肩書き、とその企業の従業員人数を受け取ります。
  以下のルールを厳守しポイントを割り当ててください。
  ルール1: 肩書きを{{部長以上の役職: 4}},{{部長ではないが管理職 : 2}},{{肩書きがある一般社員 : 1}}, {{何もなし : 0}}に分類
  ルール2: 従業員人数からその企業が{{大企業 : 4}}, {{中企業 100~ 999人規模: 2}}, {{小企業 :1 }}, {{不明: 0}}に分類
  
  上記ルールに載っとて、以下のように出力してください。
  
  7ポイント以上: {{ high }}
  4ポイント以上: {{ mid }}
  3ポイント以下: {{ low }}
  input
  {role}
  {employeeCount}
  `);

  const geminiChain = scoringPrompt.pipe(geminiModel);
  const scoringRes = await geminiChain.invoke({
    role: role,
    employeeCount: employeeCount,
  });
  const jsonPrompt = await PromptTemplate.fromTemplate(`
    プロンプト2
    これから文章を受け取るので、以下のルールを厳守してください。
    ルール1: 文章の中に{{low}},があれば、{{low}}と出力
    ルール2: 文章の中に{{mid}},があれば、{{mid}}と出力
    ルール3: 文章の中に{{high}},があれば、{{high}}と出力
    ルール4: どれにも該当しなければ、{{unknown}}と出力
    parse
    low, mid, high, unknown
`);
  const openaiChain = jsonPrompt.pipe(openaiModel);
  const jsonRes = await openaiChain.invoke({
    scoringRes: scoringRes,
  });

  console.log(jsonRes);
  const score = jsonRes as unknown as CompanyScore;
  if (!COMPANY_SCORE.includes(score)) {
    throw new Error("Invalid score");
  }

  return score as CompanyScore;
}
