import { getFirestore } from "firebase-admin/firestore";
import { CompanyScore } from "../company-scoring/score";
import { BusinessCard } from "./type";

export async function saveBusinessCard(
  userId: string,
  cardData: Omit<BusinessCard, "createdAt">
) {
  const firestore = getFirestore();
  const cardsRef = firestore.collection(`users/${userId}/cards`);

  const card = {
    imageURL: cardData.imageURL,
    companyName: cardData.companyName,
    personName: cardData.personName,
    personEmail: cardData.personEmail || null,
    companyAddress: cardData.companyAddress || null,
    personPhoneNumber: cardData.personPhoneNumber || null,
    role: cardData.role || null,
    createdAt: new Date(),
    websiteURL: cardData.websiteURL || null,
  } satisfies BusinessCard;

  const cardDoc = await cardsRef.add(card);

  return {
    doc: cardDoc,
    card: card,
  };
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
