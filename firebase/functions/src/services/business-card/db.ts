import { getFirestore } from "firebase-admin/firestore";
import { CompanyScore } from "../company-scoring/score";

export async function saveBusinessCard(
  userId: string,
  cardData: {
    imageURL: string;
    companyName: string;
    personName: string;
    personEmail?: string;
    personPhoneNumber?: string;
    role?: string;
  }
) {
  const firestore = getFirestore();
  const cardsRef = firestore.collection(`users/${userId}/cards`);

  const cardDoc = await cardsRef.add({
    imageURL: cardData.imageURL,
    companyName: cardData.companyName,
    personName: cardData.personName,
    personEmail: cardData.personEmail || null,
    personPhoneNumber: cardData.personPhoneNumber || null,
    role: cardData.role || null,
    createdAt: new Date(),
  });

  return cardDoc;
}

export async function updateScore(
  userId: string,
  cardId: string,
  companyScore: CompanyScore
): Promise<void> {
  const firestore = getFirestore();
  const cardRef = firestore.doc(`users/${userId}/cards/${cardId}`);
  const cardSnap = await cardRef.get();

  if (!cardSnap.exists) {
    throw new Error(`名刺ドキュメント： ${cardId} は存在しません`);
  }

  await cardRef.update({
    companyScore,
    updatedAt: new Date(),
  });
}
