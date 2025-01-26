export interface Link {
  id: string;
  href: string;
  text: string;
}

export interface ExtractedData {
  url: string;
  links: Link[];
}

export interface CompanyOverviewData {
  text: string;
}

export interface CompanyInfo {
  employeeCount?: string;
  sales?: string;
  businessActivities?: string[];
  headOfficeAddress?: string;
  capital?: string;
  established?: string;
}

export interface ScrapingResult {
  success: boolean;
  data: ExtractedData | CompanyInfo;
  error?: string;
}