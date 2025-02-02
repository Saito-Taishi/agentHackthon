import { getFirestore } from "firebase-admin/firestore";
import { Company } from "../company-clawler/types";

export async function saveCompany(company: Company) {
  const firestore = getFirestore();
  const companiesRef = firestore.collection("companies");

  try {
    const querySnapshot = await companiesRef
      .where("domain", "==", company.domain)
      .get();
    const now = new Date();
    if (querySnapshot.empty) {
      // No record exists for the domain, create a new one
      const companyRef = await companiesRef.add({
        ...company,
        createdAt: now,
        updatedAt: now,
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
  } catch (error) {
    throw error;
  }
}
