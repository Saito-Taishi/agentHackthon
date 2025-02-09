import { adminFirestore } from "@/utils/config/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export type CompanyDetailData = {
  name: string;
  domain: string;
  overview: string;
  employeeCount?: string;
  sales?: string;
  businessActivities?: string[];
  headOfficeAddress?: string;
  capital?: string;
  established?: string;
};

export type BusinessCardData = {
  // 必須フィールド
  ImageURL: string;
  personName: string;
  companyName: string;
  createdAt: Timestamp;

  // オプショナルフィールド
  personEmail?: string;
  personPhoneNumber?: string;
  role?: string;
};

export type CreateBusinessCardInput = Omit<BusinessCardData, "createdAt">;

const COLLECTION_NAME = "business_cards";

export async function createBusinessCard(
  input: CreateBusinessCardInput
): Promise<{ id: string; data: BusinessCardData }> {
  const now = new Date();
  const data: BusinessCardData = {
    ...input,
    createdAt: Timestamp.fromDate(now),
  };
  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.keys(data).forEach(
    (key) =>
      data[key as keyof BusinessCardData] === undefined &&
      delete data[key as keyof BusinessCardData]
  );

  const docRef = await adminFirestore.collection(COLLECTION_NAME).add(data);

  return {
    id: docRef.id,
    data,
  };
}

export async function getBusinessCard(
  id: string
): Promise<BusinessCardData | null> {
  const doc = await adminFirestore.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data() as BusinessCardData;
}
