import { create } from "zustand";
import { CrowdfundingCampaign, Investment } from "@/types";
import { useAuthStore } from "./auth-store";

interface CrowdfundingState {
  campaigns: CrowdfundingCampaign[];
  userInvestments: Investment[];
  isLoading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
  createCampaign: (campaignData: Partial<CrowdfundingCampaign>) => Promise<void>;
  investInCampaign: (campaignId: string, amount: number, rewardId?: string) => Promise<void>;
  getUserInvestments: () => Investment[];
}

export const useCrowdfundingStore = create<CrowdfundingState>((set, get) => ({
  campaigns: [],
  userInvestments: [],
  isLoading: false,
  error: null,

  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock campaigns data
      const mockCampaigns: CrowdfundingCampaign[] = [
        {
          id: "campaign1",
          title: "ArtisanConnect: Global Marketplace for Handcrafted Goods",
          description: "We're building a platform that connects local artisans with global customers using AR/VR technology to showcase their crafts.",
          goalAmount: 500000,
          raisedAmount: 125000,
          currency: "INR",
          deadline: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
          createdBy: "user2",
          createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
          status: "active",
          backerCount: 23,
          updates: [
            {
              id: "update1",
              title: "MVP Development Complete",
              content: "We've successfully completed our MVP and onboarded our first 50 artisans!",
              timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
            }
          ],
          rewards: [
            {
              id: "reward1",
              title: "Early Supporter",
              description: "Get exclusive access to our platform and a handcrafted item from our featured artisans",
              amount: 5000,
              backerCount: 15,
              isLimited: false,
            },
            {
              id: "reward2",
              title: "Artisan Partner",
              description: "Partner with us to onboard artisans in your region + all previous rewards",
              amount: 25000,
              backerCount: 8,
              isLimited: true,
              maxBackers: 10,
            }
          ],
        },
        {
          id: "campaign2",
          title: "EcoDelivery: Sustainable Last-Mile Delivery",
          description: "Electric vehicle-based delivery service for e-commerce with carbon footprint tracking.",
          goalAmount: 1000000,
          raisedAmount: 750000,
          currency: "INR",
          deadline: Date.now() + 45 * 24 * 60 * 60 * 1000, // 45 days from now
          createdBy: "user3",
          createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
          status: "active",
          backerCount: 67,
          updates: [],
          rewards: [
            {
              id: "reward3",
              title: "Green Supporter",
              description: "Free delivery credits worth ₹1000 when we launch",
              amount: 2000,
              backerCount: 45,
              isLimited: false,
            }
          ],
        },
      ];
      
      set({ campaigns: mockCampaigns, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch campaigns",
      });
    }
  },

  createCampaign: async (campaignData) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("User not authenticated");

    const newCampaign: CrowdfundingCampaign = {
      id: `campaign_${Date.now()}`,
      title: campaignData.title || "Untitled Campaign",
      description: campaignData.description || "",
      goalAmount: campaignData.goalAmount || 100000,
      raisedAmount: 0,
      currency: campaignData.currency || "INR",
      deadline: campaignData.deadline || Date.now() + 60 * 24 * 60 * 60 * 1000,
      createdBy: currentUser.id,
      createdAt: Date.now(),
      status: "active",
      backerCount: 0,
      updates: [],
      rewards: campaignData.rewards || [],
    };

    set((state) => ({
      campaigns: [newCampaign, ...state.campaigns],
    }));
  },

  investInCampaign: async (campaignId, amount, rewardId) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("User not authenticated");

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newInvestment: Investment = {
      id: `investment_${Date.now()}`,
      campaignId,
      investorId: currentUser.id,
      amount,
      rewardId,
      timestamp: Date.now(),
      status: "completed",
    };

    set((state) => ({
      userInvestments: [...state.userInvestments, newInvestment],
      campaigns: state.campaigns.map(campaign =>
        campaign.id === campaignId
          ? {
              ...campaign,
              raisedAmount: campaign.raisedAmount + amount,
              backerCount: campaign.backerCount + 1,
            }
          : campaign
      ),
    }));
  },

  getUserInvestments: () => {
    return get().userInvestments;
  },
}));