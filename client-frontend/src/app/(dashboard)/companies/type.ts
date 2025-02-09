export interface Company {
  name: string;
  domain: string;
  employeeCount?: string;
  sales?: string;
  businessActivities?: string[];
  headOfficeAddress?: string;
  capital?: string;
  established?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function isCompany(arg: unknown): arg is Company {
  return (
    typeof arg === "object" &&
    arg !== null &&
    "name" in arg &&
    "domain" in arg &&
    "createdAt" in arg &&
    "updatedAt" in arg &&
    typeof (arg as Company).name === "string" &&
    typeof (arg as Company).domain === "string"
  );
}
