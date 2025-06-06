export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: string[];
  hasAds: boolean;
  isPopular?: boolean;
}

export interface RegionPricing {
  region: string;
  currency: string;
  symbol: string;
  plans: PricingPlan[];
}

export const PRICING_BY_REGION: Record<string, RegionPricing> = {
  IN: {
    region: "India",
    currency: "INR",
    symbol: "₹",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPrice: 0,
        yearlyPrice: 0,
        currency: "INR",
        hasAds: true,
        features: [
          "Basic matchmaking",
          "Limited messaging",
          "Community access",
          "Basic toolkit",
          "Ads supported"
        ]
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPrice: 499,
        yearlyPrice: 3999,
        currency: "INR",
        hasAds: false,
        isPopular: true,
        features: [
          "Advanced AI matchmaking",
          "Unlimited messaging",
          "Priority support",
          "Full toolkit access",
          "Ad-free experience",
          "Event hosting",
          "Analytics dashboard"
        ]
      }
    ]
  },
  US: {
    region: "USA/Europe",
    currency: "USD",
    symbol: "$",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPrice: 0,
        yearlyPrice: 0,
        currency: "USD",
        hasAds: false,
        features: [
          "Basic matchmaking",
          "Limited messaging",
          "Community access",
          "Basic toolkit"
        ]
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPrice: 9.99,
        yearlyPrice: 79.99,
        currency: "USD",
        hasAds: false,
        isPopular: true,
        features: [
          "Advanced AI matchmaking",
          "Unlimited messaging",
          "Priority support",
          "Full toolkit access",
          "Event hosting",
          "Analytics dashboard"
        ]
      }
    ]
  },
  GLOBAL: {
    region: "Africa/SEA",
    currency: "USD",
    symbol: "$",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPrice: 0,
        yearlyPrice: 0,
        currency: "USD",
        hasAds: true,
        features: [
          "Basic matchmaking",
          "Limited messaging",
          "Community access",
          "Basic toolkit",
          "Ads supported"
        ]
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPrice: 4.99,
        yearlyPrice: 39.99,
        currency: "USD",
        hasAds: false,
        isPopular: true,
        features: [
          "Advanced AI matchmaking",
          "Unlimited messaging",
          "Priority support",
          "Full toolkit access",
          "Ad-free experience",
          "Event hosting",
          "Analytics dashboard"
        ]
      }
    ]
  }
};

export const getRegionFromCountryCode = (countryCode: string): string => {
  if (countryCode === "IN") return "IN";
  if (["US", "CA", "GB", "DE", "FR", "IT", "ES", "NL", "SE", "NO", "DK", "FI"].includes(countryCode)) {
    return "US";
  }
  return "GLOBAL";
};