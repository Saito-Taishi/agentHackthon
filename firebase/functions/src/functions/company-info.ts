import { HttpsError } from "firebase-functions/v2/https";
import { CompanyAnalyzer } from "../services/company-clawler/analyzer";
import { CompanyScraper } from "../services/company-clawler/scraper";
import { Company, ScrapingResult } from "../services/company-clawler/types";

/**
 * 会社情報をウェブサイトから取得する
 */
export const crawlCompanyInfo = async (
  url: string
): Promise<ScrapingResult> => {
  if (!url) {
    throw new HttpsError("invalid-argument", "URLが必要です");
  }

  const scraper = new CompanyScraper();
  const analyzer = new CompanyAnalyzer();

  try {
    const domain = analyzer.extractNormalizedDomain(url);
    if (!domain) {
      return {
        success: false,
        error: "URLからドメインを取得できませんでした",
      };
    }
    await scraper.initialize();

    // 最初のページからリンクを取得
    const extractedData = await scraper.scrapeLinks(url);

    // 会社概要ページのURLを特定
    const companyOverviewUrl = await analyzer.findCompanyOverviewUrl(
      extractedData
    );

    if (!companyOverviewUrl) {
      return {
        success: false,
        error: "会社概要ページのURLが見つかりませんでした",
      };
    }
    // 会社概要ページの内容を取得
    const overview = await scraper.scrapeCompanyOverview(companyOverviewUrl);
    // 会社情報を解析
    const companyInfo = await analyzer.analyzeCompanyOverview(overview);

    console.log("companyInfo", companyInfo);

    const company: Company = {
      ...companyInfo,
      name: "名前はまだ取得できません株式会社",
      domain: domain,
      overview: overview,
    };

    return {
      success: true,
      company,
    };
  } catch (error) {
    console.error("Error crawling company info:", error);
    throw new HttpsError("internal", "会社情報の取得に失敗しました", error);
  } finally {
    await scraper.cleanup();
  }
};
