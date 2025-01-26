import type { DocumentReference } from "firebase-admin/firestore";
import { adminFirestore } from "@/utils/config/firebase-admin";

export type BusinessCardData = {
  // 必須フィールド
  personName: string;
  personEmail: string;
  personPhoneNumber: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBusinessCardInput = Omit<BusinessCardData, "createdAt" | "updatedAt">;

const COLLECTION_NAME = "business_cards";

export async function createBusinessCard(
  input: CreateBusinessCardInput,
): Promise<{ id: string; data: BusinessCardData }> {
  const now = new Date();
  const data: BusinessCardData = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };

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

export async function getBusinessCardsByUserId(
  userId: string | DocumentReference,
): Promise<BusinessCardData[]> {
  const snapshot = await adminFirestore
    .collection(COLLECTION_NAME)
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data() as BusinessCardData);
}
