import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { ArrowLeft, Check, X, Star, Zap, Crown } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { SubscriptionPlan, SubscriptionData } from "@/types";

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SubscriptionPlan.PRO);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const subscriptionPlans: SubscriptionData[] = [
    {
      plan: SubscriptionPlan.FREE,
      price: 0,
      features: [
        { name: "5 Co-founder matches per month", included: true, limit: 5 },
        { name: "Basic pitch deck generation", included: true },
        { name: "Limited AI mentor access", included: true, limit: 10 },
        { name: "Email support", included: true },
        { name: "Community access", included: true },
        { name: "Video intro upload", included: false },
        { name: "Advanced filters", included: false },
        { name: "Priority matching", included: false },
        { name: "Custom pitch deck templates", included: false },
        { name: "Investor network access", included: false },
        { name: "Ad-free experience", included: false },
      ],
    },
    {
      plan: SubscriptionPlan.PRO,
      price: billingCycle === "monthly" ? 499 : 3999,
      currency: "₹",
      isPopular: true,
      features: [
        { name: "Unlimited co-founder matches", included: true },
        { name: "Advanced pitch deck generation", included: true },
        { name: "Unlimited AI mentor access", included: true },
        { name: "Priority email support", included: true },
        { name: "Video intro upload", included: true },
        { name: "Advanced filters & search", included: true },
        { name: "Priority matching algorithm", included: true },
        { name: "Ad-free experience", included: true },
        { name: "Event priority booking", included: true },
        { name: "Analytics dashboard", included: true },
        { name: "Custom pitch deck templates", included: false },
        { name: "Dedicated startup advisor", included: false },
      ],
    },
    {
      plan: SubscriptionPlan.ENTERPRISE,
      price: billingCycle === "monthly" ? 1999 : 19999,
      currency: "₹",
      features: [
        { name: "All Pro features", included: true },
        { name: "Custom pitch deck templates", included: true },
        { name: "Dedicated startup advisor", included: true },
        { name: "Investor network access", included: true },
        { name: "Fundraising assistance", included: true },
        { name: "Startup legal templates", included: true },
        { name: "Phone support", included: true },
        { name: "Team accounts (up to 5)", included: true },
        { name: "White-label solutions", included: true },
        { name: "Custom integrations", included: true },
        { name: "Priority feature requests", included: true },
      ],
    },
  ];

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan === SubscriptionPlan.FREE) {
      Alert.alert("Info", "You are already on the free plan!");
      return;
    }

    const selectedPlanData = subscriptionPlans.find(p => p.plan === plan);
    if (!selectedPlanData) return;

    const amount = selectedPlanData.price;
    const currency = selectedPlanData.currency || "₹";
    
    Alert.alert(
      "Confirm Subscription",
      `Subscribe to ${plan} plan for ${currency}${amount}/${billingCycle}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Subscribe",
          onPress: () => initiatePayment(plan, amount, currency),
        },
      ]
    );
  };

  const initiatePayment = async (plan: SubscriptionPlan, amount: number, currency: string) => {
    try {
      // In a real app, this would integrate with Razorpay (India) or Stripe (International)
      if (Platform.OS === "web") {
        // Web payment integration
        Alert.alert("Payment", "Redirecting to payment gateway...");
      } else {
        // Mobile payment integration
        Alert.alert("Payment", "Opening payment interface...");
      }
      
      // Mock successful payment
      setTimeout(() => {
        Alert.alert(
          "Success!",
          `Welcome to ${plan}! Your subscription is now active.`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      }, 2000);
    } catch (error) {
      Alert.alert("Error", "Payment failed. Please try again.");
    }
  };

  const getPlanIcon = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.FREE:
        return <Star size={24} color={Colors.textSecondary} />;
      case SubscriptionPlan.PRO:
        return <Zap size={24} color={Colors.primary} />;
      case SubscriptionPlan.ENTERPRISE:
        return <Crown size={24} color={Colors.warning} />;
      default:
        return <Star size={24} color={Colors.textSecondary} />;
    }
  };

  const getYearlySavings = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12;
    const discountedYearly = monthlyPrice === 499 ? 3999 : 19999;
    const savings = yearlyPrice - discountedYearly;
    const percentage = Math.round((savings / yearlyPrice) * 100);
    return { savings, percentage };
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Subscription Plans",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Upgrade to unlock premium features and accelerate your startup journey
        </Text>

        {/* Billing Cycle Toggle */}
        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === "monthly" && styles.billingOptionActive,
            ]}
            onPress={() => setBillingCycle("monthly")}
          >
            <Text
              style={[
                styles.billingText,
                billingCycle === "monthly" && styles.billingTextActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === "yearly" && styles.billingOptionActive,
            ]}
            onPress={() => setBillingCycle("yearly")}
          >
            <Text
              style={[
                styles.billingText,
                billingCycle === "yearly" && styles.billingTextActive,
              ]}
            >
              Yearly
            </Text>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>Save 33%</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.plansContainer} showsVerticalScrollIndicator={false}>
        {subscriptionPlans.map((subscription) => {
          const isSelected = selectedPlan === subscription.plan;
          const yearlySavings = subscription.price > 0 ? getYearlySavings(subscription.price) : null;
          
          return (
            <TouchableOpacity
              key={subscription.plan}
              onPress={() => setSelectedPlan(subscription.plan)}
            >
              <Card
                style={[
                  styles.planCard,
                  subscription.isPopular && styles.popularPlanCard,
                  isSelected && styles.selectedPlanCard,
                ]}
                elevation={subscription.isPopular ? "medium" : "small"}
              >
                {subscription.isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}

                <View style={styles.planHeader}>
                  {getPlanIcon(subscription.plan)}
                  <Text
                    style={[
                      styles.planName,
                      subscription.isPopular && styles.popularPlanName,
                    ]}
                  >
                    {subscription.plan}
                  </Text>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.currencySymbol}>
                    {subscription.currency || "₹"}
                  </Text>
                  <Text style={styles.price}>{subscription.price}</Text>
                  <Text style={styles.period}>
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </Text>
                </View>

                {billingCycle === "yearly" && yearlySavings && subscription.price > 0 && (
                  <Text style={styles.savingsInfo}>
                    Save ₹{yearlySavings.savings} ({yearlySavings.percentage}% off)
                  </Text>
                )}

                <View style={styles.featuresContainer}>
                  {subscription.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      {feature.included ? (
                        <Check size={18} color={Colors.success} />
                      ) : (
                        <X size={18} color={Colors.textSecondary} />
                      )}
                      <Text
                        style={[
                          styles.featureText,
                          !feature.included && styles.disabledFeatureText,
                        ]}
                      >
                        {feature.name}
                        {feature.limit ? ` (${feature.limit})` : ""}
                      </Text>
                    </View>
                  ))}
                </View>

                <Button
                  title={
                    subscription.plan === SubscriptionPlan.FREE
                      ? "Current Plan"
                      : isSelected
                      ? "Selected"
                      : "Select Plan"
                  }
                  onPress={() => handleSubscribe(subscription.plan)}
                  gradient={subscription.isPopular && isSelected}
                  variant={
                    subscription.plan === SubscriptionPlan.FREE
                      ? "outline"
                      : isSelected
                      ? "primary"
                      : "secondary"
                  }
                  disabled={subscription.plan === SubscriptionPlan.FREE}
                  fullWidth
                  style={styles.selectButton}
                />
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Payment Methods */}
        <Card style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Secure Payment</Text>
          <Text style={styles.paymentDescription}>
            We support multiple payment methods for your convenience
          </Text>
          <View style={styles.paymentMethods}>
            <Text style={styles.paymentMethod}>🇮🇳 Razorpay (India)</Text>
            <Text style={styles.paymentMethod}>🌍 Stripe (International)</Text>
            <Text style={styles.paymentMethod}>💳 Credit/Debit Cards</Text>
            <Text style={styles.paymentMethod}>🏦 UPI & Net Banking</Text>
          </View>
        </Card>

        {/* FAQ */}
        <Card style={styles.faqCard}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I cancel anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can cancel your subscription at any time. No questions asked.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Do you offer refunds?</Text>
            <Text style={styles.faqAnswer}>
              We offer a 7-day money-back guarantee for all paid plans.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I upgrade or downgrade?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can change your plan at any time. Changes take effect immediately.
            </Text>
          </View>
        </Card>
      </ScrollView>

      {selectedPlan !== SubscriptionPlan.FREE && (
        <View style={styles.footer}>
          <Button
            title={`Subscribe to ${selectedPlan} - ${
              subscriptionPlans.find(p => p.plan === selectedPlan)?.currency || "₹"
            }${subscriptionPlans.find(p => p.plan === selectedPlan)?.price}/${billingCycle}`}
            onPress={() => handleSubscribe(selectedPlan)}
            gradient
            fullWidth
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    marginRight: Theme.spacing.md,
  },
  header: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
    marginBottom: Theme.spacing.lg,
  },
  billingToggle: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xs,
  },
  billingOption: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    alignItems: "center",
    position: "relative",
  },
  billingOptionActive: {
    backgroundColor: Colors.primary,
  },
  billingText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.textSecondary,
  },
  billingTextActive: {
    color: Colors.card,
  },
  savingsBadge: {
    position: "absolute",
    top: -8,
    right: 8,
    backgroundColor: Colors.success,
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  savingsText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.card,
    fontWeight: Theme.typography.weights.bold as any,
  },
  plansContainer: {
    padding: Theme.spacing.xl,
  },
  planCard: {
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
    position: "relative",
  },
  popularPlanCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  selectedPlanCard: {
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    right: Theme.spacing.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  popularText: {
    color: Colors.card,
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.bold as any,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  planName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginLeft: Theme.spacing.sm,
  },
  popularPlanName: {
    color: Colors.primary,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: Theme.spacing.xs,
  },
  currencySymbol: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
  },
  period: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
    marginLeft: Theme.spacing.xs,
  },
  savingsInfo: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.success,
    fontWeight: Theme.typography.weights.medium as any,
    marginBottom: Theme.spacing.md,
  },
  featuresContainer: {
    marginBottom: Theme.spacing.lg,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  featureText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  disabledFeatureText: {
    color: Colors.textSecondary,
  },
  selectButton: {
    marginTop: Theme.spacing.md,
  },
  paymentCard: {
    marginBottom: Theme.spacing.lg,
  },
  paymentTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  paymentDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  paymentMethods: {
    gap: Theme.spacing.xs,
  },
  paymentMethod: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
  },
  faqCard: {
    marginBottom: Theme.spacing.xl,
  },
  faqTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  faqItem: {
    marginBottom: Theme.spacing.md,
  },
  faqQuestion: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  faqAnswer: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: Theme.spacing.xl,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});