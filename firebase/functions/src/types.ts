export interface Link {
  id: string;
  href: string;
  text: string;
}

export interface ExtractedData {
  url: string;
  links: Link[];
}

export interface Company {
  name: string;
  overview: string;
  employeeCount?: string;
  sales?: string;
  businessActivities?: string[];
  headOfficeAddress?: string;
  capital?: string;
  established?: string;
}

export type ScrapingResult =
  | {
      success: true;
      company: Company;
    }
  | {
      success: false;
      error: string;
    };
