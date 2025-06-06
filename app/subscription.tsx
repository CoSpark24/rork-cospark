import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { ArrowLeft, Check, X } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { SubscriptionPlan, SubscriptionData } from "@/types";

export default function SubscriptionScreen() {
  const router = useRouter();

  const subscriptionPlans: SubscriptionData[] = [
    {
      plan: SubscriptionPlan.FREE,
      price: 0,
      features: [
        { name: "5 Co-founder matches per month", included: true, limit: 5 },
        { name: "Basic pitch deck generation", included: true },
        { name: "Limited AI mentor access", included: true },
        { name: "Email support", included: true },
        { name: "Video intro upload", included: false },
        { name: "Advanced filters", included: false },
        { name: "Priority matching", included: false },
        { name: "Custom pitch deck templates", included: false },
      ],
    },
    {
      plan: SubscriptionPlan.PRO,
      price: 499,
      isPopular: true,
      features: [
        { name: "Unlimited co-founder matches", included: true },
        { name: "Advanced pitch deck generation", included: true },
        { name: "Unlimited AI mentor access", included: true },
        { name: "Priority email support", included: true },
        { name: "Video intro upload", included: true },
        { name: "Advanced filters", included: true },
        { name: "Priority matching", included: true },
        { name: "Custom pitch deck templates", included: false },
      ],
    },
    {
      plan: SubscriptionPlan.ENTERPRISE,
      price: 1999,
      features: [
        { name: "All Pro features", included: true },
        { name: "Custom pitch deck templates", included: true },
        { name: "Dedicated startup advisor", included: true },
        { name: "Investor network access", included: true },
        { name: "Fundraising assistance", included: true },
        { name: "Startup legal templates", included: true },
        { name: "Phone support", included: true },
        { name: "Team accounts (up to 3)", included: true },
      ],
    },
  ];

  const handleSubscribe = (plan: SubscriptionPlan) => {
    // In a real app, this would open a payment flow
    alert(`You selected the ${plan} plan. Payment integration would go here.`);
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
          Upgrade to unlock premium features and find your perfect co-founder faster
        </Text>
      </View>

      <ScrollView style={styles.plansContainer}>
        {subscriptionPlans.map((subscription) => (
          <Card
            key={subscription.plan}
            style={[
              styles.planCard,
              subscription.isPopular && styles.popularPlanCard,
            ]}
            elevation={subscription.isPopular ? "medium" : "small"}
          >
            {subscription.isPopular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}

            <Text
              style={[
                styles.planName,
                subscription.isPopular && styles.popularPlanName,
              ]}
            >
              {subscription.plan}
            </Text>

            <View style={styles.priceContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <Text style={styles.price}>{subscription.price}</Text>
              <Text style={styles.period}>/month</Text>
            </View>

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
              title={subscription.plan === SubscriptionPlan.FREE ? "Current Plan" : "Subscribe"}
              onPress={() => handleSubscribe(subscription.plan)}
              gradient={subscription.isPopular}
              variant={
                subscription.plan === SubscriptionPlan.FREE
                  ? "outline"
                  : subscription.isPopular
                  ? "primary"
                  : "secondary"
              }
              disabled={subscription.plan === SubscriptionPlan.FREE}
              fullWidth
              style={styles.subscribeButton}
            />
          </Card>
        ))}
      </ScrollView>
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
  },
  plansContainer: {
    padding: Theme.spacing.xl,
  },
  planCard: {
    marginBottom: Theme.spacing.xl,
    padding: Theme.spacing.lg,
  },
  popularPlanCard: {
    borderColor: Colors.primary,
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
  planName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  popularPlanName: {
    color: Colors.primary,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: Theme.spacing.lg,
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
  },
  disabledFeatureText: {
    color: Colors.textSecondary,
  },
  subscribeButton: {
    marginTop: Theme.spacing.md,
  },
});