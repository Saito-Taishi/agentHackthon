import { chromium, Browser, Page } from "playwright";
import { ExtractedData, CompanyOverviewData } from "./types";

export class CompanyScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize(): Promise<void> {
    this.browser = await chromium.launch();
    const context = await this.browser.newContext();
    this.page = await context.newPage();
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  async scrapeLinks(url: string): Promise<ExtractedData> {
    if (!this.page) {
      throw new Error("Browser not initialized");
    }

    await this.page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const links = await this.page.evaluate(() => {
      const linkElements = document.querySelectorAll("a");
      return Array.from(linkElements).map((link, index) => ({
        id: String(index + 1),
        href: link.href,
        text: (link.textContent || "").replace(/\s+/g, " ").trim(),
      }));
    });

    return {
      url,
      links,
    };
  }

  async scrapeCompanyOverview(url: string): Promise<CompanyOverviewData> {
    if (!this.page) {
      throw new Error("Browser not initialized");
    }

    await this.page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const text = await this.page.evaluate(() => {
      return {
        text: document.body.innerText.replace(/\n/g, ""),
      };
    });

    return text;
  }
}