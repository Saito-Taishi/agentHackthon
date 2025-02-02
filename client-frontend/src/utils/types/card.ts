export type Card = {
  companyName: string;
  position: string;
  name: string;
  mail: string;
  phoneNumber: string;
  companyAddress: string;
  companyUrl: string;
};

export function isCard(data: unknown): data is Card {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const card = data as Record<string, unknown>;
  return (
    typeof card.companyName === "string" &&
    typeof card.position === "string" &&
    typeof card.name === "string" &&
    typeof card.mail === "string" &&
    typeof card.phoneNumber === "string" &&
    typeof card.companyAddress === "string" &&
    typeof card.companyUrl === "string"
  );
}
