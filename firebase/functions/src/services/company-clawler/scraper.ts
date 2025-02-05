import playWright from "playwright-aws-lambda";
import { ChromiumBrowser, Page } from "playwright-core";
import { ExtractedData } from "../../types";

export class CompanyScraper {
  private browser: ChromiumBrowser | null = null;
  private page: Page | null = null;

  async initialize(): Promise<void> {
    this.browser = await playWright.launchChromium();
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

    // Set a lower timeout for faster failure
    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    // Use page.$eval instead of evaluate for better performance
    const links = await this.page.$$eval("a", (elements) =>
      elements.map((link, index) => ({
        id: String(index + 1),
        href: link.href,
        text: (link.textContent || "").replace(/\s+/g, " ").trim(),
      }))
    );

    return {
      url,
      links: links.filter((link) => link.href && link.text), // Filter out invalid links
    };
  }

  async scrapeDom(url: string): Promise<string> {
    if (!this.page) {
      throw new Error("Browser not initialized");
    }

    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const { text } = await this.page.evaluate(() => {
      return {
        text: document.body.innerText.replace(/\n/g, ""),
      };
    });

    return text;
  }
}
