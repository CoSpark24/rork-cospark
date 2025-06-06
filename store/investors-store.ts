import { create } from "zustand";
import { InvestorProfile, InvestmentStage } from "@/types";

interface InvestorsState {
  investors: InvestorProfile[];
  isLoading: boolean;
  error: string | null;
  fetchInvestors: () => Promise<void>;
  requestIntro: (investorId: string, message: string) => Promise<void>;
}

export const useInvestorsStore = create<InvestorsState>((set, get) => ({
  investors: [],
  isLoading: false,
  error: null,

  fetchInvestors: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock investors data
      const mockInvestors: InvestorProfile[] = [
        {
          id: "investor1",
          name: "Rajesh Kumar",
          email: "rajesh@blumevp.com",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          bio: "Partner at Blume Ventures. 15+ years in venture capital with focus on early-stage Indian startups.",
          focusAreas: ["Fintech", "E-commerce", "SaaS"],
          investmentStages: [InvestmentStage.PRE_SEED, InvestmentStage.SEED],
          location: "Bangalore, India",
          portfolioSize: 45,
          averageTicketSize: "₹2-5 Cr",
          website: "https://blume.vc",
          linkedIn: "https://linkedin.com/in/rajeshkumar",
          isVerified: true,
        },
        {
          id: "investor2",
          name: "Priya Sharma",
          email: "priya@sequoiacap.com",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1461&q=80",
          bio: "Principal at Sequoia Capital India. Passionate about backing exceptional founders building category-defining companies.",
          focusAreas: ["Healthcare", "Education", "AI/ML"],
          investmentStages: [InvestmentStage.SEED, InvestmentStage.SERIES_A],
          location: "Mumbai, India",
          portfolioSize: 28,
          averageTicketSize: "₹10-25 Cr",
          website: "https://sequoiacap.com",
          linkedIn: "https://linkedin.com/in/priyasharma",
          isVerified: true,
        },
        {
          id: "investor3",
          name: "Amit Patel",
          email: "amit@matrix.in",
          bio: "Managing Director at Matrix Partners India. Former entrepreneur with 2 successful exits.",
          focusAreas: ["B2B SaaS", "Enterprise", "Developer Tools"],
          investmentStages: [InvestmentStage.SEED, InvestmentStage.SERIES_A, InvestmentStage.SERIES_B],
          location: "Delhi, India",
          portfolioSize: 32,
          averageTicketSize: "₹5-15 Cr",
          website: "https://matrixpartners.in",
          isVerified: true,
        },
      ];
      
      set({ investors: mockInvestors, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch investors",
      });
    }
  },

  requestIntro: async (investorId, message) => {
    // Simulate API call to request introduction
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, this would send an email or notification
    console.log(`Introduction requested to investor ${investorId} with message: ${message}`);
  },
}));