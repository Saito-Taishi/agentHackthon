import { NextResponse } from "next/server";
import { chromium } from "playwright";
import { ChatOpenAI } from "@langchain/openai";
import * as hub from "langchain/hub";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

      const extractedData: { url: string; links: { id: string; href: string; text: string }[] } = {
        url,
        links: [],
      };

      extractedData.links = await page.evaluate(() => {
        const links = document.querySelectorAll("a");
        return Array.from(links).map((link, index) => ({
          id: String(index + 1), // 連番を文字列として設定
          href: link.href,
          text: (link.textContent || "").replace(/\s+/g, " ").trim(),
        }));
      });

      //TODO 出力パーサーを定義する
      const openaiModel = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0.5,
      });
      // 会社概要ページのURLを探す
      const hrefSelectPrompt = await hub.pull("zenn_selected_href");
      const openaiChain = hrefSelectPrompt.pipe(openaiModel);
      const selectedHref = await openaiChain.invoke({ question: extractedData });
      
      // selectedHrefの結果を使って新しいページに遷移
      if (selectedHref) {
        const { url } = selectedHref;
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        const companyOverviewData = await page.evaluate(() => {
          return {
            text: document.body.innerText.replace(/\n/g, ""),
          };
        });
        //会社概要から必要な情報を取得
        const companyOverviewPrompt = await hub.pull("zenn_company_overview");
        const companyOverviewChain = companyOverviewPrompt.pipe(openaiModel);
        const companyOverview = await companyOverviewChain.invoke({
          question: companyOverviewData,
        });
        console.log(companyOverview);
        await browser.close();
        return NextResponse.json({
          selectedPage: companyOverview,
          // {
          // employeeCount: '20767',
          // sales: '8078億円',
          // businessActivities: [ 'マッチング＆ソリューション事業' ],
          // headOfficeAddress: '東京都千代田区丸の内1-9-2 グラントウキョウサウスタワー',
          // capital: '3億5千万円',
          // established: '2018年4月1日'
          // }
        });
      }

      await browser.close();
      console.log(extractedData);
      return NextResponse.json(extractedData);
    } catch (error: unknown) {
      await browser.close();
      console.error("Error during scraping:", error);
      return NextResponse.json({ error: "Scraping failed", details: error }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 });
  }
}
