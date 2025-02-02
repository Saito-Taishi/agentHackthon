import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import * as hub from "langchain/hub";
import { ExtractedData, Company } from "./types";

export class CompanyAnalyzer {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.5,
    });
  }

  /**
   * 企業ドメインを抽出し正規化する
   *
   * @param url 企業のURL（例："https://www.example.com/page"）
   * @returns 正規化されたドメイン（例："example.com"）、取得できなかった場合はnull
   */
  extractNormalizedDomain(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      let domain = parsedUrl.hostname.replace("www.", "");

      // サブドメイン処理: 必要に応じてカスタムルールを実装可能
      // 例としてトップレベルドメインとセカンドレベルドメインのみを抽出
      const parts = domain.split(".");
      if (parts.length > 2) {
        domain = parts.slice(parts.length - 2).join(".");
      }

      return domain;
    } catch (error) {
      console.error("Error extracting normalized domain:", error);
      return null;
    }
  }

  /**
   * 会社概要ページのURLを特定する
   */
  async findCompanyOverviewUrl(data: ExtractedData): Promise<string | null> {
    try {
      const hrefSelectPrompt = await hub.pull("zenn_selected_href");
      const openaiChain = hrefSelectPrompt.pipe(this.model);
      const result = await openaiChain.invoke({ question: data });
      const { url } = result as unknown as { url: string };

      return url;
    } catch (error) {
      console.error("Error finding company overview URL:", error);
      return null;
    }
  }

  /**
   * 会社概要ページから情報を抽出する
   */
  async analyzeCompanyOverview(overview: string): Promise<Company> {
    try {
      // const companyOverviewPrompt = await hub.pull("zenn_company_overview");
      const formatInstructions = `
      JSON形式で回答するようにしてください。
      レスポンスのJSONの型は
          {{
						name:"string",
            employeeCount:"string", 
            sales:"string", 
            headOfficeAddress:"string",
            capital:"string",
            established:"string",
            businessActivities:"string[]",
          }}
`;
      const SystemMessage = `htmlから抽出した文章データを受け取ります。
      以下のルールを守り、以下のデータを抽出してください。
      もしもなければnullにしてください。
      ルール1：もしもなければnullにする
      - 会社名
      - 従業員数
      - 売上
      - 本社住所
      - 資本金
      - 設立
      - 事業内容

      ルール2：アウトプットは以下のルールを守るようにしてください。
      {format_instructions}
      `;
      const parser = new JsonOutputParser<Company>(); //参考：https://js.langchain.com/docs/how_to/structured_output/#using-jsonoutputparser
      const prompt = await ChatPromptTemplate.fromMessages([
        ["system", SystemMessage],
        ["user", "{question}"],
      ]).partial({
        format_instructions: formatInstructions,
      });
      const chain = prompt.pipe(this.model).pipe(parser);
      const question = overview;
      const result = await chain.invoke({ question });
      // const openaiChain = companyOverviewPrompt.pipe(this.model);
      // const result = await openaiChain.invoke({
      // 	question: overview,
      // });

      return result as unknown as Company;
    } catch (error) {
      console.error("Error analyzing company overview:", error);
      throw error;
    }
  }
}
