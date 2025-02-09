import { getFirestore } from "firebase-admin/firestore";

export interface CompanyInfo {
  name: string;
  domain: string;
  overview: string;
  employeeCount?: string;
  sales?: string;
  businessActivities?: string[];
  headOfficeAddress?: string;
  capital?: string;
  established?: string;
}

export async function saveCompany(
  userId: string,
  cardId: string,
  company: CompanyInfo
) {
  const firestore = getFirestore();
  const companyRef = firestore
    .collection(`users/${userId}/cards/${cardId}/company`)
    .doc();

  await companyRef.set({
    ...company,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return companyRef;
}

export async function getCompanyInfo(userId: string, cardId: string) {
  const firestore = getFirestore();
  const companyRef = firestore
    .collection(`users/${userId}/cards/${cardId}/company`)
    .doc();

  const doc = await companyRef.get();
  if (!doc.exists) {
    return null;
  }

  return doc.data() as CompanyInfo;
}

export async function updateCompanyInfo(
  userId: string,
  cardId: string,
  companyId: string,
  updates: Partial<CompanyInfo>
) {
  const firestore = getFirestore();
  const companyRef = firestore.doc(
    `users/${userId}/cards/${cardId}/company/${companyId}`
  );

  await companyRef.update({
    ...updates,
    updatedAt: new Date(),
  });
}
