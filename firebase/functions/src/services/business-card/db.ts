import {
  DocumentData,
  FieldValue,
  getFirestore,
} from "firebase-admin/firestore";
import { CompanyScore } from "../company-scoring/score";

const COLLECTION_NAME = "business_cards";
export async function linkBusinessCard(
  id: string,
  companyRef: FirebaseFirestore.DocumentReference<DocumentData>
): Promise<void> {
  const firestore = getFirestore();
  const businessCardRef = firestore.collection(COLLECTION_NAME).doc(id);
  const businessCardSnap = await businessCardRef.get();
  if (!businessCardSnap.exists) {
    throw new Error(`名刺ドキュメント： ${id} は存在しません`);
  }

  const companyQuerySnapshot = await companyRef.get();
  if (!companyQuerySnapshot.exists) {
    console.log(`企業ドキュメント： ${companyRef.id} は存在しません`);

    // 名刺ドキュメントに companyRef フィールドを追加・更新
    await businessCardRef.update({
      companyRef: companyRef,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
}

export async function updateScore(
  id: string,
  companyScore: CompanyScore
): Promise<void> {
  const firestore = getFirestore();
  const businessCardRef = firestore.collection(COLLECTION_NAME).doc(id);
  const businessCardSnap = await businessCardRef.get();
  if (!businessCardSnap.exists) {
    throw new Error(`名刺ドキュメント： ${id} は存在しません`);
  }

  await businessCardRef.update({
    companyScore,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
