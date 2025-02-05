import * as admin from "firebase-admin";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { auth } from "firebase-functions/v1";
import { setGlobalOptions } from "firebase-functions/v2";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { crawlCompanyInfo } from "./functions/company-info";
import { linkBusinessCard, updateScore } from "./services/business-card/db";
import { saveCompany } from "./services/company/db";
import { scoreCompany } from "./services/company-scoring/score";

setGlobalOptions({
  region: "asia-northeast1",
  timeoutSeconds: 300, // 5分
});

admin.initializeApp();
const firestore = getFirestore();

// ユーザー作成時のトリガー関数
export const createUserDocument = auth
  .user()
  .onCreate(async (user: auth.UserRecord) => {
    try {
      const { email, displayName } = user;

      const userData = {
        name: displayName || "",
        email: email || "",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await firestore.collection("users").doc(user.uid).set(userData);

      console.log(`新規ユーザーのデータを保存しました: ${user.uid}`);
    } catch (error) {
      console.error("ユーザーデータの保存中にエラーが発生しました:", error);
      // throw error;
    }
  });

export const scrapeCompanyInfo = onDocumentCreated(
  {
    document: "business_cards/{id}",
    memory: "1GiB",
  },
  async (event) => {
    if (!event.data) {
      throw new Error("No data in event");
    }
    const businessCard = event.data?.data();
    if (!businessCard || !businessCard.websiteURL) {
      throw new Error("No data in snapshot or websiteURL is missing");
    }

    const crawlResult = await crawlCompanyInfo(businessCard.websiteURL);
    if (!crawlResult.success) {
      throw new Error("Error crawling company info: " + crawlResult.error);
    }
    const { company } = crawlResult;
    const companyRef = await saveCompany(company);
    if (!companyRef) {
      throw new Error("Error saving company info");
    }

    await linkBusinessCard(event.params.id, companyRef);

    if (
      !businessCard.role ||
      !company.employeeCount ||
      !parseInt(company.employeeCount)
    ) {
      throw new Error("スコア計算に必要な情報が名刺に足りません");
    }

    const score = await scoreCompany(
      businessCard.role,
      Number(company.employeeCount)
    );
    await updateScore(event.params.id, score);
  }
);

if (process.env.FUNCTIONS_EMULATOR) {
  module.exports.debugCompanyCrawler = onRequest(async (req, res) => {
    console.log("debugCompanyCrawler");

    try {
      const crawlResult = await crawlCompanyInfo("https://www.a-s-ist.com");
      console.log("crawlResult:", crawlResult);
      if (!crawlResult.success) {
        res.status(500).json({ error: crawlResult.error });
        return;
      }

      await saveCompany(crawlResult.company);
      res.status(200).json(crawlResult.company);
    } catch (error) {
      console.error("Error in debugCompanyCrawler:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
