import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PricingPlan, RegionPricing, PRICING_BY_REGION, getRegionFromCountryCode } from "@/constants/pricing";

interface SubscriptionState {
  currentPlan: PricingPlan | null;
  userRegion: string;
  regionPricing: RegionPricing;
  isSubscribed: boolean;
  subscriptionEndDate: Date | null;
  
  // Actions
  setUserRegion: (countryCode: string) => void;
  subscribeToPlan: (plan: PricingPlan) => void;
  cancelSubscription: () => void;
  checkSubscriptionStatus: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      userRegion: "US",
      regionPricing: PRICING_BY_REGION.US,
      isSubscribed: false,
      subscriptionEndDate: null,

      setUserRegion: (countryCode: string) => {
        const region = getRegionFromCountryCode(countryCode);
        const regionPricing = PRICING_BY_REGION[region];
        
        set({
          userRegion: region,
          regionPricing,
        });
      },

      subscribeToPlan: (plan: PricingPlan) => {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // Add 1 month
        
        set({
          currentPlan: plan,
          isSubscribed: plan.id !== "free",
          subscriptionEndDate: endDate,
        });
      },

      cancelSubscription: () => {
        const freePlan = get().regionPricing.plans.find(p => p.id === "free");
        
        set({
          currentPlan: freePlan || null,
          isSubscribed: false,
          subscriptionEndDate: null,
        });
      },

      checkSubscriptionStatus: () => {
        const { subscriptionEndDate, isSubscribed } = get();
        
        if (!isSubscribed || !subscriptionEndDate) {
          return false;
        }
        
        const now = new Date();
        const isActive = now < subscriptionEndDate;
        
        if (!isActive) {
          get().cancelSubscription();
        }
        
        return isActive;
      },
    }),
    {
      name: "subscription-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);