import {
  DocumentData,
  DocumentReference,
  getFirestore,
} from "firebase-admin/firestore";
import { Company } from "../../types";

export async function saveCompany(
  company: Company,
  businessCardRef: DocumentReference<DocumentData, DocumentReference>
) {
  const firestore = getFirestore();
  const companiesRef = firestore.collection("companies");

  const querySnapshot = await companiesRef
    .where("domain", "==", company.domain)
    .get();
  const now = new Date();
  if (querySnapshot.empty) {
    // No record exists for the domain, create a new one
    const companyRef = await companiesRef.doc(company.domain).set({
      ...company,
      createdAt: now,
      updatedAt: now,
      businessCardRefs: businessCardRef,
    });
    return companyRef;
  } else {
    // Record exists, update the first matching document (upsert behavior)
    const companyDoc = querySnapshot.docs[0];
    await companyDoc.ref.update({
      ...company,
      updatedAt: now,
    });
    return companyDoc.ref;
  }
}
