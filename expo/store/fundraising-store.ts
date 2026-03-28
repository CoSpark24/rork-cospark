import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  tips?: string[];
}

interface ChecklistCategory {
  category: string;
  items: ChecklistItem[];
}

interface FundraisingState {
  checklist: ChecklistCategory[];
  completedItems: string[];
  isLoading: boolean;
  error: string | null;
  fetchChecklist: () => Promise<void>;
  toggleItem: (itemId: string) => void;
  getCompletionPercentage: () => number;
}

const mockChecklist: ChecklistCategory[] = [
  {
    category: "Business Foundation",
    items: [
      {
        id: "business_plan",
        title: "Complete Business Plan",
        description: "Comprehensive business plan with market analysis and financial projections",
        priority: "high",
        tips: [
          "Include 3-5 year financial projections",
          "Research your competition thoroughly",
          "Define your unique value proposition clearly"
        ]
      },
      {
        id: "pitch_deck",
        title: "Professional Pitch Deck",
        description: "10-12 slide presentation covering problem, solution, market, and team",
        priority: "high",
        tips: [
          "Keep slides visual and concise",
          "Tell a compelling story",
          "Practice your presentation multiple times"
        ]
      },
      {
        id: "financial_model",
        title: "Financial Model",
        description: "Detailed financial model with revenue projections and unit economics",
        priority: "high",
        tips: [
          "Use realistic assumptions",
          "Include multiple scenarios",
          "Show clear path to profitability"
        ]
      }
    ]
  },
  {
    category: "Legal & Compliance",
    items: [
      {
        id: "incorporation",
        title: "Company Incorporation",
        description: "Properly incorporated business entity with clear ownership structure",
        priority: "high",
        tips: [
          "Choose the right business structure",
          "Set up proper equity distribution",
          "Consider tax implications"
        ]
      },
      {
        id: "ip_protection",
        title: "Intellectual Property Protection",
        description: "Trademarks, patents, and copyrights properly filed and protected",
        priority: "medium",
        tips: [
          "File provisional patents early",
          "Register key trademarks",
          "Document all IP creation"
        ]
      },
      {
        id: "legal_docs",
        title: "Legal Documentation",
        description: "Operating agreements, employment contracts, and NDAs in place",
        priority: "medium"
      }
    ]
  },
  {
    category: "Market Validation",
    items: [
      {
        id: "customer_validation",
        title: "Customer Validation",
        description: "Proven customer demand with testimonials and case studies",
        priority: "high",
        tips: [
          "Get written testimonials",
          "Document customer interviews",
          "Show product-market fit metrics"
        ]
      },
      {
        id: "mvp_traction",
        title: "MVP and Traction",
        description: "Working product with measurable user engagement and growth",
        priority: "high",
        tips: [
          "Track key metrics consistently",
          "Show month-over-month growth",
          "Demonstrate user retention"
        ]
      },
      {
        id: "market_research",
        title: "Market Research",
        description: "Comprehensive market analysis with size and growth projections",
        priority: "medium"
      }
    ]
  },
  {
    category: "Team & Operations",
    items: [
      {
        id: "core_team",
        title: "Core Team in Place",
        description: "Key team members with relevant experience and equity agreements",
        priority: "high",
        tips: [
          "Highlight relevant experience",
          "Show complementary skills",
          "Have clear role definitions"
        ]
      },
      {
        id: "advisory_board",
        title: "Advisory Board",
        description: "Industry experts and mentors providing guidance and credibility",
        priority: "medium",
        tips: [
          "Choose advisors strategically",
          "Formalize advisory agreements",
          "Leverage advisor networks"
        ]
      },
      {
        id: "operational_systems",
        title: "Operational Systems",
        description: "Basic operational processes and systems for scaling",
        priority: "low"
      }
    ]
  }
];

export const useFundraisingStore = create<FundraisingState>()(
  persist(
    (set, get) => ({
      checklist: [],
      completedItems: [],
      isLoading: false,
      error: null,
      fetchChecklist: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({
            checklist: mockChecklist,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to fetch checklist",
          });
        }
      },
      toggleItem: (itemId) => {
        set((state) => {
          const isCompleted = state.completedItems.includes(itemId);
          const newCompletedItems = isCompleted
            ? state.completedItems.filter((id) => id !== itemId)
            : [...state.completedItems, itemId];
          
          return { completedItems: newCompletedItems };
        });
      },
      getCompletionPercentage: () => {
        const state = get();
        const totalItems = state.checklist.reduce((total, category) => total + category.items.length, 0);
        if (totalItems === 0) return 0;
        return Math.round((state.completedItems.length / totalItems) * 100);
      },
    }),
    {
      name: "cospark-fundraising-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ completedItems: state.completedItems }),
    }
  )
);