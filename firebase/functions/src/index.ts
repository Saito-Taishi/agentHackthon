import * as admin from "firebase-admin";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { auth } from "firebase-functions/v1";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { crawlCompanyInfo } from "./functions/company-info";
import { saveCompany } from "./services/company/db";
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({
  region: "asia-northeast1",
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
  "business_cards/{id}",
  async (event) => {
    const snapshot = event.data?.data();
    if (!snapshot || !snapshot.websiteURL) {
      console.error("No data in snapshot or websiteURL is missing");
      return;
    }

    const crawlResult = await crawlCompanyInfo(snapshot.websiteURL);
    if (!crawlResult.success) {
      console.error("Error crawling company info:", crawlResult.error);
      return;
    }

    await saveCompany(crawlResult.company);
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
