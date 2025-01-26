import { ChatOpenAI } from "@langchain/openai";
import * as hub from "langchain/hub";
import { ExtractedData, CompanyInfo, CompanyOverviewData } from "./types";

export class CompanyAnalyzer {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      model: "gpt-4",
      temperature: 0.5,
    });
  }

  /**
   * 会社概要ページのURLを特定する
   */
  async findCompanyOverviewUrl(data: ExtractedData): Promise<string | null> {
    try {
      const hrefSelectPrompt = await hub.pull("zenn_selected_href");
      const openaiChain = hrefSelectPrompt.pipe(this.model);
      const result = await openaiChain.invoke({ question: data });
      return result.url || null;
    } catch (error) {
      console.error("Error finding company overview URL:", error);
      return null;
    }
  }

  /**
   * 会社概要ページから情報を抽出する
   */
  async analyzeCompanyOverview(
    data: CompanyOverviewData
  ): Promise<CompanyInfo> {
    try {
      const companyOverviewPrompt = await hub.pull("zenn_company_overview");
      const openaiChain = companyOverviewPrompt.pipe(this.model);
      const result = await openaiChain.invoke({
        question: data,
      });

      return result as CompanyInfo;
    } catch (error) {
      console.error("Error analyzing company overview:", error);
      throw error;
    }
  }
}
