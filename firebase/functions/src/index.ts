import * as admin from "firebase-admin";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { auth } from "firebase-functions/v1";
import { setGlobalOptions } from "firebase-functions/v2";
import { onObjectFinalized } from "firebase-functions/v2/storage";
import { crawlCompanyInfo } from "./functions/company-info";
import { saveBusinessCard, updateScore } from "./services/business-card/db";
import { ocrBusinessCard } from "./services/business-card/llm";
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

export const handleFileUpload = onObjectFinalized(
  {
    bucket: "zenn-ai-hackthon.firebasestorage.app",
    region: "asia-northeast1",
    memory: "1GiB",
  },
  async (event) => {
    try {
      if (!event.data?.selfLink) {
        throw new Error("No self link found in event data");
      }

      const userId = event.data.name.split("/")[0];
      console.log(`ユーザーID: ${userId}`);
      console.log(`OCR処理を開始します: ${event.data.name}`);

      // Cloud Storageの公開URLを生成
      const imageURL = `https://storage.googleapis.com/${event.data.bucket}/${event.data.name}`;
      console.log("画像のURLを生成しました:", imageURL);

      const ocrResponse = await ocrBusinessCard(event.data.name);
      console.log("OCR結果:", ocrResponse);
      console.log("名刺データを保存します");

      const { card, doc: cardDoc } = await saveBusinessCard(userId, {
        imageURL: imageURL,
        companyName: ocrResponse.companyName,
        personName: ocrResponse.name,
        personEmail: ocrResponse.mail,
        personPhoneNumber: ocrResponse.phoneNumber,
        role: ocrResponse.position,
        companyAddress: ocrResponse.companyAddress,
        websiteURL: ocrResponse.companyUrl,
      });
      console.log("名刺データを保存しました", card);

      if (!card.websiteURL || !card.role) {
        console.error("No website URL found in OCR response");
        return;
      }

      const crawlResult = await crawlCompanyInfo(card.websiteURL);
      if (!crawlResult.success) {
        console.error("Error crawling company info:", crawlResult.error);
        return;
      }

      const cardID = cardDoc.id;

      // 企業情報を保存
      await saveCompany(userId, cardID, crawlResult.company);

      // スコアを計算して更新
      const employeeCount = crawlResult.company.employeeCount;
      const companyScore = await scoreCompany(card.role, employeeCount);
      await updateScore(userId, cardID, companyScore);
    } catch (error) {
      console.error("ファイル処理中にエラーが発生しました:", error);
      throw error; // Cloud Functionsに再試行させる
    }
  }
);
