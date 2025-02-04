export type Card = {
	companyName: string | null;
	position: string | null;
	name: string | null;
	mail: string | null;
	phoneNumber: string | null;
	companyAddress: string | null;
	companyUrl: string | null;
};

// Helper function for type guard checking string or null
function isStringOrNull(value: unknown): value is string | null {
	return typeof value === "string" || value === null;
}

export function isCard(data: unknown): data is Card {
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
