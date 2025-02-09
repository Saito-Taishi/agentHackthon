import * as admin from "firebase-admin";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/firestore";
import { auth } from "firebase-functions/v1";
import { setGlobalOptions } from "firebase-functions/v2";
import { crawlCompanyInfo } from "./functions/company-info";
import { updateScore } from "./services/business-card/db";
import { scoreCompany } from "./services/company-scoring/score";
import { saveCompany } from "./services/company/db";

setGlobalOptions({
  region: "asia-northeast1",
  timeoutSeconds: 300,
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
    memory: "1GiB",
    document: "users/{userId}/cards/{cardId}",
  },
  async (event) => {
    const userId = event.params.userId;
    const cardId = event.params.cardId;

    const data = event.data;
    if (!data || !data.data().websiteURL) {
      console.error("No data in snapshot or websiteURL is missing");
      return;
    }
    const businessCard = data.data();

    const crawlResult = await crawlCompanyInfo(businessCard.websiteURL);
    if (!crawlResult.success) {
      console.error("Error crawling company info:", crawlResult.error);
      return;
    }

    // 企業情報を保存
    await saveCompany(userId, cardId, crawlResult.company);

    // スコアを計算して更新
    const role = businessCard.role;
    const employeeCount = crawlResult.company.employeeCount;
    const companyScore = await scoreCompany(role, employeeCount);
    await updateScore(userId, cardId, companyScore);
  }
);
