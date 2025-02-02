import type { DocumentReference } from "firebase-admin/firestore";
import { adminFirestore } from "@/utils/config/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export type BusinessCardData = {
  // 必須フィールド
  personName: string;
  personEmail: string;
  personPhoneNumber: string;
  personPosition:string;
  createdBy: string | DocumentReference;
  companyName: string;
  // オプショナルフィールド
  tradeShowId?: string | DocumentReference;
  companyId?: string | DocumentReference;
  websiteURL?: string;
  role?: string;
  companyAddress?: string;
  memo?: string;

  // システムフィールド
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CreateBusinessCardInput = Omit<BusinessCardData, "createdAt" | "updatedAt">;

const COLLECTION_NAME = "business_cards";

export async function createBusinessCard(
  input: CreateBusinessCardInput,
): Promise<{ id: string; data: BusinessCardData }> {
  const now = new Date();
  const data: BusinessCardData = {
    ...input,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  };
  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.keys(data).forEach(
    (key) =>
      data[key as keyof BusinessCardData] === undefined &&
      delete data[key as keyof BusinessCardData],
  );

  const docRef = await adminFirestore.collection(COLLECTION_NAME).add(data);

  return {
    id: docRef.id,
    data,
  };
}

export async function getBusinessCard(id: string): Promise<BusinessCardData | null> {
  const doc = await adminFirestore.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data() as BusinessCardData;
}
