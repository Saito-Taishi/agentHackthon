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

    const dom = await scraper.scrapeDom(companyOverviewUrl);
    const companyInfo = await analyzer.analyzeCompanyOverview(dom);

    console.log("companyInfo", companyInfo);

    const company: Company = {
      ...companyInfo,
      domain: domain,
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
