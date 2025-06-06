import { create } from "zustand";
import { BusinessPlanData } from "@/types";

interface BusinessPlan extends BusinessPlanData {
  id: string;
  createdAt: number;
  updatedAt: number;
}

interface BusinessPlanState {
  businessPlans: BusinessPlan[];
  isLoading: boolean;
  error: string | null;
  createBusinessPlan: (data: Partial<BusinessPlanData>) => Promise<void>;
  updateBusinessPlan: (id: string, data: Partial<BusinessPlanData>) => Promise<void>;
  deleteBusinessPlan: (id: string) => void;
  getBusinessPlan: (id: string) => BusinessPlan | undefined;
  fetchBusinessPlans: () => Promise<void>;
}

export const useBusinessPlanStore = create<BusinessPlanState>((set, get) => ({
  businessPlans: [],
  isLoading: false,
  error: null,

  createBusinessPlan: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const newBusinessPlan: BusinessPlan = {
        id: Date.now().toString(),
        companyName: data.companyName || "Untitled Business Plan",
        executiveSummary: data.executiveSummary || "",
        companyDescription: data.companyDescription || "",
        marketAnalysis: data.marketAnalysis || "",
        organizationManagement: data.organizationManagement || "",
        serviceProductLine: data.serviceProductLine || "",
        marketingSales: data.marketingSales || "",
        fundingRequest: data.fundingRequest || "",
        financialProjections: data.financialProjections || "",
        appendix: data.appendix || "",
        industry: data.industry!,
        stage: data.stage!,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      set((state) => ({
        businessPlans: [newBusinessPlan, ...state.businessPlans],
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to create business plan",
      });
    }
  },

  updateBusinessPlan: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      set((state) => ({
        businessPlans: state.businessPlans.map((plan) =>
          plan.id === id
            ? { ...plan, ...data, updatedAt: Date.now() }
            : plan
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to update business plan",
      });
    }
  },

  deleteBusinessPlan: (id) => {
    set((state) => ({
      businessPlans: state.businessPlans.filter((plan) => plan.id !== id),
    }));
  },

  getBusinessPlan: (id) => {
    return get().businessPlans.find((plan) => plan.id === id);
  },

  fetchBusinessPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, return empty array
      // In real app, this would fetch from API
      set({ businessPlans: [], isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch business plans",
      });
    }
  },
}));