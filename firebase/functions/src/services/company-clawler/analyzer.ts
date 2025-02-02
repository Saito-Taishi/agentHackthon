import { ChatOpenAI } from "@langchain/openai";
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
      const companyOverviewPrompt = await hub.pull("zenn_company_overview");
      const openaiChain = companyOverviewPrompt.pipe(this.model);
      const result = await openaiChain.invoke({
        question: overview,
      });

      return result as unknown as Company;
    } catch (error) {
      console.error("Error analyzing company overview:", error);
      throw error;
    }
  }
}
