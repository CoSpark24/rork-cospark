import { create } from "zustand";

interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  isPremium: boolean;
  downloadUrl?: string;
  previewUrl?: string;
  keyPoints?: string[];
}

interface LegalTemplatesState {
  templates: LegalTemplate[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
}

const mockTemplates: LegalTemplate[] = [
  // Incorporation
  {
    id: "articles_incorporation",
    title: "Articles of Incorporation",
    description: "Legal document to formally establish your corporation",
    category: "Incorporation",
    type: "Corporation",
    isPremium: false,
    keyPoints: [
      "Establishes legal entity status",
      "Defines corporate structure",
      "Required for business registration"
    ]
  },
  {
    id: "operating_agreement",
    title: "LLC Operating Agreement",
    description: "Defines ownership and operating procedures for LLCs",
    category: "Incorporation",
    type: "LLC",
    isPremium: false,
    keyPoints: [
      "Outlines member rights and responsibilities",
      "Defines profit and loss distribution",
      "Establishes management structure"
    ]
  },
  {
    id: "bylaws_template",
    title: "Corporate Bylaws",
    description: "Internal rules and procedures for corporation governance",
    category: "Incorporation",
    type: "Corporation",
    isPremium: true,
    keyPoints: [
      "Defines board structure and meetings",
      "Outlines shareholder rights",
      "Establishes voting procedures"
    ]
  },
  
  // Employment
  {
    id: "employment_agreement",
    title: "Employment Agreement",
    description: "Standard employment contract for full-time employees",
    category: "Employment",
    type: "Contract",
    isPremium: false,
    keyPoints: [
      "Defines job responsibilities and compensation",
      "Includes confidentiality provisions",
      "Outlines termination procedures"
    ]
  },
  {
    id: "contractor_agreement",
    title: "Independent Contractor Agreement",
    description: "Contract for freelancers and independent contractors",
    category: "Employment",
    type: "Contract",
    isPremium: false,
    keyPoints: [
      "Clarifies contractor vs employee status",
      "Defines project scope and deliverables",
      "Includes payment terms and IP ownership"
    ]
  },
  {
    id: "equity_agreement",
    title: "Equity Compensation Agreement",
    description: "Stock option and equity grants for employees",
    category: "Employment",
    type: "Equity",
    isPremium: true,
    keyPoints: [
      "Defines vesting schedule",
      "Outlines exercise terms",
      "Includes acceleration clauses"
    ]
  },
  
  // Intellectual Property
  {
    id: "nda_template",
    title: "Non-Disclosure Agreement (NDA)",
    description: "Protect confidential information in business discussions",
    category: "Intellectual Property",
    type: "Confidentiality",
    isPremium: false,
    keyPoints: [
      "Protects confidential business information",
      "Defines permitted uses of information",
      "Includes return of materials clause"
    ]
  },
  {
    id: "ip_assignment",
    title: "Intellectual Property Assignment",
    description: "Transfer IP rights from employees/contractors to company",
    category: "Intellectual Property",
    type: "Assignment",
    isPremium: true,
    keyPoints: [
      "Transfers all IP rights to company",
      "Covers inventions and creative works",
      "Includes moral rights waiver"
    ]
  },
  
  // Funding
  {
    id: "term_sheet",
    title: "Investment Term Sheet",
    description: "Outline key terms for equity investment rounds",
    category: "Funding",
    type: "Investment",
    isPremium: true,
    keyPoints: [
      "Defines valuation and investment amount",
      "Outlines investor rights and preferences",
      "Includes board composition terms"
    ]
  },
  {
    id: "convertible_note",
    title: "Convertible Note Agreement",
    description: "Debt instrument that converts to equity in future rounds",
    category: "Funding",
    type: "Investment",
    isPremium: true,
    keyPoints: [
      "Defines conversion terms and triggers",
      "Includes discount and cap provisions",
      "Outlines interest and maturity terms"
    ]
  },
  {
    id: "safe_agreement",
    title: "SAFE Agreement",
    description: "Simple Agreement for Future Equity (Y Combinator standard)",
    category: "Funding",
    type: "Investment",
    isPremium: false,
    keyPoints: [
      "Simple and founder-friendly structure",
      "No interest or maturity date",
      "Converts on qualified financing"
    ]
  }
];

export const useLegalTemplatesStore = create<LegalTemplatesState>((set) => ({
  templates: [],
  categories: [],
  isLoading: false,
  error: null,
  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const categories = Array.from(new Set(mockTemplates.map(t => t.category)));
      
      set({
        templates: mockTemplates,
        categories,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch templates",
      });
    }
  },
}));