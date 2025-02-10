import { onCall } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { BusinessCard } from "../services/business-card/type";
import { Company } from "../types";
import { ChatVertexAI } from "@langchain/google-vertexai";

interface EmailDraftRequest {
  cardId: string;
}

interface EmailDraftResponse {
  subject: string;
  body: string;
}

/**
 * 展示会での名刺交換後の挨拶メールの下書きを生成するAPI
 */
export const generateEmailDraft = onCall(
  {
    region: "asia-northeast1",
    cors: true,
  },
  async (request): Promise<EmailDraftResponse> => {
    const firestore = getFirestore();
    console.log("Email draft request:", request.data);
    // リクエストデータの型チェック
    if (!isEmailDraftRequest(request.data)) {
      throw new Error("不正なリクエスト形式です。");
    }

    // 認証チェック
    if (!request.auth) {
      throw new Error("認証が必要です。");
    }

    const { cardId } = request.data;
    const userId = request.auth.uid;

    try {
      // 名刺情報の取得
      const cardDoc = await firestore
        .collection("users")
        .doc(userId)
        .collection("cards")
        .doc(cardId)
        .get();

      if (!cardDoc.exists) {
        throw new Error("指定された名刺が見つかりません。");
      }

      const cardData = cardDoc.data() as BusinessCard;
      if (!cardData) {
        throw new Error("名刺データの取得に失敗しました。");
      }

      // 企業情報の取得
      const companySnapshot = await firestore
        .collection("users")
        .doc(userId)
        .collection("companies")
        .where("name", "==", cardData.companyName)
        .limit(1)
        .get();

      if (companySnapshot.empty) {
        throw new Error("企業情報が見つかりません。");
      }

      const companyData = companySnapshot.docs[0].data() as Company;

      // メール本文の生成
      const subject = generateEmailSubject(cardData);
      const body = await generateEmailBody(
        cardData.personName || "担当者様",
        companyData
      );

      return {
        subject,
        body,
      };
    } catch (error) {
      console.error("Email draft generation error:", error);
      throw new Error("メール下書きの生成に失敗しました。");
    }
  }
);

/**
 * リクエストデータの型チェック
 */
function isEmailDraftRequest(data: unknown): data is EmailDraftRequest {
  if (typeof data === "object" && data !== null) {
    const { cardId } = data as EmailDraftRequest;
    return typeof cardId === "string";
  }
  return false;
}

/**
 * メール件名を生成する
 */
function generateEmailSubject(
  cardData: Pick<BusinessCard, "companyName" | "personName">
): string {
  return `${cardData.companyName} ${cardData.personName}様 - 展示会でのご挨拶ありがとうございました`;
}

/**
 * メール本文を生成する
 */
async function generateEmailBody(
  personName: string,
  companyData: Company
): Promise<string> {
  const chat = new ChatVertexAI({ temperature: 0.7 });

  const prompt = `
あなたはビジネスメール作成のプロフェッショナルです。以下の条件に従って、展示会で名刺交換後に送る挨拶メールの本文を作成してください。

【条件】
1. メール冒頭で展示会でお会いできたことへの感謝の意を述べる。
2. 名刺交換の経緯に触れ、具体的な展示会名や出会いの印象を簡潔に記載する。
3. 今後のビジネス連携や情報交換の可能性について前向きな意欲を示す。
4. 丁寧かつプロフェッショナルな文体で、読みやすく簡潔な文章にまとめる。

企業情報:
  ${JSON.stringify(companyData)}

担当者名:
  ${personName}

締めの挨拶文:
  `;

  const response = await chat.invoke(prompt);

  return response.content.toString();
}
