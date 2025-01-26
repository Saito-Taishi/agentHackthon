import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { auth } from "firebase-functions/v1";
import { crawlCompanyInfo } from "./functions/company-info";
import { onDocumentCreated } from "firebase-functions/firestore";

// Firebase Adminの初期化
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
      throw error;
    }
  });

export const scrapeCompanyInfo = onDocumentCreated(
  "business_cards/{id}",
  async (event) => {
    const snapshot = event.data?.data();
    if (!snapshot) {
      // TODO error handling
      return;
    }

    const companyInfo = await crawlCompanyInfo(snapshot.url);
    await firestore.collection("companies").add(companyInfo);
  }
);
