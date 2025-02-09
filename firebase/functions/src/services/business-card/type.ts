export type BusinessCard = {
  imageURL: string;
  websiteURL: string | null;
  companyName: string | null;
  companyAddress: string | null;
  personName: string | null;
  personEmail: string | null;
  personPhoneNumber: string | null;
  role: string | null;
  companyCrawledAt: Date | null;
  createdAt: Date;
};

export type OCRBusinessCardResponse = {
  companyName: string | null;
  position: string | null;
  name: string | null;
  mail: string | null;
  phoneNumber: string | null;
  companyAddress: string | null;
  companyUrl: string | null;
  createdAt: Date | null;
};

// Helper function for type guard checking string or null
function isStringOrNull(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

export function isBusinessCard(data: unknown): data is OCRBusinessCardResponse {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const card = data as Record<string, unknown>;
  return (
    isStringOrNull(card.companyName) &&
    isStringOrNull(card.position) &&
    isStringOrNull(card.name) &&
    isStringOrNull(card.mail) &&
    isStringOrNull(card.phoneNumber) &&
    isStringOrNull(card.companyAddress) &&
    isStringOrNull(card.companyUrl)
  );
}
